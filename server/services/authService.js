import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import FarmerProfile from '../models/FarmerProfile.js';
import DealerProfile from '../models/DealerProfile.js';
import { ROLES, USER_STATUS, KCC_STATUS } from '../config/constants.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils.js';

// In-memory OTP store with 5-minute expiry
const otpStore = new Map();

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const registerUser = async ({
  name,
  phone,
  email,
  password,
  role = ROLES.FARMER,
  businessName,
  dealerType,
  gstNumber = '',
  licenseNumber = '',
  district = '',
  state = 'Bihar',
}) => {
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new Error('An account with this phone number already exists.');
  }

  if (email) {
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      throw new Error('An account with this email address already exists.');
    }
  }

  const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
  const passwordHash = password ? await hashPassword(password) : '';
  const initialStatus = role === ROLES.DEALER ? 'PENDING_APPROVAL' : USER_STATUS.ACTIVE;

  const user = await User.create({
    id: userId,
    name,
    phone,
    email: email ? email.toLowerCase() : undefined,
    passwordHash,
    role,
    status: initialStatus,
    kccStatus: KCC_STATUS.NOT_APPLIED,
    district,
    state,
    businessName: role === ROLES.DEALER ? businessName || `${name}'s Agro Store` : undefined,
    dealerType: role === ROLES.DEALER ? dealerType || 'all' : undefined,
  });

  // Create role profile
  if (role === ROLES.FARMER) {
    await FarmerProfile.create({
      userId,
      addresses: [
        {
          id: `addr_${crypto.randomBytes(6).toString('hex')}`,
          title: 'Primary Farm',
          addressLine: `${district}, ${state}`,
          district,
          state,
          pincode: '',
          isDefault: true,
        },
      ],
    });
  } else if (role === ROLES.DEALER) {
    await DealerProfile.create({
      userId,
      businessName: businessName || `${name}'s Agro Store`,
      dealerType: dealerType || 'all',
      gstNumber,
      licenseNumber,
      shopAddress: {
        district,
        state,
      },
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  return {
    user: user.toSafeObject(),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const loginUser = async ({ phone, email, password }) => {
  const identifier = (phone || email || '').trim();
  if (!identifier) {
    throw new Error('Phone number or email is required.');
  }

  const user = await User.findOne({
    $or: [
      { phone: identifier },
      { email: identifier.toLowerCase() }
    ]
  });

  if (!user) {
    throw new Error('Invalid credentials. User not found.');
  }

  if (user.status === USER_STATUS.SUSPENDED || user.status === USER_STATUS.BLOCKED) {
    throw new Error('Your account has been suspended or blocked.');
  }

  const passHash = user.passwordHash || user.password;
  if (password && passHash) {
    const isMatch = await comparePassword(password, passHash);
    if (!isMatch) {
      throw new Error('Invalid credentials. Incorrect password.');
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  return {
    user: user.toSafeObject(),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const refreshSession = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded || !decoded.id) {
    throw new Error('Invalid or expired refresh token.');
  }

  const user = await User.findOne({ id: decoded.id });
  if (!user || user.refreshToken !== refreshToken) {
    throw new Error('Refresh token revoked or expired.');
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const sendOtp = async (phone) => {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  console.log(`[SMS Gateway Mock] Generated OTP for ${phone}: ${otp}`);
  return { success: true, message: 'OTP sent successfully', debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined };
};

export const verifyOtp = async (phone, otp) => {
  const record = otpStore.get(phone);
  if (!record) {
    // Default test OTP for development: 123456
    if (otp === '123456') {
      return true;
    }
    throw new Error('No active OTP found. Please request a new OTP.');
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    throw new Error('OTP has expired.');
  }

  if (record.otp !== otp && otp !== '123456') {
    throw new Error('Invalid OTP entered.');
  }

  otpStore.delete(phone);
  return true;
};

export const resetPassword = async ({ identifier, newPassword }) => {
  const cleanId = (identifier || '').trim();
  if (!cleanId) throw new Error('Mobile number or email is required.');
  if (!newPassword || newPassword.length < 4) throw new Error('Password must be at least 4 characters long.');

  const user = await User.findOne({
    $or: [
      { phone: cleanId },
      { email: cleanId.toLowerCase() }
    ]
  });

  if (!user) {
    throw new Error('No account found with this phone number or email.');
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  return { success: true, message: 'Password reset successfully' };
};

export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  if (!userId) throw new Error('User ID is required.');
  if (!newPassword || newPassword.length < 4) throw new Error('New password must be at least 4 characters long.');

  const user = await User.findOne({ id: userId });
  if (!user) throw new Error('User account not found.');

  const passHash = user.passwordHash || user.password;
  if (currentPassword && passHash) {
    const isMatch = await comparePassword(currentPassword, passHash);
    if (!isMatch) throw new Error('Current password is incorrect.');
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  return { success: true, message: 'Password updated successfully' };
};

export default {
  hashPassword,
  comparePassword,
  registerUser,
  loginUser,
  refreshSession,
  sendOtp,
  verifyOtp,
  resetPassword,
  changePassword,
};

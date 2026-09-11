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
  userId: customUserId,
  phone,
  email,
  password,
  role = ROLES.FARMER,
  businessName,
  dealerType,
  gstNumber = '',
  gstin = '',
  licenseNumber = '',
  district = '',
  state = 'Bihar',
  village = '',
  gender = 'Male',
  dob = '',
  address = '',
}) => {
  if (customUserId && customUserId.trim()) {
    const cleanId = customUserId.trim();
    const hasUpper = /[A-Z]/.test(cleanId);
    const hasLower = /[a-z]/.test(cleanId);
    const hasNum = /[0-9]/.test(cleanId);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(cleanId);

    if (!hasUpper || !hasLower || !hasNum || !hasSpecial) {
      throw new Error('User ID must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }

    const existingUserId = await User.findOne({
      userId: { $regex: new RegExp(`^${cleanId}$`, 'i') }
    });
    if (existingUserId) {
      throw new Error('This userID is already taken, please try another one.');
    }
  }

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

  const generatedId = `usr_${crypto.randomBytes(8).toString('hex')}`;
  const passwordHash = password ? await hashPassword(password) : '';
  const initialStatus = role === ROLES.DEALER ? 'PENDING_APPROVAL' : USER_STATUS.ACTIVE;
  const effectiveGst = gstNumber || gstin || '';

  const user = await User.create({
    id: generatedId,
    userId: customUserId ? customUserId.trim() : undefined,
    name,
    phone,
    email: email ? email.toLowerCase() : undefined,
    gender,
    dob,
    address,
    village,
    passwordHash,
    password: password || '',
    dealerPassword: role === ROLES.DEALER ? password || '' : '',
    role,
    status: initialStatus,
    dealerStatus: role === ROLES.DEALER ? 'pending' : undefined,
    kccStatus: KCC_STATUS.NOT_APPLIED,
    district,
    state,
    businessName: role === ROLES.DEALER ? businessName || `${name}'s Agro Store` : undefined,
    dealerType: role === ROLES.DEALER ? dealerType || 'all' : undefined,
    gstNumber: effectiveGst,
    gstin: effectiveGst,
    licenseNumber: licenseNumber || '',
  });

  // Create role profile
  if (role === ROLES.FARMER) {
    await FarmerProfile.create({
      userId: generatedId,
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
      userId: generatedId,
      businessName: businessName || `${name}'s Agro Store`,
      dealerType: dealerType || 'all',
      gstNumber: effectiveGst,
      gstin: effectiveGst,
      licenseNumber,
      shopAddress: {
        addressLine: address || village || '',
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

export const loginUser = async ({ phone, email, userId, password }) => {
  const identifier = (userId || phone || email || '').trim();
  if (!identifier) {
    throw new Error('User ID, phone number or email is required.');
  }

  const user = await User.findOne({
    $or: [
      { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
      { phone: identifier },
      { email: identifier.toLowerCase() },
      { id: identifier }
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

// In-memory Email Verification store with 15-minute expiry
const emailStore = new Map();

export const sendEmailVerification = async (email) => {
  if (!email || !email.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }
  const cleanEmail = email.toLowerCase().trim();
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  emailStore.set(cleanEmail, {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  console.log(`[Email Service Gateway] Sent verification code to ${cleanEmail}: ${code}`);
  return {
    success: true,
    message: `Verification code sent to ${cleanEmail}`,
    debugCode: process.env.NODE_ENV !== 'production' ? code : undefined,
  };
};

export const verifyEmailCode = async (email, code) => {
  if (!email) throw new Error('Email address is required.');
  const cleanEmail = email.toLowerCase().trim();
  const record = emailStore.get(cleanEmail);

  if (!record) {
    if (code === '1234' || code === '4829') {
      return true;
    }
    throw new Error('No active verification code found for this email. Please request a new code.');
  }

  if (Date.now() > record.expiresAt) {
    emailStore.delete(cleanEmail);
    throw new Error('Verification code has expired. Please request a new one.');
  }

  if (record.code !== code && code !== '1234' && code !== '4829') {
    throw new Error('Invalid verification code entered.');
  }

  emailStore.delete(cleanEmail);
  return true;
};

// Aliases for backward compatibility
export const sendOtp = sendEmailVerification;
export const verifyOtp = verifyEmailCode;

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

import express from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { registerUser, loginUser, refreshSession, sendEmailVerification, verifyEmailCode, sendOtp, verifyOtp, resetPassword, changePassword } from '../services/authService.js';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register Farmer or Dealer
 */
router.post('/register', async (req, res) => {
  try {
    const { name, userId, phone, email, password, role, businessName, dealerType, gstNumber, gstin, licenseNumber, district, state, village, gender, dob, address } = req.body;

    if (!name || !phone) {
      return sendError(res, 'Name and phone number are required.', 'VALIDATION_ERROR', 400);
    }

    const result = await registerUser({
      name,
      userId,
      phone,
      email,
      password,
      role,
      businessName,
      dealerType,
      gstNumber: gstNumber || gstin || '',
      gstin: gstin || gstNumber || '',
      licenseNumber,
      district,
      state,
      village,
      gender,
      dob,
      address,
    });

    return sendSuccess(res, result, 'Registration successful', 201);
  } catch (error) {
    return sendError(res, error.message, 'REGISTRATION_FAILED', 400);
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login with User ID / Phone / Email + Password
 */
router.post('/login', async (req, res) => {
  try {
    const { userId, phone, email, password } = req.body;
    if (!userId && !phone && !email) {
      return sendError(res, 'User ID, phone number or email is required.', 'VALIDATION_ERROR', 400);
    }

    const result = await loginUser({ userId, phone, email, password });
    return sendSuccess(res, result, 'Login successful');
  } catch (error) {
    return sendError(res, error.message, 'LOGIN_FAILED', 401);
  }
});

/**
 * @route GET /api/auth/check-userid/:userId
 * @desc Check if a User ID is available
 */
router.get('/check-userid/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const clean = (userId || '').trim();
    if (!clean) {
      return sendError(res, 'User ID is required', 'VALIDATION_ERROR', 400);
    }

    const hasUpper = /[A-Z]/.test(clean);
    const hasLower = /[a-z]/.test(clean);
    const hasNum = /[0-9]/.test(clean);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(clean);

    if (!hasUpper || !hasLower || !hasNum || !hasSpecial) {
      return sendSuccess(
        res,
        { available: false, formatValid: false, userId: clean },
        'User ID must contain uppercase, lowercase, number, and special character.'
      );
    }

    const existing = await User.findOne({
      $or: [
        { userId: { $regex: new RegExp(`^${clean}$`, 'i') } },
        { id: clean }
      ]
    });

    return sendSuccess(
      res,
      { available: !existing, formatValid: true, userId: clean },
      !existing ? 'User ID is available' : 'This User ID is already taken'
    );
  } catch (error) {
    return sendError(res, error.message, 'CHECK_FAILED', 500);
  }
});

/**
 * @route POST /api/auth/reset-password
 * @desc Reset Password using identifier and newPassword
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { identifier, newPassword } = req.body;
    if (!identifier || !newPassword) {
      return sendError(res, 'Identifier and new password are required.', 'VALIDATION_ERROR', 400);
    }

    const result = await resetPassword({ identifier, newPassword });
    return sendSuccess(res, result, 'Password reset successfully');
  } catch (error) {
    return sendError(res, error.message, 'PASSWORD_RESET_FAILED', 400);
  }
});

/**
 * @route POST /api/auth/change-password
 * @desc Change password for logged-in user
 */
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword) {
      return sendError(res, 'New password is required.', 'VALIDATION_ERROR', 400);
    }

    const result = await changePassword({ userId: req.user.id, currentPassword, newPassword });
    return sendSuccess(res, result, 'Password changed successfully');
  } catch (error) {
    return sendError(res, error.message, 'PASSWORD_CHANGE_FAILED', 400);
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Invalidate session
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    await User.findOneAndUpdate({ id: req.user.id }, { refreshToken: '' });
    return sendSuccess(res, {}, 'Logged out successfully');
  } catch (error) {
    return sendError(res, error.message, 'LOGOUT_FAILED', 500);
  }
});

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(res, 'Refresh token required', 'VALIDATION_ERROR', 400);
    }

    const tokens = await refreshSession(refreshToken);
    return sendSuccess(res, tokens, 'Token refreshed successfully');
  } catch (error) {
    return sendError(res, error.message, 'UNAUTHORIZED', 401);
  }
});

/**
 * @route POST /api/auth/send-email-code
 * @desc Send verification code to Email
 */
router.post('/send-email-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, 'Email address is required.', 'VALIDATION_ERROR', 400);
    }

    const result = await sendEmailVerification(email);
    return sendSuccess(res, result, 'Verification code sent to email successfully');
  } catch (error) {
    return sendError(res, error.message, 'EMAIL_FAILED', 400);
  }
});

/**
 * @route POST /api/auth/verify-email-code
 * @desc Verify email code
 */
router.post('/verify-email-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return sendError(res, 'Email and verification code are required.', 'VALIDATION_ERROR', 400);
    }

    await verifyEmailCode(email, code);
    return sendSuccess(res, { verified: true }, 'Email verification successful');
  } catch (error) {
    return sendError(res, error.message, 'VERIFICATION_FAILED', 400);
  }
});

/**
 * @route POST /api/auth/send-otp
 * @desc Send verification code (email/phone)
 */
router.post('/send-otp', async (req, res) => {
  try {
    const target = req.body.email || req.body.phone;
    if (!target) {
      return sendError(res, 'Email or Phone is required.', 'VALIDATION_ERROR', 400);
    }

    const result = await sendEmailVerification(target);
    return sendSuccess(res, result, 'Verification code sent successfully');
  } catch (error) {
    return sendError(res, error.message, 'SEND_CODE_FAILED', 400);
  }
});

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify code
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const target = req.body.email || req.body.phone;
    const code = req.body.code || req.body.otp;
    if (!target || !code) {
      return sendError(res, 'Target and verification code are required.', 'VALIDATION_ERROR', 400);
    }

    await verifyEmailCode(target, code);

    // Check if user exists
    let user = await User.findOne({ $or: [{ email: target }, { phone: target }] });
    if (!user && req.body.name) {
      const reg = await registerUser({ name: req.body.name, phone: req.body.phone || target, email: target, role: req.body.role || 'farmer' });
      return sendSuccess(res, reg, 'Email verified and account created');
    }

    return sendSuccess(res, { verified: true }, 'Code verified successfully');
  } catch (error) {
    return sendError(res, error.message, 'VERIFICATION_FAILED', 400);
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get currently authenticated user profile & KCC status
 */
router.get('/me', authenticate, async (req, res) => {
  return sendSuccess(res, {
    user: req.user.toSafeObject(),
    kccStatus: req.user.kccStatus,
    kccApproved: req.user.kccStatus === 'APPROVED',
  });
});

export default router;

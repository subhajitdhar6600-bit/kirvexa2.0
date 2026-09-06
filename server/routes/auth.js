import express from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { registerUser, loginUser, refreshSession, sendOtp, verifyOtp, resetPassword, changePassword } from '../services/authService.js';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register Farmer or Dealer
 */
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, role, businessName, dealerType, gstNumber, licenseNumber, district, state } = req.body;

    if (!name || !phone) {
      return sendError(res, 'Name and phone number are required.', 'VALIDATION_ERROR', 400);
    }

    const result = await registerUser({
      name,
      phone,
      email,
      password,
      role,
      businessName,
      dealerType,
      gstNumber,
      licenseNumber,
      district,
      state,
    });

    return sendSuccess(res, result, 'Registration successful', 201);
  } catch (error) {
    return sendError(res, error.message, 'REGISTRATION_FAILED', 400);
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login with Phone/Email + Password
 */
router.post('/login', async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    if (!phone && !email) {
      return sendError(res, 'Phone number or email is required.', 'VALIDATION_ERROR', 400);
    }

    const result = await loginUser({ phone, email, password });
    return sendSuccess(res, result, 'Login successful');
  } catch (error) {
    return sendError(res, error.message, 'LOGIN_FAILED', 401);
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
 * @route POST /api/auth/send-otp
 * @desc Send 6-digit OTP to mobile
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return sendError(res, 'Phone number is required.', 'VALIDATION_ERROR', 400);
    }

    const result = await sendOtp(phone);
    return sendSuccess(res, result, 'OTP sent successfully');
  } catch (error) {
    return sendError(res, error.message, 'OTP_FAILED', 400);
  }
});

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify OTP and authenticate
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, role = 'farmer', name = 'Farmer User' } = req.body;
    if (!phone || !otp) {
      return sendError(res, 'Phone and OTP are required.', 'VALIDATION_ERROR', 400);
    }

    await verifyOtp(phone, otp);

    // Check if user exists, if not auto-register
    let user = await User.findOne({ phone });
    if (!user) {
      const reg = await registerUser({ name, phone, role });
      return sendSuccess(res, reg, 'OTP verified and account created');
    }

    const result = await loginUser({ phone });
    return sendSuccess(res, result, 'OTP verified successfully');
  } catch (error) {
    return sendError(res, error.message, 'OTP_VERIFICATION_FAILED', 400);
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

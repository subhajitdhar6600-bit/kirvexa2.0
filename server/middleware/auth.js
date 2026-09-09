import { verifyAccessToken } from '../utils/tokenUtils.js';
import { sendError } from '../utils/apiResponse.js';
import { ERROR_CODES, USER_STATUS, ROLES } from '../config/constants.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token missing or invalid', ERROR_CODES.UNAUTHORIZED, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded.id) {
      return sendError(res, 'Invalid or expired session token', ERROR_CODES.UNAUTHORIZED, 401);
    }

    const user = await User.findOne({ id: decoded.id });
    if (!user) {
      return sendError(res, 'User not found or deleted', ERROR_CODES.UNAUTHORIZED, 401);
    }

    // Rule 2 â Suspended or blocked account cannot transact or access protected endpoints
    if (user.status === USER_STATUS.SUSPENDED || user.status === USER_STATUS.BLOCKED) {
      return sendError(
        res,
        'Your account has been suspended or blocked. Please contact platform support.',
        ERROR_CODES.ACCOUNT_SUSPENDED,
        403
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Authentication failed', ERROR_CODES.UNAUTHORIZED, 401, [error.message]);
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', ERROR_CODES.UNAUTHORIZED, 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
        ERROR_CODES.FORBIDDEN,
        403
      );
    }

    next();
  };
};

export const requireFarmer = authorize(ROLES.FARMER, ROLES.ADMIN);
export const requireDealer = authorize(ROLES.DEALER, ROLES.ADMIN);
export const requireAdmin = authorize(ROLES.ADMIN);

export default {
  authenticate,
  authorize,
  requireFarmer,
  requireDealer,
  requireAdmin,
};

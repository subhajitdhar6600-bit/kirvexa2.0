import { sendError } from '../utils/apiResponse.js';
import { ERROR_CODES, KCC_STATUS, ROLES } from '../config/constants.js';
import PlatformSettings from '../models/PlatformSettings.js';

export const requireApprovedKCC = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return sendError(res, 'Authentication required', ERROR_CODES.UNAUTHORIZED, 401);
    }

    // Admins bypass KCC requirement
    if (user.role === ROLES.ADMIN) {
      return next();
    }

    // Query platform settings to check if KCC is globally enforced for this role
    const settings = await PlatformSettings.getSettings();
    const isEnforced =
      user.role === ROLES.FARMER
        ? settings.requireKccForFarmerCrops
        : user.role === ROLES.DEALER
        ? settings.requireKccForDealerProducts
        : true;

    if (!isEnforced) {
      return next();
    }

    // Rule 1: No KCC approval -> no KCC-dependent transaction
    if (user.kccStatus !== KCC_STATUS.APPROVED) {
      return sendError(
        res,
        'Approved KCC verification is required to access this service.',
        ERROR_CODES.KCC_REQUIRED,
        403,
        [{ currentStatus: user.kccStatus, requiredStatus: KCC_STATUS.APPROVED }]
      );
    }

    next();
  } catch (error) {
    return sendError(res, 'Failed to verify KCC status', ERROR_CODES.INTERNAL_ERROR, 500, [error.message]);
  }
};

export default {
  requireApprovedKCC,
};

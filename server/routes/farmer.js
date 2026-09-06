import express from 'express';
import crypto from 'crypto';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { authenticate, requireFarmer } from '../middleware/auth.js';
import { requireApprovedKCC } from '../middleware/kcc.js';
import User from '../models/User.js';
import FarmerProfile from '../models/FarmerProfile.js';
import KccApplication from '../models/KccApplication.js';
import CropListing from '../models/CropListing.js';
import Order from '../models/Order.js';
import { applyKcc } from '../services/kccService.js';
import { CROP_STATUS, KCC_STATUS } from '../config/constants.js';

const router = express.Router();

// Apply authentication and farmer role middleware to all farmer routes
router.use(authenticate, requireFarmer);

/**
 * @route GET /api/farmer/profile
 */
router.get('/profile', async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ userId: req.user.id });
    return sendSuccess(res, {
      user: req.user.toSafeObject(),
      profile: profile || {},
      kccStatus: req.user.kccStatus,
    });
  } catch (error) {
    return sendError(res, error.message, 'PROFILE_FETCH_FAILED', 500);
  }
});

/**
 * @route PATCH /api/farmer/profile
 */
router.patch('/profile', async (req, res) => {
  try {
    const { name, email, district, state, village, landSizeAcres, primaryCrops } = req.body;

    const user = await User.findOneAndUpdate(
      { id: req.user.id },
      {
        $set: {
          ...(name && { name }),
          ...(email && { email }),
          ...(district && { district }),
          ...(state && { state }),
          ...(village && { village }),
        },
      },
      { new: true }
    );

    let profile = await FarmerProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          ...(landSizeAcres !== undefined && { landSizeAcres }),
          ...(primaryCrops && { primaryCrops }),
        },
      },
      { new: true, upsert: true }
    );

    return sendSuccess(res, { user: user.toSafeObject(), profile }, 'Profile updated successfully');
  } catch (error) {
    return sendError(res, error.message, 'PROFILE_UPDATE_FAILED', 400);
  }
});

/**
 * @route GET /api/farmer/kcc/status
 */
router.get('/kcc/status', async (req, res) => {
  try {
    const application = await KccApplication.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, {
      status: req.user.kccStatus || KCC_STATUS.NOT_APPLIED,
      isApproved: req.user.kccStatus === KCC_STATUS.APPROVED,
      rejectionReason: req.user.kccRejectionReason || application?.rejectionReason || '',
      application: application || null,
      message:
        req.user.kccStatus === KCC_STATUS.NOT_APPLIED
          ? 'Please apply for KCC to access this service.'
          : req.user.kccStatus === KCC_STATUS.PENDING
          ? 'Your KCC application is under review.'
          : req.user.kccStatus === KCC_STATUS.APPROVED
          ? 'Your KCC is verified and approved.'
          : req.user.kccStatus === KCC_STATUS.REJECTED
          ? 'Your KCC application was rejected.'
          : req.user.kccStatus,
    });
  } catch (error) {
    return sendError(res, error.message, 'KCC_STATUS_FAILED', 500);
  }
});

/**
 * @route GET /api/farmer/kcc
 */
router.get('/kcc', async (req, res) => {
  try {
    const applications = await KccApplication.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, { applications });
  } catch (error) {
    return sendError(res, error.message, 'KCC_FETCH_FAILED', 500);
  }
});

/**
 * @route POST /api/farmer/kcc/apply
 */
router.post('/kcc/apply', async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      dateOfBirth,
      address,
      district,
      state,
      pincode,
      aadhaarNumber,
      landDetails,
      bankDetails,
      documentUrls,
    } = req.body;

    const application = await applyKcc({
      userId: req.user.id,
      userType: 'farmer',
      fullName: fullName || req.user.name,
      mobileNumber: mobileNumber || req.user.phone,
      dateOfBirth,
      address: address || req.user.village,
      district: district || req.user.district,
      state: state || req.user.state,
      pincode: pincode || req.user.pincode,
      aadhaarNumber: aadhaarNumber || req.user.aadhaarNumber,
      landDetails,
      bankDetails,
      documentUrls,
    });

    return sendSuccess(res, { application }, 'KCC application submitted successfully', 201);
  } catch (error) {
    return sendError(res, error.message, error.code || 'KCC_APPLICATION_FAILED', 400);
  }
});

/**
 * @route POST /api/farmer/crops
 * @desc Create Crop Listing (CRITICAL: Protected by requireApprovedKCC)
 */
router.post('/crops', requireApprovedKCC, async (req, res) => {
  try {
    const {
      cropName,
      cropVariety,
      description,
      quantity,
      unit,
      expectedPrice,
      qualityGrade,
      images,
      harvestDate,
      availableFrom,
      village,
      district,
    } = req.body;

    if (!cropName || !quantity || !expectedPrice) {
      return sendError(res, 'Crop name, quantity, and expected price are required.', 'VALIDATION_ERROR', 400);
    }

    const cropId = `crp_${crypto.randomBytes(8).toString('hex')}`;
    const crop = await CropListing.create({
      id: cropId,
      farmerId: req.user.id,
      cropName,
      cropVariety,
      description,
      quantity: Number(quantity),
      initialQuantity: Number(quantity),
      unit: unit || 'quintal',
      expectedPrice: Number(expectedPrice),
      qualityGrade: qualityGrade || 'A',
      images: images || [],
      harvestDate,
      availableFrom,
      location: {
        village: village || req.user.village,
        district: district || req.user.district,
        state: req.user.state || 'Bihar',
      },
      status: CROP_STATUS.ACTIVE,
    });

    return sendSuccess(res, { crop }, 'Crop listed successfully for sale', 201);
  } catch (error) {
    return sendError(res, error.message, 'CROP_CREATION_FAILED', 400);
  }
});

/**
 * @route GET /api/farmer/crops
 */
router.get('/crops', async (req, res) => {
  try {
    const crops = await CropListing.find({ farmerId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, { crops });
  } catch (error) {
    return sendError(res, error.message, 'CROP_FETCH_FAILED', 500);
  }
});

/**
 * @route GET /api/farmer/crops/:id
 */
router.get('/crops/:id', async (req, res) => {
  try {
    const crop = await CropListing.findOne({ id: req.params.id, farmerId: req.user.id });
    if (!crop) {
      return sendError(res, 'Crop listing not found.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, { crop });
  } catch (error) {
    return sendError(res, error.message, 'CROP_FETCH_FAILED', 500);
  }
});

/**
 * @route PATCH /api/farmer/crops/:id
 */
router.patch('/crops/:id', async (req, res) => {
  try {
    const crop = await CropListing.findOneAndUpdate(
      { id: req.params.id, farmerId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!crop) {
      return sendError(res, 'Crop listing not found.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, { crop }, 'Crop listing updated successfully');
  } catch (error) {
    return sendError(res, error.message, 'CROP_UPDATE_FAILED', 400);
  }
});

/**
 * @route DELETE /api/farmer/crops/:id
 */
router.delete('/crops/:id', async (req, res) => {
  try {
    const crop = await CropListing.findOneAndDelete({ id: req.params.id, farmerId: req.user.id });
    if (!crop) {
      return sendError(res, 'Crop listing not found.', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, {}, 'Crop listing removed');
  } catch (error) {
    return sendError(res, error.message, 'CROP_DELETE_FAILED', 500);
  }
});

/**
 * @route GET /api/farmer/sales
 * @desc Get orders where farmer is the seller
 */
router.get('/sales', async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, { orders });
  } catch (error) {
    return sendError(res, error.message, 'SALES_FETCH_FAILED', 500);
  }
});

export default router;

import mongoose from 'mongoose';
import express from 'express';
import CropListing from '../models/CropListing.js';
import User from '../models/User.js';
import { createCropOrder } from '../services/orderService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const buildIdQuery = (id) => {
  const query = [{ id }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    query.push({ _id: id });
  }
  return { $or: query };
};

/**
 * @route GET /api/crops
 * @desc Get all crops - returns plain array for frontend compatibility
 */
router.get('/', async (req, res) => {
  try {
    const { district, cropName, qualityGrade } = req.query;
    const query = {};

    if (district) query.$or = [{ district: { $regex: district, $options: 'i' } }, { 'location.district': { $regex: district, $options: 'i' } }];
    if (cropName) query.cropName = { $regex: cropName, $options: 'i' };
    if (qualityGrade) query.qualityGrade = qualityGrade;

    const crops = await CropListing.find(query).sort({ createdAt: -1 });
    return res.json(crops);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @route POST /api/crops
 * @desc Submit new crop listing (Frontend & API)
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `crop-${Date.now()}`;
    }
    if (data.price && !data.expectedPrice) data.expectedPrice = Number(data.price);
    if (data.expectedPrice && !data.price) data.price = Number(data.expectedPrice);
    if (!data.status) data.status = 'pending';

    const crop = await CropListing.create(data);
    return res.json(crop);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @route PUT /api/crops/:id/approve
 * @desc Approve crop listing (Frontend Admin)
 */
router.put('/:id/approve', async (req, res) => {
  try {
    const updated = await CropListing.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { status: 'approved', adminApprovalStatus: 'APPROVED' },
      { new: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @route PUT /api/crops/:id/reject
 * @desc Reject crop listing (Frontend Admin)
 */
router.put('/:id/reject', async (req, res) => {
  try {
    const updated = await CropListing.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { status: 'rejected', adminApprovalStatus: 'REJECTED' },
      { new: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @route GET /api/crops/:id
 * @desc Get single crop detail
 */
router.get('/:id', async (req, res) => {
  try {
    const crop = await CropListing.findOne(buildIdQuery(req.params.id));
    if (!crop) {
      return res.status(404).json({ error: 'Crop listing not found' });
    }
    const farmer = await User.findOne({ id: crop.farmerId || crop.phone });
    return res.json({
      crop,
      farmer: farmer ? { name: farmer.name, phone: farmer.phone, district: farmer.district } : null,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @route POST /api/crops/:id/buy
 * @desc Purchase crop from farmer (PRD Flow 2)
 */
router.post('/:id/buy', authenticate, async (req, res) => {
  try {
    const { quantity, shippingAddress, billingAddress, paymentMethod } = req.body;
    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({ error: 'Valid purchase quantity is required' });
    }
    const order = await createCropOrder({
      buyerId: req.user.id,
      cropId: req.params.id,
      quantity: Number(quantity),
      shippingAddress: shippingAddress || { addressLine: 'Default address' },
      billingAddress,
      paymentMethod,
    });
    return res.status(201).json({ success: true, order });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @route DELETE /api/crops/:id
 * @desc Delete crop listing
 */
router.delete('/:id', async (req, res) => {
  try {
    await CropListing.findOneAndDelete(buildIdQuery(req.params.id));
    return res.json({ success: true, id: req.params.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

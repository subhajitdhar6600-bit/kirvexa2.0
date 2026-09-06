import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import DealerListing from '../models/DealerListing.js';
import User from '../models/User.js';
import DealerProfile from '../models/DealerProfile.js';
import KccApplication from '../models/KccApplication.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { applyKcc } from '../services/kccService.js';
import { updateOrderStatus } from '../services/orderService.js';
import { PRODUCT_STATUS, KCC_STATUS } from '../config/constants.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { authenticate, requireDealer } from '../middleware/auth.js';
import { requireApprovedKCC } from '../middleware/kcc.js';

const router = express.Router();

const buildIdQuery = (id) => {
  const query = [{ id }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    query.push({ _id: id });
  }
  return { $or: query };
};

/* ==========================================================================
   1. FRONTEND COMPATIBILITY ROUTES (Dealer Listings)
   Used directly by client/src/services/api.ts (api.getDealerListings, etc.)
   ========================================================================== */

// GET all dealer listings (plain JSON array for frontend)
router.get('/listings', async (req, res) => {
  try {
    const listings = await DealerListing.find().sort({ createdAt: -1 });
    return res.json(listings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST submit new dealer listing
router.post('/listings', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `dl-${Date.now()}`;
    }
    const listing = await DealerListing.create(data);
    return res.json(listing);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT update dealer listing
router.put('/listings/:id', async (req, res) => {
  try {
    const updated = await DealerListing.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: req.body },
      { new: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT approve dealer listing
router.put('/listings/:id/approve', async (req, res) => {
  try {
    const updated = await DealerListing.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { status: 'approved' },
      { new: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT reject dealer listing
router.put('/listings/:id/reject', async (req, res) => {
  try {
    const updated = await DealerListing.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { status: 'rejected' },
      { new: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE dealer listing
router.delete('/listings/:id', async (req, res) => {
  try {
    await DealerListing.findOneAndDelete(buildIdQuery(req.params.id));
    return res.json({ success: true, id: req.params.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   2. PRD MODULAR DEALER ROUTES (Authenticated)
   ========================================================================== */

router.get('/profile', authenticate, requireDealer, async (req, res) => {
  try {
    const profile = await DealerProfile.findOne({ userId: req.user.id });
    return sendSuccess(res, {
      user: req.user.toSafeObject(),
      profile: profile || {},
      kccStatus: req.user.kccStatus,
    });
  } catch (error) {
    return sendError(res, error.message, 'PROFILE_FETCH_FAILED', 500);
  }
});

router.patch('/profile', authenticate, requireDealer, async (req, res) => {
  try {
    const { name, businessName, dealerType, gstNumber, licenseNumber, shopAddress, district, state } = req.body;
    const user = await User.findOneAndUpdate(
      { id: req.user.id },
      { $set: { ...(name && { name }), ...(businessName && { businessName }), ...(dealerType && { dealerType }), ...(district && { district }), ...(state && { state }) } },
      { new: true }
    );
    const profile = await DealerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { ...(businessName && { businessName }), ...(dealerType && { dealerType }), ...(gstNumber !== undefined && { gstNumber }), ...(licenseNumber !== undefined && { licenseNumber }), ...(shopAddress && { shopAddress }) } },
      { new: true, upsert: true }
    );
    return sendSuccess(res, { user: user.toSafeObject(), profile }, 'Dealer profile updated');
  } catch (error) {
    return sendError(res, error.message, 'PROFILE_UPDATE_FAILED', 400);
  }
});

router.get('/kcc/status', authenticate, requireDealer, async (req, res) => {
  try {
    const application = await KccApplication.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, {
      status: req.user.kccStatus || KCC_STATUS.NOT_APPLIED,
      isApproved: req.user.kccStatus === KCC_STATUS.APPROVED,
      rejectionReason: req.user.kccRejectionReason || application?.rejectionReason || '',
      application: application || null,
    });
  } catch (error) {
    return sendError(res, error.message, 'KCC_STATUS_FAILED', 500);
  }
});

router.post('/kcc/apply', authenticate, requireDealer, async (req, res) => {
  try {
    const application = await applyKcc({
      userId: req.user.id,
      userType: 'dealer',
      fullName: req.body.fullName || req.user.name,
      mobileNumber: req.body.mobileNumber || req.user.phone,
      district: req.body.district || req.user.district,
      state: req.body.state || req.user.state,
      ...req.body,
    });
    return sendSuccess(res, { application }, 'Dealer KCC application submitted', 201);
  } catch (error) {
    return sendError(res, error.message, error.code || 'KCC_APPLICATION_FAILED', 400);
  }
});

router.post('/products', authenticate, requireDealer, requireApprovedKCC, async (req, res) => {
  try {
    const { name, categoryId = 'general', description, brand, images, unit, price, discount = 0, tax = 0, stockQuantity, minimumOrderQuantity = 1 } = req.body;
    if (!name || price === undefined || stockQuantity === undefined) {
      return sendError(res, 'Product name, price, and stockQuantity are required.', 'VALIDATION_ERROR', 400);
    }
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const product = await Product.create({
      id: `prd_${crypto.randomBytes(8).toString('hex')}`,
      dealerId: req.user.id,
      categoryId,
      name,
      slug,
      description,
      brand,
      images: images || [],
      unit: unit || 'kg',
      price: Number(price),
      discount: Number(discount),
      tax: Number(tax),
      stockQuantity: Number(stockQuantity),
      minimumOrderQuantity: Number(minimumOrderQuantity),
      status: PRODUCT_STATUS.ACTIVE,
      adminApprovalStatus: 'APPROVED',
    });
    return sendSuccess(res, { product }, 'Product listed successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 'PRODUCT_CREATION_FAILED', 400);
  }
});

router.get('/products', authenticate, requireDealer, async (req, res) => {
  try {
    const products = await Product.find({ dealerId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, { products });
  } catch (error) {
    return sendError(res, error.message, 'PRODUCT_FETCH_FAILED', 500);
  }
});

router.get('/orders', authenticate, requireDealer, async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, { orders });
  } catch (error) {
    return sendError(res, error.message, 'ORDERS_FETCH_FAILED', 500);
  }
});

router.patch('/orders/:id/status', authenticate, requireDealer, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await updateOrderStatus({
      orderId: req.params.id,
      newStatus: status,
      changedBy: req.user.id,
      note: note || `Updated by dealer ${req.user.name}`,
    });
    return sendSuccess(res, { order }, 'Order status updated');
  } catch (error) {
    return sendError(res, error.message, 'ORDER_STATUS_UPDATE_FAILED', 400);
  }
});

router.get('/sales', authenticate, requireDealer, async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id });
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return sendSuccess(res, { totalOrders: orders.length, totalRevenue, recentOrders: orders.slice(0, 10) });
  } catch (error) {
    return sendError(res, error.message, 'SALES_FETCH_FAILED', 500);
  }
});

export default router;

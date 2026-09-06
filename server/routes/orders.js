import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Delivery from '../models/Delivery.js';
import Payment from '../models/Payment.js';
import { createProductOrder, updateOrderStatus } from '../services/orderService.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';
import { ORDER_STATUS } from '../config/constants.js';

const buildIdQuery = (id) => {
  const query = [{ id }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    query.push({ _id: id });
  }
  return { $or: query };
};

const router = express.Router();

/**
 * @route GET /api/orders
 * @desc Get orders - returns array for frontend compatibility
 */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @route POST /api/orders
 * @desc Place order (Frontend & PRD compatible)
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    let authUserId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const decoded = verifyAccessToken(authHeader.split(' ')[1]);
      if (decoded) authUserId = decoded.id;
    }

    // PRD format: has items with productId and no totalAmount
    if (data.items && data.items.length > 0 && data.items[0].productId && data.totalAmount === undefined) {
      const buyerId = data.buyerId || authUserId || data.userId || 'guest';
      const order = await createProductOrder({
        buyerId,
        items: data.items,
        shippingAddress: data.shippingAddress || { addressLine: 'Default' },
        billingAddress: data.billingAddress,
        paymentMethod: data.paymentMethod || 'COD',
      });
      return res.status(201).json({ success: true, data: { order }, order });
    }

    // Frontend format: has totalAmount
    if (!data.id) {
      data.id = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    const order = await Order.create(data);
    return res.json(order);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message, message: err.message, code: err.code });
  }
});

/**
 * @route PUT /api/orders/:id/status
 * @desc Update order status (Frontend compatible)
 */
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findOneAndUpdate(
      { id: req.params.id },
      { status, orderStatus: status ? status.toUpperCase() : 'CONFIRMED' },
      { new: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @route GET /api/orders/:id
 * @desc Get single order detail
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const delivery = await Delivery.findOne({ orderId: order.id });
    const payment = await Payment.findOne({ orderId: order.id });
    return res.json({ order, delivery, payment });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @route POST /api/orders/:id/cancel
 * @desc Cancel order
 */
router.post('/:id/cancel', async (req, res) => {
  try {
    const { reason = 'Cancelled by buyer' } = req.body;
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'Cancelled';
    order.orderStatus = ORDER_STATUS.CANCELLED;
    order.statusHistory.push({
      status: ORDER_STATUS.CANCELLED,
      changedBy: 'user',
      note: reason,
      timestamp: new Date(),
    });
    await order.save();

    return res.json({ success: true, order });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @route PUT /api/orders/:id
 * @desc Update full order details
 */
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: req.body },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json({ success: true, order });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @route DELETE /api/orders/:id
 * @desc Delete order permanently
 */
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findOneAndDelete(buildIdQuery(req.params.id));
    if (!order) return res.status(404).json({ error: 'Order not found' });
    // Also cleanup associated delivery and payment records if any
    await Delivery.deleteMany({ orderId: req.params.id });
    await Payment.deleteMany({ orderId: req.params.id });
    return res.json({ success: true, message: 'Order deleted successfully', id: req.params.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

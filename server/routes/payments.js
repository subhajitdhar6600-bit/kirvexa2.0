import express from 'express';
import mongoose from 'mongoose';
import Payment from '../models/Payment.js';

const router = express.Router();

const buildIdQuery = (id) => {
  const query = [{ id }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    query.push({ _id: id });
  }
  return { $or: query };
};

// GET /api/payments - Get all payments/transactions from MongoDB
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payments/:id
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findOne(buildIdQuery(req.params.id));
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payments - Create new payment / deposit / transaction in MongoDB
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) data.id = `pay-${Date.now()}`;
    if (!data.transactionId) data.transactionId = `tx-${Date.now()}`;
    if (!data.orderId) data.orderId = `ord-${Date.now()}`;
    if (!data.userId) data.userId = 'usr_admin_01';

    const payment = await Payment.create(data);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/payments/:id - Update payment
router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      buildIdQuery(req.params.id),
      req.body,
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/payments/:id - Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete(buildIdQuery(req.params.id));
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ message: 'Payment deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

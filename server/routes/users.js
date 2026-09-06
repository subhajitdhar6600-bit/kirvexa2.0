import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// GET user by ID or get list
router.get('/', async (req, res) => {
  try {
    const { id, phone } = req.query;
    if (id) {
      const user = await User.findOne({ id });
      return res.json(user);
    }
    if (phone) {
      const user = await User.findOne({ phone });
      return res.json(user);
    }
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST save/login user profile
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    if (!userData.id) {
      userData.id = `usr-${Date.now()}`;
    }
    if (userData.fullName && !userData.name) {
      userData.name = userData.fullName;
    }
    const filter = userData.phone ? { phone: userData.phone } : { id: userData.id };
    const user = await User.findOneAndUpdate(
      filter,
      userData,
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filter = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ id }, { _id: id }] }
      : { id };

    const updated = await User.findOneAndUpdate(
      filter,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filter = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ id }, { _id: id }] }
      : { id };

    const result = await User.findOneAndDelete(filter);
    if (!result) {
      // Also try by phone or raw string
      await User.findOneAndDelete({ $or: [{ phone: id }, { name: id }] });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

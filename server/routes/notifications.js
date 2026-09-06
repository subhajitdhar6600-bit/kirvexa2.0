import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET all notifications (plain array for frontend)
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST add notification
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    }
    const notif = await Notification.create(data);
    return res.json(notif);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT mark notification read
router.put('/:id/read', async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { id: req.params.id },
      { read: true, isRead: true },
      { new: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PATCH mark notification read (PRD)
router.patch('/:id/read', async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { id: req.params.id },
      { read: true, isRead: true },
      { new: true }
    );
    return res.json({ success: true, notification: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT mark all read
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({}, { read: true, isRead: true });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE single notification
router.delete('/:id', async (req, res) => {
  try {
    await Notification.deleteOne({ id: req.params.id });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE all notifications
router.delete('/', async (req, res) => {
  try {
    await Notification.deleteMany({});
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

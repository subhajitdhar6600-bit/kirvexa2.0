import express from 'express';
import mongoose from 'mongoose';
import LabourBooking from '../models/LabourBooking.js';
import LabourType from '../models/LabourType.js';

const router = express.Router();

// GET all labour bookings
router.get(['/', '/bookings'], async (req, res) => {
  try {
    const bookings = await LabourBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit new labour booking
router.post('/bookings', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `labour-req-${Date.now()}`;
    }
    const booking = await LabourBooking.create(data);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const buildIdQuery = (paramId) => {
  return mongoose.Types.ObjectId.isValid(paramId)
    ? { $or: [{ id: paramId }, { _id: paramId }] }
    : { id: paramId };
};

// PUT update labour booking
router.put(['/:id', '/bookings/:id'], async (req, res) => {
  try {
    const { status, adminNotes, assignedLabours, labourType, count, days, startDate } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (assignedLabours !== undefined) updateData.assignedLabours = assignedLabours;
    if (labourType !== undefined) updateData.labourType = labourType;
    if (count !== undefined) updateData.count = count;
    if (days !== undefined) updateData.days = days;
    if (startDate !== undefined) updateData.startDate = startDate;

    const updated = await LabourBooking.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: updateData },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE labour booking
router.delete(['/:id', '/bookings/:id'], async (req, res) => {
  try {
    await LabourBooking.deleteOne(buildIdQuery(req.params.id));
    res.json({ success: true, message: 'Labour booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET labour types
router.get('/types', async (req, res) => {
  try {
    const types = await LabourType.find();
    res.json(types.map(t => t.name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add labour type
router.post('/types', async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) return res.status(400).json({ error: 'Type is required' });
    const created = await LabourType.findOneAndUpdate(
      { name: type },
      { name: type },
      { upsert: true, new: true }
    );
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE labour type
router.delete('/types/:name', async (req, res) => {
  try {
    await LabourType.deleteOne({ name: req.params.name });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

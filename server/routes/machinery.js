import express from 'express';
import mongoose from 'mongoose';
import MachineryBooking from '../models/MachineryBooking.js';

const router = express.Router();

// GET all machinery bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await MachineryBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit machinery booking
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `mach-${Date.now()}`;
    }
    const booking = await MachineryBooking.create(data);
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

// PUT update machinery booking
router.put('/:id', async (req, res) => {
  try {
    const { status, allottedMachineDetails, adminNotes, machineryType, bookingDate, durationHours } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (allottedMachineDetails !== undefined) updateData.allottedMachineDetails = allottedMachineDetails;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (machineryType !== undefined) updateData.machineryType = machineryType;
    if (bookingDate !== undefined) updateData.bookingDate = bookingDate;
    if (durationHours !== undefined) updateData.durationHours = durationHours;

    const updated = await MachineryBooking.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: updateData },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE machinery booking
router.delete('/:id', async (req, res) => {
  try {
    await MachineryBooking.deleteOne(buildIdQuery(req.params.id));
    res.json({ success: true, message: 'Machinery booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

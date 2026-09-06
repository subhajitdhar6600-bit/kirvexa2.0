import express from 'express';
import mongoose from 'mongoose';
import ExpertQuery from '../models/ExpertQuery.js';

const router = express.Router();

// GET all expert advice queries
router.get('/', async (req, res) => {
  try {
    const queries = await ExpertQuery.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit expert query
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `exp-${Date.now()}`;
    }
    const query = await ExpertQuery.create(data);
    res.json(query);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const buildIdQuery = (paramId) => {
  return mongoose.Types.ObjectId.isValid(paramId)
    ? { $or: [{ id: paramId }, { _id: paramId }] }
    : { id: paramId };
};

// PUT update expert query status and reply
router.put('/:id', async (req, res) => {
  try {
    const { status, adminReply, problemDetails, cropName } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (adminReply !== undefined) updateData.adminReply = adminReply;
    if (problemDetails !== undefined) updateData.problemDetails = problemDetails;
    if (cropName !== undefined) updateData.cropName = cropName;

    const updated = await ExpertQuery.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: updateData },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE expert query
router.delete('/:id', async (req, res) => {
  try {
    await ExpertQuery.deleteOne(buildIdQuery(req.params.id));
    res.json({ success: true, message: 'Expert query deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

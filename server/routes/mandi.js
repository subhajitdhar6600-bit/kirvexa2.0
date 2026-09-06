import express from 'express';
import MandiRate from '../models/MandiRate.js';

const router = express.Router();

// GET all mandi rates
router.get('/', async (req, res) => {
  try {
    const rates = await MandiRate.find().sort({ createdAt: -1 });
    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add mandi rate
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `mandi-${Date.now()}`;
    }
    const rate = await MandiRate.create(data);
    res.json(rate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update mandi rate
router.put('/:id', async (req, res) => {
  try {
    const updated = await MandiRate.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE mandi rate
router.delete('/:id', async (req, res) => {
  try {
    await MandiRate.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

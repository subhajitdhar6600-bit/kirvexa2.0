import express from 'express';
import RegisteredFarmer from '../models/RegisteredFarmer.js';

const router = express.Router();

// GET all registered farmers
router.get('/', async (req, res) => {
  try {
    const farmers = await RegisteredFarmer.find().sort({ createdAt: -1 });
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST register farmer by dealer
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `rf-${Date.now()}`;
    }
    const farmer = await RegisteredFarmer.create(data);
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import express from 'express';
import KccApplication from '../models/KccApplication.js';

const router = express.Router();

// GET all KCC applications
router.get('/', async (req, res) => {
  try {
    const apps = await KccApplication.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit new KCC application
router.post('/', async (req, res) => {
  try {
    const appData = req.body;
    if (!appData.id) {
      appData.id = `kcc-${Date.now()}`;
    }
    const newApp = await KccApplication.create(appData);
    res.json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT approve KCC application
router.put('/:id/approve', async (req, res) => {
  try {
    const cardNumber = req.body.cardNumber || `KCC-BH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = new Date().toISOString().split('T')[0];
    const updated = await KccApplication.findOneAndUpdate(
      { id: req.params.id },
      { status: 'approved', cardNumber, issueDate },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT reject KCC application
router.put('/:id/reject', async (req, res) => {
  try {
    const updated = await KccApplication.findOneAndUpdate(
      { id: req.params.id },
      { status: 'rejected' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET search KCC status by phone/aadhaar/card number
router.get('/search', async (req, res) => {
  try {
    const { phone, aadhaar, cardNumber } = req.query;
    const cleanPhone = (phone || '').toString().trim();
    const cleanAadhaar = (aadhaar || '').toString().trim().replace(/\s+/g, '');
    const cleanCard = (cardNumber || '').toString().trim();

    if (!cleanPhone && !cleanAadhaar && !cleanCard) {
      return res.json(null);
    }

    const apps = await KccApplication.find();
    const matched = apps.find(a => {
      const matchPhone = cleanPhone && (a.phone.trim() === cleanPhone || a.phone.includes(cleanPhone));
      const matchAadhaar = cleanAadhaar && (a.aadhaar.replace(/\s+/g, '') === cleanAadhaar || a.aadhaar.includes(cleanAadhaar));
      const matchCard = cleanCard && (a.cardNumber?.toLowerCase() === cleanCard.toLowerCase() || a.cardNumber?.includes(cleanCard));
      return matchPhone || matchAadhaar || matchCard;
    });

    res.json(matched || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

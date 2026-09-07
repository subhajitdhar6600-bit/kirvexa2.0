import express from 'express';
import KccApplication from '../models/KccApplication.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

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
    const creditLimit = Number(req.body.creditLimit || req.body.paymentAmount) || 50000;
    const cardNumber = req.body.cardNumber || `KCC-BH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = new Date().toISOString().split('T')[0];
    const updated = await KccApplication.findOneAndUpdate(
      { id: req.params.id },
      { status: 'approved', cardNumber, issueDate, creditLimit, paymentAmount: creditLimit },
      { new: true }
    );

    if (updated) {
      // Also update matching User in DB if exists
      const cleanPhone = (updated.phone || '').replace(/\D/g, '').slice(-10);
      if (cleanPhone) {
        await User.updateMany(
          { phone: { $regex: cleanPhone } },
          { isKccIssued: true, isVerified: true, kccCardNumber: cardNumber, kccCreditLimit: creditLimit, kccStatus: 'APPROVED' }
        );
      }

      // Add Notification
      try {
        await Notification.create({
          id: `notif-${Date.now()}`,
          userId: updated.phone || 'broadcast',
          title: 'KCC Card Approved & Allotted 💳',
          message: `Congratulations ${updated.fullName}! Your Kisan Credit Card (KCC) has been approved. Allotted Card Number: ${cardNumber} with Credit Limit ₹${creditLimit.toLocaleString('en-IN')}. All platform features are now unlocked!`,
          type: 'success',
          link: '/wallet',
          category: 'kcc',
        });
      } catch (notifErr) {
        console.warn('Failed to persist notification:', notifErr);
      }
    }

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

// PUT update KCC limit for an application and user
router.put('/update-limit', async (req, res) => {
  try {
    const { id, cardNumber, phone, creditLimit } = req.body;
    const numLimit = Number(creditLimit);
    if (!numLimit || isNaN(numLimit)) {
      return res.status(400).json({ error: 'Valid credit limit is required' });
    }

    const cleanCard = (cardNumber || '').trim();
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);

    const appQueries = [];
    if (id) appQueries.push({ id });
    if (cleanCard) appQueries.push({ cardNumber: cleanCard });
    if (cleanPhone) appQueries.push({ phone: { $regex: cleanPhone } });

    let updated = null;
    if (appQueries.length > 0) {
      updated = await KccApplication.findOneAndUpdate(
        { $or: appQueries },
        { creditLimit: numLimit, paymentAmount: numLimit },
        { new: true }
      );
    }

    // Also update all matching users in database
    const userQueries = [];
    if (cleanCard) userQueries.push({ kccCardNumber: cleanCard });
    if (cleanPhone) userQueries.push({ phone: { $regex: cleanPhone } });

    if (userQueries.length > 0) {
      await User.updateMany(
        { $or: userQueries },
        { kccCreditLimit: numLimit, ...(cleanCard ? { kccCardNumber: cleanCard } : {}) }
      );
    }

    res.json({ success: true, updated, creditLimit: numLimit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

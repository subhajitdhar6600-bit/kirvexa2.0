import express from 'express';
import FarmerCard from '../models/FarmerCard.js';
import KccApplication from '../models/KccApplication.js';

const router = express.Router();

// GET check farmer card balance
router.get('/:cardNumber', async (req, res) => {
  try {
    const cleaned = req.params.cardNumber.trim();
    let card = await FarmerCard.findOne({ cardNumber: cleaned });
    
    if (!card) {
      const matchedApp = await KccApplication.findOne({ cardNumber: cleaned, status: 'approved' });
      if (matchedApp) {
        card = await FarmerCard.create({
          cardNumber: cleaned,
          cardHolder: matchedApp.fullName,
          balance: 20000,
          status: 'active',
        });
      }
    }

    if (card) {
      return res.json({ exists: true, cardHolder: card.cardHolder, balance: card.balance, status: card.status });
    }

    res.json({ exists: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST charge farmer card
router.post('/charge', async (req, res) => {
  try {
    const { cardNumber, amount } = req.body;
    const cleaned = (cardNumber || '').trim();
    if (!cleaned || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid card number or amount.' });
    }

    let card = await FarmerCard.findOne({ cardNumber: cleaned });
    if (!card) {
      const matchedApp = await KccApplication.findOne({ cardNumber: cleaned, status: 'approved' });
      if (matchedApp) {
        card = await FarmerCard.create({
          cardNumber: cleaned,
          cardHolder: matchedApp.fullName,
          balance: 25000,
          status: 'active',
        });
      }
    }

    if (!card || card.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Kishan Credit Card not found or not active.' });
    }

    if (card.balance < amount) {
      return res.json({
        success: false,
        message: `Insufficient balance on KCC. Current available limit: ₹${card.balance}`,
      });
    }

    card.balance -= amount;
    await card.save();

    res.json({
      success: true,
      message: `Payment of ₹${amount} debited successfully!`,
      remainingBalance: card.balance,
      cardHolder: card.cardHolder,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

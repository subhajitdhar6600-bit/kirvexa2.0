import express from 'express';
import mongoose from 'mongoose';
import LabourBooking from '../models/LabourBooking.js';
import LabourType from '../models/LabourType.js';
import Notification from '../models/Notification.js';

const router = express.Router();

const buildIdQuery = (paramId) => {
  return mongoose.Types.ObjectId.isValid(paramId)
    ? { $or: [{ id: paramId }, { _id: paramId }] }
    : { id: paramId };
};

// Helper: send notification to user
const sendNotification = async ({ userId, title, message, type = 'info', category = 'labour', data = {} }) => {
  try {
    await Notification.create({
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: userId || 'broadcast',
      title,
      message,
      type,
      category,
      link: '/profile',
      data,
      read: false,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

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
router.post(['/', '/bookings'], async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = `labour-req-${Date.now()}`;
    }
    if (!data.status) {
      data.status = 'pending_rate';
    }
    const booking = await LabourBooking.create(data);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Step 1: Admin Allot Rate / Charge for Labour Booking
router.put(['/:id/rate', '/bookings/:id/rate'], async (req, res) => {
  try {
    const { rateQuote, rateQuoteAmount, rateNotes } = req.body;
    const updateData = {
      status: 'rate_quoted',
      rateQuote: rateQuote || '',
      rateQuoteAmount: Number(rateQuoteAmount) || 0,
      rateNotes: rateNotes || '',
    };

    const updated = await LabourBooking.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Labour booking not found' });
    }

    // Send rate quote notification to user profile
    await sendNotification({
      userId: updated.userId || updated.phone,
      title: `Rate Quoted: ${updated.labourType} Booking (#${updated.id})`,
      message: `Admin has quoted ${updated.rateQuote} for your request of ${updated.count} ${updated.labourType} worker(s). Click to review and Accept or Cancel.`,
      type: 'info',
      category: 'labour',
      data: {
        bookingId: updated.id,
        bookingType: 'labour',
        action: 'rate_quote',
        rateQuote: updated.rateQuote,
        rateQuoteAmount: updated.rateQuoteAmount,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Step 2: User Accept or Cancel Labour Rate
router.put(['/:id/respond', '/bookings/:id/respond'], async (req, res) => {
  try {
    const { response } = req.body; // 'accepted' | 'cancelled'
    if (response !== 'accepted' && response !== 'cancelled') {
      return res.status(400).json({ error: 'Response must be accepted or cancelled' });
    }

    const newStatus = response === 'accepted' ? 'rate_accepted' : 'cancelled';
    const updated = await LabourBooking.findOneAndUpdate(
      buildIdQuery(req.params.id),
      {
        $set: {
          status: newStatus,
          userResponse: response,
          userResponseAt: new Date().toISOString(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Labour booking not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Step 3: Admin Allot Resources (Labour Names, Contact Phone Number)
router.put(['/:id/allot-resources', '/bookings/:id/allot-resources', '/:id/assign', '/bookings/:id/assign'], async (req, res) => {
  try {
    const { assignedLabours, adminNotes, workerNames, leadPhone } = req.body;
    
    let laboursList = assignedLabours || [];
    if (!laboursList.length && workerNames) {
      laboursList = workerNames.split(',').map((name) => ({
        name: name.trim(),
        phone: leadPhone || '',
        charges: '',
      }));
    }

    const updated = await LabourBooking.findOneAndUpdate(
      buildIdQuery(req.params.id),
      {
        $set: {
          status: 'allotted',
          assignedLabours: laboursList,
          adminNotes: adminNotes || '',
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Labour booking not found' });
    }

    const namesSummary = laboursList.map(l => l.name).filter(Boolean).join(', ') || 'Assigned Workers';
    const phonesSummary = laboursList.map(l => l.phone).filter(Boolean)[0] || leadPhone || updated.phone;

    // Send Final Detailed Notification to User's Profile
    await sendNotification({
      userId: updated.userId || updated.phone,
      title: `Labour Allotted & Confirmed! (#${updated.id}) 👷`,
      message: `Your booking for ${updated.count} ${updated.labourType} worker(s) is confirmed! Assigned Labours: ${namesSummary} (Contact: ${phonesSummary}). Start Date: ${updated.startDate || 'Immediate'}, Duration: ${updated.days} days, Location: ${updated.location}, Agreed Rate: ${updated.rateQuote}.`,
      type: 'success',
      category: 'labour',
      data: {
        bookingId: updated.id,
        bookingType: 'labour',
        status: 'allotted',
        labourType: updated.labourType,
        count: updated.count,
        days: updated.days,
        startDate: updated.startDate,
        location: updated.location,
        rateQuote: updated.rateQuote,
        assignedLabours: laboursList,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// General PUT update labour booking
router.put(['/:id', '/bookings/:id'], async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;

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

import express from 'express';
import mongoose from 'mongoose';
import MachineryBooking from '../models/MachineryBooking.js';
import Notification from '../models/Notification.js';

const router = express.Router();

const buildIdQuery = (paramId) => {
  return mongoose.Types.ObjectId.isValid(paramId)
    ? { $or: [{ id: paramId }, { _id: paramId }] }
    : { id: paramId };
};

// Helper: send notification to user
const sendNotification = async ({ userId, title, message, type = 'info', category = 'machinery', data = {} }) => {
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
    if (!data.status) {
      data.status = 'pending_rate';
    }
    const booking = await MachineryBooking.create(data);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Step 1: Admin Allot Rate / Charge
router.put('/:id/rate', async (req, res) => {
  try {
    const { rateQuote, rateQuoteAmount, rateNotes } = req.body;
    const updateData = {
      status: 'rate_quoted',
      rateQuote: rateQuote || '',
      rateQuoteAmount: Number(rateQuoteAmount) || 0,
      rateNotes: rateNotes || '',
    };

    const updated = await MachineryBooking.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Machinery booking not found' });
    }

    // Send rate quote notification to user profile
    await sendNotification({
      userId: updated.userId || updated.phone,
      title: `Rate Quoted: ${updated.machineryType} Booking (#${updated.id})`,
      message: `Admin has quoted ${updated.rateQuote} for your ${updated.machineryType} booking request. Click to review and Accept or Cancel.`,
      type: 'info',
      category: 'machinery',
      data: {
        bookingId: updated.id,
        bookingType: 'machinery',
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

// PUT Step 2: User Accept or Cancel Rate
router.put('/:id/respond', async (req, res) => {
  try {
    const { response } = req.body; // 'accepted' | 'cancelled'
    if (response !== 'accepted' && response !== 'cancelled') {
      return res.status(400).json({ error: 'Response must be accepted or cancelled' });
    }

    const newStatus = response === 'accepted' ? 'rate_accepted' : 'cancelled';
    const updated = await MachineryBooking.findOneAndUpdate(
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
      return res.status(404).json({ error: 'Machinery booking not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Step 3: Admin Allot Resources (Machine Name, Number Plate, Operator Phone)
router.put(['/:id/allot-resources', '/:id/allot'], async (req, res) => {
  try {
    const { machineName, numberPlate, operatorName, operatorPhone, detailsText, adminNotes, machineDetails } = req.body;
    
    const allottedMachine = {
      machineName: machineName || (machineDetails ? machineDetails.split('|')[0] : '') || '',
      numberPlate: numberPlate || '',
      operatorName: operatorName || '',
      operatorPhone: operatorPhone || '',
      detailsText: detailsText || machineDetails || '',
    };

    const detailsSummary = detailsText || machineDetails || 
      `Machine: ${allottedMachine.machineName}${allottedMachine.numberPlate ? ` (${allottedMachine.numberPlate})` : ''} | Operator: ${allottedMachine.operatorName} (${allottedMachine.operatorPhone})`;

    const updated = await MachineryBooking.findOneAndUpdate(
      buildIdQuery(req.params.id),
      {
        $set: {
          status: 'allotted',
          allottedMachine,
          allottedMachineDetails: detailsSummary,
          adminNotes: adminNotes || '',
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Machinery booking not found' });
    }

    // Send Final Detailed Notification to User's Profile
    await sendNotification({
      userId: updated.userId || updated.phone,
      title: `Machine Allotted & Confirmed! (#${updated.id}) 🚜`,
      message: `Your booking for ${updated.machineryType} is confirmed! Machine: ${allottedMachine.machineName || 'Allotted'}, Number Plate: ${allottedMachine.numberPlate || 'Assigned'}, Operator: ${allottedMachine.operatorName} (${allottedMachine.operatorPhone}). Date: ${updated.bookingDate}, Duration: ${updated.durationHours} hrs, Address: ${updated.location}, Agreed Rate: ${updated.rateQuote}.`,
      type: 'success',
      category: 'machinery',
      data: {
        bookingId: updated.id,
        bookingType: 'machinery',
        status: 'allotted',
        machineryType: updated.machineryType,
        bookingDate: updated.bookingDate,
        durationHours: updated.durationHours,
        location: updated.location,
        rateQuote: updated.rateQuote,
        allottedMachine,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT reject machinery booking (backward compatibility)
router.put('/:id/reject', async (req, res) => {
  try {
    const updated = await MachineryBooking.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: { status: 'rejected' } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// General PUT update machinery booking
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;

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

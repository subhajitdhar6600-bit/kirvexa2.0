import express from 'express';
import crypto from 'crypto';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { authenticate } from '../middleware/auth.js';
import Complaint from '../models/Complaint.js';

const router = express.Router();

router.use(authenticate);

/**
 * @route POST /api/complaints
 * @desc File a support complaint
 */
router.post('/', async (req, res) => {
  try {
    const { subject, description, category = 'other', orderId } = req.body;
    if (!subject || !description) {
      return sendError(res, 'Subject and description are required', 'VALIDATION_ERROR', 400);
    }

    const complaint = await Complaint.create({
      id: `cmp_${crypto.randomBytes(6).toString('hex')}`,
      userId: req.user.id,
      orderId,
      subject,
      description,
      category,
    });

    return sendSuccess(res, { complaint }, 'Complaint submitted successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 'COMPLAINT_FAILED', 400);
  }
});

/**
 * @route GET /api/complaints
 * @desc Get user's complaints
 */
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, { complaints });
  } catch (error) {
    return sendError(res, error.message, 'COMPLAINTS_FETCH_FAILED', 500);
  }
});

export default router;

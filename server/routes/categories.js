import express from 'express';
import crypto from 'crypto';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import Category from '../models/Category.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route GET /api/categories
 * @desc Get all active categories
 */
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };
    if (type) query.type = { $in: [type, 'both'] };

    const categories = await Category.find(query).sort({ name: 1 });
    return sendSuccess(res, { categories });
  } catch (error) {
    return sendError(res, error.message, 'CATEGORIES_FETCH_FAILED', 500);
  }
});

/**
 * @route POST /api/categories
 * @desc Admin creates category
 */
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, type = 'product', description, image } = req.body;
    if (!name) return sendError(res, 'Category name is required', 'VALIDATION_ERROR', 400);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await Category.create({
      id: `cat_${crypto.randomBytes(6).toString('hex')}`,
      name,
      slug,
      type,
      description,
      image,
    });

    return sendSuccess(res, { category }, 'Category created', 201);
  } catch (error) {
    return sendError(res, error.message, 'CATEGORY_CREATE_FAILED', 400);
  }
});

export default router;

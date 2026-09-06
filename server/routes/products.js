import mongoose from 'mongoose';
import express from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import Product from '../models/Product.js';
import { PRODUCT_STATUS } from '../config/constants.js';

const router = express.Router();

const buildIdQuery = (id) => {
  const query = [{ id }, { slug: id }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    query.push({ _id: id });
  }
  return { $or: query };
};

/**
 * @route GET /api/products
 * @desc Public marketplace & admin: Browse products
 */
router.get('/', async (req, res) => {
  try {
    const { categoryId, search, brand, minPrice, maxPrice, page = 1, limit = 100, all } = req.query;
    
    // For public marketplace, filter active & approved; for admin (all=true), show all
    const query = (all === 'true' || all === '1') 
      ? {} 
      : { status: PRODUCT_STATUS.ACTIVE, adminApprovalStatus: 'APPROVED' };

    if (categoryId && categoryId !== 'All') query.categoryId = categoryId;
    if (brand && brand !== 'All') query.brand = brand;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    const formatted = products.map((p) => ({
      ...p.toObject(),
      effectivePrice: p.getEffectivePrice ? p.getEffectivePrice() : (p.price || 0),
    }));

    return sendSuccess(res, {
      products: formatted,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    return sendError(res, error.message, 'PRODUCTS_FETCH_FAILED', 500);
  }
});

/**
 * @route POST /api/products
 * @desc Create new product
 */
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.id) {
      data.id = `prd_${Date.now()}`;
    }
    if (!data.dealerId) {
      data.dealerId = 'admin';
    }
    if (!data.categoryId) {
      data.categoryId = data.category || 'general';
    }
    if (!data.slug) {
      data.slug = `${(data.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    }
    if (data.status) {
      data.status = data.status.toUpperCase();
    }
    const product = await Product.create(data);
    return sendSuccess(res, { product }, 'Product created successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 'PRODUCT_CREATION_FAILED', 400);
  }
});

/**
 * @route GET /api/products/:id
 * @desc Get single product detail
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne(buildIdQuery(req.params.id));

    if (!product) {
      return sendError(res, 'Product not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, {
      product: {
        ...product.toObject(),
        effectivePrice: product.getEffectivePrice ? product.getEffectivePrice() : (product.price || 0),
      },
    });
  } catch (error) {
    return sendError(res, error.message, 'PRODUCT_FETCH_FAILED', 500);
  }
});

/**
 * @route PUT /api/products/:id
 * @desc Update product
 */
router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.status) {
      data.status = data.status.toUpperCase();
    }
    const updated = await Product.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: data },
      { new: true }
    );
    if (!updated) {
      return sendError(res, 'Product not found', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, { product: updated }, 'Product updated successfully');
  } catch (error) {
    return sendError(res, error.message, 'PRODUCT_UPDATE_FAILED', 400);
  }
});

/**
 * @route DELETE /api/products/:id
 * @desc Delete product permanently
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete(buildIdQuery(req.params.id));
    return sendSuccess(res, { id: req.params.id }, 'Product deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 'PRODUCT_DELETE_FAILED', 500);
  }
});

export default router;

import express from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { authenticate } from '../middleware/auth.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import PlatformSettings from '../models/PlatformSettings.js';

const router = express.Router();

router.use(authenticate);

/**
 * @route GET /api/cart
 * @desc Get user cart with authoritative live price calculations
 */
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const settings = await PlatformSettings.getSettings();
    let subtotal = 0;
    const itemsDetailed = [];

    for (const item of cart.items) {
      const product = await Product.findOne({ id: item.productId });
      if (product) {
        const unitPrice = product.getEffectivePrice();
        const itemTotal = unitPrice * item.quantity;
        subtotal += itemTotal;

        itemsDetailed.push({
          id: item._id,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          image: product.images?.[0] || '',
          unit: product.unit,
          unitPrice,
          originalPrice: product.price,
          discount: product.discount,
          quantity: item.quantity,
          totalPrice: itemTotal,
          availableStock: product.stockQuantity,
          inStock: product.stockQuantity >= item.quantity,
        });
      }
    }

    const tax = Math.round((subtotal * (settings.taxPercentage || 5)) / 100);
    const deliveryCharge = subtotal > 0 ? settings.deliveryChargeFlat || 50 : 0;
    const totalAmount = subtotal + tax + deliveryCharge;

    return sendSuccess(res, {
      cartId: cart._id,
      items: itemsDetailed,
      itemCount: itemsDetailed.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      tax,
      deliveryCharge,
      totalAmount,
    });
  } catch (error) {
    return sendError(res, error.message, 'CART_FETCH_FAILED', 500);
  }
});

/**
 * @route POST /api/cart/items
 * @desc Add item to cart
 */
router.post('/items', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return sendError(res, 'ProductId required', 'VALIDATION_ERROR', 400);

    const product = await Product.findOne({ id: productId });
    if (!product) return sendError(res, 'Product not found', 'NOT_FOUND', 404);

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const existingIndex = cart.items.findIndex((i) => i.productId === productId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        dealerId: product.dealerId,
        quantity: Number(quantity),
      });
    }

    await cart.save();
    return sendSuccess(res, { cart }, 'Item added to cart');
  } catch (error) {
    return sendError(res, error.message, 'CART_ADD_FAILED', 400);
  }
});

/**
 * @route PATCH /api/cart/items/:id
 * @desc Update cart item quantity
 */
router.patch('/items/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || Number(quantity) < 1) {
      return sendError(res, 'Quantity must be at least 1', 'VALIDATION_ERROR', 400);
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return sendError(res, 'Cart not found', 'NOT_FOUND', 404);

    const item = cart.items.id(req.params.id) || cart.items.find((i) => i.productId === req.params.id);
    if (!item) return sendError(res, 'Cart item not found', 'NOT_FOUND', 404);

    item.quantity = Number(quantity);
    await cart.save();

    return sendSuccess(res, { cart }, 'Cart item updated');
  } catch (error) {
    return sendError(res, error.message, 'CART_UPDATE_FAILED', 400);
  }
});

/**
 * @route DELETE /api/cart/items/:id
 * @desc Remove item from cart
 */
router.delete('/items/:id', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return sendError(res, 'Cart not found', 'NOT_FOUND', 404);

    cart.items = cart.items.filter((i) => i.id !== req.params.id && i.productId !== req.params.id);
    await cart.save();

    return sendSuccess(res, { cart }, 'Item removed from cart');
  } catch (error) {
    return sendError(res, error.message, 'CART_REMOVE_FAILED', 400);
  }
});

/**
 * @route DELETE /api/cart
 * @desc Clear entire cart
 */
router.delete('/', async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });
    return sendSuccess(res, {}, 'Cart cleared');
  } catch (error) {
    return sendError(res, error.message, 'CART_CLEAR_FAILED', 500);
  }
});

export default router;

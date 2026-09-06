import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import CropListing from '../models/CropListing.js';
import Delivery from '../models/Delivery.js';
import Payment from '../models/Payment.js';
import Cart from '../models/Cart.js';
import PlatformSettings from '../models/PlatformSettings.js';
import { ORDER_TYPE, ORDER_STATUS, PAYMENT_STATUS, PRODUCT_STATUS, CROP_STATUS, ERROR_CODES } from '../config/constants.js';
import { createNotification } from './notificationService.js';

export const createProductOrder = async ({
  buyerId,
  items, // [{ productId, quantity }]
  shippingAddress,
  billingAddress,
  paymentMethod = 'UPI',
}) => {
  if (!items || !items.length) {
    throw new Error('Order must contain at least one item.');
  }

  const settings = await PlatformSettings.getSettings();
  let subtotal = 0;
  let sellerId = '';
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findOne({ id: item.productId });
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (product.status !== PRODUCT_STATUS.ACTIVE) {
      throw new Error(`Product "${product.name}" is not currently available for purchase.`);
    }

    // Rule 4: Inventory check
    if (product.stockQuantity < item.quantity) {
      const err = new Error(`Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`);
      err.code = ERROR_CODES.INSUFFICIENT_STOCK;
      throw err;
    }

    if (item.quantity < (product.minimumOrderQuantity || 1)) {
      throw new Error(`Quantity for "${product.name}" is below minimum order quantity of ${product.minimumOrderQuantity}.`);
    }

    sellerId = product.dealerId;

    // Rule 5: Backend calculates authoritative unit price & total
    const effectivePrice = product.getEffectivePrice();
    const itemTotal = effectivePrice * item.quantity;
    subtotal += itemTotal;

    validatedItems.push({
      itemId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      unit: product.unit || 'kg',
      unitPrice: effectivePrice,
      quantity: item.quantity,
      totalPrice: itemTotal,
    });
  }

  // Calculate tax & delivery from platform settings
  const tax = Math.round((subtotal * (settings.taxPercentage || 5)) / 100);
  const deliveryCharge = settings.deliveryChargeFlat || 50;
  const totalAmount = subtotal + tax + deliveryCharge;

  // Atomically decrement stock
  for (const item of items) {
    await Product.findOneAndUpdate(
      { id: item.productId, stockQuantity: { $gte: item.quantity } },
      {
        $inc: { stockQuantity: -item.quantity },
      }
    );
  }

  const orderId = `ord_${crypto.randomBytes(8).toString('hex')}`;
  const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const order = await Order.create({
    id: orderId,
    orderNumber,
    buyerId,
    sellerId,
    orderType: ORDER_TYPE.PRODUCT_PURCHASE,
    items: validatedItems,
    subtotal,
    tax,
    deliveryCharge,
    totalAmount,
    paymentStatus: paymentMethod === 'COD' ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.INITIATED,
    orderStatus: ORDER_STATUS.CONFIRMED,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    statusHistory: [
      {
        status: ORDER_STATUS.CONFIRMED,
        changedBy: buyerId,
        note: 'Order placed by buyer',
        timestamp: new Date(),
      },
    ],
  });

  // Create initial delivery record
  await Delivery.create({
    id: `del_${crypto.randomBytes(8).toString('hex')}`,
    orderId,
    deliveryAddress: shippingAddress,
    status: 'PENDING',
  });

  // Create payment record
  const transactionId = `txn_${crypto.randomBytes(10).toString('hex')}`;
  await Payment.create({
    id: `pay_${crypto.randomBytes(8).toString('hex')}`,
    orderId,
    userId: buyerId,
    transactionId,
    amount: totalAmount,
    currency: 'INR',
    paymentMethod,
    status: paymentMethod === 'COD' ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.INITIATED,
  });

  // Clear user's cart if any
  await Cart.findOneAndUpdate({ userId: buyerId }, { $set: { items: [] } });

  // Notifications
  await createNotification({
    userId: buyerId,
    title: 'Order Confirmed',
    message: `Your order #${orderNumber} for ₹${totalAmount} has been placed successfully.`,
    type: 'ORDER',
    data: { orderId, orderNumber },
  });

  if (sellerId) {
    await createNotification({
      userId: sellerId,
      title: 'New Customer Order Received',
      message: `You have received a new order #${orderNumber} for ₹${totalAmount}.`,
      type: 'ORDER',
      data: { orderId, orderNumber },
    });
  }

  return order;
};

export const createCropOrder = async ({
  buyerId,
  cropId,
  quantity,
  shippingAddress,
  billingAddress,
  paymentMethod = 'UPI',
}) => {
  const crop = await CropListing.findOne({ id: cropId });
  if (!crop) {
    throw new Error('Crop listing not found.');
  }

  if (crop.status !== CROP_STATUS.ACTIVE) {
    throw new Error('Crop listing is not currently available for purchase.');
  }

  // Rule 6: Crop quantity validation
  if (crop.quantity < quantity) {
    const err = new Error(`Requested crop quantity (${quantity} ${crop.unit}) exceeds available stock (${crop.quantity} ${crop.unit}).`);
    err.code = ERROR_CODES.INSUFFICIENT_STOCK;
    throw err;
  }

  const subtotal = crop.expectedPrice * quantity;
  const tax = 0; // Agriculture products often exempt or nominal
  const deliveryCharge = 100;
  const totalAmount = subtotal + tax + deliveryCharge;

  // Atomically update crop quantity
  const remainingQty = crop.quantity - quantity;
  crop.quantity = remainingQty;
  if (remainingQty === 0) {
    crop.status = CROP_STATUS.SOLD;
  } else {
    crop.status = CROP_STATUS.PARTIALLY_SOLD;
  }
  await crop.save();

  const orderId = `ord_${crypto.randomBytes(8).toString('hex')}`;
  const orderNumber = `CROP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const order = await Order.create({
    id: orderId,
    orderNumber,
    buyerId,
    sellerId: crop.farmerId,
    orderType: ORDER_TYPE.CROP_PURCHASE,
    items: [
      {
        itemId: crop.id,
        name: crop.cropName,
        image: crop.images?.[0] || '',
        unit: crop.unit,
        unitPrice: crop.expectedPrice,
        quantity,
        totalPrice: subtotal,
      },
    ],
    subtotal,
    tax,
    deliveryCharge,
    totalAmount,
    paymentStatus: paymentMethod === 'COD' ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.INITIATED,
    orderStatus: ORDER_STATUS.CONFIRMED,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    statusHistory: [
      {
        status: ORDER_STATUS.CONFIRMED,
        changedBy: buyerId,
        note: 'Crop purchase order initiated',
        timestamp: new Date(),
      },
    ],
  });

  await Delivery.create({
    id: `del_${crypto.randomBytes(8).toString('hex')}`,
    orderId,
    deliveryAddress: shippingAddress,
    status: 'PENDING',
  });

  return order;
};

export const updateOrderStatus = async ({ orderId, newStatus, changedBy, note = '' }) => {
  const order = await Order.findOne({ id: orderId });
  if (!order) {
    throw new Error('Order not found.');
  }

  const validTransitions = {
    [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REJECTED],
    [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.READY_FOR_SHIPMENT, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.READY_FOR_SHIPMENT]: [ORDER_STATUS.SHIPPED],
    [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.OUT_FOR_DELIVERY],
    [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.RETURN_REQUESTED],
    [ORDER_STATUS.RETURN_REQUESTED]: [ORDER_STATUS.RETURNED, ORDER_STATUS.COMPLETED],
    [ORDER_STATUS.RETURNED]: [ORDER_STATUS.REFUNDED],
  };

  const allowed = validTransitions[order.orderStatus] || [];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid status transition from "${order.orderStatus}" to "${newStatus}". Allowed: [${allowed.join(', ')}]`);
  }

  order.orderStatus = newStatus;
  order.statusHistory.push({
    status: newStatus,
    changedBy,
    note,
    timestamp: new Date(),
  });

  // Sync delivery status if relevant
  if (newStatus === ORDER_STATUS.SHIPPED) {
    await Delivery.findOneAndUpdate({ orderId }, { status: 'IN_TRANSIT' });
  } else if (newStatus === ORDER_STATUS.OUT_FOR_DELIVERY) {
    await Delivery.findOneAndUpdate({ orderId }, { status: 'OUT_FOR_DELIVERY' });
  } else if (newStatus === ORDER_STATUS.DELIVERED) {
    await Delivery.findOneAndUpdate({ orderId }, { status: 'DELIVERED', actualDeliveryDate: new Date() });
    order.paymentStatus = PAYMENT_STATUS.SUCCESS;
  }

  await order.save();

  // Notify buyer and seller
  await createNotification({
    userId: order.buyerId,
    title: `Order Status: ${newStatus}`,
    message: `Your order #${order.orderNumber} status is now: ${newStatus}.`,
    type: 'ORDER',
    data: { orderId: order.id, orderStatus: newStatus },
  });

  return order;
};

export default {
  createProductOrder,
  createCropOrder,
  updateOrderStatus,
};

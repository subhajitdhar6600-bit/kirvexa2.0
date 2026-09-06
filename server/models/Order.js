import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String },
  productId: { type: String },
  itemId: { type: String },
  name: { type: String },
  category: { type: String },
  price: { type: Number },
  unitPrice: { type: Number },
  unit: { type: String, default: 'kg' },
  image: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number },
  sellerName: { type: String },
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedBy: { type: String, default: 'system' },
  note: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, default: '' },
    // Frontend compatibility fields
    userId: { type: String, default: '' },
    userName: { type: String, default: '' },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: 'cod' },
    deliveryAddress: { type: mongoose.Schema.Types.Mixed, default: '' },
    status: {
      type: String,
      default: 'Confirmed',
    },
    assignedDealerName: { type: String, default: '' },

    // PRD modular fields
    buyerId: { type: String, default: '' },
    sellerId: { type: String, default: '' },
    orderType: { type: String, default: 'PRODUCT_PURCHASE' },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    paymentStatus: { type: String, default: 'PENDING' },
    orderStatus: { type: String, default: 'CONFIRMED' },
    shippingAddress: { type: Object, default: {} },
    billingAddress: { type: Object, default: {} },
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

// Bridge frontend and PRD fields before save
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = this.id;
  }
  if (!this.buyerId && this.userId) {
    this.buyerId = this.userId;
  }
  if (!this.userId && this.buyerId) {
    this.userId = this.buyerId;
  }
  if (!this.subtotal && this.totalAmount) {
    this.subtotal = this.totalAmount;
  }
  if (!this.orderStatus && this.status) {
    this.orderStatus = this.status.toUpperCase();
  }
  if (!this.status && this.orderStatus) {
    this.status = this.orderStatus;
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);

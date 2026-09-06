import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../config/constants.js';

const paymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    transactionId: { type: String, required: true, unique: true, index: true },
    gateway: { type: String, default: 'MOCK_GATEWAY' }, // RAZORPAY, CASHFREE, MOCK_GATEWAY, COD
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      uppercase: true,
      set: (v) => (v ? String(v).toUpperCase() : 'SUCCESS'),
      enum: ['INITIATED', 'PENDING', 'SUCCESS', 'COMPLETED', 'DELIVERED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
      default: 'SUCCESS',
      index: true,
    },
    paymentMethod: { type: String, default: 'UPI' }, // UPI, NET_BANKING, CARD, WALLET, COD
    gatewayResponse: { type: Object, default: {} },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

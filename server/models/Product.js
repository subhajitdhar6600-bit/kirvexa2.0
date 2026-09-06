import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '../config/constants.js';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    dealerId: { type: String, required: true, index: true },
    categoryId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    brand: { type: String, default: '' },
    images: [{ type: String }],
    unit: { type: String, default: 'kg' }, // kg, bag, liter, packet, piece
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 }, // percentage discount e.g. 10 = 10%
    tax: { type: Number, default: 0, min: 0 }, // percentage tax e.g. 5 = 5%
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    minimumOrderQuantity: { type: Number, default: 1, min: 1 },
    maximumOrderQuantity: { type: Number, default: 1000 },
    status: {
      type: String,
      enum: [
        ...Object.values(PRODUCT_STATUS),
        ...Object.values(PRODUCT_STATUS).map(s => s.toLowerCase()),
        'active', 'inactive', 'pending', 'approved', 'rejected'
      ],
      default: PRODUCT_STATUS.ACTIVE,
      index: true,
    },
    adminApprovalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED',
      index: true,
    },
    adminRejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

// Helper method to compute effective final unit price
productSchema.methods.getEffectivePrice = function () {
  const discountAmount = (this.price * (this.discount || 0)) / 100;
  return Math.max(0, this.price - discountAmount);
};

export default mongoose.models.Product || mongoose.model('Product', productSchema);

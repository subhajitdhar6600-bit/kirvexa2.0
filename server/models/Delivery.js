import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, required: true, unique: true, index: true },
    deliveryPartner: { type: String, default: 'LOCAL_LOGISTICS' },
    trackingNumber: { type: String, default: '' },
    pickupAddress: { type: Object, default: {} },
    deliveryAddress: { type: Object, default: {} },
    estimatedDeliveryDate: { type: Date },
    actualDeliveryDate: { type: Date },
    status: {
      type: String,
      enum: ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED'],
      default: 'PENDING',
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);

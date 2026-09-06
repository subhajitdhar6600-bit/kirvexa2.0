import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    targetType: { type: String, enum: ['product', 'dealer'], required: true },
    targetId: { type: String, required: true, index: true },
    orderId: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);

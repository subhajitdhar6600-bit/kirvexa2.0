import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['product', 'crop', 'both'], default: 'product' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model('Category', categorySchema);

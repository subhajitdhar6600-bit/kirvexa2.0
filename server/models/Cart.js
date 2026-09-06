import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    dealerId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);

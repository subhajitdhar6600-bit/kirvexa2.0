import mongoose from 'mongoose';

const farmerCardSchema = new mongoose.Schema(
  {
    cardNumber: { type: String, required: true, unique: true },
    cardHolder: { type: String, required: true },
    balance: { type: Number, required: true, default: 25000 },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.models.FarmerCard || mongoose.model('FarmerCard', farmerCardSchema);

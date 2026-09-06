import mongoose from 'mongoose';

const registeredFarmerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    aadhaar: { type: String, required: true },
    village: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    landSize: { type: String, default: '' },
    registeredByDealer: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.models.RegisteredFarmer || mongoose.model('RegisteredFarmer', registeredFarmerSchema);

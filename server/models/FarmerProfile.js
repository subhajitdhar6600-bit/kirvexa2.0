import mongoose from 'mongoose';

const farmerProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    landSizeAcres: { type: Number, default: 0 },
    primaryCrops: [{ type: String }],
    farmingType: { type: String, enum: ['organic', 'conventional', 'mixed'], default: 'conventional' },
    addresses: [
      {
        id: { type: String, default: () => `addr_${Math.random().toString(36).substring(2, 9)}` },
        title: { type: String, default: 'Home' },
        addressLine: { type: String, default: '' },
        district: { type: String, default: '' },
        state: { type: String, default: 'Bihar' },
        pincode: { type: String, default: '' },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.FarmerProfile || mongoose.model('FarmerProfile', farmerProfileSchema);

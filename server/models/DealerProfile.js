import mongoose from 'mongoose';

const dealerProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    businessName: { type: String, required: true },
    dealerType: { type: String, enum: ['seeds', 'fertilizer', 'pesticides', 'machinery', 'all'], default: 'all' },
    gstNumber: { type: String, default: '' },
    gstin: { type: String, default: '' },
    licenseNumber: { type: String, default: '' },
    shopAddress: {
      addressLine: { type: String, default: '' },
      district: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    verificationDocuments: [{ type: String }],
    isVerifiedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.DealerProfile || mongoose.model('DealerProfile', dealerProfileSchema);

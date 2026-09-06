import mongoose from 'mongoose';
import { ROLES, USER_STATUS, KCC_STATUS } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      default: ROLES.FARMER,
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, sparse: true, lowercase: true, trim: true },
    phone: { type: String, required: true, index: true },
    passwordHash: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    status: {
      type: String,
      default: USER_STATUS.ACTIVE,
      index: true,
    },
    isVerified: { type: Boolean, default: false },
    verificationStatus: { type: String, default: 'Pending' },
    kccStatus: {
      type: String,
      enum: Object.values(KCC_STATUS),
      default: KCC_STATUS.NOT_APPLIED,
      index: true,
    },
    kccApprovedAt: { type: Date },
    kccRejectedAt: { type: Date },
    kccRejectionReason: { type: String },
    kccReviewedBy: { type: String },
    refreshToken: { type: String },
    lastLogin: { type: Date },

    // Location & legacy profile details
    state: { type: String, default: '' },
    district: { type: String, default: '' },
    village: { type: String, default: '' },
    pincode: { type: String, default: '' },
    businessName: { type: String },
    dealerType: { type: String },
    aadhaarNumber: { type: String },
    bankHolder: { type: String },
    bankName: { type: String },
    bankAccount: { type: String },
    bankIfsc: { type: String },
  },
  { timestamps: true }
);

// Helper method to safely return public user object (without password & refresh token)
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

export default mongoose.models.User || mongoose.model('User', userSchema);

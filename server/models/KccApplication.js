import mongoose from 'mongoose';

const kccApplicationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    // Frontend fields
    fullName: { type: String, required: true },
    phone: { type: String, default: '' },
    aadhaar: { type: String, default: '' },
    address: { type: String, default: '' },
    district: { type: String, default: '' },
    landSize: { type: String, default: '' },
    cardNumber: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    cardTier: { type: String, default: 'prime' },
    paymentStatus: { type: String, default: 'pending' },
    paymentAmount: { type: Number, default: 0 },
    createdAt: { type: String, default: () => new Date().toISOString() },

    // PRD fields
    userId: { type: String, default: '' },
    applicationNumber: { type: String, default: '' },
    userType: { type: String, default: 'farmer' },
    mobileNumber: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    state: { type: String, default: 'Bihar' },
    pincode: { type: String, default: '' },
    aadhaarNumber: { type: String, default: '' },
    kccCardNumber: { type: String, default: '' },

    landDetails: {
      surveyNumber: { type: String, default: '' },
      landSizeAcres: { type: Number, default: 0 },
      ownershipType: { type: String, default: 'owned' },
      village: { type: String, default: '' },
    },

    bankDetails: {
      bankName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      branchName: { type: String, default: '' },
    },

    documentUrls: [{ type: String }],
    status: {
      type: String,
      default: 'pending',
      index: true,
    },

    rejectionReason: { type: String, default: '' },
    adminRemarks: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    reviewedBy: { type: String, default: '' },
  },
  { timestamps: true }
);

// Bridge frontend and PRD fields
kccApplicationSchema.pre('save', function (next) {
  if (!this.userId) {
    this.userId = this.phone || this.id;
  }
  if (!this.applicationNumber) {
    this.applicationNumber = `KCC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  }
  if (!this.mobileNumber && this.phone) {
    this.mobileNumber = this.phone;
  }
  if (!this.phone && this.mobileNumber) {
    this.phone = this.mobileNumber;
  }
  if (!this.aadhaarNumber && this.aadhaar) {
    this.aadhaarNumber = this.aadhaar;
  }
  if (!this.aadhaar && this.aadhaarNumber) {
    this.aadhaar = this.aadhaarNumber;
  }
  if (!this.cardNumber && this.kccCardNumber) {
    this.cardNumber = this.kccCardNumber;
  }
  next();
});

export default mongoose.models.KccApplication || mongoose.model('KccApplication', kccApplicationSchema);

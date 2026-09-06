import mongoose from 'mongoose';

const cropListingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    // Frontend fields
    sellerName: { type: String, default: '' },
    phone: { type: String, default: '' },
    district: { type: String, default: '' },
    city: { type: String, default: '' },
    address: { type: String, default: '' },
    pincode: { type: String, default: '' },
    cropName: { type: String, required: true },
    weight: { type: String, default: '' },
    price: { type: Number, default: 0 },
    image: { type: String, default: '' },
    status: { type: String, default: 'pending', index: true },
    createdAt: { type: String, default: () => new Date().toISOString() },

    // PRD modular fields (with safe defaults)
    farmerId: { type: String, default: '' },
    categoryId: { type: String, default: '' },
    cropVariety: { type: String, default: '' },
    description: { type: String, default: '' },
    quantity: { type: Number, default: 10 },
    initialQuantity: { type: Number, default: 10 },
    unit: { type: String, default: 'quintal' },
    expectedPrice: { type: Number, default: 0 },
    location: {
      village: { type: String, default: '' },
      district: { type: String, default: '' },
      state: { type: String, default: 'Bihar' },
    },
    harvestDate: { type: String, default: '' },
    availableFrom: { type: String, default: '' },
    qualityGrade: { type: String, default: 'A' },
    images: [{ type: String }],
    adminApprovalStatus: { type: String, default: 'APPROVED' },
  },
  { timestamps: true }
);

// Pre-save hook to bridge frontend fields and PRD fields
cropListingSchema.pre('save', function (next) {
  if (!this.farmerId && (this.phone || this.sellerName)) {
    this.farmerId = this.phone || this.sellerName;
  }
  if (!this.expectedPrice && this.price) {
    this.expectedPrice = this.price;
  }
  if (!this.price && this.expectedPrice) {
    this.price = this.expectedPrice;
  }
  if (!this.image && this.images && this.images.length > 0) {
    this.image = this.images[0];
  }
  if (!this.district && this.location?.district) {
    this.district = this.location.district;
  }
  next();
});

export default mongoose.models.CropListing || mongoose.model('CropListing', cropListingSchema);

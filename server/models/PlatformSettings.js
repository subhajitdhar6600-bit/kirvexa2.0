import mongoose from 'mongoose';

const platformSettingsSchema = new mongoose.Schema(
  {
    requireKccForFarmerCrops: { type: Boolean, default: true },
    requireKccForDealerProducts: { type: Boolean, default: true },
    requireProductApproval: { type: Boolean, default: false },
    requireCropApproval: { type: Boolean, default: false },
    orderCancellationWindowMinutes: { type: Number, default: 60 },
    maxCropQuantityLimit: { type: Number, default: 50000 },
    minimumOrderQuantityLimit: { type: Number, default: 1 },
    deliveryChargeFlat: { type: Number, default: 50 },
    taxPercentage: { type: Number, default: 5 },
    allowDealerReapplication: { type: Boolean, default: true },
    allowFarmerReapplication: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Singleton helper to get or create platform settings
platformSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.models.PlatformSettings || mongoose.model('PlatformSettings', platformSettingsSchema);

import mongoose from 'mongoose';

const dealerListingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    dealerId: { type: String, required: true },
    dealerName: { type: String, required: true },
    type: { type: String, enum: ['product', 'machinery', 'labour'], required: true },
    title: { type: String, required: true },
    category: { type: String, default: '' },
    price: { type: mongoose.Schema.Types.Mixed, required: true },
    unit: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    specifications: { type: String, default: '' },
    location: { type: String, default: '' },
    workerCount: { type: Number },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.models.DealerListing || mongoose.model('DealerListing', dealerListingSchema);

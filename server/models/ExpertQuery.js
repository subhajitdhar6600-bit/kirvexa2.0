import mongoose from 'mongoose';

const expertQuerySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    farmerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: '' },
    cropName: { type: String, default: '' },
    problemDetails: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'resolved', 'contacted'], default: 'pending' },
    adminReply: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.models.ExpertQuery || mongoose.model('ExpertQuery', expertQuerySchema);

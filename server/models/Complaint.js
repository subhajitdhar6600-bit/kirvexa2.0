import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    orderId: { type: String, default: '' },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['product', 'delivery', 'payment', 'kcc', 'dealer', 'other'], default: 'other' },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN', index: true },
    adminResponse: { type: String, default: '' },
    resolvedBy: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);

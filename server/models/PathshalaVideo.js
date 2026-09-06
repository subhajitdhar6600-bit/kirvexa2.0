import mongoose from 'mongoose';

const pathshalaVideoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.models.PathshalaVideo || mongoose.model('PathshalaVideo', pathshalaVideoSchema);

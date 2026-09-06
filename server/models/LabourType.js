import mongoose from 'mongoose';

const labourTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.LabourType || mongoose.model('LabourType', labourTypeSchema);

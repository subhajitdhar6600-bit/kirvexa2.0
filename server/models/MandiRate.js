import mongoose from 'mongoose';

const mandiRateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    hindi: { type: String, default: '' },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    modal: { type: Number, required: true },
    unit: { type: String, default: 'Quintal' },
    change: { type: Number, default: 0 },
    img: { type: String, default: '🌾' },
    mandi: { type: String, default: 'Kanpur Mandi' },
  },
  { timestamps: true }
);

export default mongoose.models.MandiRate || mongoose.model('MandiRate', mandiRateSchema);

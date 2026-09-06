import mongoose from 'mongoose';

const labourBookingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    labourType: { type: String, required: true },
    count: { type: Number, required: true },
    days: { type: Number, required: true },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    location: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'assigned', 'completed'], default: 'pending' },
    assignedLabours: [
      {
        name: { type: String },
        phone: { type: String },
        charges: { type: String },
      },
    ],
    adminNotes: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.models.LabourBooking || mongoose.model('LabourBooking', labourBookingSchema);

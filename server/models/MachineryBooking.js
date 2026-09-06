import mongoose from 'mongoose';

const machineryBookingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    machineryType: { type: String, required: true },
    bookingDate: { type: String, default: '' },
    durationHours: { type: mongoose.Schema.Types.Mixed, default: 1 },
    location: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'allotted', 'rejected'], default: 'pending' },
    allottedMachineDetails: { type: String },
    adminNotes: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.models.MachineryBooking || mongoose.model('MachineryBooking', machineryBookingSchema);

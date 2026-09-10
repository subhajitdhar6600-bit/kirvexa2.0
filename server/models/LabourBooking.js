import mongoose from 'mongoose';

const labourBookingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, default: '' },
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    labourType: { type: String, required: true },
    count: { type: Number, required: true },
    days: { type: Number, required: true },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    location: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'pending_rate', 'rate_quoted', 'rate_accepted', 'cancelled', 'assigned', 'allotted', 'completed'],
      default: 'pending_rate',
    },
    rateQuote: { type: String, default: '' },
    rateQuoteAmount: { type: Number, default: 0 },
    rateNotes: { type: String, default: '' },
    userResponse: { type: String, enum: ['', 'accepted', 'cancelled'], default: '' },
    userResponseAt: { type: String, default: '' },
    assignedLabours: [
      {
        name: { type: String },
        phone: { type: String },
        charges: { type: String },
      },
    ],
    adminNotes: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.models.LabourBooking || mongoose.model('LabourBooking', labourBookingSchema);

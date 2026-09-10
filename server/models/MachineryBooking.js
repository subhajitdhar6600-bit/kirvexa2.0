import mongoose from 'mongoose';

const machineryBookingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, default: '' },
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    machineryType: { type: String, required: true },
    bookingDate: { type: String, default: '' },
    durationHours: { type: mongoose.Schema.Types.Mixed, default: 1 },
    location: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'pending_rate', 'rate_quoted', 'rate_accepted', 'cancelled', 'allotted', 'rejected', 'completed'],
      default: 'pending_rate',
    },
    rateQuote: { type: String, default: '' },
    rateQuoteAmount: { type: Number, default: 0 },
    rateNotes: { type: String, default: '' },
    userResponse: { type: String, enum: ['', 'accepted', 'cancelled'], default: '' },
    userResponseAt: { type: String, default: '' },
    allottedMachine: {
      machineName: { type: String, default: '' },
      numberPlate: { type: String, default: '' },
      operatorName: { type: String, default: '' },
      operatorPhone: { type: String, default: '' },
      detailsText: { type: String, default: '' },
    },
    allottedMachineDetails: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.models.MachineryBooking || mongoose.model('MachineryBooking', machineryBookingSchema);

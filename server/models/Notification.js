import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, default: 'broadcast', index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, default: () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
    read: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    type: { type: String, default: 'info' },
    link: { type: String, default: '' },
    category: { type: String, default: 'account' },
    data: { type: Object, default: {} },
    pdfDataUrl: { type: String },
    pdfFileName: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

notificationSchema.pre('save', function (next) {
  if (this.isRead && !this.read) {
    this.read = true;
  }
  if (this.read && !this.isRead) {
    this.isRead = true;
  }
  next();
});

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

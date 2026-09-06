import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    adminId: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true }, // e.g. ADMIN_APPROVED_KCC, ADMIN_SUSPENDED_USER
    module: { type: String, required: true, index: true }, // kcc, users, products, orders, settings
    entityType: { type: String, required: true },
    entityId: { type: String, required: true, index: true },
    oldValue: { type: Object, default: null },
    newValue: { type: Object, default: null },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

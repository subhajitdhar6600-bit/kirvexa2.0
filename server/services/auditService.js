import crypto from 'crypto';
import AuditLog from '../models/AuditLog.js';

export const logAdminAction = async ({
  adminId,
  action,
  module,
  entityType,
  entityId,
  oldValue = null,
  newValue = null,
  req = null,
}) => {
  try {
    const ipAddress = req ? req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress : '';
    const userAgent = req ? req.headers['user-agent'] || '' : '';

    await AuditLog.create({
      id: `audit_${crypto.randomBytes(8).toString('hex')}`,
      adminId,
      action,
      module,
      entityType,
      entityId,
      oldValue,
      newValue,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error(`[AuditLog Error] Failed to write audit log: ${error.message}`);
  }
};

export default {
  logAdminAction,
};

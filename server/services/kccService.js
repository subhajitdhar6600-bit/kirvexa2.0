import crypto from 'crypto';
import KccApplication from '../models/KccApplication.js';
import User from '../models/User.js';
import { KCC_STATUS, ERROR_CODES } from '../config/constants.js';
import { logAdminAction } from './auditService.js';
import { createNotification } from './notificationService.js';

export const applyKcc = async ({
  userId,
  userType,
  fullName,
  mobileNumber,
  dateOfBirth,
  address,
  district,
  state = 'Bihar',
  pincode,
  aadhaarNumber,
  landDetails = {},
  bankDetails = {},
  documentUrls = [],
}) => {
  // Rule 10: Prevent multiple active KCC applications for the same user
  const activeApp = await KccApplication.findOne({
    userId,
    status: { $in: [KCC_STATUS.PENDING, KCC_STATUS.UNDER_REVIEW] },
  });

  if (activeApp) {
    const error = new Error('You already have an active KCC application under review.');
    error.code = ERROR_CODES.DUPLICATE_APPLICATION;
    throw error;
  }

  const applicationId = `kcc_${crypto.randomBytes(8).toString('hex')}`;
  const applicationNumber = `KCC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const application = await KccApplication.create({
    id: applicationId,
    userId,
    applicationNumber,
    userType,
    fullName,
    mobileNumber,
    dateOfBirth,
    address,
    district,
    state,
    pincode,
    aadhaarNumber,
    landDetails,
    bankDetails,
    documentUrls,
    status: KCC_STATUS.PENDING,
    submittedAt: new Date(),
  });

  // Update user's kccStatus
  await User.findOneAndUpdate(
    { id: userId },
    {
      kccStatus: KCC_STATUS.PENDING,
      kccRejectionReason: '',
    }
  );

  await createNotification({
    userId,
    title: 'KCC Application Submitted',
    message: `Your KCC application (${applicationNumber}) has been submitted successfully and is pending review.`,
    type: 'KCC',
    data: { applicationNumber, status: KCC_STATUS.PENDING },
  });

  return application;
};

export const approveKcc = async ({ applicationId, adminId, adminRemarks = '', req = null }) => {
  const application = await KccApplication.findOne({ id: applicationId });
  if (!application) {
    throw new Error('KCC application not found.');
  }

  const oldStatus = application.status;
  const now = new Date();

  application.status = KCC_STATUS.APPROVED;
  application.approvedAt = now;
  application.reviewedAt = now;
  application.reviewedBy = adminId;
  application.adminRemarks = adminRemarks;
  await application.save();

  // Update user's KCC status to APPROVED
  await User.findOneAndUpdate(
    { id: application.userId },
    {
      kccStatus: KCC_STATUS.APPROVED,
      kccApprovedAt: now,
      kccReviewedBy: adminId,
    }
  );

  // Audit log
  await logAdminAction({
    adminId,
    action: 'ADMIN_APPROVED_KCC',
    module: 'kcc',
    entityType: 'KccApplication',
    entityId: applicationId,
    oldValue: { status: oldStatus },
    newValue: { status: KCC_STATUS.APPROVED, remarks: adminRemarks },
    req,
  });

  await createNotification({
    userId: application.userId,
    title: 'KCC Verification Approved!',
    message: `Congratulations! Your KCC application (${application.applicationNumber}) has been approved. You now have full access to agricultural marketplace services.`,
    type: 'KCC',
    data: { applicationNumber: application.applicationNumber, status: KCC_STATUS.APPROVED },
  });

  return application;
};

export const rejectKcc = async ({ applicationId, adminId, rejectionReason, adminRemarks = '', req = null }) => {
  // Rule 8: Rejected KCC applications must store a rejection reason
  if (!rejectionReason || !rejectionReason.trim()) {
    throw new Error('A valid rejection reason must be provided when rejecting a KCC application.');
  }

  const application = await KccApplication.findOne({ id: applicationId });
  if (!application) {
    throw new Error('KCC application not found.');
  }

  const oldStatus = application.status;
  const now = new Date();

  application.status = KCC_STATUS.REJECTED;
  application.rejectedAt = now;
  application.reviewedAt = now;
  application.reviewedBy = adminId;
  application.rejectionReason = rejectionReason;
  application.adminRemarks = adminRemarks;
  await application.save();

  // Update user's KCC status to REJECTED
  await User.findOneAndUpdate(
    { id: application.userId },
    {
      kccStatus: KCC_STATUS.REJECTED,
      kccRejectedAt: now,
      kccRejectionReason: rejectionReason,
      kccReviewedBy: adminId,
    }
  );

  // Audit log
  await logAdminAction({
    adminId,
    action: 'ADMIN_REJECTED_KCC',
    module: 'kcc',
    entityType: 'KccApplication',
    entityId: applicationId,
    oldValue: { status: oldStatus },
    newValue: { status: KCC_STATUS.REJECTED, rejectionReason },
    req,
  });

  await createNotification({
    userId: application.userId,
    title: 'KCC Verification Update',
    message: `Your KCC application (${application.applicationNumber}) was not approved. Reason: ${rejectionReason}. You may correct the details and apply again.`,
    type: 'KCC',
    data: { applicationNumber: application.applicationNumber, status: KCC_STATUS.REJECTED, rejectionReason },
  });

  return application;
};

export const setKccUnderReview = async ({ applicationId, adminId, adminRemarks = '', req = null }) => {
  const application = await KccApplication.findOne({ id: applicationId });
  if (!application) {
    throw new Error('KCC application not found.');
  }

  application.status = KCC_STATUS.UNDER_REVIEW;
  application.reviewedAt = new Date();
  application.reviewedBy = adminId;
  application.adminRemarks = adminRemarks;
  await application.save();

  await User.findOneAndUpdate(
    { id: application.userId },
    { kccStatus: KCC_STATUS.UNDER_REVIEW }
  );

  await logAdminAction({
    adminId,
    action: 'ADMIN_PUT_KCC_UNDER_REVIEW',
    module: 'kcc',
    entityType: 'KccApplication',
    entityId: applicationId,
    oldValue: { status: application.status },
    newValue: { status: KCC_STATUS.UNDER_REVIEW },
    req,
  });

  return application;
};

export default {
  applyKcc,
  approveKcc,
  rejectKcc,
  setKccUnderReview,
};

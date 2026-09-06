import express from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import KccApplication from '../models/KccApplication.js';
import Product from '../models/Product.js';
import CropListing from '../models/CropListing.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import AuditLog from '../models/AuditLog.js';
import PlatformSettings from '../models/PlatformSettings.js';
import { approveKcc, rejectKcc, setKccUnderReview } from '../services/kccService.js';
import { logAdminAction } from '../services/auditService.js';
import { updateOrderStatus } from '../services/orderService.js';
import { ROLES, USER_STATUS, KCC_STATUS, PRODUCT_STATUS, CROP_STATUS } from '../config/constants.js';

const router = express.Router();

// Apply authentication and admin role check across all /api/admin routes
router.use(authenticate, requireAdmin);

/**
 * @route GET /api/admin/dashboard
 * @desc Admin Dashboard analytics
 */
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalFarmers,
      totalDealers,
      pendingKcc,
      approvedKcc,
      activeProducts,
      activeCrops,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalPayments,
    ] = await Promise.all([
      User.countDocuments({ role: ROLES.FARMER }),
      User.countDocuments({ role: ROLES.DEALER }),
      KccApplication.countDocuments({ status: { $in: [KCC_STATUS.PENDING, KCC_STATUS.UNDER_REVIEW] } }),
      KccApplication.countDocuments({ status: KCC_STATUS.APPROVED }),
      Product.countDocuments({ status: PRODUCT_STATUS.ACTIVE }),
      CropListing.countDocuments({ status: CROP_STATUS.ACTIVE }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ['DELIVERED', 'COMPLETED'] } }),
      Order.countDocuments({ orderStatus: 'PENDING' }),
      Payment.countDocuments(),
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    const recentKcc = await KccApplication.find().sort({ createdAt: -1 }).limit(5);

    return sendSuccess(res, {
      total_farmers: totalFarmers,
      total_dealers: totalDealers,
      pending_kcc: pendingKcc,
      approved_kcc: approvedKcc,
      active_products: activeProducts,
      active_crop_listings: activeCrops,
      total_orders: totalOrders,
      pending_orders: pendingOrders,
      completed_orders: completedOrders,
      total_transactions: totalPayments,
      recent_orders: recentOrders,
      recent_kcc: recentKcc,
    });
  } catch (error) {
    return sendError(res, error.message, 'DASHBOARD_FAILED', 500);
  }
});

/**
 * @route GET /api/admin/users
 */
router.get('/users', async (req, res) => {
  try {
    const { role, status, kccStatus, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (kccStatus) query.kccStatus = kccStatus;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    return sendSuccess(res, {
      users: users.map((u) => u.toSafeObject()),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    return sendError(res, error.message, 'USERS_FETCH_FAILED', 500);
  }
});

/**
 * @route GET /api/admin/users/:id
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return sendError(res, 'User not found', 'NOT_FOUND', 404);
    return sendSuccess(res, { user: user.toSafeObject() });
  } catch (error) {
    return sendError(res, error.message, 'USER_FETCH_FAILED', 500);
  }
});

/**
 * @route PATCH /api/admin/users/:id/status
 * @desc Suspend, activate, or block a user
 */
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { status, reason = '' } = req.body;
    if (!Object.values(USER_STATUS).includes(status)) {
      return sendError(res, 'Invalid user status', 'VALIDATION_ERROR', 400);
    }

    const user = await User.findOne({ id: req.params.id });
    if (!user) return sendError(res, 'User not found', 'NOT_FOUND', 404);

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    await logAdminAction({
      adminId: req.user.id,
      action: status === USER_STATUS.SUSPENDED ? 'ADMIN_SUSPENDED_USER' : 'ADMIN_CHANGED_USER_STATUS',
      module: 'users',
      entityType: 'User',
      entityId: user.id,
      oldValue: { status: oldStatus },
      newValue: { status, reason },
      req,
    });

    return sendSuccess(res, { user: user.toSafeObject() }, `User status updated to ${status}`);
  } catch (error) {
    return sendError(res, error.message, 'USER_STATUS_UPDATE_FAILED', 400);
  }
});

/**
 * @route GET /api/admin/kcc
 * @desc List KCC applications
 */
router.get('/kcc', async (req, res) => {
  try {
    const { status, userType, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (userType) query.userType = userType;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { applicationNumber: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [applications, total] = await Promise.all([
      KccApplication.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      KccApplication.countDocuments(query),
    ]);

    return sendSuccess(res, {
      applications,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    return sendError(res, error.message, 'KCC_FETCH_FAILED', 500);
  }
});

/**
 * @route GET /api/admin/kcc/:id
 */
router.get('/kcc/:id', async (req, res) => {
  try {
    const application = await KccApplication.findOne({ id: req.params.id });
    if (!application) return sendError(res, 'Application not found', 'NOT_FOUND', 404);
    const user = await User.findOne({ id: application.userId });

    return sendSuccess(res, {
      application,
      user: user ? user.toSafeObject() : null,
    });
  } catch (error) {
    return sendError(res, error.message, 'KCC_FETCH_FAILED', 500);
  }
});

/**
 * @route POST /api/admin/kcc/:id/approve
 */
router.post('/kcc/:id/approve', async (req, res) => {
  try {
    const { adminRemarks } = req.body;
    const application = await approveKcc({
      applicationId: req.params.id,
      adminId: req.user.id,
      adminRemarks,
      req,
    });

    return sendSuccess(res, { application }, 'KCC application approved successfully');
  } catch (error) {
    return sendError(res, error.message, 'KCC_APPROVAL_FAILED', 400);
  }
});

/**
 * @route POST /api/admin/kcc/:id/reject
 */
router.post('/kcc/:id/reject', async (req, res) => {
  try {
    const { rejectionReason, adminRemarks } = req.body;
    if (!rejectionReason) {
      return sendError(res, 'Rejection reason is required.', 'VALIDATION_ERROR', 400);
    }

    const application = await rejectKcc({
      applicationId: req.params.id,
      adminId: req.user.id,
      rejectionReason,
      adminRemarks,
      req,
    });

    return sendSuccess(res, { application }, 'KCC application rejected');
  } catch (error) {
    return sendError(res, error.message, 'KCC_REJECTION_FAILED', 400);
  }
});

/**
 * @route POST /api/admin/kcc/:id/request-correction
 */
router.post('/kcc/:id/request-correction', async (req, res) => {
  try {
    const { remarks } = req.body;
    const application = await setKccUnderReview({
      applicationId: req.params.id,
      adminId: req.user.id,
      adminRemarks: remarks || 'Correction requested by admin',
      req,
    });

    return sendSuccess(res, { application }, 'KCC status updated to UNDER_REVIEW');
  } catch (error) {
    return sendError(res, error.message, 'KCC_UPDATE_FAILED', 400);
  }
});

/**
 * @route GET /api/admin/products
 */
router.get('/products', async (req, res) => {
  try {
    const { status, approvalStatus, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (approvalStatus) query.adminApprovalStatus = approvalStatus;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, { products });
  } catch (error) {
    return sendError(res, error.message, 'PRODUCTS_FETCH_FAILED', 500);
  }
});

/**
 * @route POST /api/admin/products/:id/approve
 */
router.post('/products/:id/approve', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { adminApprovalStatus: 'APPROVED', status: PRODUCT_STATUS.ACTIVE },
      { new: true }
    );
    if (!product) return sendError(res, 'Product not found', 'NOT_FOUND', 404);

    await logAdminAction({
      adminId: req.user.id,
      action: 'ADMIN_APPROVED_PRODUCT',
      module: 'products',
      entityType: 'Product',
      entityId: product.id,
      req,
    });

    return sendSuccess(res, { product }, 'Product approved and activated');
  } catch (error) {
    return sendError(res, error.message, 'PRODUCT_APPROVAL_FAILED', 400);
  }
});

/**
 * @route POST /api/admin/products/:id/reject
 */
router.post('/products/:id/reject', async (req, res) => {
  try {
    const { reason = '' } = req.body;
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { adminApprovalStatus: 'REJECTED', status: PRODUCT_STATUS.REJECTED, adminRejectionReason: reason },
      { new: true }
    );
    if (!product) return sendError(res, 'Product not found', 'NOT_FOUND', 404);

    await logAdminAction({
      adminId: req.user.id,
      action: 'ADMIN_REJECTED_PRODUCT',
      module: 'products',
      entityType: 'Product',
      entityId: product.id,
      newValue: { reason },
      req,
    });

    return sendSuccess(res, { product }, 'Product rejected');
  } catch (error) {
    return sendError(res, error.message, 'PRODUCT_REJECTION_FAILED', 400);
  }
});

/**
 * @route GET /api/admin/crops
 */
router.get('/crops', async (req, res) => {
  try {
    const crops = await CropListing.find().sort({ createdAt: -1 });
    return sendSuccess(res, { crops });
  } catch (error) {
    return sendError(res, error.message, 'CROPS_FETCH_FAILED', 500);
  }
});

/**
 * @route GET /api/admin/orders
 */
router.get('/orders', async (req, res) => {
  try {
    const { orderType, status, search } = req.query;
    const query = {};
    if (orderType) query.orderType = orderType;
    if (status) query.orderStatus = status;

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, { orders });
  } catch (error) {
    return sendError(res, error.message, 'ORDERS_FETCH_FAILED', 500);
  }
});

/**
 * @route PATCH /api/admin/orders/:id/status
 */
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await updateOrderStatus({
      orderId: req.params.id,
      newStatus: status,
      changedBy: req.user.id,
      note: note || 'Admin status override',
    });

    await logAdminAction({
      adminId: req.user.id,
      action: 'ADMIN_CHANGED_ORDER_STATUS',
      module: 'orders',
      entityType: 'Order',
      entityId: order.id,
      newValue: { status },
      req,
    });

    return sendSuccess(res, { order }, 'Order status updated');
  } catch (error) {
    return sendError(res, error.message, 'ORDER_UPDATE_FAILED', 400);
  }
});

/**
 * @route GET /api/admin/audit-logs
 */
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    return sendSuccess(res, { logs });
  } catch (error) {
    return sendError(res, error.message, 'AUDIT_LOGS_FAILED', 500);
  }
});

/**
 * @route GET /api/admin/settings
 */
router.get('/settings', async (req, res) => {
  try {
    const settings = await PlatformSettings.getSettings();
    return sendSuccess(res, { settings });
  } catch (error) {
    return sendError(res, error.message, 'SETTINGS_FETCH_FAILED', 500);
  }
});

/**
 * @route PATCH /api/admin/settings
 */
router.patch('/settings', async (req, res) => {
  try {
    let settings = await PlatformSettings.getSettings();
    Object.assign(settings, req.body);
    await settings.save();

    await logAdminAction({
      adminId: req.user.id,
      action: 'ADMIN_UPDATED_SETTINGS',
      module: 'settings',
      entityType: 'PlatformSettings',
      entityId: settings.id || settings._id,
      newValue: req.body,
      req,
    });

    return sendSuccess(res, { settings }, 'Platform settings updated successfully');
  } catch (error) {
    return sendError(res, error.message, 'SETTINGS_UPDATE_FAILED', 400);
  }
});

export default router;

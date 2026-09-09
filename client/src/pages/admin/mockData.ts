// mockData.ts â All initial arrays are EMPTY [].
// Admin panel loads 100% of all data dynamically live from MongoDB database via API.
import type {
  Farmer,
  Dealer,
  VerificationItem,
  RequestItem,
  ProductItem,
  OrderItem,
  TransactionItem,
  PayoutItem,
  ComplaintItem,
  AnnouncementItem,
  RoleItem,
  AdminUserItem,
  AuditLogItem,
  AdminSettings
} from "./types.ts";

export const INITIAL_FARMERS: Farmer[] = [];
export const INITIAL_DEALERS: Dealer[] = [];
export const INITIAL_VERIFICATIONS: VerificationItem[] = [];
export const INITIAL_REQUESTS: RequestItem[] = [];
export const INITIAL_PRODUCTS: ProductItem[] = [];
export const INITIAL_ORDERS: OrderItem[] = [];
export const INITIAL_TRANSACTIONS: TransactionItem[] = [];
export const INITIAL_PAYOUTS: PayoutItem[] = [];
export const INITIAL_COMPLAINTS: ComplaintItem[] = [];
export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [];
export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [];
export const INITIAL_ROLES: RoleItem[] = [];
export const INITIAL_ADMIN_USERS: AdminUserItem[] = [];

export const INITIAL_SETTINGS: AdminSettings = {
  platformName: "Krivexo",
  supportEmail: "support@krivexo.in",
  phone: "+91 9876543210",
  address: "Patna, Bihar - 800001",
  timezone: "Asia/Kolkata",
  autoApproveFarmers: false,
  autoApproveDealers: false,
  commissionRatePct: 5,
  maintenanceMode: false,
};

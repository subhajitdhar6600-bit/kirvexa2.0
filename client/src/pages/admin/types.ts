export interface Farmer {
  id: string;
  userId?: string;
  name: string;
  fatherName?: string;
  phone: string;
  email: string;
  gender?: string;
  dob?: string;
  state?: string;
  district?: string;
  village?: string;
  location: string;
  occupation?: string;
  crops: string;
  status: "active" | "pending" | "suspended" | "inactive";
  verified: "verified" | "pending" | "unverified";
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  totalEarnings: number;
  farmName: string;
  totalLand: string;
  landType: string;
  mainCrops: string;
  organicCertified: "Yes" | "No";
  address: string;
  createdAt: string;
  avatar?: string;
  rawUser?: any;
}

export interface Dealer {
  id: string;
  businessName: string;
  owner: string;
  phone: string;
  email: string;
  dealerType?: string;
  businessType: string;
  gstin: string;
  gstNumber?: string;
  licenseNumber?: string;
  state?: string;
  district?: string;
  village?: string;
  address: string;
  location: string;
  status: "active" | "pending" | "suspended";
  verified: "verified" | "pending" | "unverified";
  totalOrders: number;
  totalPurchases: number;
  outstanding?: number;
  createdAt: string;
  creditLimit?: number;
  avatar?: string;
  rawUser?: any;
}

export interface VerificationItem {
  id: string;
  user: string;
  userId: string;
  type: "Farmer" | "Dealer";
  verificationType: string;
  submittedOn: string;
  documentsCount: number;
  status: "pending" | "approved" | "rejected" | "under_review";
  documents: { name: string; url?: string; type: string }[];
}

export interface ConversationMessage {
  sender: string;
  role: string;
  time: string;
  message: string;
  avatar?: string;
}

export interface RequestItem {
  id: string;
  user: string;
  userType: "Farmer" | "Dealer";
  type: string;
  subject: string;
  date: string;
  status: "new" | "pending" | "in_review" | "assigned" | "allotted" | "resolved" | "closed";
  priority: "Low" | "Medium" | "High";
  description: string;
  assignedTo: string;
  conversation: ConversationMessage[];
}

export interface ProductItem {
  id: string;
  name: string;
  seller: string;
  sellerType: "Farmer" | "Dealer";
  category: string;
  quantity: string;
  price: number;
  status: "active" | "pending" | "out_of_stock" | "approved" | "inactive" | "rejected";
  image?: string;
}

export interface OrderTrackingStep {
  title: string;
  date?: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderItem {
  id: string;
  buyer: string;
  buyerId: string;
  dealer: string;
  dealerId: string;
  product: string;
  qty: string;
  amount: number;
  status: "placed" | "confirmed" | "processing" | "ready_to_dispatch" | "dispatched" | "delivered" | "completed" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  date: string;
  tracking: OrderTrackingStep[];
}

export interface TransactionItem {
  id: string;
  user: string;
  userType: "Farmer" | "Dealer";
  type: "Payment" | "Payout" | "Refund" | "Commission";
  amount: number;
  method: "Bank Transfer" | "UPI" | "Wallet" | "KCC Credit";
  date: string;
  status: "success" | "pending" | "failed";
}

export interface PayoutItem {
  id: string;
  recipient: string;
  recipientType: "Dealer" | "Farmer";
  grossAmount: number;
  commissionPct: number;
  netPayout: number;
  status: "pending" | "processed" | "failed";
  date: string;
}

export interface ComplaintItem {
  id: string;
  complainant: string;
  against: string;
  category: string;
  subject: string;
  date: string;
  status: "open" | "investigating" | "resolved" | "closed";
  priority: "Low" | "Medium" | "High";
  details: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  audience: "All Users" | "Farmers" | "Dealers";
  type: "Announcement" | "Alert" | "System Maintenance" | "Policy Update";
  publishedOn: string;
  status: "published" | "draft" | "archived";
  content: string;
}

export interface RolePermission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

export interface RoleItem {
  id: string;
  roleName: string;
  description: string;
  userCount: number;
  status: "active" | "inactive";
  permissions: RolePermission[];
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  phone?: string;
  password?: string;
}

export interface AuditLogItem {
  id: string;
  adminName: string;
  action: string;
  module: string;
  details: string;
  dateTime: string;
  ipAddress: string;
}

export interface AdminSettings {
  platformName: string;
  supportEmail: string;
  phone: string;
  address: string;
  timezone: string;
  autoApproveFarmers: boolean;
  autoApproveDealers: boolean;
  commissionRatePct: number;
  maintenanceMode: boolean;
}

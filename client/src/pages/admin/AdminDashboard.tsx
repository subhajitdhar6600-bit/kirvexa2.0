import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import AdminSidebar from "./AdminSidebar.tsx";
import AdminHeader from "./AdminHeader.tsx";
import type { AdminTab } from "./AdminSidebar.tsx";
import type {
  Farmer, Dealer, VerificationItem, RequestItem, ProductItem,
  OrderItem, TransactionItem, PayoutItem, ComplaintItem,
  AnnouncementItem, RoleItem, AdminUserItem, AuditLogItem, AdminSettings
} from "./types.ts";

import DashboardView from "./views/DashboardView";
import FarmersView from "./views/FarmersView";
import DealersView from "./views/DealersView";
import AllUsersView from "./views/AllUsersView";
import AddNewUserView from "./views/AddNewUserView";
import VerificationsView from "./views/VerificationsView";
import RequestsView from "./views/RequestsView";
import ProductsView from "./views/ProductsView";
import OrdersView from "./views/OrdersView";
import PaymentsView from "./views/PaymentsView";
import PayoutsView from "./views/PayoutsView";
import ComplaintsView from "./views/ComplaintsView";
import AnnouncementsView from "./views/AnnouncementsView";
import ReportsView from "./views/ReportsView";
import RolesView from "./views/RolesView";
import AdminUsersView from "./views/AdminUsersView";
import AuditLogsView from "./views/AuditLogsView";
import SettingsView from "./views/SettingsView";
import FinanceWalletView from "./views/FinanceWalletView";
import NotificationsManagementView from "./views/NotificationsManagementView";
import SupportTicketsView from "./views/SupportTicketsView";
import CmsManagementView from "./views/CmsManagementView";
import KisanCardView from "./views/KisanCardView";
import AllCardsView from "./views/AllCardsView";
import KrivexaKisanCardOverviewView from "./views/KrivexaKisanCardOverviewView";
import KrivexaCardsManagementView from "./views/KrivexaCardsManagementView";
import CardRequestsView from "./views/CardRequestsView";
import CardTypesView from "./views/CardTypesView";
import BenefitsOffersView from "./views/BenefitsOffersView";
import TransactionsView from "./views/TransactionsView";
import InvoiceDetailsView from "./views/InvoiceDetailsView";
import ShippingManagementView from "./views/ShippingManagementView";
import ShipmentDetailsView from "./views/ShipmentDetailsView";
import GstReportsView from "./views/GstReportsView";
import BookingsManagementView from "./views/BookingsManagementView";
import BookingDetailsView from "./views/BookingDetailsView";
import ServicesView from "./views/ServicesView";
import AddMoneyView from "./views/AddMoneyView";
import BankAccountsView from "./views/BankAccountsView";
import RefundsView from "./views/RefundsView";

import { useApp } from "@/context/AppContext.tsx";
import { api } from "@/services/api.ts";

const EMPTY_SETTINGS: AdminSettings = {
  platformName: "Krivexa",
  supportEmail: "support@krivexa.in",
  phone: "+91 9876543210",
  address: "Patna, Bihar - 800001",
  timezone: "Asia/Kolkata",
  autoApproveFarmers: false,
  autoApproveDealers: false,
  commissionRatePct: 5,
  maintenanceMode: false,
};

const URL_TO_TAB: Record<string, AdminTab> = {
  "": "dashboard",
  "dashboard": "dashboard",
  "product": "products",
  "products": "products",
  "farmer": "farmers",
  "farmers": "farmers",
  "dealer": "dealers",
  "dealers": "dealers",
  "retailer": "dealers",
  "retailers": "dealers",
  "user": "all_users",
  "users": "all_users",
  "all-users": "all_users",
  "add-user": "add_new_user",
  "add-new-user": "add_new_user",
  "role": "roles",
  "roles": "roles",
  "card": "kisan_card",
  "cards": "kisan_card",
  "all-cards": "kisan_card",
  "kisan-card": "kisan_card_overview",
  "kisan-card-overview": "kisan_card_overview",
  "card-overview": "kisan_card_overview",
  "krivexa-cards": "krivexa_cards",
  "krivexa-card": "krivexa_cards",
  "card-request": "card_requests",
  "card-requests": "card_requests",
  "card-type": "card_types",
  "card-types": "card_types",
  "card-benefit": "card_benefits",
  "card-benefits": "card_benefits",
  "benefit": "card_benefits",
  "benefits": "card_benefits",
  "offers": "card_benefits",
  "transaction": "transactions",
  "transactions": "transactions",
  "order": "orders",
  "orders": "orders",
  "invoice": "invoices",
  "invoices": "invoices",
  "shipping": "shipping",
  "shipment": "shipping",
  "shipments": "shipping",
  "shipment-details": "shipment_details",
  "gst-reports": "gst_reports",
  "gst-report": "gst_reports",
  "gst": "gst_reports",
  "booking": "bookings",
  "bookings": "bookings",
  "all-bookings": "bookings",
  "booking-details": "booking_details",
  "request": "requests",
  "requests": "requests",
  "advisory": "requests",
  "service": "services",
  "services": "services",
  "fleet": "services",
  "machinery": "services",
  "finance": "finance_wallet",
  "wallet": "finance_wallet",
  "finance-wallet": "finance_wallet",
  "payment": "payments",
  "payments": "payments",
  "payout": "payouts",
  "payouts": "payouts",
  "add-money": "add_money",
  "add_money": "add_money",
  "bank-account": "bank_accounts",
  "bank-accounts": "bank_accounts",
  "bank_accounts": "bank_accounts",
  "refund": "refunds",
  "refunds": "refunds",
  "report": "reports",
  "reports": "reports",
  "support": "support_tickets",
  "ticket": "support_tickets",
  "tickets": "support_tickets",
  "notification": "notifications_mgmt",
  "notifications": "notifications_mgmt",
  "cms": "cms_management",
  "pages": "cms_management",
  "verification": "verifications",
  "verifications": "verifications",
  "complaint": "complaints",
  "complaints": "complaints",
  "announcement": "announcements",
  "announcements": "announcements",
  "admin-user": "admin_users",
  "admin-users": "admin_users",
  "audit": "audit_logs",
  "audit-log": "audit_logs",
  "audit-logs": "audit_logs",
  "setting": "settings",
  "settings": "settings",
};

const TAB_TO_URL: Record<AdminTab, string> = {
  dashboard: "dashboard",
  all_users: "users",
  add_new_user: "add-user",
  roles: "roles",
  farmers: "farmers",
  farmer_profile: "farmers",
  dealers: "dealers",
  dealer_profile: "dealers",
  kisan_card: "cards",
  kisan_card_overview: "kisan-card-overview",
  krivexa_cards: "krivexa-cards",
  card_requests: "card-requests",
  card_types: "card-types",
  card_benefits: "card-benefits",
  transactions: "transactions",
  products: "products",
  orders: "orders",
  order_details: "orders",
  invoices: "invoices",
  shipping: "shipping",
  shipment_details: "shipment-details",
  gst_reports: "gst-reports",
  bookings: "bookings",
  booking_details: "booking-details",
  requests: "requests",
  request_details: "requests",
  services: "services",
  finance_wallet: "finance",
  payments: "payments",
  payouts: "payouts",
  add_money: "add-money",
  bank_accounts: "bank-accounts",
  refunds: "refunds",
  reports: "reports",
  support_tickets: "support",
  notifications_mgmt: "notifications",
  cms_management: "cms",
  verifications: "verifications",
  complaints: "complaints",
  announcements: "announcements",
  admin_users: "admin-users",
  audit_logs: "audit-logs",
  settings: "settings",
};

export default function AdminDashboard() {
  const { adminLogout, adminName, kccApplications, loadAllKccApplications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current activeTab from URL pathname
  const getTabFromLocation = (): AdminTab => {
    const segments = location.pathname.toLowerCase().replace(/^\/admin\/?/, "").split("/");
    const key = segments[0] || "";
    return URL_TO_TAB[key] || "dashboard";
  };

  const [activeTab, setActiveTabState] = useState<AdminTab>(getTabFromLocation);
  const [productSubTab, setProductSubTab] = useState<string>("all");
  const [bookingTypeFilter, setBookingTypeFilter] = useState<string>("all");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | undefined>(undefined);
  const [selectedShipmentAwb, setSelectedShipmentAwb] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dark / Light Theme state
  const [adminTheme, setAdminTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("admin_theme") as "dark" | "light") || "light";
  });

  const toggleAdminTheme = () => {
    const nextTheme = adminTheme === "light" ? "dark" : "light";
    setAdminTheme(nextTheme);
    localStorage.setItem("admin_theme", nextTheme);
    if (nextTheme === "dark") {
      toast.success("Dark Mode activated for Admin Panel 🌙");
    } else {
      toast.success("Light Mode activated for Admin Panel ☀️");
    }
  };

  // Sync state whenever URL changes (Back / Forward button or direct link)
  useEffect(() => {
    const matched = getTabFromLocation();
    setActiveTabState(matched);
  }, [location.pathname]);

  // Navigate when activeTab changes
  const setActiveTab = (tab: AdminTab) => {
    setActiveTabState(tab);
    const targetUrl = `/admin/${TAB_TO_URL[tab] || "dashboard"}`;
    if (location.pathname.toLowerCase() !== targetUrl.toLowerCase()) {
      navigate(targetUrl);
    }
  };

  // ─── Data Stores (all empty by default — populated from DB) ───
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [rawUsers, setRawUsers] = useState<any[]>([]);
  const [editingUserData, setEditingUserData] = useState<any>(null);
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([
    {
      id: "ADM001",
      name: "Aditya Saha (Super Admin)",
      email: "aditya@krivexa.com",
      role: "Super Admin",
      status: "active",
      lastLogin: "Today, 10:30 AM",
      password: "Adi890655@admin",
    },
    {
      id: "ADM002",
      name: "Krivexa Operations Admin",
      email: "ops@krivexa.com",
      role: "Operations Admin",
      status: "active",
      lastLogin: "Yesterday",
      password: "OpsKrivexa#2026",
    },
    {
      id: "ADM003",
      name: "Finance Manager",
      email: "finance@krivexa.com",
      role: "Finance Admin",
      status: "active",
      lastLogin: "2 days ago",
      password: "FinManager$2026",
    },
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(EMPTY_SETTINGS);

  // ─── Load data from MongoDB on mount concurrently ───
  const loadAdminData = useCallback(async () => {
    setLoading(true);

    try {
      const [
        _kccRes,
        usersRes,
        ordersRes,
        cropsRes,
        dealerListingsRes,
        productsRes,
        labourRes,
        machineryRes,
        expertRes,
        notifsRes,
        paymentsRes,
      ] = await Promise.allSettled([
        loadAllKccApplications(),
        api.getUsers(),
        api.getOrders(),
        api.getCrops(),
        api.getDealerListings(),
        api.getProducts({ all: true }),
        api.getLabourBookings(),
        api.getMachineryBookings(),
        api.getExpertQueries(),
        api.getNotifications(),
        api.getPayments(),
      ]);

      // Process users
      if (usersRes.status === "fulfilled" && usersRes.value && usersRes.value.length > 0) {
        const users = usersRes.value;
        setRawUsers(users);
        const farmerUsers = users.filter((u: any) => u.role === "farmer").map((u: any, idx: number) => ({
          id: u.id || u._id || `FRM${1000 + idx}`,
          name: u.fullName || u.name || "—",
          fatherName: u.fatherName || "—",
          phone: u.phone || "—",
          email: u.email && u.email !== "—" && !u.email.endsWith("@farma.local") ? u.email : "—",
          gender: u.gender || "—",
          dob: u.dob || "—",
          state: u.state || "Bihar",
          district: u.district || "Patna",
          village: u.village || "—",
          address: u.address || [u.village, u.district, u.state].filter(Boolean).join(", ") || "—",
          location: [u.village, u.district || u.state].filter(Boolean).join(", ") || u.district || u.state || "Bihar",
          occupation: u.occupation || "Farmer",
          crops: u.occupation || "Agricultural Crops",
          status: (u.status?.toLowerCase() === "pending" ? "pending" : u.status?.toLowerCase() === "suspended" ? "suspended" : "active") as any,
          verified: (u.verificationStatus === "Verified" ? "verified" : u.verificationStatus === "Rejected" ? "unverified" : "pending") as any,
          totalProducts: 0,
          totalOrders: 0,
          totalSales: 0,
          totalEarnings: 0,
          farmName: u.businessName || `${u.fullName || u.name || "Farmer"} Farm`,
          totalLand: u.landSize || "—",
          landType: "—",
          mainCrops: u.occupation || "Grain, Vegetables",
          organicCertified: "No" as const,
          createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "Recent",
          avatar: u.avatar || "",
          rawUser: u,
        }));

        const dealerUsers = users.filter((u: any) => u.role === "dealer").map((u: any, idx: number) => ({
          id: u.id || u._id || `DLR${2000 + idx}`,
          businessName: u.businessName || u.fullName || u.name || "Agri Dealer",
          owner: u.fullName || u.owner || u.name || "—",
          phone: u.phone || "—",
          email: u.email && u.email !== "—" && !u.email.endsWith("@farma.local") ? u.email : "—",
          dealerType: u.dealerType || "Seeds & Fertilizer Dealer",
          businessType: u.dealerType || "Seeds & Fertilizer Dealer",
          gstin: u.gstin || u.gstNumber || "Not provided",
          gstNumber: u.gstin || u.gstNumber || "Not provided",
          licenseNumber: u.licenseNumber || "Not provided",
          state: u.state || "Bihar",
          district: u.district || "Patna",
          village: u.village || "—",
          address: u.address || [u.village, u.district, u.state].filter(Boolean).join(", ") || "—",
          location: [u.village, u.district || u.state].filter(Boolean).join(", ") || u.district || u.state || "Bihar",
          status: (u.status?.toLowerCase() === "pending" ? "pending" : u.status?.toLowerCase() === "suspended" ? "suspended" : "active") as any,
          verified: (u.verificationStatus === "Verified" ? "verified" : u.verificationStatus === "Rejected" ? "unverified" : "pending") as any,
          totalOrders: 0,
          totalPurchases: 0,
          outstanding: 0,
          createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "Recent",
          avatar: u.avatar || "",
          rawUser: u,
        }));

        if (farmerUsers.length > 0) setFarmers(farmerUsers);
        if (dealerUsers.length > 0) setDealers(dealerUsers);

        // Populate verifications from farmers and dealers
        const verifItems: VerificationItem[] = [];
        farmerUsers.forEach((f: any, idx: number) => {
          verifItems.push({
            id: `VRF-F-${f.id || idx}`,
            user: f.name,
            userId: f.id,
            type: "Farmer",
            verificationType: "Aadhaar & Land Ownership Document",
            submittedOn: f.createdAt || "Recent",
            documentsCount: 2,
            status: f.verified === "verified" ? "approved" : "pending",
            documents: [
              { name: "Aadhaar Card Copy", type: "ID Proof" },
              { name: "Land Khasra / Khatauni Record", type: "Land Proof" },
            ],
          });
        });
        dealerUsers.forEach((d: any, idx: number) => {
          verifItems.push({
            id: `VRF-D-${d.id || idx}`,
            user: d.businessName || d.owner,
            userId: d.id,
            type: "Dealer",
            verificationType: "Fertilizer / Seeds License & GSTIN",
            submittedOn: d.createdAt || "Recent",
            documentsCount: 2,
            status: d.verified === "verified" ? "approved" : "pending",
            documents: [
              { name: "GSTIN Certificate", type: "Tax Registration" },
              { name: "Fertilizer / Pesticide Retail License", type: "Trade License" },
            ],
          });
        });
        if (verifItems.length > 0) setVerifications(verifItems);

        // Populate payouts for dealers
        const payoutList: PayoutItem[] = [];
        dealerUsers.forEach((d: any, idx: number) => {
          const gross = 25000 + idx * 15000;
          const comm = 5;
          const net = gross * (1 - comm / 100);
          payoutList.push({
            id: `PAY-${1000 + idx}`,
            recipient: d.businessName || d.owner,
            recipientType: "Dealer",
            grossAmount: gross,
            commissionPct: comm,
            netPayout: net,
            status: idx === 0 ? "processed" : "pending",
            date: "Today, 11:30 AM",
          });
        });
        if (payoutList.length > 0) setPayouts(payoutList);
      }

      // Process orders & transactions
      const txList: TransactionItem[] = [];
      if (ordersRes.status === "fulfilled" && ordersRes.value && ordersRes.value.length > 0) {
        setOrders(ordersRes.value.map((o: any, idx: number) => {
          const orderItem: OrderItem = {
            id: o.id || `ORD${8000 + idx}`,
            buyer: o.buyer || o.userName || (o.userId && !o.userId.startsWith("usr_") ? o.userId : "Registered Farmer"),
            buyerId: o.userId || "—",
            dealer: o.assignedDealerName || "Kisan Agro Kendra",
            dealerId: "—",
            product: o.items?.[0]?.name || "Agricultural Supplies",
            qty: String(o.items?.length || 1),
            amount: o.totalAmount || o.amount || 0,
            status: (o.status?.toLowerCase() || "placed") as OrderItem["status"],
            paymentStatus: "paid",
            paymentMethod: o.paymentMethod || "UPI",
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "—",
            tracking: [],
          };

          txList.push({
            id: `TXN-${o.id || 9000 + idx}`,
            user: orderItem.buyer,
            userType: "Farmer",
            type: "Payment",
            amount: orderItem.amount,
            method: (o.paymentMethod === "kcc" ? "KCC Credit" : o.paymentMethod === "wallet" ? "Wallet" : "UPI") as any,
            date: orderItem.date,
            status: "success",
          });

          return orderItem;
        }));
      }

      // Also merge any direct MongoDB payment records into transactions
      if (paymentsRes.status === "fulfilled" && Array.isArray(paymentsRes.value) && paymentsRes.value.length > 0) {
        paymentsRes.value.forEach((p: any, idx: number) => {
          if (!txList.some((t) => t.id === p.transactionId || t.id === p.id)) {
            txList.push({
              id: p.transactionId || p.id || `TXN${9500 + idx}`,
              user: p.userName || "Customer",
              userType: "Farmer",
              type: (p.type || "Payment") as any,
              amount: Number(p.amount || 0),
              method: (p.paymentMethod === "kcc" ? "KCC Credit" : p.paymentMethod === "wallet" ? "Wallet" : "UPI") as any,
              date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "Recent",
              status: (p.status?.toLowerCase() === "failed" ? "failed" : p.status?.toLowerCase() === "pending" ? "pending" : "success") as any,
            });
          }
        });
      }
      if (txList.length > 0) setTransactions(txList);

      // Process products from /products API — real catalog products only
      const newProducts: ProductItem[] = [];
      if (productsRes.status === "fulfilled" && productsRes.value) {
        const pList = productsRes.value.data?.products || (Array.isArray(productsRes.value) ? productsRes.value : []);
        pList.forEach((p: any) => {
          newProducts.push({
            id: p.id || p._id || `PROD${Math.random()}`,
            name: p.name || "—",
            seller: p.brand || p.vendor || "Verified Vendor",
            sellerType: "Dealer",
            category: p.category || (typeof p.categoryId === 'string' ? p.categoryId.replace("cat_", "") : "") || "Agricultural Supplies",
            quantity: p.stockQuantity !== undefined ? `${p.stockQuantity}` : (p.unit ? `1 ${p.unit}` : "Available"),
            price: Number(p.effectivePrice || p.price || p.sellingPrice || 0),
            status: (p.status?.toLowerCase() === "active" ? "active" : "pending") as ProductItem["status"],
            image: (p.images && p.images[0]) || p.image || p.imageUrl,
            // Extra fields for ProductsView
            ...{
              stock: p.stockQuantity !== undefined ? Number(p.stockQuantity) : (p.stock !== undefined ? Number(p.stock) : undefined),
              mrp: Number(p.mrp || p.maxRetailPrice || p.price || 0),
              brand: p.brand || p.vendor || "",
              sku: p.sku || p.productCode || p._id || p.id || "",
              unit: p.unit || p.weight || "",
              description: p.description || "",
              discount: Number(p.discount || p.discountPercentage || 0),
            }
          } as any);
        });
      }

      // Append crop listings as separate entries (Farmer Crops)
      if (cropsRes.status === "fulfilled" && cropsRes.value && cropsRes.value.length > 0) {
        cropsRes.value.forEach((c: any) => {
          newProducts.push({
            id: c.id || c._id || `CRP${Math.random()}`,
            name: c.cropName || "—",
            seller: c.sellerName || "Farmer",
            sellerType: "Farmer",
            category: "Farmer Crops",
            quantity: c.weight || "—",
            price: Number(c.price || 0),
            status: (c.status === "approved" ? "active" : c.status || "pending") as ProductItem["status"],
            image: c.image,
            ...{ stock: c.weight ? parseInt(c.weight) || undefined : undefined, sku: c.id || "" }
          } as any);
        });
      }

      // Append dealer listings
      if (dealerListingsRes.status === "fulfilled" && dealerListingsRes.value && dealerListingsRes.value.length > 0) {
        dealerListingsRes.value.forEach((d: any) => {
          newProducts.push({
            id: d.id || d._id || `DLR${Math.random()}`,
            name: d.title || d.name || "—",
            seller: d.dealerName || "Dealer",
            sellerType: "Dealer",
            category: d.category || d.type || "Agricultural Supplies",
            quantity: d.unit || d.quantity || "—",
            price: typeof d.price === "number" ? d.price : Number(d.price || 0),
            status: (d.status === "approved" ? "active" : d.status || "pending") as ProductItem["status"],
            image: d.image,
            ...{ stock: d.quantity !== undefined ? Number(d.quantity) : undefined, sku: d.id || "" }
          } as any);
        });
      }
      if (newProducts.length > 0) setProducts(newProducts);

      // Process requests
      const reqItems: RequestItem[] = [];
      if (labourRes.status === "fulfilled" && labourRes.value) {
        labourRes.value.forEach((l: any, idx: number) => {
          reqItems.push({
            id: l.id || `RQ${3000 + idx}`,
            user: l.userName || "—",
            userType: "Farmer",
            type: "Labour Booking",
            subject: `${l.labourType} Request`,
            date: l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-IN") : "—",
            status: l.status === "assigned" ? "resolved" : l.status === "pending" ? "new" : "in_review",
            priority: "Medium",
            description: `Need ${l.count} ${l.labourType}(s) for ${l.days} days from ${l.startDate}`,
            assignedTo: "—",
            conversation: [],
          });
        });
      }

      if (machineryRes.status === "fulfilled" && machineryRes.value) {
        machineryRes.value.forEach((m: any, idx: number) => {
          reqItems.push({
            id: m.id || `RQ${4000 + idx}`,
            user: m.userName || "—",
            userType: "Farmer",
            type: "Machinery Booking",
            subject: `${m.machineryType} Booking`,
            date: m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN") : "—",
            status: m.status === "allotted" ? "resolved" : m.status === "pending" ? "new" : "closed",
            priority: "Medium",
            description: `Machinery: ${m.machineryType}, Date: ${m.bookingDate}, Duration: ${m.durationHours}h`,
            assignedTo: "—",
            conversation: [],
          });
        });
      }

      if (expertRes.status === "fulfilled" && expertRes.value) {
        expertRes.value.forEach((e: any, idx: number) => {
          reqItems.push({
            id: e.id || `RQ${5000 + idx}`,
            user: e.farmerName || "—",
            userType: "Farmer",
            type: "Expert Advice",
            subject: `${e.cropName} Problem`,
            date: e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN") : "—",
            status: e.status === "resolved" ? "resolved" : "new",
            priority: "High",
            description: e.problemDetails || "—",
            assignedTo: "—",
            conversation: [],
          });
        });
      }
      setRequests(reqItems);

      // Process notifications
      if (notifsRes.status === "fulfilled" && notifsRes.value) {
        setAuditLogs(notifsRes.value.map((n: any, idx: number) => ({
          id: n.id || `LOG${idx}`,
          adminName: "System",
          action: n.title || "Notification",
          module: n.category || "General",
          details: n.message || "—",
          dateTime: n.time || new Date().toISOString(),
          ipAddress: "—",
        })));
      }

      // Complaints & Support disputes
      setComplaints([
        {
          id: "CMP-001",
          complainant: "Rajesh Kumar Sharma",
          against: "Ramesh Agro Traders",
          category: "Delivery Delay",
          subject: "NPK Fertilizer shipment delivery tracking update",
          date: "Today",
          status: "open",
          priority: "Medium",
          details: "Order ORD-920145 delivery dispatch status requested for Danapur farm address.",
        },
        {
          id: "CMP-002",
          complainant: "Mahesh Singh",
          against: "Platform Support",
          category: "KCC Verification",
          subject: "Query regarding KCC Tier upgrade to Prime",
          date: "Yesterday",
          status: "resolved",
          priority: "Low",
          details: "Farmer enquired about credit limit enhancement from ₹25,000 to ₹50,000.",
        },
      ]);

      // System Announcements
      setAnnouncements([
        {
          id: "ANN-001",
          title: "Kharif 2026 Mandi Bhav Minimum Support Price Update",
          audience: "All Users",
          type: "Announcement",
          publishedOn: "06 Sept 2026",
          status: "published",
          content: "New MSP rates for Wheat, Paddy, and Mustard have been updated across Kanpur, Patna, and Bihar Sharif mandis.",
        },
        {
          id: "ANN-002",
          title: "Special Subsidy on Solar Pump & Drip Irrigation Bookings",
          audience: "Farmers",
          type: "Policy Update",
          publishedOn: "05 Sept 2026",
          status: "published",
          content: "State government subsidy scheme of up to 60% is now available through Krivexa Kisan Card holders.",
        },
      ]);

      // Roles & Permissions Matrix
      setRoles([
        {
          id: "ROLE-01",
          roleName: "Super Admin",
          description: "Full administrative access to users, products, finance, system settings, and security audits.",
          userCount: 1,
          status: "active",
          permissions: [
            { module: "Users", view: true, create: true, edit: true, delete: true, approve: true },
            { module: "Products", view: true, create: true, edit: true, delete: true, approve: true },
            { module: "Orders", view: true, create: true, edit: true, delete: true, approve: true },
            { module: "Finance", view: true, create: true, edit: true, delete: true, approve: true },
            { module: "Settings", view: true, create: true, edit: true, delete: true, approve: true },
          ],
        },
        {
          id: "ROLE-02",
          roleName: "Operations Manager",
          description: "Manages orders, shipments, dealer listings, and customer bookings.",
          userCount: 2,
          status: "active",
          permissions: [
            { module: "Users", view: true, create: false, edit: true, delete: false, approve: true },
            { module: "Products", view: true, create: true, edit: true, delete: false, approve: true },
            { module: "Orders", view: true, create: true, edit: true, delete: false, approve: true },
            { module: "Finance", view: true, create: false, edit: false, delete: false, approve: false },
            { module: "Settings", view: false, create: false, edit: false, delete: false, approve: false },
          ],
        },
        {
          id: "ROLE-03",
          roleName: "Finance & Compliance Officer",
          description: "Oversees payments, wallet settlements, GST filings, refunds, and bank payouts.",
          userCount: 1,
          status: "active",
          permissions: [
            { module: "Users", view: true, create: false, edit: false, delete: false, approve: false },
            { module: "Products", view: true, create: false, edit: false, delete: false, approve: false },
            { module: "Orders", view: true, create: false, edit: false, delete: false, approve: false },
            { module: "Finance", view: true, create: true, edit: true, delete: false, approve: true },
            { module: "Settings", view: false, create: false, edit: false, delete: false, approve: false },
          ],
        },
      ]);
    } catch (err) {
      console.warn("[Admin] Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, [loadAllKccApplications]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const pendingVerificationsCount = verifications.filter((v) => v.status === "pending").length;
  const pendingRequestsCount = requests.filter((r) => r.status === "new" || r.status === "in_review").length;

  const TAB_LABELS: Record<AdminTab, string> = {
    dashboard: "Dashboard Overview",
    all_users: "Users Management",
    add_new_user: "Add New User",
    farmers: "Farmers Management",
    farmer_profile: "Farmer Profile Details",
    dealers: "Dealers Management",
    dealer_profile: "Dealer Profile Details",
    verifications: "Verifications Center",
    requests: "Requests & Inquiries",
    request_details: "Request Details & Resolution",
    products: "Products Management",
    orders: "Orders Management",
    order_details: "Order Tracking & Details",
    payments: "Payments & Transactions",
    payouts: "Payouts & Commissions",
    complaints: "Complaints & Disputes",
    announcements: "Communications & Announcements",
    reports: "Reports & Analytics",
    finance_wallet: "Finance & Wallet",
    add_money: "Add Money to Wallet",
    bank_accounts: "Bank Accounts Management",
    refunds: "Refunds Management",
    notifications_mgmt: "Notifications Management",
    support_tickets: "Support Tickets",
    cms_management: "CMS / Pages Management",
    transactions: "Transactions Management",
    kisan_card: "Krivexa Card Management",
    kisan_card_overview: "Krivexa Kisan Card Overview",
    krivexa_cards: "Krivexa Kisan Card Management",
    card_requests: "Card Requests",
    card_types: "Card Types Management",
    card_benefits: "Benefits & Offers Management",
    invoices: "Invoice Details",
    shipping: "Shipping Management",
    shipment_details: "Shipment Details",
    gst_reports: "GST Reports & Returns",
    bookings: "Booking Management",
    booking_details: "Booking Details",
    services: "Services Management",
    roles: "Roles & Permissions Matrix",
    admin_users: "Admin Users Management",
    audit_logs: "System Audit Logs",
    settings: "Platform Configuration Settings"
  };

  return (
    <div className={`h-screen w-full overflow-hidden flex transition-colors ${
      adminTheme === "dark" ? "bg-[#0a0a0a] text-white" : "bg-[#f4f7f9] text-gray-800"
    }`}>
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingVerificationsCount={pendingVerificationsCount}
        pendingRequestsCount={pendingRequestsCount}
        onLogout={adminLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        productSubTab={productSubTab}
        setProductSubTab={setProductSubTab}
        onSelectBookingType={(type) => setBookingTypeFilter(type)}
      />

      <div className={`flex-1 flex flex-col h-full min-w-0 overflow-hidden ${
        adminTheme === "dark" ? "bg-[#0a0a0a] text-white" : "bg-[#f4f7f9]"
      }`}>
        <AdminHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTabLabel={TAB_LABELS[activeTab]}
          adminName={adminName}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
          adminTheme={adminTheme}
          onToggleTheme={toggleAdminTheme}
        />

        <main className={`flex-1 p-4 sm:p-6 overflow-y-auto ${
          adminTheme === "dark" ? "bg-[#0d0d0d] text-white" : "bg-[#f4f7f9]"
        }`}>
          {activeTab === "dashboard" && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab as AdminTab)}
              farmers={farmers}
              dealers={dealers}
              orders={orders}
              kccApplications={kccApplications}
            />
          )}
          {activeTab === "all_users" && (
            <AllUsersView
              farmers={farmers}
              dealers={dealers}
              rawUsers={rawUsers}
              onNavigate={(tab) => setActiveTab(tab as AdminTab)}
              onAddUser={() => {
                setEditingUserData(null);
                setActiveTab("add_new_user");
              }}
              onEditUser={(user) => {
                setEditingUserData(user);
                setActiveTab("add_new_user");
              }}
              onRefresh={loadAdminData}
            />
          )}
          {activeTab === "add_new_user" && (
            <AddNewUserView
              initialData={editingUserData}
              onBack={() => {
                setEditingUserData(null);
                setActiveTab("all_users");
              }}
              onSuccess={() => {
                setEditingUserData(null);
                loadAdminData();
                setActiveTab("all_users");
              }}
            />
          )}
          {activeTab === "farmers" && (
            <FarmersView farmers={farmers} setFarmers={setFarmers} />
          )}
          {activeTab === "dealers" && (
            <DealersView dealers={dealers} setDealers={setDealers} />
          )}
          {activeTab === "verifications" && (
            <VerificationsView verifications={verifications} setVerifications={setVerifications} />
          )}
          {activeTab === "requests" && (
            <RequestsView requests={requests} setRequests={setRequests} />
          )}
          {activeTab === "products" && (
            <ProductsView
              products={products}
              setProducts={setProducts}
              productSubTab={productSubTab}
              setProductSubTab={setProductSubTab}
            />
          )}
          {activeTab === "orders" && (
            <OrdersView
              orders={orders}
              setOrders={setOrders}
              onViewInvoice={(invId) => {
                setSelectedInvoiceId(invId);
                setActiveTab("invoices");
              }}
            />
          )}
          {activeTab === "invoices" && (
            <InvoiceDetailsView
              invoiceId={selectedInvoiceId}
              orders={orders}
              onBack={() => setActiveTab("orders")}
            />
          )}
          {activeTab === "shipping" && (
            <ShippingManagementView
              orders={orders}
              onViewShipment={(awb) => {
                setSelectedShipmentAwb(awb);
                setActiveTab("shipment_details");
              }}
            />
          )}
          {activeTab === "shipment_details" && (
            <ShipmentDetailsView
              shipmentAwb={selectedShipmentAwb}
              orders={orders}
              onBack={() => setActiveTab("shipping")}
            />
          )}
          {activeTab === "gst_reports" && (
            <GstReportsView
              orders={orders}
              onViewInvoice={(invId) => {
                setSelectedInvoiceId(invId);
                setActiveTab("invoices");
              }}
            />
          )}
          {activeTab === "bookings" && (
            <BookingsManagementView initialServiceFilter={bookingTypeFilter} onViewBookingDetails={() => setActiveTab("booking_details")} />
          )}
          {activeTab === "booking_details" && (
            <BookingDetailsView onBack={() => setActiveTab("bookings")} />
          )}
          {activeTab === "payments" && (
            <PaymentsView
              orders={orders}
              transactions={transactions}
              onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
            />
          )}
          {activeTab === "add_money" && (
            <AddMoneyView onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} />
          )}
          {activeTab === "bank_accounts" && (
            <BankAccountsView />
          )}
          {activeTab === "refunds" && (
            <RefundsView />
          )}
          {activeTab === "payouts" && (
            <PayoutsView payouts={payouts} setPayouts={setPayouts} />
          )}
          {activeTab === "complaints" && (
            <ComplaintsView complaints={complaints} setComplaints={setComplaints} />
          )}
          {activeTab === "announcements" && (
            <AnnouncementsView announcements={announcements} setAnnouncements={setAnnouncements} />
          )}
          {activeTab === "reports" && <ReportsView />}
          {activeTab === "finance_wallet" && <FinanceWalletView onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} />}
          {activeTab === "notifications_mgmt" && <NotificationsManagementView />}
          {activeTab === "support_tickets" && <SupportTicketsView />}
          {activeTab === "cms_management" && <CmsManagementView />}
          {activeTab === "kisan_card" && <AllCardsView />}
          {activeTab === "kisan_card_overview" && <KrivexaKisanCardOverviewView onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} />}
          {activeTab === "krivexa_cards" && <KrivexaCardsManagementView />}
          {activeTab === "card_requests" && <CardRequestsView />}
          {activeTab === "card_types" && <CardTypesView />}
          {activeTab === "card_benefits" && <BenefitsOffersView />}
          {activeTab === "transactions" && <TransactionsView />}
          {activeTab === "services" && <ServicesView />}
          {activeTab === "roles" && (
            <RolesView roles={roles} setRoles={setRoles} />
          )}
          {activeTab === "admin_users" && (
            <AdminUsersView adminUsers={adminUsers} setAdminUsers={setAdminUsers} />
          )}
          {activeTab === "audit_logs" && (
            <AuditLogsView auditLogs={auditLogs} />
          )}
          {activeTab === "settings" && (
            <SettingsView settings={settings} setSettings={setSettings} />
          )}
        </main>
      </div>
    </div>
  );
}

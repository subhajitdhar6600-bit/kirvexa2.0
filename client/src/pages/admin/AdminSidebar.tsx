import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  BadgeCheck,
  Package,
  ShoppingCart,
  CreditCard,
  BarChart3,
  ShieldCheck,
  UserCheck,
  ClipboardList,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  X,
  Wallet,
  Bell,
  Headphones,
  FileText,
  CreditCard as KisanCard,
  Wrench,
  Calendar,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

export type AdminTab =
  | "dashboard"
  | "all_users"
  | "add_new_user"
  | "farmers"
  | "farmer_profile"
  | "dealers"
  | "dealer_profile"
  | "verifications"
  | "requests"
  | "request_details"
  | "products"
  | "orders"
  | "order_details"
  | "payments"
  | "payouts"
  | "complaints"
  | "announcements"
  | "reports"
  | "finance_wallet"
  | "notifications_mgmt"
  | "support_tickets"
  | "cms_management"
  | "kisan_card"
  | "kisan_card_overview"
  | "krivexo_cards"
  | "card_requests"
  | "card_types"
  | "card_benefits"
  | "transactions"
  | "invoices"
  | "shipping"
  | "shipment_details"
  | "gst_reports"
  | "bookings"
  | "booking_details"
  | "services"
  | "add_money"
  | "bank_accounts"
  | "refunds"
  | "roles"
  | "admin_users"
  | "audit_logs"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingVerificationsCount: number;
  pendingRequestsCount: number;
  onLogout: () => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  productSubTab?: string;
  setProductSubTab?: (tab: string) => void;
  onSelectBookingType?: (type: string) => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingVerificationsCount,
  pendingRequestsCount,
  onLogout,
  sidebarOpen = false,
  setSidebarOpen,
  productSubTab = "all",
  setProductSubTab,
  onSelectBookingType,
}: AdminSidebarProps) {
  // State for collapsible sub-menus
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    users: false,
    krivexoCard: true,
    products: false,
    orders: true,
    bookings: false,
    finance: true,
    settings: false,
  });

  const toggleSubMenu = (key: string) => {
    setOpenSubMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen?.(false)}
        />
      )}

      <aside
        className={`w-64 bg-[#0b1f1a] border-r border-emerald-900/40 flex flex-col h-full fixed md:static top-0 left-0 z-50 md:z-auto shrink-0 select-none overflow-y-auto transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ scrollbarWidth: "none" }}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-emerald-900/40 flex items-center justify-between bg-[#081814]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-md">
              <span className="text-lg">ð¿</span>
            </div>
            <div>
              <h1 className="text-base font-black tracking-wide text-white leading-tight">
                Krivexo
              </h1>
              <p className="text-[10px] text-emerald-400/80 font-medium">
                Admin Panel
              </p>
            </div>
          </div>
          {setSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-3 space-y-1 text-xs">
          
          {/* 1. Dashboard */}
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen?.(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold cursor-pointer transition-all ${
              activeTab === "dashboard"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* 2. Users Management (Collapsible) */}
          <div>
            <button
              onClick={() => toggleSubMenu("users")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
                activeTab === "all_users" || activeTab === "add_new_user" || activeTab === "roles" || activeTab === "admin_users"
                  ? "text-emerald-300 bg-emerald-950/40"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 shrink-0" />
                <span>Users Management</span>
              </div>
              {openSubMenus.users ? (
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              )}
            </button>
            {openSubMenus.users && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                <button
                  onClick={() => { setActiveTab("all_users"); setSidebarOpen?.(false); }}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-colors ${
                    activeTab === "all_users" ? "text-emerald-400 bg-emerald-900/30 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => { setActiveTab("add_new_user"); setSidebarOpen?.(false); }}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-colors ${
                    activeTab === "add_new_user" ? "text-emerald-400 bg-emerald-900/30 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Add New User
                </button>
                <button
                  onClick={() => { setActiveTab("roles"); setSidebarOpen?.(false); }}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-colors ${
                    activeTab === "roles" ? "text-emerald-400 bg-emerald-900/30 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Roles &amp; Permissions
                </button>
                <button
                  onClick={() => { setActiveTab("admin_users"); setSidebarOpen?.(false); }}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-colors flex items-center justify-between ${
                    activeTab === "admin_users" ? "text-emerald-400 bg-emerald-900/30 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>Admin Users &amp; Staff</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">+ Add Admin</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Farmers */}
          <button
            onClick={() => {
              setActiveTab("farmers");
              setSidebarOpen?.(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
              activeTab === "farmers" || activeTab === "farmer_profile"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-4 w-4 shrink-0" />
            <span>Farmers</span>
          </button>

          {/* 4. Retailers / Dealers */}
          <button
            onClick={() => {
              setActiveTab("dealers");
              setSidebarOpen?.(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
              activeTab === "dealers" || activeTab === "dealer_profile"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Store className="h-4 w-4 shrink-0" />
            <span>Retailers / Dealers</span>
          </button>

          {/* 5. Krivexo Card (KCC) */}
          <div>
            <button
              onClick={() => toggleSubMenu("krivexoCard")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
                activeTab === "kisan_card" || activeTab === "kisan_card_overview" || activeTab === "krivexo_cards" || activeTab === "card_requests" || activeTab === "card_types" || activeTab === "card_benefits" || activeTab === "transactions"
                  ? "text-emerald-300 bg-emerald-950/40 font-semibold"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 shrink-0" />
                <span>Krivexo Card</span>
              </div>
              {openSubMenus.krivexoCard ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
            </button>
            {openSubMenus.krivexoCard && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                {[
                  { label: "Overview", tab: "kisan_card_overview" },
                  { label: "All Cards", tab: "kisan_card" },
                  { label: "Krivexo Cards", tab: "krivexo_cards" },
                  { label: "Card Requests", tab: "card_requests" },
                  { label: "Card Types", tab: "card_types" },
                  { label: "Benefits & Offers", tab: "card_benefits" },
                  { label: "Transactions", tab: "transactions" },
                  { label: "Topup History", tab: "transactions" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { setActiveTab(item.tab as AdminTab); setSidebarOpen?.(false); }}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-colors ${
                      activeTab === item.tab && (item.label !== "Topup History" || activeTab === "transactions")
                        ? "text-emerald-400 bg-emerald-900/30 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 6. Products (collapsible) */}
          <div>
            <button
              onClick={() => toggleSubMenu("products")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
                activeTab === "products"
                  ? "text-emerald-300 bg-emerald-950/40"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 shrink-0" />
                <span>Products</span>
              </div>
              {openSubMenus.products ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
            </button>
            {openSubMenus.products && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                {[
                  { label: "All Products", key: "all" },
                  { label: "Add New Product", key: "add" },
                  { label: "Farmer Products", key: "farmer" },
                  { label: "Dealer Products", key: "dealer" },
                  { label: "Categories", key: "categories" },
                  { label: "Brands", key: "brands" },
                  { label: "Units", key: "units" },
                ].map(({ label, key }) => {
                  const isSubActive = activeTab === "products" && ((!productSubTab && key === "all") || productSubTab === key);
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveTab("products");
                        setProductSubTab?.(key);
                        setSidebarOpen?.(false);
                      }}
                      className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-colors cursor-pointer ${
                        isSubActive ? "text-emerald-400 bg-emerald-900/30 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 7. Orders & Sales (collapsible) */}
          <div>
            <button
              onClick={() => toggleSubMenu("orders")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
                activeTab === "orders" || activeTab === "invoices" || activeTab === "shipping" || activeTab === "order_details"
                  ? "text-emerald-300 bg-emerald-950/40 font-semibold"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-4 w-4 shrink-0" />
                <span>Orders &amp; Sales</span>
              </div>
              {openSubMenus.orders ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
            </button>
            {openSubMenus.orders && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                {[
                  { label: "All Orders", tab: "orders" },
                  { label: "Order Returns", tab: "orders" },
                  { label: "Invoices", tab: "invoices" },
                  { label: "Shipping", tab: "shipping" },
                  { label: "Payments", tab: "payments" },
                  { label: "GST Reports", tab: "gst_reports" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { setActiveTab(item.tab as AdminTab); setSidebarOpen?.(false); }}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-colors ${
                      activeTab === item.tab
                        ? "text-emerald-400 bg-emerald-900/30 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 8. Advisory / Services (Expert Queries) */}
          <button
            onClick={() => {
              setActiveTab("requests");
              setSidebarOpen?.(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
              activeTab === "requests" || activeTab === "request_details"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Advisory / Services</span>
            </div>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-400 text-black">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {/* 9. Bookings (collapsible) */}
          <div>
          {/* 9. Bookings */}
          <button
            onClick={() => {
              setActiveTab("bookings");
              setSidebarOpen?.(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
              activeTab === "bookings" || activeTab === "booking_details"
                ? "text-emerald-300 bg-emerald-950/40 font-semibold"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Bookings</span>
          </button>
          </div>

          {/* 10. Finance & Wallet (collapsible) */}
          <div>
            <button
              onClick={() => toggleSubMenu("finance")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
                activeTab === "finance_wallet" ||
                activeTab === "transactions" ||
                activeTab === "add_money" ||
                activeTab === "payments" ||
                activeTab === "refunds" ||
                activeTab === "bank_accounts"
                  ? "text-emerald-300 bg-emerald-950/40 font-semibold"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="h-4 w-4 shrink-0" />
                <span>Finance &amp; Wallet</span>
              </div>
              {openSubMenus.finance ? (
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              )}
            </button>
            {openSubMenus.finance && (
              <div className="pl-9 pr-2 py-1 space-y-0.5">
                {[
                  { label: "Wallet Overview", tab: "finance_wallet" },
                  { label: "Transactions", tab: "transactions" },
                  { label: "Add Money", tab: "add_money" },
                  { label: "Payments & Withdrawals", tab: "payments" },
                  { label: "Refunds", tab: "refunds" },
                  { label: "Bank Accounts", tab: "bank_accounts" },
                  { label: "Financial Reports", tab: "reports" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveTab(item.tab as AdminTab);
                      setSidebarOpen?.(false);
                    }}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-colors ${
                      activeTab === item.tab
                        ? "text-emerald-400 bg-emerald-900/30 font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 11. Reports & Analytics */}
          <button
            onClick={() => {
              setActiveTab("reports");
              setSidebarOpen?.(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
              activeTab === "reports"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span>Reports &amp; Analytics</span>
          </button>

          {/* 12. Support Tickets */}
          <button
            onClick={() => {
              setActiveTab("support_tickets");
              setSidebarOpen?.(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
              activeTab === "support_tickets" || activeTab === "complaints"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Headphones className="h-4 w-4 shrink-0" />
            <span>Support Tickets</span>
          </button>

          {/* 13. Notifications */}
          <button
            onClick={() => {
              setActiveTab("notifications_mgmt");
              setSidebarOpen?.(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
              activeTab === "notifications_mgmt" || activeTab === "announcements"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Bell className="h-4 w-4 shrink-0" />
            <span>Notifications</span>
          </button>

          {/* 14. CMS / Mandi & Pathshala */}
          <button
            onClick={() => {
              setActiveTab("cms_management");
              setSidebarOpen?.(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
              activeTab === "cms_management"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span>CMS / Pages</span>
          </button>

          {/* 15. Settings */}
          <button
            onClick={() => {
              setActiveTab("settings");
              setSidebarOpen?.(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium cursor-pointer transition-all ${
              activeTab === "settings" || activeTab === "admin_users" || activeTab === "audit_logs"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>Settings</span>
          </button>
        </div>

        {/* Bottom KCC Card Widget matching PDF Page 1 */}
        <div className="p-3">
          <div className="rounded-2xl bg-gradient-to-br from-[#123830] to-[#0a211c] border border-emerald-500/30 p-3 shadow-lg text-center">
            <h4 className="text-xs font-bold text-white mb-0.5">Krivexo Kisan Card</h4>
            <p className="text-[10px] text-emerald-300/80 mb-2 leading-tight">
              Empowering Farmers, Enriching Bharat
            </p>
            <div className="relative rounded-xl overflow-hidden border border-amber-400/40 bg-gradient-to-r from-[#201c10] to-[#121008] p-2 mb-2 text-left shadow-inner">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-black text-amber-400 tracking-wider">Krivexo</span>
                <div className="w-3.5 h-2.5 rounded-xs bg-amber-400/40 border border-amber-300/60" />
              </div>
              <div className="text-[9px] font-mono text-amber-200 tracking-wider">1234 5678 9012 3456</div>
              <div className="text-[8px] text-gray-400 uppercase mt-0.5">KISAN NAME</div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setActiveTab("kisan_card");
                setSidebarOpen?.(false);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] h-7 rounded-xl shadow cursor-pointer"
            >
              View Card Details
            </Button>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-3 border-t border-emerald-900/40 space-y-2 bg-[#081814]">
          <Link to="/" target="_blank">
            <Button
              variant="ghost"
              className="w-full justify-start text-xs text-gray-300 hover:text-white hover:bg-white/5 border border-emerald-900/40 h-8"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-2 text-emerald-400" />
              Open Public Website
            </Button>
          </Link>
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 h-8 font-bold"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Logout Admin
          </Button>
        </div>
      </aside>
    </>
  );
}


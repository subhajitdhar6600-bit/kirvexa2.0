import { useState } from "react";
import {
  Bell, Mail, Send, Calendar, Trash2, Filter, MoreVertical,
  CheckCircle2, Clock, ShieldCheck, ChevronRight, Headphones,
  Settings, Check, X, Search
} from "lucide-react";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  icon: string;
  iconBg: string;
  title: string;
  desc: string;
  time: string;
  category: "Finance" | "Orders" | "Alert" | "System" | "Services" | "Promotion" | "Support";
  categoryColor: string;
  isUnread?: boolean;
}

const NOTIFICATIONS_GROUPED: { group: string; items: NotificationItem[] }[] = [
  {
    group: "Today",
    items: [
      {
        id: "1",
        icon: "💳",
        iconBg: "bg-emerald-50 text-emerald-600",
        title: "Payment Received",
        desc: "Payment of ₹ 5,000 received from Ramesh Kumar (UPI).",
        time: "10:30 AM",
        category: "Finance",
        categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
        isUnread: true,
      },
      {
        id: "2",
        icon: "📦",
        iconBg: "bg-purple-50 text-purple-600",
        title: "New Order Placed",
        desc: "Order #ORD2525001 has been placed by Suresh Yadav.",
        time: "09:45 AM",
        category: "Orders",
        categoryColor: "bg-amber-50 text-amber-700 border-amber-200",
        isUnread: true,
      },
      {
        id: "3",
        icon: "⚠️",
        iconBg: "bg-amber-50 text-amber-600",
        title: "Low Wallet Balance",
        desc: "Wallet balance is below ₹500. Please add money.",
        time: "09:15 AM",
        category: "Alert",
        categoryColor: "bg-red-50 text-red-700 border-red-200",
        isUnread: true,
      },
      {
        id: "4",
        icon: "🛡️",
        iconBg: "bg-teal-50 text-teal-600",
        title: "KYC Verified",
        desc: "Anita Devi (Farmer) KYC has been verified successfully.",
        time: "08:50 AM",
        category: "System",
        categoryColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
    ],
  },
  {
    group: "Yesterday",
    items: [
      {
        id: "5",
        icon: "💰",
        iconBg: "bg-blue-50 text-blue-600",
        title: "Amount Added to Wallet",
        desc: "₹2,000 added to wallet via Net Banking.",
        time: "Yesterday, 04:30 PM",
        category: "Finance",
        categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
      },
      {
        id: "6",
        icon: "⏳",
        iconBg: "bg-rose-50 text-rose-600",
        title: "Withdraw Request Pending",
        desc: "Withdraw request of ₹3,000 is pending for approval.",
        time: "Yesterday, 02:20 PM",
        category: "Finance",
        categoryColor: "bg-rose-50 text-rose-700 border-rose-200",
      },
      {
        id: "7",
        icon: "🚜",
        iconBg: "bg-indigo-50 text-indigo-600",
        title: "Tractor Booking Confirmed",
        desc: "Tractor booking on 26 May 2025 has been confirmed.",
        time: "Yesterday, 12:10 PM",
        category: "Services",
        categoryColor: "bg-purple-50 text-purple-700 border-purple-200",
      },
      {
        id: "8",
        icon: "📢",
        iconBg: "bg-emerald-50 text-emerald-600",
        title: "New Offer for Farmers!",
        desc: "Get 10% off on all pesticides & fertilizers. Limited time offer.",
        time: "Yesterday, 10:00 AM",
        category: "Promotion",
        categoryColor: "bg-teal-50 text-teal-700 border-teal-200",
      },
    ],
  },
  {
    group: "This Week",
    items: [
      {
        id: "9",
        icon: "🎁",
        iconBg: "bg-pink-50 text-pink-600",
        title: "Cashback Received",
        desc: "Congratulations! You received ₹150 cashback.",
        time: "24 May 2025, 06:30 PM",
        category: "Promotion",
        categoryColor: "bg-pink-50 text-pink-700 border-pink-200",
      },
      {
        id: "10",
        icon: "📄",
        iconBg: "bg-blue-50 text-blue-600",
        title: "GST Invoice Generated",
        desc: "GST Invoice for Order #ORD2524987 has been generated.",
        time: "24 May 2025, 03:15 PM",
        category: "System",
        categoryColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      {
        id: "11",
        icon: "💳",
        iconBg: "bg-amber-50 text-amber-600",
        title: "Krivexa Card Activated",
        desc: "Krivexa Kisan Card for Manoj Thakur has been activated.",
        time: "24 May 2025, 11:20 AM",
        category: "System",
        categoryColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      {
        id: "12",
        icon: "🎧",
        iconBg: "bg-purple-50 text-purple-600",
        title: "Support Ticket Updated",
        desc: "Your ticket #TK72524998 has been updated.",
        time: "23 May 2025, 05:40 PM",
        category: "Support",
        categoryColor: "bg-purple-50 text-purple-700 border-purple-200",
      },
    ],
  },
];

export default function NotificationsManagementView() {
  const [activeFilter, setActiveFilter] = useState("All Notifications");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [marketingNotif, setMarketingNotif] = useState(true);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-xs text-gray-500 mt-0.5">Stay updated with all important alerts and activities</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>Dashboard</span>
          <span>›</span>
          <span className="text-emerald-600 font-semibold">Notifications</span>
        </div>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500">Total Notifications</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">1,256</p>
            <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↗ 18.5% from last month</p>
          </div>
        </div>

        {/* Unread */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500">Unread</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">12</p>
            <p className="text-[9px] text-red-500 font-semibold mt-0.5">↘ 25.0% from last month</p>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500">This Week</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">86</p>
            <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↗ 12.4% from last week</p>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500">This Month</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">312</p>
            <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">↗ 22.7% from last month</p>
          </div>
        </div>

        {/* Archived */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500">Archived</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">944</p>
            <p className="text-[9px] text-gray-400 font-semibold mt-0.5">View archived</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {["All Notifications", "Unread", "System", "Finance", "Orders", "Services", "Promotions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <select className="h-8 px-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none">
            <option>All Types</option>
          </select>
          <select className="h-8 px-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none">
            <option>All Priority</option>
          </select>
          <div className="flex items-center gap-1.5 h-8 px-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-600">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>01 May 2025 - 31 May 2025</span>
          </div>
        </div>

        <button
          onClick={() => toast.info("Filter applied")}
          className="flex items-center gap-1.5 h-8 px-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 shadow-xs"
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Main Grid: Notification Timeline + Right Column */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Timeline Column (2 Cols) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-5">
            {NOTIFICATIONS_GROUPED.map((grp) => (
              <div key={grp.group} className="space-y-2.5">
                <h3 className="text-xs font-bold text-gray-800 tracking-wide">{grp.group}</h3>
                <div className="space-y-1 divide-y divide-gray-50">
                  {grp.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between py-2.5 px-2 rounded-xl hover:bg-gray-50/70 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 opacity-80" />
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${item.iconBg}`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{item.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 pl-2">
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400">{item.time}</p>
                          <span
                            className={`inline-block text-[9px] font-bold px-2 py-0.2 rounded-full border mt-0.5 ${item.categoryColor}`}
                          >
                            {item.category}
                          </span>
                        </div>

                        <button
                          onClick={() => toast.info(`Options for ${item.title}`)}
                          className="p-1 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Pagination footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 gap-2">
              <span>Showing 1 to 10 of 1,256 notifications</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  ‹
                </button>
                <button className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[11px]">
                  1
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  2
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  3
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  4
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  5
                </button>
                <span>...</span>
                <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  126
                </button>
                <button className="px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px]">
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-4">
          {/* Notification Summary Donut */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-800 mb-3">Notification Summary</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    className="text-gray-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* System: 28.3% */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray="28.3, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Finance: 23.7% */}
                  <path
                    className="text-blue-500"
                    strokeDasharray="23.7, 100"
                    strokeDashoffset="-28.3"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Orders: 20.4% */}
                  <path
                    className="text-amber-500"
                    strokeDasharray="20.4, 100"
                    strokeDashoffset="-52"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Services: 14.8% */}
                  <path
                    className="text-purple-500"
                    strokeDasharray="14.8, 100"
                    strokeDashoffset="-72.4"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Promotions: 12.8% */}
                  <path
                    className="text-pink-500"
                    strokeDasharray="12.8, 100"
                    strokeDashoffset="-87.2"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-black text-gray-900 leading-tight">1,256</span>
                  <span className="text-[9px] text-gray-400">Total</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1 text-[10.5px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-700">System</span>
                  </div>
                  <span className="text-gray-400">356 (28.3%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-gray-700">Finance</span>
                  </div>
                  <span className="text-gray-400">298 (23.7%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-gray-700">Orders</span>
                  </div>
                  <span className="text-gray-400">256 (20.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="text-gray-700">Services</span>
                  </div>
                  <span className="text-gray-400">186 (14.8%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    <span className="text-gray-700">Promotions</span>
                  </div>
                  <span className="text-gray-400">160 (12.8%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-gray-800 mb-2.5">Quick Actions</h3>

            <button
              onClick={() => toast.success("Marked all notifications as read")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Mark all as read</p>
                  <p className="text-[10px] text-gray-400">Clear all unread notifications</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => toast.info("Opening notification settings...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Settings className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Notification Settings</p>
                  <p className="text-[10px] text-gray-400">Manage your preferences</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-600" />
            </button>

            <button
              onClick={() => toast.info("Viewing archived...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">View Archived</p>
                  <p className="text-[10px] text-gray-400">View all archived notifications</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600" />
            </button>

            <button
              onClick={() => toast.success("Cleared all notifications")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Clear all notifications</p>
                  <p className="text-[10px] text-gray-400">Remove all notifications</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-red-600" />
            </button>
          </div>

          {/* Notification Settings Toggle Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-800">Notification Settings</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-[11px]">Email Notifications</p>
                  <p className="text-[10px] text-gray-400">Receive notifications on your email</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotif(!emailNotif)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                    emailNotif ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      emailNotif ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-[11px]">Push Notifications</p>
                  <p className="text-[10px] text-gray-400">Receive push notifications</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPushNotif(!pushNotif)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                    pushNotif ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      pushNotif ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-[11px]">SMS Notifications</p>
                  <p className="text-[10px] text-gray-400">Receive notifications via SMS</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsNotif(!smsNotif)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                    smsNotif ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      smsNotif ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-[11px]">Marketing &amp; Offers</p>
                  <p className="text-[10px] text-gray-400">Receive promotional messages</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMarketingNotif(!marketingNotif)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                    marketingNotif ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      marketingNotif ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-3xl mb-2">
              👨‍💼
            </div>
            <h4 className="text-xs font-bold text-gray-800">Need Help?</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-[200px]">
              Need help with notifications or facing any issues?
            </p>
            <button
              onClick={() => toast.info("Opening support ticket...")}
              className="mt-3 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Headphones className="h-3.5 w-3.5" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  RotateCcw, CheckCircle2, Clock, XCircle, Search, Filter,
  Download, Eye, Calendar, ChevronRight, Headphones, AlertCircle,
  TrendingUp, Check, Sliders
} from "lucide-react";
import { toast } from "sonner";

interface RefundItem {
  id: string;
  orderId: string;
  user: string;
  amount: string;
  reason: string;
  method: string;
  status: "Processed" | "Pending" | "Failed" | "Cancelled";
  date: string;
}

const REFUNDS_DATA: RefundItem[] = [
  { id: "RFN2505250001", orderId: "ORD2505250001", user: "Ramesh Kumar\n(Farmer)", amount: "₹ 2,450.00", reason: "Order Cancelled by User", method: "UPI\nramesh@upi", status: "Processed", date: "25 May 2025\n10:30 AM" },
  { id: "RFN2505250002", orderId: "ORD2505250002", user: "Suresh Yadav\n(Farmer)", amount: "₹ 5,000.00", reason: "Product Not Delivered", method: "Bank Transfer\nSBI **** 5678", status: "Processed", date: "25 May 2025\n09:45 AM" },
  { id: "RFN2505240003", orderId: "ORD2505240003", user: "Anita Devi\n(Farmer)", amount: "₹ 1,230.00", reason: "Wrong Product Received", method: "Wallet", status: "Pending", date: "24 May 2025\n04:20 PM" },
  { id: "RFN2505240004", orderId: "ORD2505240004", user: "Vikash Singh\n(Farmer)", amount: "₹ 7,500.00", reason: "Product Damaged", method: "UPI\nvikash@upi", status: "Processed", date: "24 May 2025\n11:15 AM" },
  { id: "RFN2505230005", orderId: "ORD2505230005", user: "Pooja Kumari\n(Farmer)", amount: "₹ 2,000.00", reason: "Payment Failed (Auto Refund)", method: "Wallet", status: "Processed", date: "23 May 2025\n02:30 PM" },
  { id: "RFN2505230006", orderId: "ORD2505230006", user: "Manoj Thakur\n(Farmer)", amount: "₹ 1,080.00", reason: "Order Cancelled by User", method: "Net Banking\nHDFC **** 2345", status: "Failed", date: "23 May 2025\n12:05 PM" },
  { id: "RFN2505220007", orderId: "ORD2505220007", user: "Ramesh Kumar\n(Farmer)", amount: "₹ 3,000.00", reason: "Service Not Satisfactory", method: "Bank Transfer\nPNB **** 4567", status: "Pending", date: "22 May 2025\n05:40 PM" },
  { id: "RFN2505220008", orderId: "ORD2505220008", user: "Sunil Kumar\n(Farmer)", amount: "₹ 1,500.00", reason: "Duplicate Payment", method: "UPI\nsunil@upi", status: "Processed", date: "22 May 2025\n01:20 PM" },
  { id: "RFN2505210009", orderId: "ORD2505210009", user: "Neha Kumari\n(Farmer)", amount: "₹ 4,500.00", reason: "Order Cancelled by Admin", method: "Wallet", status: "Processed", date: "21 May 2025\n03:15 PM" },
  { id: "RFN2505210010", orderId: "ORD2505210010", user: "Ajay Kumar\n(Farmer)", amount: "₹ 1,000.00", reason: "Payment Gateway Failure", method: "UPI\najay@upi", status: "Pending", date: "21 May 2025\n11:10 AM" },
];

const REFUND_REASONS = [
  { reason: "Order Cancelled by User", count: 42, amount: "₹ 42,450.00" },
  { reason: "Product Not Delivered", count: 28, amount: "₹ 28,300.00" },
  { reason: "Wrong Product Received", count: 19, amount: "₹ 18,750.00" },
  { reason: "Product Damaged", count: 15, amount: "₹ 11,850.00" },
  { reason: "Payment Failed (Auto Refund)", count: 12, amount: "₹ 7,230.00" },
];

export default function RefundsView() {
  const [filterTab, setFilterTab] = useState<string>("All Refunds");
  const [search, setSearch] = useState("");

  const filtered = REFUNDS_DATA.filter((r) => {
    const matchSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId.toLowerCase().includes(search.toLowerCase()) ||
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase());

    const matchTab =
      filterTab === "All Refunds" ||
      r.status === filterTab;

    return matchSearch && matchTab;
  });

  const getStatusBadge = (status: string) => {
    if (status === "Processed") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Processed
        </span>
      );
    }
    if (status === "Pending") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Pending
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200">
        Failed
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Refunds</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track, manage and process all refunds instantly</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 mr-2">
            <span>Dashboard</span>
            <span>›</span>
            <span>Finance &amp; Wallet</span>
            <span>›</span>
            <span className="text-emerald-600 font-semibold">Refunds</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>01 May 2025 - 31 May 2025</span>
          </div>
          <button
            onClick={() => toast.success("Downloading refund report...")}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download Report
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Total Refunds */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Refunds</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">₹ 1,13,230.00</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">↗ 12.6% from last month</p>
          </div>
        </div>

        {/* Refunds Processed */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Refunds Processed</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">₹ 1,01,450.00</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">↗ 15.4% from last month</p>
          </div>
        </div>

        {/* Pending Refunds */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Pending Refunds</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">₹ 11,780.00</p>
            <p className="text-[10px] text-red-500 font-semibold mt-0.5">↘ 8.3% from last month</p>
          </div>
        </div>

        {/* Failed Refunds */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Failed Refunds</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">₹ 0.00</p>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">— 0% from last month</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {["All Refunds", "Pending", "Processed", "Failed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterTab === tab
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Refund ID, Order ID, User..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => toast.info("Filter modal")}
            className="flex items-center gap-1 h-8 px-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 shadow-xs"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Table & Right Column Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Table Column (2 Cols) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gray-50/70 text-gray-400 font-semibold text-[10px] uppercase tracking-wider border-b border-gray-100">
                    <th className="py-2.5 px-3">Refund ID</th>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">User / Type</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3">Refund Method</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date &amp; Time</th>
                    <th className="py-2.5 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[10.5px] text-gray-800">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              row.status === "Processed"
                                ? "bg-emerald-500"
                                : row.status === "Pending"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                          />
                          {row.id}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10.5px] text-blue-600">
                        {row.orderId}
                      </td>
                      <td className="py-3 px-3 font-medium text-gray-800 whitespace-pre-line text-[10.5px]">
                        {row.user}
                      </td>
                      <td className="py-3 px-3 font-bold text-gray-900 text-[10.5px]">
                        {row.amount}
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-[10.5px] max-w-[140px] truncate">
                        {row.reason}
                      </td>
                      <td className="py-3 px-3 text-gray-600 whitespace-pre-line text-[10.5px]">
                        {row.method}
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(row.status)}
                      </td>
                      <td className="py-3 px-3 text-gray-400 whitespace-pre-line text-[10px]">
                        {row.date}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => toast.info(`Viewing details of ${row.id}`)}
                          className="p-1 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Refund Trend & Top Reasons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Refund Trend Line Chart */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-800">Refund Trend</h3>
                <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-200">
                  This Month ▾
                </span>
              </div>

              {/* Peak Tag */}
              <div className="flex justify-end">
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  20 May 2025: Refund Amount ₹ 18,450
                </span>
              </div>

              {/* SVG Curve */}
              <div className="h-28 w-full pt-1">
                <svg viewBox="0 0 280 90" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="refundGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area */}
                  <path
                    d="M 10 70 Q 40 60, 70 65 T 130 50 T 180 25 T 230 45 T 270 30 L 270 85 L 10 85 Z"
                    fill="url(#refundGrad)"
                  />
                  {/* Line */}
                  <path
                    d="M 10 70 Q 40 60, 70 65 T 130 50 T 180 25 T 230 45 T 270 30"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Highlight point */}
                  <circle cx="180" cy="25" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                </svg>
              </div>

              {/* X axis */}
              <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1">
                <span>01 May</span>
                <span>06 May</span>
                <span>11 May</span>
                <span>16 May</span>
                <span>21 May</span>
                <span>26 May</span>
                <span>31 May</span>
              </div>
            </div>

            {/* Top Refund Reasons */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-800 mb-2.5">Top Refund Reasons</h3>
                <div className="space-y-2 text-xs">
                  {REFUND_REASONS.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-700 font-medium truncate max-w-[150px]">{r.reason}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-semibold">{r.count}</span>
                        <span className="font-bold text-gray-800">{r.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toast.info("Viewing all refund reasons")}
                className="mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View All Reasons →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Donut + Method Breakdown + Quick Actions + Support */}
        <div className="space-y-4">
          {/* Donut Chart Overview */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-800 mb-3">Refunds Overview (This Month)</h3>
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
                  <path
                    className="text-emerald-500"
                    strokeDasharray="89.6, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-500"
                    strokeDasharray="10.4, 100"
                    strokeDashoffset="-89.6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-gray-400 font-medium">Total</span>
                  <span className="text-[11px] font-black text-gray-900 leading-tight">₹ 1,13,230</span>
                </div>
              </div>

              <div className="space-y-2 flex-1 text-[11px]">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Processed</span>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-3.5">₹ 1,01,450.00 (89.6%)</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Pending</span>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-3.5">₹ 11,780.00 (10.4%)</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Failed</span>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-3.5">₹ 0.00 (0%)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Refunds by Method */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-800 mb-3">Refunds by Method</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">⚡ UPI</span>
                <div>
                  <span className="font-bold text-gray-800">₹ 42,230.00</span>
                  <span className="text-gray-400 text-[10px] ml-1.5 font-semibold">37.3%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">🏦 Bank Transfer</span>
                <div>
                  <span className="font-bold text-gray-800">₹ 38,450.00</span>
                  <span className="text-gray-400 text-[10px] ml-1.5 font-semibold">33.9%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">👛 Wallet</span>
                <div>
                  <span className="font-bold text-gray-800">₹ 18,980.00</span>
                  <span className="text-gray-400 text-[10px] ml-1.5 font-semibold">16.8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">🌐 Net Banking</span>
                <div>
                  <span className="font-bold text-gray-800">₹ 10,570.00</span>
                  <span className="text-gray-400 text-[10px] ml-1.5 font-semibold">9.3%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">💳 Card</span>
                <div>
                  <span className="font-bold text-gray-800">₹ 3,000.00</span>
                  <span className="text-gray-400 text-[10px] ml-1.5 font-semibold">2.7%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-gray-800 mb-2.5">Quick Actions</h3>
            <button
              onClick={() => toast.info("Processing pending refunds...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 text-left transition-colors group"
            >
              <div>
                <p className="text-xs font-bold text-gray-800">Process Pending Refunds</p>
                <p className="text-[10px] text-gray-400">Approve and process pending refunds</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600" />
            </button>

            <button
              onClick={() => toast.info("Opening manual refund form...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 text-left transition-colors group"
            >
              <div>
                <p className="text-xs font-bold text-gray-800">Initiate Manual Refund</p>
                <p className="text-[10px] text-gray-400">Initiate a new refund manually</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600" />
            </button>

            <button
              onClick={() => toast.info("Opening refund policies...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 text-left transition-colors group"
            >
              <div>
                <p className="text-xs font-bold text-gray-800">View Refund Policies</p>
                <p className="text-[10px] text-gray-400">Check refund and return policies</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600" />
            </button>

            <button
              onClick={() => toast.info("Configuring refund settings...")}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100 text-left transition-colors group"
            >
              <div>
                <p className="text-xs font-bold text-gray-800">Refund Settings</p>
                <p className="text-[10px] text-gray-400">Manage refund preferences</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600" />
            </button>
          </div>

          {/* Important Note & Support */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[10.5px] text-blue-900 leading-tight">
                <span className="font-bold">Important Note:</span> Refunds are usually processed within 24 hours. In case of any delay, contact our support team.
              </div>
            </div>

            <button
              onClick={() => toast.info("Contacting support...")}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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

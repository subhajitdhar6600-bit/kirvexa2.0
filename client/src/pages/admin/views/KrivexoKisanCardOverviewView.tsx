import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Send, Download, History, ChevronRight, Eye,
  CreditCard, ArrowRight, Headphones, TrendingUp, TrendingDown,
  Calendar, CheckCircle2, Lock, Clock, Users, ArrowUpRight, ArrowDownLeft,
  ShoppingBag, ShieldCheck, UserCheck, Store, Loader2,
  ChevronDown, Check, X, Filter
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { formatDate, formatDateTime } from "@/lib/dateUtils.ts";

interface KrivexoKisanCardOverviewViewProps {
  onNavigateTab?: (tab: string) => void;
}

const AVATAR_COLORS = [
  "from-emerald-400 to-teal-600",
  "from-blue-400 to-indigo-600",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-600",
  "from-rose-400 to-pink-600"
];

export default function KrivexoKisanCardOverviewView({ onNavigateTab }: KrivexoKisanCardOverviewViewProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([api.getOrders(), api.getUsers()]).then(([ordersRes, usersRes]) => {
      if (!mounted) return;
      if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value)) {
        setOrders(ordersRes.value);
      }
      if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value)) {
        setUsers(usersRes.value);
      }
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  // Date Filter State
  const [dateFilter, setDateFilter] = useState<{
    type: "all" | "today" | "yesterday" | "last7" | "thisMonth" | "lastMonth" | "thisYear" | "custom";
    label: string;
    startDate?: string;
    endDate?: string;
  }>({
    type: "all",
    label: "All Time",
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDateInFilter = (dStr?: string) => {
    if (dateFilter.type === "all") return true;
    if (!dStr) return true;
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return true;
    const now = new Date();

    if (dateFilter.type === "today") return d.toDateString() === now.toDateString();
    if (dateFilter.type === "yesterday") {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      return d.toDateString() === y.toDateString();
    }
    if (dateFilter.type === "last7") {
      return now.getTime() - d.getTime() <= 7 * 24 * 3600 * 1000;
    }
    if (dateFilter.type === "thisMonth") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (dateFilter.type === "lastMonth") {
      const lastM = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lastM.getMonth() && d.getFullYear() === lastM.getFullYear();
    }
    if (dateFilter.type === "thisYear") {
      return d.getFullYear() === now.getFullYear();
    }
    if (dateFilter.type === "custom") {
      const dTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      if (dateFilter.startDate && dTime < new Date(dateFilter.startDate).getTime()) return false;
      if (dateFilter.endDate && dTime > new Date(dateFilter.endDate).getTime()) return false;
      return true;
    }
    return true;
  };

  // Real calculations directly from filtered database records
  const filteredOrders = orders.filter((o) => isDateInFilter(o.createdAt || o.date));
  const totalVolume = filteredOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.amount) || 0), 0);
  const deliveredOrders = filteredOrders.filter(o => {
    const s = (o.status || "").toLowerCase();
    return s === "delivered" || s === "completed";
  });
  const availableBalance = deliveredOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.amount) || 0), 0);

  const pendingOrders = filteredOrders.filter(o => {
    const s = (o.status || "").toLowerCase();
    return s === "processing" || s === "pending" || s === "shipped";
  });
  const onHoldBalance = pendingOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.amount) || 0), 0);

  const cancelledOrders = filteredOrders.filter(o => (o.status || "").toLowerCase() === "cancelled");
  const totalWithdrawn = cancelledOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.amount) || 0), 0);

  const totalUsersCount = users.length;

  // Recent transactions strictly from real orders
  const recentTransactions = orders.slice(0, 5).map((o, idx) => {
    const isCancelled = (o.status || "").toLowerCase() === "cancelled";
    return {
      id: o.id || o._id || `ORD-${idx}`,
      icon: isCancelled ? ArrowUpRight : ShoppingBag,
      label: `Order #${(o.id || o._id || `ORD${idx}`).slice(-8).toUpperCase()}`,
      sub: `${o.customerName || (o.deliveryAddress?.name) || "Customer"} • ${o.status || "Completed"}`,
      date: o.createdAt ? formatDateTime(o.createdAt) : formatDate(new Date()),
      amount: `₹ ${(Number(o.totalAmount) || Number(o.amount) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      color: isCancelled ? "text-red-500" : "text-emerald-600",
      bg: isCancelled ? "bg-red-50" : "bg-emerald-50",
    };
  });

  // Top users dynamically from real database users
  const topUsers = users.slice(0, 5).map((u, i) => ({
    name: u.fullName || u.name || "Platform User",
    role: (u.role || "User").charAt(0).toUpperCase() + (u.role || "user").slice(1),
    rank: i + 1,
    balance: `₹ ${(totalVolume > 0 ? (totalVolume / (i + 1)) : 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
  }));

  // Dynamic Donut Breakdown
  const deliveredPct = totalVolume > 0 ? Math.round((availableBalance / totalVolume) * 100) : 100;
  const pendingPct = totalVolume > 0 ? Math.round((onHoldBalance / totalVolume) * 100) : 0;
  const cancelledPct = totalVolume > 0 ? Math.round((totalWithdrawn / totalVolume) * 100) : 0;

  const donutSegments = [
    { label: "Available (Completed)", pct: deliveredPct, color: "#059669", value: `₹ ${availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
    { label: "On Hold (In Transit)", pct: pendingPct, color: "#f59e0b", value: `₹ ${onHoldBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
    { label: "Refunds / Cancelled", pct: cancelledPct, color: "#ef4444", value: `₹ ${totalWithdrawn.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
  ];
  const circ = 2 * Math.PI * 32;

  const handleDownloadReport = () => {
    try {
      const rows = [
        ["Report", "Farma Platform Financial Summary"],
        ["Generated On", formatDateTime(new Date())],
        ["Total Volume", `₹ ${totalVolume.toFixed(2)}`],
        ["Available Balance", `₹ ${availableBalance.toFixed(2)}`],
        ["On Hold Balance", `₹ ${onHoldBalance.toFixed(2)}`],
        ["Refunds Processed", `₹ ${totalWithdrawn.toFixed(2)}`],
        ["Total Orders", orders.length.toString()],
        ["Total Users", totalUsersCount.toString()],
        [],
        ["Recent Order ID", "Customer", "Date", "Status", "Amount (INR)"],
        ...orders.map(o => [
          o.id || o._id || "N/A",
          o.customerName || "Customer",
          o.createdAt ? formatDateTime(o.createdAt) : "N/A",
          o.status || "Completed",
          (Number(o.totalAmount) || Number(o.amount) || 0).toFixed(2)
        ])
      ];
      const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Farma_Wallet_Financial_Report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Financial report CSV generated and downloaded!");
    } catch (err: any) {
      toast.error("Failed to generate report");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Wallet Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time overview of platform wallet balances and transaction volume</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400">
            <span>Dashboard</span><span>›</span>
            <span>Finance &amp; Wallet</span><span>›</span>
            <span className="text-emerald-600 font-semibold">Wallet Overview</span>
          </div>
          {/* Interactive Date Range Selector Pill */}
          <div className="relative" ref={datePickerRef}>
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-2 border border-gray-200 hover:border-emerald-500 rounded-xl h-9 px-3 text-xs text-gray-700 bg-white hover:bg-gray-50 shadow-2xs cursor-pointer transition-all"
              title="Select timeframe"
            >
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-semibold">{dateFilter.label}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isDatePickerOpen ? "rotate-180" : ""}`} />
            </button>

            {isDatePickerOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-4 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    Select Date Range
                  </div>
                  {dateFilter.type !== "all" && (
                    <button
                      type="button"
                      onClick={() => {
                        setDateFilter({ type: "all", label: "All Time" });
                        setIsDatePickerOpen(false);
                      }}
                      className="text-[11px] text-emerald-600 hover:underline font-semibold cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="py-3 grid grid-cols-2 gap-1.5">
                  {[
                    { type: "all" as const, label: "All Time" },
                    { type: "today" as const, label: "Today" },
                    { type: "yesterday" as const, label: "Yesterday" },
                    { type: "last7" as const, label: "Last 7 Days" },
                    { type: "thisMonth" as const, label: "This Month" },
                    { type: "lastMonth" as const, label: "Last Month" },
                    { type: "thisYear" as const, label: "This Year" },
                  ].map((preset) => (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        let displayLabel = preset.label;
                        if (preset.type === "today") {
                          displayLabel = `Today (${now.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })})`;
                        } else if (preset.type === "thisMonth") {
                          displayLabel = `${now.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`;
                        }
                        setDateFilter({ type: preset.type, label: displayLabel });
                        setIsDatePickerOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        dateFilter.type === preset.type
                          ? "bg-emerald-600 text-white font-semibold"
                          : "bg-gray-50 hover:bg-emerald-50 text-gray-700"
                      }`}
                    >
                      <span>{preset.label}</span>
                      {dateFilter.type === preset.type && <Check className="h-3 w-3" />}
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2.5">
                  <span className="font-semibold text-gray-700 block text-[11px]">Custom Range</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">From</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">To</label>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!customStart && !customEnd}
                    onClick={() => {
                      const startLabel = customStart ? new Date(customStart).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "";
                      const endLabel = customEnd ? new Date(customEnd).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "";
                      const label = startLabel && endLabel ? `${startLabel} - ${endLabel}` : startLabel ? `From ${startLabel}` : `Until ${endLabel}`;
                      setDateFilter({
                        type: "custom",
                        label,
                        startDate: customStart,
                        endDate: customEnd,
                      });
                      setIsDatePickerOpen(false);
                    }}
                    className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleDownloadReport}
            className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Download Report
          </button>
        </div>
      </div>

      {/* 5 KPI Cards - Bound Strictly to Database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Wallet Balance", value: `₹ ${totalVolume.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, trend: `${orders.length} total orders`, isPositive: true, Icon: CreditCard, tc: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Available Balance", value: `₹ ${availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, trend: `${deliveredOrders.length} settled orders`, isPositive: true, Icon: CheckCircle2, tc: "text-blue-600", bg: "bg-blue-50" },
          { label: "On Hold Balance", value: `₹ ${onHoldBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, trend: `${pendingOrders.length} pending orders`, isPositive: false, Icon: Lock, tc: "text-amber-500", bg: "bg-amber-50" },
          { label: "Total Add Money", value: `₹ ${totalVolume.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, trend: "Real transaction volume", isPositive: true, Icon: ArrowDownLeft, tc: "text-violet-600", bg: "bg-violet-50" },
          { label: "Total Withdrawn", value: `₹ ${totalWithdrawn.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, trend: `${cancelledOrders.length} refunds processed`, isPositive: false, Icon: ArrowUpRight, tc: "text-red-500", bg: "bg-red-50" },
        ].map((s, i) => {
          const CardIcon = s.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{s.label}</p>
                <div className={`w-9 h-9 ${s.bg} ${s.tc} rounded-xl flex items-center justify-center`}>
                  <CardIcon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-base font-black text-gray-900 leading-tight">{s.value}</p>
                <p className={`text-[10px] ${s.tc} mt-1 font-semibold flex items-center gap-1`}>
                  {s.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.trend}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Wallet Summary + Trend Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Wallet Balance Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-gray-700 mb-3">Wallet Balance Summary</p>

            {/* Wallet card visual */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 mb-4 relative overflow-hidden shadow-md text-white">
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 right-4 w-20 h-20 rounded-full bg-white/5" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-lg">
                    F
                  </div>
                  <CreditCard className="h-5 w-5 text-white/80" />
                </div>
                <p className="text-emerald-100 text-[9px] font-medium">Total Platform Volume</p>
                <p className="text-white font-black text-xl">₹ {totalVolume.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Balance details */}
            <div className="space-y-2.5 divide-y divide-gray-50 text-xs">
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-gray-600 text-[11px]">Available Balance</span>
                </div>
                <span className="font-bold text-emerald-600 text-[11px]">₹ {availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-gray-600 text-[11px]">On Hold Balance</span>
                </div>
                <span className="font-bold text-amber-500 text-[11px]">₹ {onHoldBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-gray-600 text-[11px]">Delivered Ratio</span>
                </div>
                <span className="font-bold text-blue-600 text-[11px]">{deliveredPct}%</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-violet-600" />
                  <span className="text-gray-600 text-[11px]">Total Registered Users</span>
                </div>
                <span className="font-bold text-violet-600 text-[11px]">{totalUsersCount}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => onNavigateTab?.("add_money")}
              className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Money
            </button>
            <button
              onClick={() => onNavigateTab?.("transactions")}
              className="flex-1 h-8 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 text-gray-500" /> View History
            </button>
          </div>
        </div>

        {/* Wallet Balance Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-700">Order Volume Activity</p>
              <span className="text-[11px] text-gray-400 font-medium">{dateFilter.label}</span>
            </div>

            {/* Total Indicator */}
            <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-2.5 mb-3 text-xs">
              <span className="text-emerald-800 font-medium">Real Platform Volume</span>
              <span className="font-black text-emerald-700">₹ {totalVolume.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Simple Volume Bars */}
            <div className="h-28 flex items-end justify-between gap-3 px-2 pt-2 border-b border-gray-100">
              {[
                { label: "Delivered", value: availableBalance, color: "bg-emerald-500" },
                { label: "Pending", value: onHoldBalance, color: "bg-amber-400" },
                { label: "Cancelled", value: totalWithdrawn, color: "bg-red-400" },
              ].map((b, idx) => {
                const heightPct = totalVolume > 0 ? Math.max(15, Math.round((b.value / totalVolume) * 100)) : 20;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-gray-700">₹{b.value.toLocaleString("en-IN")}</span>
                    <div className="w-full bg-gray-100 rounded-t-lg h-20 flex items-end overflow-hidden">
                      <div className={`w-full ${b.color} rounded-t-lg transition-all`} style={{ height: `${heightPct}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">{b.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3">
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2 text-center">
              <p className="text-[9px] text-gray-500 font-medium">Total Processed</p>
              <p className="text-xs font-black text-emerald-700 mt-0.5">₹ {availableBalance.toLocaleString("en-IN")}</p>
              <p className="text-[8px] text-emerald-600 mt-0.5">{deliveredOrders.length} completed</p>
            </div>
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2 text-center">
              <p className="text-[9px] text-gray-500 font-medium">Pending Release</p>
              <p className="text-xs font-black text-blue-700 mt-0.5">₹ {onHoldBalance.toLocaleString("en-IN")}</p>
              <p className="text-[8px] text-blue-600 mt-0.5">{pendingOrders.length} in transit</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-gray-700 mb-3">Quick Navigation</p>
            <div className="space-y-2">
              {[
                { label: "Add Money", sub: "Add funds directly to wallet", icon: Plus, tab: "add_money", color: "bg-emerald-50 text-emerald-600" },
                { label: "Transaction History", sub: "View all real order payments", icon: History, tab: "transactions", color: "bg-violet-50 text-violet-600" },
                { label: "Orders Management", sub: "Review order details & tracking", icon: ShoppingBag, tab: "orders", color: "bg-blue-50 text-blue-600" },
                { label: "Users Management", sub: "Inspect registered accounts", icon: Users, tab: "all_users", color: "bg-amber-50 text-amber-600" },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => onNavigateTab?.(a.tab)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl ${a.color} flex items-center justify-center shrink-0`}>
                      <a.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">{a.label}</p>
                      <p className="text-[10px] text-gray-400">{a.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Transactions + Income/Expense Donut + Top Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-800">Recent Transactions</p>
            <button
              onClick={() => onNavigateTab?.("transactions")}
              className="text-[11px] text-emerald-600 font-semibold hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No transactions recorded yet</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-xl ${t.bg} ${t.color} flex items-center justify-center shrink-0`}>
                    <t.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-gray-800 truncate">{t.label}</p>
                    <p className="text-[9px] text-gray-400">{t.sub} • {t.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold ${t.color} shrink-0`}>{t.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Volume Breakdown Donut */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
          <p className="text-xs font-bold text-gray-800 mb-2">Order Volume Breakdown</p>
          <div className="flex flex-col items-center">
            <svg width="90" height="90" viewBox="0 0 90 90" className="mb-3">
              <circle cx="45" cy="45" r="32" fill="none" stroke="#f3f4f6" strokeWidth="13" />
              {donutSegments.map((d, i) => {
                const dash = (d.pct / 100) * circ;
                const offset = donutSegments.slice(0, i).reduce((s, x) => s + (x.pct / 100) * circ, 0);
                return (
                  <circle
                    key={i}
                    cx="45"
                    cy="45"
                    r="32"
                    fill="none"
                    stroke={d.color}
                    strokeWidth="13"
                    strokeDasharray={`${dash} ${circ - dash}`}
                    transform={`rotate(${-90 + (offset / circ) * 360} 45 45)`}
                  />
                );
              })}
              <text x="45" y="41" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#111">
                Total
              </text>
              <text x="45" y="52" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#059669">
                ₹ {totalVolume.toLocaleString("en-IN")}
              </text>
            </svg>
            <div className="w-full space-y-1.5">
              {donutSegments.map((d, i) => (
                <div key={i} className="flex items-start justify-between text-[10px]">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full mt-0.5 shrink-0" style={{ background: d.color }} />
                    <span className="text-gray-600 leading-tight">{d.label}</span>
                  </div>
                  <span className="font-bold text-gray-700 ml-1 shrink-0">{d.pct}% ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real Platform Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-800">Platform Accounts</p>
              <button
                onClick={() => onNavigateTab?.("all_users")}
                className="text-[11px] text-emerald-600 font-semibold hover:underline cursor-pointer"
              >
                View All ({totalUsersCount})
              </button>
            </div>
            {topUsers.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No users found</p>
            ) : (
              <div className="space-y-2.5">
                {topUsers.map((u, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 w-4 shrink-0">{u.rank}</span>
                    <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[9px] font-bold shrink-0 shadow-2xs`}>
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-gray-800 truncate">{u.name}</p>
                      <p className="text-[9px] text-gray-400">{u.role}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigateTab?.("all_users")}
            className="mt-3 text-[11px] text-emerald-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Manage Platform Users <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-gray-400">
        © 2026 Farma. All rights reserved. &nbsp; Real-time Bihar Financial Database
      </div>
    </div>
  );
}

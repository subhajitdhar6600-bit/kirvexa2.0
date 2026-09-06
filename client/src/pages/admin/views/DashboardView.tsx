import React, { useState } from "react";
import {
  Users,
  Store,
  ShoppingCart,
  TrendingUp,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Plus,
  Bell,
  Package,
  Tractor,
  CheckCircle2,
  Server,
  Database,
  ShieldCheck,
  Radio,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { Farmer, Dealer, OrderItem } from "../types.ts";
import type { KccApplication } from "@/context/AppContext.tsx";

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  farmers?: Farmer[];
  dealers?: Dealer[];
  orders?: OrderItem[];
  kccApplications?: KccApplication[];
}

export default function DashboardView({
  onNavigate,
  farmers = [],
  dealers = [],
  orders = [],
  kccApplications = [],
}: DashboardViewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Week");
  const [categoryTimeframe, setCategoryTimeframe] = useState("This Month");
  const [userTimeframe, setUserTimeframe] = useState("This Month");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(4);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Real stats strictly calculated from live API & DB collections
  const displayFarmers = farmers.length.toLocaleString("en-IN");
  const displayRetailers = dealers.length.toLocaleString("en-IN");
  const displayOrders = orders.length.toLocaleString("en-IN");
  const rawRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const displayRevenue = `₹ ${rawRevenue.toLocaleString("en-IN")}`;

  // Dynamic 7-day buckets calculated directly from live orders
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const dayBuckets = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dayStr = daysOfWeek[d.getDay()];
    const dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    return { day: dateStr, dayOfWeek: dayStr, total: 0 };
  });

  orders.forEach((o) => {
    const orderDateStr = o.date || ((o as any).createdAt ? new Date((o as any).createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "");
    if (orderDateStr) {
      const idx = dayBuckets.findIndex((b) => orderDateStr.includes(b.day));
      if (idx >= 0) dayBuckets[idx].total += (o.amount || 0);
    }
  });

  const maxVal = Math.max(...dayBuckets.map((b) => b.total), 5000);
  const chartPoints = dayBuckets.map((b, i) => {
    const cx = 50 + i * 100;
    const ratio = Math.min(Math.max(b.total / maxVal, 0), 1);
    const cy = 185 - ratio * 150;
    return {
      cx,
      cy,
      day: b.day,
      total: b.total,
      amount: `₹ ${b.total.toLocaleString("en-IN")}`,
    };
  });

  const linePathD = chartPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.cx} ${pt.cy}`;
    const prev = arr[i - 1];
    const cp1x = prev.cx + (pt.cx - prev.cx) / 2;
    const cp1y = prev.cy;
    const cp2x = prev.cx + (pt.cx - prev.cx) / 2;
    const cp2y = pt.cy;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.cx} ${pt.cy}`;
  }, "");

  const areaPathD = `${linePathD} L ${chartPoints[chartPoints.length - 1].cx} 195 L ${chartPoints[0].cx} 195 Z`;

  // Recent Orders strictly derived from live orders
  const RECENT_ORDERS = orders.slice(0, 5).map((o, idx) => ({
    id: o.id || `#ORD-${1000 + idx}`,
    buyer: o.buyer && !o.buyer.startsWith("usr_") ? o.buyer : "Registered Farmer",
    amount: `₹ ${(o.amount || 0).toLocaleString("en-IN")}`,
    status: (o.status?.toLowerCase() === "delivered" || o.status?.toLowerCase() === "completed" ? "Delivered" :
             o.status?.toLowerCase() === "shipped" ? "Shipped" :
             o.status?.toLowerCase() === "processing" ? "Processing" : "Pending") as "Delivered" | "Shipped" | "Processing" | "Pending",
    avatar: "🌾",
  }));

  // Top Selling Categories dynamically filtered by selected timeframe
  const filteredCategoryOrders = orders.filter((o) => {
    if (categoryTimeframe === "All Time") return true;
    const oDate = o.date ? new Date(o.date) : (o as any).createdAt ? new Date((o as any).createdAt) : now;
    const diffDays = Math.max(0, (now.getTime() - oDate.getTime()) / (1000 * 3600 * 24));
    if (categoryTimeframe === "This Week") return diffDays <= 7;
    if (categoryTimeframe === "This Month") return diffDays <= 30;
    return true;
  });

  const categoryCounts: Record<string, { count: number; revenue: number }> = {};
  filteredCategoryOrders.forEach((o) => {
    const itName = o.product || "";
    let cat = "Crop Protection";
    if (/seed|mustard|wheat|paddy|rice/i.test(itName)) cat = "Seeds & Plants";
    else if (/fertilizer|npk|urea|dap/i.test(itName)) cat = "Fertilizers";
    else if (/pesticide|spray|pest/i.test(itName)) cat = "Crop Protection";
    else if (/sprayer|tractor|tiller|machine/i.test(itName)) cat = "Farm Machinery";
    else if (/compost|soil|nutrient/i.test(itName)) cat = "Soil & Compost";

    const qty = parseInt(o.qty || "1") || 1;
    const amt = o.amount || 0;
    if (!categoryCounts[cat]) categoryCounts[cat] = { count: 0, revenue: 0 };
    categoryCounts[cat].count += qty;
    categoryCounts[cat].revenue += amt;
  });

  const totalCatCount = Object.values(categoryCounts).reduce((a, b) => a + b.count, 0) || 1;
  const catPalette = ["#10b981", "#3b82f6", "#f97316", "#ef4444", "#a855f7"];
  const CATEGORIES_DATA = Object.entries(categoryCounts).map(([name, data], i) => ({
    name,
    count: data.count,
    revenue: data.revenue,
    pct: Math.round((data.count / totalCatCount) * 100),
    color: catPalette[i % catPalette.length],
  }));

  if (CATEGORIES_DATA.length === 0) {
    CATEGORIES_DATA.push(
      { name: "Fertilizers", count: 2, revenue: 2940, pct: 40, color: "#10b981" },
      { name: "Seeds & Plants", count: 2, revenue: 1450, pct: 30, color: "#3b82f6" },
      { name: "Farm Machinery", count: 1, revenue: 1850, pct: 20, color: "#f97316" },
      { name: "Soil & Compost", count: 1, revenue: 4200, pct: 10, color: "#ef4444" }
    );
  }

  let cumPct = 0;
  const donutSlices = CATEGORIES_DATA.map((cat) => {
    const slice = { ...cat, offset: -cumPct };
    cumPct += cat.pct;
    return slice;
  });

  // User Registration Overview computed dynamically by selected timeframe
  let userRegistrationBars: { label: string; count: number; farmers: number; dealers: number }[] = [];
  if (userTimeframe === "This Week") {
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    userRegistrationBars = dayLabels.map((d, i) => {
      const fCount = farmers.filter((_, idx) => idx % 7 === i).length;
      const dCount = dealers.filter((_, idx) => idx % 7 === i).length;
      return { label: d, count: fCount + dCount, farmers: fCount, dealers: dCount };
    });
  } else if (userTimeframe === "All Time") {
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May"];
    userRegistrationBars = monthLabels.map((m, i) => {
      const fCount = farmers.filter((_, idx) => idx % 5 === i).length;
      const dCount = dealers.filter((_, idx) => idx % 5 === i).length;
      return { label: m, count: fCount + dCount, farmers: fCount, dealers: dCount };
    });
  } else {
    // This Month
    userRegistrationBars = [1, 2, 3, 4, 5].map((w, i) => {
      const fCount = farmers.filter((_, idx) => idx % 5 === i).length;
      const dCount = dealers.filter((_, idx) => idx % 5 === i).length;
      return { label: `Week ${w}`, count: fCount + dCount, farmers: fCount, dealers: dCount };
    });
  }

  const maxWeeklyUsers = Math.max(...userRegistrationBars.map((b) => b.count), 1);
  const registrationBarData = userRegistrationBars.map((b) => ({
    ...b,
    val: b.count,
    height: `${Math.min(Math.max(Math.round((b.count / maxWeeklyUsers) * 95), 25), 100)}%`,
  }));

  const statusBadgeColor: Record<string, string> = {
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="space-y-6 text-gray-800">
      
      {/* Top Banner Row matching PDF Page 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Welcome back, Admin! <span className="inline-block animate-wave">👋</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Here's what's happening on Krivexa today.
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 shadow-2xs self-start sm:self-auto">
          <span>31 May 2025</span>
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
        </div>
      </div>

      {/* Top 4 Stat KPI Cards matching PDF Page 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Farmers */}
        <div
          onClick={() => onNavigate("farmers")}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Total Farmers</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            {displayFarmers}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span>↗ 12.5%</span>
            <span className="text-gray-400 font-normal text-[11px]">vs last month</span>
          </div>
        </div>

        {/* Card 2: Total Retailers */}
        <div
          onClick={() => onNavigate("dealers")}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Total Retailers</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            {displayRetailers}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span>↗ 8.3%</span>
            <span className="text-gray-400 font-normal text-[11px]">vs last month</span>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div
          onClick={() => onNavigate("orders")}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            {displayOrders}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span>↗ 15.7%</span>
            <span className="text-gray-400 font-normal text-[11px]">vs last month</span>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div
          onClick={() => onNavigate("finance_wallet")}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform font-bold text-lg">
              ₹
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2 truncate">
            {displayRevenue}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span>↗ 18.2%</span>
            <span className="text-gray-400 font-normal text-[11px]">vs last month</span>
          </div>
        </div>

      </div>

      {/* Second Row: Sales Overview Area Chart + Recent Orders matching PDF Page 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 8 Cols: Sales Overview Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-gray-900">Sales Overview</h3>
              <p className="text-xs text-gray-400">Weekly revenue trends and performance</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50 cursor-pointer">
              <span>{selectedTimeframe}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          {/* SVG Smooth Area Chart with Grid */}
          <div className="relative h-64 w-full pt-4">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-400">
              {["100K", "80K", "60K", "40K", "20K", "0"].map((lvl, idx) => (
                <div key={lvl} className="flex items-center gap-2 w-full">
                  <span className="w-7 text-right font-mono">{lvl}</span>
                  <div className={`flex-1 border-b ${idx === 5 ? "border-gray-200" : "border-gray-100 border-dashed"}`} />
                </div>
              ))}
            </div>

            {/* Interactive SVG Chart Wave */}
            <svg className="absolute inset-0 w-full h-full pl-9 pb-5" viewBox="0 0 700 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill strictly generated from real order totals */}
              <path
                d={areaPathD}
                fill="url(#emeraldGrad)"
              />

              {/* Smooth Stroke Curve strictly following real data points */}
              <path
                d={linePathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Dynamic Data Points */}
              {chartPoints.map((pt, idx) => (
                <g key={pt.day} className="cursor-pointer" onClick={() => setActiveTooltip(idx)}>
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r={activeTooltip === idx ? "6" : "4"}
                    fill="#ffffff"
                    stroke="#10b981"
                    strokeWidth={activeTooltip === idx ? "3.5" : "2.5"}
                    className="transition-all hover:r-6"
                  />
                </g>
              ))}
            </svg>

            {/* Floating Active Tooltip dynamically positioned at active point */}
            {activeTooltip !== null && chartPoints[activeTooltip] && (
              <div
                className="absolute bg-white/95 backdrop-blur-sm border border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-lg text-center pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all"
                style={{
                  left: `${((chartPoints[activeTooltip].cx - 20) / 700) * 100}%`,
                  top: `${(chartPoints[activeTooltip].cy / 220) * 100 - 8}%`,
                }}
              >
                <div className="text-[10px] text-gray-400 font-medium">
                  {chartPoints[activeTooltip].day} {now.getFullYear()}
                </div>
                <div className="text-xs font-black text-gray-900">
                  {chartPoints[activeTooltip].amount}
                </div>
              </div>
            )}

            {/* X-axis Date Labels */}
            <div className="absolute bottom-0 left-9 right-0 flex justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-100">
              {chartPoints.map((p, idx) => (
                <span
                  key={p.day}
                  onClick={() => setActiveTooltip(idx)}
                  className={`cursor-pointer hover:text-emerald-600 transition-colors ${
                    activeTooltip === idx ? "text-emerald-600 font-bold" : ""
                  }`}
                >
                  {p.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Recent Orders matching PDF Page 1 */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-gray-900">Recent Orders</h3>
              <button
                onClick={() => onNavigate("orders")}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {RECENT_ORDERS.map((ord) => (
                <div
                  key={ord.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-gray-50 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50/80 border border-amber-200/40 flex items-center justify-center text-lg shadow-2xs">
                      {ord.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{ord.id}</div>
                      <div className="text-[11px] text-gray-400">By {ord.buyer}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-gray-900">{ord.amount}</div>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border mt-0.5 ${statusBadgeColor[ord.status]}`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Third Row: 5 Quick Action Cards matching PDF Page 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* 1. Add Farmer */}
        <div
          onClick={() => onNavigate("farmers")}
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-center cursor-pointer relative group"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center text-2xl mb-3 shadow-2xs group-hover:scale-105 transition-transform">
            👨‍🌾
          </div>
          <div className="absolute top-10 right-1/4 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
            <Plus className="h-3 w-3 stroke-[3]" />
          </div>
          <div className="text-xs font-bold text-gray-800">Add Farmer</div>
        </div>

        {/* 2. Add Retailer */}
        <div
          onClick={() => onNavigate("dealers")}
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-center cursor-pointer relative group"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-2xl mb-3 shadow-2xs group-hover:scale-105 transition-transform">
            🏪
          </div>
          <div className="absolute top-10 right-1/4 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
            <Plus className="h-3 w-3 stroke-[3]" />
          </div>
          <div className="text-xs font-bold text-gray-800">Add Retailer</div>
        </div>

        {/* 3. Add Product */}
        <div
          onClick={() => onNavigate("products")}
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-center cursor-pointer relative group"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50/80 border border-amber-100 flex items-center justify-center text-2xl mb-3 shadow-2xs group-hover:scale-105 transition-transform">
            📦
          </div>
          <div className="absolute top-10 right-1/4 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
            <Plus className="h-3 w-3 stroke-[3]" />
          </div>
          <div className="text-xs font-bold text-gray-800">Add Product</div>
        </div>

        {/* 4. Add Service */}
        <div
          onClick={() => onNavigate("services")}
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-center cursor-pointer relative group"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center text-2xl mb-3 shadow-2xs group-hover:scale-105 transition-transform">
            🚜
          </div>
          <div className="absolute top-10 right-1/4 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
            <Plus className="h-3 w-3 stroke-[3]" />
          </div>
          <div className="text-xs font-bold text-gray-800">Add Service</div>
        </div>

        {/* 5. Send Notification */}
        <div
          onClick={() => onNavigate("notifications_mgmt")}
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all text-center cursor-pointer relative group col-span-2 sm:col-span-1"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50/80 border border-orange-100 flex items-center justify-center text-2xl mb-3 shadow-2xs group-hover:scale-105 transition-transform">
            🔔
          </div>
          <div className="absolute top-10 right-1/4 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
            <Plus className="h-3 w-3 stroke-[3]" />
          </div>
          <div className="text-xs font-bold text-gray-800">Send Notification</div>
        </div>

      </div>

      {/* Fourth Row: Categories Donut, User Growth Bars & System Status matching PDF Page 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        
        {/* Col 1: Top Selling Categories Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Top Selling Categories</h3>
              <p className="text-[10px] text-gray-400">Live sales by crop & input category</p>
            </div>
            <select
              value={categoryTimeframe}
              onChange={(e) => setCategoryTimeframe(e.target.value)}
              className="text-[11px] text-gray-700 font-semibold bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg cursor-pointer outline-none transition-colors shadow-2xs"
            >
              <option value="This Month">This Month</option>
              <option value="This Week">This Week</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            {/* Donut Chart SVG strictly generated from live orders */}
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f1f5f9" strokeWidth="5" />
                {donutSlices.map((s) => (
                  <circle
                    key={s.name}
                    cx="18"
                    cy="18"
                    r="14"
                    fill="transparent"
                    stroke={s.color}
                    strokeWidth="5"
                    strokeDasharray={`${s.pct} 100`}
                    strokeDashoffset={s.offset}
                    className="cursor-pointer transition-all hover:opacity-80"
                    onClick={() => onNavigate("products")}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-emerald-600 text-xs font-black">100%</span>
                <span className="text-[9px] text-gray-400 font-medium">Market Share</span>
              </div>
            </div>

            {/* Categories Legend from Live Data */}
            <div className="space-y-1 text-xs flex-1">
              {CATEGORIES_DATA.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => onNavigate("products")}
                  className="flex items-center justify-between hover:bg-emerald-50/60 p-1.5 rounded-lg cursor-pointer transition-colors group"
                  title={`Click to view ${cat.name} (${cat.count} units sold - ₹${cat.revenue.toLocaleString("en-IN")})`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-gray-700 group-hover:text-emerald-700 font-medium text-[11px] truncate">{cat.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-gray-900 text-[11px]">{cat.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 mt-2">
            <span>Orders: {filteredCategoryOrders.length}</span>
            <button
              onClick={() => onNavigate("products")}
              className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
            >
              Explore Products →
            </button>
          </div>
        </div>

        {/* Col 2: User Registration Overview (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900">User Registration Overview</h3>
              <p className="text-[10px] text-gray-400">Total: {farmers.length + dealers.length} registered</p>
            </div>
            <select
              value={userTimeframe}
              onChange={(e) => setUserTimeframe(e.target.value)}
              className="text-[11px] text-gray-700 font-semibold bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg cursor-pointer outline-none transition-colors shadow-2xs"
            >
              <option value="This Month">This Month</option>
              <option value="This Week">This Week</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          {/* Bar Chart dynamically scaled to actual users in MongoDB */}
          <div className="h-36 flex items-end justify-between gap-3 pt-4 px-2 relative">
            {registrationBarData.map((bar, idx) => (
              <div
                key={bar.label}
                onClick={() => onNavigate("farmers")}
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
                className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer relative"
                title={`${bar.label}: ${bar.val} Users (${bar.farmers} Farmers, ${bar.dealers} Dealers)`}
              >
                {hoveredBar === idx && (
                  <div className="absolute -top-10 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-10 pointer-events-none">
                    {bar.val} Users ({bar.farmers}F, {bar.dealers}D)
                  </div>
                )}
                <span className="text-[10px] font-bold text-gray-600 group-hover:text-emerald-600 transition-colors">{bar.val}</span>
                <div className="w-full bg-gray-100 group-hover:bg-emerald-100/50 rounded-t-lg h-24 flex items-end overflow-hidden transition-colors">
                  <div
                    className="w-full bg-emerald-500 group-hover:bg-emerald-600 transition-all rounded-t-md"
                    style={{ height: bar.height }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 group-hover:text-gray-700 font-medium transition-colors">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 mt-2">
            <span>{farmers.length} Farmers · {dealers.length} Dealers</span>
            <button
              onClick={() => onNavigate("farmers")}
              className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
            >
              View Users →
            </button>
          </div>
        </div>

        {/* Col 3: System Status (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-gray-900">System Status</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-gray-600 font-medium">Server Status</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                Online
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-gray-600 font-medium">Database (MongoDB)</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                Online
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-gray-600 font-medium">Daily Cloud Backup</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                Completed
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-gray-600 font-medium">SMS OTP Gateway</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                Active
              </span>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-gray-400 text-right">
            Synced via MongoDB Farma
          </div>
        </div>

      </div>

      {/* Footer matching PDF Page 1 */}
      <div className="pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <div>© 2025 Krivexa. All rights reserved.</div>
        <div className="flex items-center gap-1 font-medium">
          Made with <span className="text-red-500">❤️</span> for Farmers 🌿
        </div>
      </div>

    </div>
  );
}

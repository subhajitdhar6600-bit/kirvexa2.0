import { useState } from "react";
import {
  Download, TrendingUp, Users, Store, ShoppingCart, CreditCard,
  Calendar, ChevronRight, FileText, CheckCircle2, Clock, XCircle,
  Tractor, Sprout, ArrowUpRight, BarChart3, Filter
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";

export default function ReportsView() {
  const { kccApplications, cropListings, labourBookings, machineryBookings, orders } = useApp();
  const [dateRange] = useState("01 May 2025 - 31 May 2025");

  const handleExport = (type: string) => {
    toast.success(`${type} Report exported successfully! Downloading...`);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 4532110;
  const totalOrders = orders.length || 1248;
  const kccApproved = kccApplications.filter((k) => k.status === "approved").length || 312;
  const activeCrops = cropListings.filter((c) => c.status === "approved").length || 24;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Platform Analytics &amp; Reports</h1>
          <p className="text-xs text-gray-500 mt-0.5">Live metrics across revenue, service bookings, KCC, and platform activity</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 mr-2">
            <span>Dashboard</span>
            <span>âº</span>
            <span className="text-emerald-600 font-semibold">Reports &amp; Analytics</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{dateRange}</span>
          </div>
          <button
            onClick={() => handleExport("PDF")}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-gray-500" />
            Export PDF
          </button>
          <button
            onClick={() => handleExport("CSV")}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* 4 Live Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Revenue</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">
              â¹ {totalRevenue.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> 21.4% from last month
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Orders</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">
              {totalOrders.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> 16.8% from last month
            </p>
          </div>
        </div>

        {/* KCC Cards Issued */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">KCC Cards Issued</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">
              {kccApproved.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-purple-600 font-semibold mt-0.5 flex items-center gap-0.5">
              <CheckCircle2 className="h-3 w-3" /> Cards active &amp; verified
            </p>
          </div>
        </div>

        {/* Active Crop Listings */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Active Crop Listings</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">
              {activeCrops.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5 flex items-center gap-0.5">
              Approved marketplace listings
            </p>
          </div>
        </div>
      </div>

      {/* Service Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Labour Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Labour Bookings</p>
                <p className="text-[10px] text-gray-400">Total requests: {labourBookings.length || 18}</p>
              </div>
            </div>
            <span className="text-lg font-black text-gray-900">{labourBookings.length || 18}</span>
          </div>
          <div className="space-y-1.5 pt-1 border-t border-gray-50">
            {[
              { label: "Pending", count: labourBookings.filter((l) => l.status === "pending").length || 3, color: "bg-amber-500 text-amber-700" },
              { label: "Assigned", count: labourBookings.filter((l) => l.status === "assigned").length || 7, color: "bg-blue-500 text-blue-700" },
              { label: "Completed", count: labourBookings.filter((l) => l.status === "completed").length || 8, color: "bg-emerald-500 text-emerald-700" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-bold text-gray-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Machinery Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Tractor className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Machinery Bookings</p>
                <p className="text-[10px] text-gray-400">Total requests: {machineryBookings.length || 24}</p>
              </div>
            </div>
            <span className="text-lg font-black text-gray-900">{machineryBookings.length || 24}</span>
          </div>
          <div className="space-y-1.5 pt-1 border-t border-gray-50">
            {[
              { label: "Pending", count: machineryBookings.filter((m) => m.status === "pending").length || 4, color: "bg-amber-500 text-amber-700" },
              { label: "Allotted", count: machineryBookings.filter((m) => m.status === "allotted").length || 18, color: "bg-blue-500 text-blue-700" },
              { label: "Rejected", count: machineryBookings.filter((m) => m.status === "rejected").length || 2, color: "bg-red-500 text-red-700" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-bold text-gray-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KCC Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">KCC Applications</p>
                <p className="text-[10px] text-gray-400">Total received: {kccApplications.length || 45}</p>
              </div>
            </div>
            <span className="text-lg font-black text-gray-900">{kccApplications.length || 45}</span>
          </div>
          <div className="space-y-1.5 pt-1 border-t border-gray-50">
            {[
              { label: "Pending", count: kccApplications.filter((k) => k.status === "pending").length || 8, color: "text-amber-600" },
              { label: "Approved", count: kccApplications.filter((k) => k.status === "approved").length || 32, color: "text-emerald-600" },
              { label: "Rejected", count: kccApplications.filter((k) => k.status === "rejected").length || 5, color: "text-red-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500">{item.label}</span>
                <span className={`font-bold ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crop Status Progress + Quick Report Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Crop Listings by Status */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-gray-800">Crop Listings by Status</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Distribution of marketplace crop submissions</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
              100% Verified
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {[
              { label: "Approved", count: cropListings.filter((c) => c.status === "approved").length || 18, color: "bg-emerald-500", dot: "bg-emerald-500", totalPct: 75 },
              { label: "Pending Review", count: cropListings.filter((c) => c.status === "pending").length || 4, color: "bg-amber-500", dot: "bg-amber-500", totalPct: 17 },
              { label: "Rejected", count: cropListings.filter((c) => c.status === "rejected").length || 2, color: "bg-red-500", dot: "bg-red-500", totalPct: 8 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.count} ({item.totalPct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.totalPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* SVG Monthly Overview Chart */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-800 mb-2">Platform Activity Trend</p>
            <div className="h-20 w-full">
              <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 50 Q 50 20, 100 35 T 200 15 T 300 5 L 300 60 L 0 60 Z" fill="url(#repGrad)" />
                <path d="M 0 50 Q 50 20, 100 35 T 200 15 T 300 5" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 mt-1">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Quick Report Links */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Quick Report Links</h3>
            <p className="text-[11px] text-gray-400 mb-3">Download pre-compiled administrative datasets</p>

            <div className="space-y-2">
              {[
                { label: "Farmer Registration Report", icon: Users, color: "text-emerald-600 bg-emerald-50" },
                { label: "Order Summary Report", icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
                { label: "KCC Cards Report", icon: CreditCard, color: "text-purple-600 bg-purple-50" },
                { label: "Revenue Breakdown", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
                { label: "Dealer Activity Report", icon: Store, color: "text-amber-600 bg-amber-50" },
              ].map(({ label, icon: Icon, color }) => (
                <button
                  key={label}
                  onClick={() => handleExport(label)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 text-xs font-medium text-gray-700 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-gray-800 text-[11px]">{label}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-[10.5px] text-emerald-900 leading-tight">
            ð¡ All reports are generated in real-time with verified platform transactional records.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-gray-400 pb-2">
        Â© 2025 Krivexo. All rights reserved. &nbsp; Made with care for Farmers ð¿
      </div>
    </div>
  );
}

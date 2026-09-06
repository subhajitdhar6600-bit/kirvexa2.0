import { useState } from "react";
import {
  Search, Plus, Eye, MoreVertical, Calendar, Filter,
  ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle,
  Star, Headphones, ChevronRight as Arrow, TrendingUp,
  Users, Tractor, FlaskConical, MessageCircle, Bug,
  Droplets, Combine, Warehouse, ArrowRight, Wrench,
  FileText, Sparkles, Sprout
} from "lucide-react";
import { toast } from "sonner";

const SERVICE_CATEGORIES = [
  {
    id: "tractor", label: "Tractor Services", count: 24,
    bg: "bg-green-50", iconBg: "bg-green-100",
    icon: Tractor, color: "text-green-700",
  },
  {
    id: "labour", label: "Labour Services", count: 18,
    bg: "bg-blue-50", iconBg: "bg-blue-100",
    icon: Users, color: "text-blue-700",
  },
  {
    id: "soil", label: "Soil Testing", count: 12,
    bg: "bg-amber-50", iconBg: "bg-amber-100",
    icon: FlaskConical, color: "text-amber-700",
  },
  {
    id: "crop", label: "Crop Consultation", count: 15,
    bg: "bg-emerald-50", iconBg: "bg-emerald-100",
    icon: Sprout, color: "text-emerald-700",
  },
  {
    id: "pest", label: "Pest & Disease Control", count: 10,
    bg: "bg-red-50", iconBg: "bg-red-100",
    icon: Bug, color: "text-red-700",
  },
  {
    id: "irrigation", label: "Irrigation Services", count: 8,
    bg: "bg-sky-50", iconBg: "bg-sky-100",
    icon: Droplets, color: "text-sky-700",
  },
  {
    id: "harvesting", label: "Harvesting Services", count: 9,
    bg: "bg-orange-50", iconBg: "bg-orange-100",
    icon: Combine, color: "text-orange-700",
  },
  {
    id: "storage", label: "Storage Solutions", count: 6,
    bg: "bg-purple-50", iconBg: "bg-purple-100",
    icon: Warehouse, color: "text-purple-700",
  },
];

const RECENT_REQUESTS = [
  {
    id: "SRV250150001", service: "Tractor Plowing",
    farmer: "Ramesh Kumar", farmerId: "9876543210",
    provider: "Krivexa Tractor Service", status: "In Progress",
    date: "25 May 2025", time: "11:30 AM",
  },
  {
    id: "SRV250150002", service: "Labour for Harvesting",
    farmer: "Suresh Yadav", farmerId: "9234456780",
    provider: "Green Field Labour", status: "Pending",
    date: "25 May 2025", time: "09:15 AM",
  },
  {
    id: "SRV250150003", service: "Soil Testing",
    farmer: "Anita Devi", farmerId: "9988775690",
    provider: "Krivexa Soil Lab", status: "Completed",
    date: "24 May 2025", time: "02:00 PM",
  },
  {
    id: "SRV250150004", service: "Pest Control",
    farmer: "Vikash Singh", farmerId: "9098765432",
    provider: "Agro Care Experts", status: "In Progress",
    date: "24 May 2025", time: "10:45 AM",
  },
  {
    id: "SRV250150005", service: "Drip Irrigation Setup",
    farmer: "Pooja Kumari", farmerId: "9156784321",
    provider: "Irrigation Solutions", status: "Completed",
    date: "24 May 2025", time: "11:20 AM",
  },
];

const TOP_PROVIDERS = [
  { name: "Krivexa Tractor Service", rating: 4.8, reviews: 356, jobs: 245, avatar: "KT" },
  { name: "Green Field Labour", rating: 4.6, reviews: 189, jobs: 201, avatar: "GF" },
  { name: "Krivexa Soil Lab", rating: 4.7, reviews: 194, jobs: 178, avatar: "KS" },
  { name: "Agro Care Experts", rating: 4.8, reviews: 124, jobs: 142, avatar: "AC" },
  { name: "Harvest Pro Services", rating: 4.6, reviews: 466, jobs: 126, avatar: "HP" },
];

const AVATAR_COLORS = [
  "from-emerald-400 to-teal-600",
  "from-blue-400 to-indigo-600",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-600",
  "from-rose-400 to-pink-600",
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

import { useApp } from "@/context/AppContext.tsx";

interface ServicesViewProps {
  requests?: any[];
}

export default function ServicesView({ requests: propRequests }: ServicesViewProps) {
  const { labourBookings, machineryBookings } = useApp();

  const RECENT_REQUESTS = [
    ...(labourBookings || []).map((l: any, idx: number) => ({
      id: l.id || `SRV${250150000 + idx}`,
      service: `${l.labourType || "Labour"} Service`,
      farmer: l.userName || "Farmer",
      farmerId: l.phone || "—",
      provider: "Assigned Labour Team",
      status: l.status === "assigned" ? "Completed" : l.status === "pending" ? "Pending" : "In Progress",
      date: l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-IN") : "Today",
      time: l.createdAt ? new Date(l.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:00 AM",
    })),
    ...(machineryBookings || []).map((m: any, idx: number) => ({
      id: m.id || `SRV${250160000 + idx}`,
      service: `${m.machineryType || "Machinery"} Service`,
      farmer: m.userName || "Farmer",
      farmerId: m.phone || "—",
      provider: m.allottedMachineDetails || "Agri Machinery",
      status: m.status === "allotted" ? "Completed" : m.status === "pending" ? "Pending" : "In Progress",
      date: m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN") : "Today",
      time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:00 AM",
    })),
  ];

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filtered = RECENT_REQUESTS.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.id.toLowerCase().includes(q) || r.farmer.toLowerCase().includes(q) || r.service.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All Status" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getStatusBadge = (status: string) => {
    if (status === "Completed") return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
        <CheckCircle2 className="h-2.5 w-2.5" /> Completed
      </span>
    );
    if (status === "In Progress") return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[11px] font-semibold">
        <Clock className="h-2.5 w-2.5" /> In Progress
      </span>
    );
    if (status === "Cancelled") return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold">
        <XCircle className="h-2.5 w-2.5" /> Cancelled
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
        <Clock className="h-2.5 w-2.5" /> Pending
      </span>
    );
  };

  const DONUT = [
    { label: "Pending", value: 412, pct: 16.8, color: "#f59e0b" },
    { label: "In Progress", value: 684, pct: 27.9, color: "#3b82f6" },
    { label: "Completed", value: 1865, pct: 75.9, color: "#059669" },
    { label: "Cancelled", value: 97, pct: 3.9, color: "#ef4444" },
  ];
  const circ = 2 * Math.PI * 38;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Services Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all agricultural services and service providers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="hover:text-emerald-600 cursor-pointer transition-colors">Dashboard</span>
            <span>&gt;</span>
            <span className="hover:text-emerald-600 cursor-pointer transition-colors">Services</span>
            <span>&gt;</span>
            <span className="text-emerald-600 font-semibold">All Services</span>
          </div>
          <button
            onClick={() => toast.success("Add New Service")}
            className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add New Service
          </button>
        </div>
      </div>

      {/* 5 KPI Stat Cards */}
      <div className="flex gap-4">
        <div className="flex-1 grid grid-cols-5 gap-3">
          {[
            { label: "Total Services", value: "128", trend: "+18.7%", bg: "bg-green-50", ic: "bg-green-100", icon: Wrench, tc: "text-emerald-600" },
            { label: "Active Services", value: "96", trend: "+21.4%", bg: "bg-blue-50", ic: "bg-blue-100", icon: Sparkles, tc: "text-blue-600" },
            { label: "Service Providers", value: "56", trend: "+16.3%", bg: "bg-violet-50", ic: "bg-violet-100", icon: Users, tc: "text-violet-600" },
            { label: "Total Requests", value: "2,458", trend: "+23.9%", bg: "bg-amber-50", ic: "bg-amber-100", icon: FileText, tc: "text-amber-600" },
            { label: "Completed", value: "1,865", trend: "+34.2%", bg: "bg-emerald-50", ic: "bg-emerald-100", icon: CheckCircle2, tc: "text-emerald-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{s.label}</p>
                <div className={`w-8 h-8 ${s.ic} ${s.tc} rounded-xl flex items-center justify-center`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xl font-black text-gray-900 leading-none">{s.value}</p>
              <p className={`text-[10px] ${s.tc} font-semibold flex items-center gap-1`}>
                <TrendingUp className="h-2.5 w-2.5" />
                {s.trend} this month
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout: Left + Right Panel */}
      <div className="flex gap-4 items-start">
        {/* Left Column */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Service Categories Grid */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Our Service Categories</h2>
            <div className="grid grid-cols-4 gap-3">
              {SERVICE_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`${cat.bg} rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group border border-transparent hover:border-gray-200`}
                  onClick={() => toast.info(`Viewing ${cat.label}`)}
                >
                  <div className={`${cat.iconBg} ${cat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <cat.icon className="h-7 w-7" />
                  </div>
                  <p className={`text-xs font-bold ${cat.color} mb-1`}>{cat.label}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-500">{cat.count} Services</p>
                    <Arrow className="h-3.5 w-3.5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Service Requests Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Recent Service Requests</h3>
                <p className="text-xs text-gray-500 mt-0.5">Track and manage recent customer service bookings</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search requests..."
                    className="h-8 pl-7 pr-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none focus:border-emerald-400 w-44"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="h-8 text-xs border border-gray-200 rounded-xl px-2.5 bg-gray-50 text-gray-700 outline-none"
                >
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Farmer</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paged.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-800 text-[11px]">{r.id}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{r.service}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800">{r.farmer}</p>
                        <p className="text-[10px] text-gray-400">{r.farmerId}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{r.provider}</td>
                      <td className="py-3 px-4 text-gray-500">
                        <p>{r.date}</p>
                        <p className="text-[10px] text-gray-400">{r.time}</p>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(r.status)}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toast.info(`Viewing details of ${r.id}`)}
                          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <p>Showing 1 to {paged.length} of {filtered.length} requests</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-semibold text-xs">
                  {currentPage}
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-72 shrink-0 space-y-4">
          {/* Request Status Breakdown Donut */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-800 mb-3">Request Status Overview</p>
            <div className="flex items-center gap-3">
              <svg width="100" height="100" viewBox="0 0 90 90" className="shrink-0">
                <circle cx="45" cy="45" r="38" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                {DONUT.map((d, i) => {
                  const dash = (d.pct / 100) * circ;
                  const offset = DONUT.slice(0, i).reduce((s, x) => s + (x.pct / 100) * circ, 0);
                  return (
                    <circle
                      key={i}
                      cx="45"
                      cy="45"
                      r="38"
                      fill="none"
                      stroke={d.color}
                      strokeWidth="12"
                      strokeDasharray={`${dash} ${circ - dash}`}
                      transform={`rotate(${-90 + (offset / circ) * 360} 45 45)`}
                    />
                  );
                })}
                <text x="45" y="42" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#111">
                  2,458
                </text>
                <text x="45" y="52" textAnchor="middle" fontSize="7" fill="#6b7280">
                  Total
                </text>
              </svg>
              <div className="space-y-1.5 flex-1">
                {DONUT.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="text-gray-600">{d.label}</span>
                    </div>
                    <span className="font-bold text-gray-700">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Service Providers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-800">Top Service Providers</p>
              <button
                onClick={() => toast.info("Viewing all providers")}
                className="text-[11px] text-emerald-600 font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {TOP_PROVIDERS.map((p, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColor(p.name)} flex items-center justify-center text-white font-bold text-[10px] shrink-0`}>
                    {p.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-700">{p.rating}</span>
                      <span>({p.reviews})</span>
                      <span>&bull;</span>
                      <span>{p.jobs} jobs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-800 mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Add New Service", icon: Plus, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                { label: "Add Service Provider", icon: Users, color: "bg-blue-50 text-blue-700 border-blue-100" },
                { label: "View All Requests", icon: FileText, color: "bg-violet-50 text-violet-700 border-violet-100" },
                { label: "Service Reports", icon: TrendingUp, color: "bg-amber-50 text-amber-700 border-amber-100" },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => toast.info(a.label)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] font-semibold ${a.color} hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  <a.icon className="h-4 w-4" />
                  <span className="leading-tight text-center">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                👨‍💼
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800 mb-1">Need Help?</p>
                <p className="text-[11px] text-gray-500 mb-3">Our support team is here to help you.</p>
                <button
                  onClick={() => toast.info("Contacting support...")}
                  className="w-full h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Headphones className="h-3.5 w-3.5" /> Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-gray-400 pb-2">
        © 2025 Krivexa. All rights reserved. &nbsp; Made with care for Farmers 🌿
      </div>
    </div>
  );
}

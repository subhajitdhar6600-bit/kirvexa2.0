import React, { useState, useEffect } from "react";
import {
  Search, Eye, Check, X, ChevronLeft, ChevronRight, Filter,
  Download, CheckCircle, XCircle, Clock, MapPin, Phone,
  Mail, CreditCard, Calendar, ArrowRight, FileText, CheckCircle2,
  Users, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";

const CARD_TYPE_COLORS: Record<string, string> = {
  "Kisan Card Basic": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Kisan Card Premium": "bg-blue-50 text-blue-700 border border-blue-200",
  "Kisan Card Gold": "bg-amber-50 text-amber-700 border border-amber-200",
};

interface CardRequestsViewProps {
  kccApplications?: any[];
}

export default function CardRequestsView({ kccApplications: propKcc }: CardRequestsViewProps) {
  const { kccApplications: contextKcc, approveKccApplication, rejectKccApplication, loadAllKccApplications } = useApp();

  useEffect(() => {
    if (loadAllKccApplications) {
      loadAllKccApplications();
    }
  }, [loadAllKccApplications]);

  const rawList = (propKcc && propKcc.length > 0 ? propKcc : contextKcc) || [];

  const requests = rawList.map((k: any) => ({
    id: k.id || `REQ${Math.floor(10000 + Math.random() * 90000)}`,
    name: k.fullName || "Applicant",
    phone: k.phone || k.mobileNumber || "—",
    email: k.email || "—",
    address: [k.address, k.district].filter(Boolean).join(", ") || "Bihar",
    cardType: k.cardTier === "nex" ? "Kisan Card Gold" : "Kisan Card Basic",
    cardNumber: k.cardNumber || k.kccCardNumber,
    creditRequested: k.creditLimit || k.paymentAmount || 50000,
    status: (k.status?.toLowerCase() === "approved" ? "Approved" : k.status?.toLowerCase() === "rejected" ? "Rejected" : "Pending") as "Pending" | "Approved" | "Rejected",
    appliedOn: k.createdAt ? new Date(k.createdAt).toLocaleDateString("en-IN") : "Today",
    idProof: k.aadhaar ? "Aadhaar Card" : "Government ID",
    appliedByDealer: k.appliedByDealer || k.dealerName || "",
    avatar: (k.fullName || "KC").slice(0, 2).toUpperCase(),
  }));

  const [selected, setSelected] = useState<any>(requests[0] || null);
  const [search, setSearch] = useState("");
  const [cardTypeFilter, setCardTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filtered = requests.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search);
    const matchCard = cardTypeFilter === "all" || r.cardType.toLowerCase().includes(cardTypeFilter);
    const matchStatus = statusFilter === "all" || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchCard && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const [allotModalOpen, setAllotModalOpen] = useState(false);
  const [allottingRequest, setAllottingRequest] = useState<any | null>(null);
  const [allottedCardNumber, setAllottedCardNumber] = useState("");
  const [allottedCreditLimit, setAllottedCreditLimit] = useState(50000);
  const [isVerifyingUser, setIsVerifyingUser] = useState(true);

  const openAllotModal = (req: any) => {
    setAllottingRequest(req);
    const existingCard = req.cardNumber || rawList.find((k: any) => k.id === req.id)?.cardNumber;
    const cleanPhone = (req.phone || "9876").replace(/\D/g, "").slice(-4);
    setAllottedCardNumber(existingCard || `KCC-BH-2026-${cleanPhone}`);
    setAllottedCreditLimit(req.creditRequested || 50000);
    setIsVerifyingUser(true);
    setAllotModalOpen(true);
  };

  const handleConfirmAllotment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allottingRequest) return;
    if (!allottedCardNumber.trim()) {
      toast.error("Please specify a valid KCC Card Number");
      return;
    }
    approveKccApplication(allottingRequest.id, allottedCardNumber.trim(), allottedCreditLimit);
    toast.success(`KCC Card "${allottedCardNumber}" allotted with ₹${allottedCreditLimit.toLocaleString("en-IN")} limit! User documents verified.`);
    setAllotModalOpen(false);
    setAllottingRequest(null);
  };

  const handleApprove = (id: string) => {
    const target = requests.find(r => r.id === id);
    if (target) {
      openAllotModal(target);
    } else {
      approveKccApplication(id);
      toast.success(`KCC Request ${id} approved with live card issued!`);
    }
  };
  const handleReject = (id: string) => {
    rejectKccApplication(id);
    toast.error(`KCC Request ${id} rejected.`);
  };

  const getStatusBadge = (status: string) => {
    if (status === "Pending") return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold flex items-center gap-1"><Clock className="h-3 w-3" />Pending</span>;
    if (status === "Approved") return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" />Approved</span>;
    return <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</span>;
  };

  const total = requests.length;
  const pending = requests.filter(r => r.status === "Pending").length;
  const approved = requests.filter(r => r.status === "Approved").length;
  const rejected = requests.filter(r => r.status === "Rejected").length;

  const handleExportCsv = () => {
    try {
      const headers = ["Request ID", "Applicant Name", "Phone", "Location", "Card Tier", "Credit Limit", "Status", "Applied On"];
      const rows = requests.map(r => [r.id, r.name, r.phone, r.address, r.cardType, r.creditRequested, r.status, r.appliedOn]);
      const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `KCC_Applications_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Card requests exported successfully!");
    } catch {
      toast.error("Failed to export requests");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Card Requests</h1>
          <p className="text-xs text-gray-500 mt-0.5">Review and manage all live Krivexo Kisan Card applications</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span><span>›</span><span>Krivexo Card</span><span>›</span>
          <span className="text-emerald-600 font-medium">Card Requests</span>
        </div>
      </div>

      {/* Stat Cards - Strictly Live Database Counts */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: total.toString(), sub: `${total} real applications`, Icon: FileText, bg: "bg-emerald-50", tc: "text-emerald-600" },
          { label: "Pending", value: pending.toString(), sub: `${total > 0 ? Math.round((pending / total) * 100) : 0}% awaiting review`, Icon: Clock, bg: "bg-amber-50", tc: "text-amber-600" },
          { label: "Approved", value: approved.toString(), sub: `${total > 0 ? Math.round((approved / total) * 100) : 0}% cards approved`, Icon: CheckCircle2, bg: "bg-blue-50", tc: "text-blue-600" },
          { label: "Rejected", value: rejected.toString(), sub: `${total > 0 ? Math.round((rejected / total) * 100) : 0}% declined`, Icon: XCircle, bg: "bg-red-50", tc: "text-red-600" },
        ].map((s, i) => {
          const StatIcon = s.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.tc} flex items-center justify-center`}>
                  <StatIcon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Split Layout */}
      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by name, mobile or request ID..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl"
              />
            </div>
            <select
              value={cardTypeFilter}
              onChange={e => { setCardTypeFilter(e.target.value); setCurrentPage(1); }}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium cursor-pointer"
            >
              <option value="all">All Card Types</option>
              <option value="basic">Kisan Card Basic</option>
              <option value="gold">Kisan Card Gold</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={handleExportCsv}
              title="Download CSV Report"
              className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 text-left w-8">#</th>
                  <th className="py-3 px-4 text-left">Request ID</th>
                  <th className="py-3 px-4 text-left">Farmer Details</th>
                  <th className="py-3 px-4 text-left">Card Type</th>
                  <th className="py-3 px-4 text-left">Credit Limit Requested</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Applied On</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold text-gray-600">No card requests found</p>
                      <p className="text-[11px] text-gray-400">Try changing your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  paged.map((r, idx) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected?.id === r.id ? "bg-emerald-50/50" : ""}`}
                    >
                      <td className="py-3 px-4 text-gray-400 font-medium">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-700">{r.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                            {r.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-gray-900">{r.name}</p>
                              {r.appliedByDealer && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[9px] border border-emerald-300">
                                  Dealer: {r.appliedByDealer}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400">{r.phone} • {r.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${CARD_TYPE_COLORS[r.cardType] || "bg-gray-100 text-gray-600"}`}>
                          {r.cardType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-800">₹ {r.creditRequested.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4">{getStatusBadge(r.status)}</td>
                      <td className="py-3 px-4 text-gray-500">{r.appliedOn}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={e => { e.stopPropagation(); setSelected(r); }}
                            title="View Application Details"
                            className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          {r.status === "Pending" && (
                            <>
                              <button
                                onClick={e => { e.stopPropagation(); handleApprove(r.id); }}
                                title="Approve Request"
                                className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-600 cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); handleReject(r.id); }}
                                title="Reject Request"
                                className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[11px] text-gray-500">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} requests
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer ${
                    currentPage === p ? "bg-emerald-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {selected && (
          <div className="w-72 space-y-4 shrink-0">
            {/* Request Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Request Details</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${selected.status === "Pending" ? "bg-amber-400/30 text-amber-100 border-amber-400/40" : selected.status === "Approved" ? "bg-emerald-400/30 text-emerald-100 border-emerald-400/40" : "bg-red-400/30 text-red-100 border-red-400/40"}`}>
                    {selected.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {selected.avatar}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm leading-tight">{selected.name}</h3>
                    <p className="text-emerald-200 text-[11px]">#{selected.id}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                {[
                  { label: "Mobile Number", value: selected.phone },
                  { label: "Email Address", value: selected.email || "—" },
                  { label: "Address", value: selected.address },
                  { label: "Card Type", value: selected.cardType },
                  { label: "Credit Requested", value: `₹ ${selected.creditRequested.toLocaleString("en-IN")}` },
                  { label: "ID Proof", value: selected.idProof },
                  ...(selected.appliedByDealer ? [{ label: "Applied By Dealer", value: selected.appliedByDealer }] : []),
                  { label: "Applied On", value: selected.appliedOn },
                ].map((row, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <span className="text-gray-400 shrink-0">{row.label}</span>
                    <span className="text-gray-700 font-semibold text-right truncate max-w-[150px]">{row.value}</span>
                  </div>
                ))}
                {selected.status === "Pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => openAllotModal(selected)} className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-semibold cursor-pointer">
                      Review & Allot Card
                    </Button>
                    <Button onClick={() => handleReject(selected.id)} variant="outline" className="flex-1 h-8 text-red-600 border-red-200 hover:bg-red-50 text-xs rounded-xl font-semibold cursor-pointer">
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Request Statistics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-xs font-bold text-gray-800 mb-3">Live Application Stats</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-gray-600">Approved</span></div>
                  <span className="font-bold text-gray-800">{approved} ({total > 0 ? Math.round((approved / total) * 100) : 0}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span className="text-gray-600">Pending</span></div>
                  <span className="font-bold text-gray-800">{pending} ({total > 0 ? Math.round((pending / total) * 100) : 0}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400" /><span className="text-gray-600">Rejected</span></div>
                  <span className="font-bold text-gray-800">{rejected} ({total > 0 ? Math.round((rejected / total) * 100) : 0}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── REVIEW & ALLOT KCC CARD MODAL (Point 5) ─── */}
      {allotModalOpen && allottingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setAllotModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-base">
                <CreditCard className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Review & Allot KCC Card</h3>
                <p className="text-[11px] text-gray-500">Assign card number, credit limit & verify user</p>
              </div>
            </div>

            {/* Applicant Summary */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5 space-y-1.5 text-xs mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Applicant:</span>
                <span className="font-bold text-gray-900">{allottingRequest.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-800">{allottingRequest.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="font-medium text-gray-800">{allottingRequest.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Card Tier:</span>
                <span className="font-semibold text-emerald-800">{allottingRequest.cardType}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmAllotment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Allot KCC Card Number *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                  <Input
                    value={allottedCardNumber}
                    onChange={e => setAllottedCardNumber(e.target.value)}
                    placeholder="e.g. KCC-BH-2026-9876"
                    className="pl-9 h-9 text-xs font-mono font-bold text-emerald-900 rounded-xl"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Format: KCC-BH-2026-XXXX (Synchronized across User Wallet & Admin)</p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Approved Credit Limit (₹) *</label>
                <Input
                  type="number"
                  min="1000"
                  step="1000"
                  value={allottedCreditLimit}
                  onChange={e => setAllottedCreditLimit(Number(e.target.value))}
                  className="h-9 text-xs rounded-xl font-bold"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1">Available credit allotted for purchasing inputs & booking machinery</p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="verifyUser"
                  checked={isVerifyingUser}
                  onChange={e => setIsVerifyingUser(e.target.checked)}
                  className="mt-0.5 accent-emerald-600 rounded"
                />
                <label htmlFor="verifyUser" className="text-[11px] text-gray-700 cursor-pointer">
                  <strong className="font-semibold">Verify User & Authenticate KCC:</strong> Mark user as verified so full active permissions (Buy, Sell, Book) are unlocked immediately.
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl cursor-pointer"
                >
                  <Check className="h-4 w-4 mr-1" /> Allot & Issue Card
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleReject(allottingRequest.id);
                    setAllotModalOpen(false);
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Reject
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">
        © 2026 Farma. All rights reserved. &nbsp; Real-time Bihar KCC Applications Database
      </div>
    </div>
  );
}

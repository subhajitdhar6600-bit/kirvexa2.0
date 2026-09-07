import React, { useState } from "react";
import {
  Search, Plus, Edit2, Trash2,
  ChevronLeft, ChevronRight, Filter, Download,
  CheckCircle, XCircle, Clock, Eye, ArrowRight,
  Store, CheckCircle2, ShieldCheck, Users, Phone, Mail, MapPin, Calendar, CreditCard, X, FileText, Building2,
  KeyRound, Copy, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { Dealer } from "../types.ts";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";
import { sendDealerCredentialsEmail } from "@/services/emailService.ts";

interface DealersViewProps {
  dealers: Dealer[];
  setDealers: React.Dispatch<React.SetStateAction<Dealer[]>>;
}

export default function DealersView({ dealers: propDealers, setDealers }: DealersViewProps) {
  const { allotDealerCredentials } = useApp();
  const dealers = propDealers || [];
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(dealers[0] || null);
  const [viewingModalDealer, setViewingModalDealer] = useState<Dealer | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Dealer Credential Allotment Modal
  const [allotCredDealer, setAllotCredDealer] = useState<Dealer | null>(null);
  const [credLoginId, setCredLoginId] = useState("");
  const [credPassword, setCredPassword] = useState("");
  const [credSendEmail, setCredSendEmail] = useState(true);
  const [credIsAllotting, setCredIsAllotting] = useState(false);

  const generateCredentials = (dealer: Dealer) => {
    const city = (dealer.district || dealer.village || "PATNA").slice(0, 6).toUpperCase().replace(/\s/g, "");
    const rand = Math.floor(100 + Math.random() * 900);
    const loginId = `DLR-${city}-${rand}`;
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#";
    const pass = "Dealer@" + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("") + rand;
    return { loginId, pass };
  };

  const openAllotCredModal = (dealer: Dealer) => {
    const { loginId, pass } = generateCredentials(dealer);
    setCredLoginId(loginId);
    setCredPassword(pass);
    setCredSendEmail(true);
    setAllotCredDealer(dealer);
  };

  const handleConfirmAllotCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allotCredDealer || !credLoginId.trim() || !credPassword.trim()) return;
    setCredIsAllotting(true);

    try {
      const allottedId = credLoginId.trim();
      const allottedPass = credPassword.trim();

      // 1. Sync to registeredAccounts and backend database
      await allotDealerCredentials(
        { id: allotCredDealer.id, phone: allotCredDealer.phone, email: allotCredDealer.email },
        allottedId,
        allottedPass
      );

      // 2. Send email via EmailJS / EmailService
      if (credSendEmail && allotCredDealer.email && allotCredDealer.email.includes("@")) {
        try {
          await sendDealerCredentialsEmail({
            to_email: allotCredDealer.email,
            to_name: allotCredDealer.owner || allotCredDealer.businessName,
            businessName: allotCredDealer.businessName,
            dealerId: allottedId,
            password: allottedPass,
            loginUrl: `${window.location.origin}/login`,
          });
        } catch (emailErr) {
          console.warn("Dealer credentials email dispatch warning:", emailErr);
        }
      }

      // 3. Update local dealers view state
      setDealers(prev => prev.map(d =>
        d.id === allotCredDealer.id
          ? { ...d, status: "active", verified: "verified", loginId: allottedId, password: allottedPass }
          : d
      ));
      if (selectedDealer?.id === allotCredDealer.id) {
        setSelectedDealer(prev => prev ? { ...prev, status: "active", verified: "verified", loginId: allottedId, password: allottedPass } : null);
      }

      toast.success(`Dealer "${allotCredDealer.businessName}" approved! Dealer ID: ${allottedId}${credSendEmail ? ` • Credentials dispatched via email to ${allotCredDealer.email}` : ""}`);
    } catch (err: any) {
      toast.error(`Failed to allot dealer credentials: ${err.message || err}`);
    } finally {
      setCredIsAllotting(false);
      setAllotCredDealer(null);
    }
  };

  const filtered = dealers.filter((d) => {
    const matchSearch =
      d.businessName.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase()) ||
      (d.gstin && d.gstin.toLowerCase().includes(search.toLowerCase())) ||
      (d.licenseNumber && d.licenseNumber.toLowerCase().includes(search.toLowerCase())) ||
      d.phone.includes(search) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalRetailers = dealers.length;
  const activeRetailers = dealers.filter(d => d.status === "active").length;
  const inactiveRetailers = dealers.filter(d => d.status !== "active").length;
  const verifiedRetailers = dealers.filter(d => d.verified === "verified").length;

  const getKycBadge = (verified: string) => {
    if (verified === "verified") return <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-semibold"><CheckCircle className="h-3.5 w-3.5" />Verified</span>;
    if (verified === "pending") return <span className="inline-flex items-center gap-1 text-amber-600 text-[11px] font-semibold"><Clock className="h-3.5 w-3.5" />Pending</span>;
    return <span className="inline-flex items-center gap-1 text-red-500 text-[11px] font-semibold"><XCircle className="h-3.5 w-3.5" />Rejected</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">Active</span>;
    if (status === "pending") return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">Pending</span>;
    return <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold">Inactive</span>;
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Retailers & Dealers Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all registered retailers, dealers and inspect GST & license verification details</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span><span>›</span><span>Users Management</span><span>›</span>
          <span className="text-emerald-600 font-medium">All Retailers</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Retailers", value: totalRetailers.toString(), sub: "Registered dealers in database", Icon: Store, bg: "bg-emerald-50", color: "text-emerald-600" },
          { label: "Active Retailers", value: activeRetailers.toString(), sub: `${totalRetailers > 0 ? Math.round((activeRetailers / totalRetailers) * 100) : 0}% active merchant accounts`, Icon: CheckCircle2, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Inactive Retailers", value: inactiveRetailers.toString(), sub: "Pending or suspended accounts", Icon: XCircle, bg: "bg-red-50", color: "text-red-500" },
          { label: "KYC Verified", value: verifiedRetailers.toString(), sub: `${totalRetailers > 0 ? Math.round((verifiedRetailers / totalRetailers) * 100) : 0}% verified merchants`, Icon: ShieldCheck, bg: "bg-violet-50", color: "text-violet-600" },
        ].map((s, i) => {
          const IconComp = s.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <IconComp className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Split layout */}
      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by shop name, owner, GSTIN or license..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 text-left w-8">#</th>
                  <th className="py-3 px-4 text-left">Business / Shop Name</th>
                  <th className="py-3 px-4 text-left">Owner Name</th>
                  <th className="py-3 px-4 text-left">GSTIN & License</th>
                  <th className="py-3 px-4 text-left">Mobile / Email</th>
                  <th className="py-3 px-4 text-left">State & District</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">KYC</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold text-gray-600">No retailers found</p>
                      <p className="text-[11px] text-gray-400">Try changing your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  paged.map((d, idx) => (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDealer(d)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedDealer?.id === d.id ? "bg-emerald-50/50" : ""}`}
                    >
                      <td className="py-3.5 px-4 text-gray-400">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {d.avatar ? (
                            <img src={d.avatar} alt="" className="w-8 h-8 rounded-xl object-cover border border-orange-300" />
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                              {d.businessName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{d.businessName}</p>
                            <p className="text-[10px] text-gray-400 font-mono">#{d.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 font-medium">{d.owner}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-mono text-emerald-800 font-bold text-[11px]">{d.gstin || d.gstNumber || "Not provided"}</p>
                        <p className="font-mono text-[10px] text-gray-400">{d.licenseNumber || "—"}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-gray-800 font-medium">{d.phone}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{d.email || "—"}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-gray-800 font-medium">{d.district || "Patna"}</p>
                        <p className="text-[10px] text-gray-400">{d.state || "Bihar"}</p>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(d.status)}</td>
                      <td className="py-3.5 px-4">{getKycBadge(d.verified)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={e => { e.stopPropagation(); setViewingModalDealer(d); }}
                            className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer"
                            title="View Full Dealer Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
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
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} retailers
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

        {/* Right Panel - Retailer Complete Registration Details */}
        {selectedDealer && (
          <div className="w-80 space-y-4 shrink-0">
            {/* Retailer Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Dealer Profile</p>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold border border-white/30 capitalize">
                    {selectedDealer.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {selectedDealer.avatar ? (
                    <img src={selectedDealer.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-white/40 shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center text-white font-bold text-base shadow-sm">
                      {selectedDealer.businessName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-bold text-sm leading-tight">{selectedDealer.businessName}</h3>
                    <p className="text-orange-200 text-[11px] font-mono">#{selectedDealer.id}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div className="space-y-2 pb-2 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">Business & Owner Info</p>
                  {[
                    { label: "Business Name", value: selectedDealer.businessName },
                    { label: "Owner Name", value: selectedDealer.owner },
                    { label: "Dealer Type", value: selectedDealer.dealerType || selectedDealer.businessType },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 shrink-0">{row.label}</span>
                      <span className="text-gray-800 font-semibold text-right truncate max-w-[150px]">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pb-2 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">Mandatory Verification Data</p>
                  {[
                    { label: "GSTIN (Section 1)", value: selectedDealer.gstin || selectedDealer.gstNumber || "Not provided", mono: true },
                    { label: "License (Section 2)", value: selectedDealer.licenseNumber || "Not provided", mono: true },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 shrink-0">{row.label}</span>
                      <span className={`text-emerald-800 font-bold text-right truncate max-w-[150px] ${row.mono ? "font-mono" : ""}`}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pb-2 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">Contact & Shop Address</p>
                  {[
                    { label: "Mobile Number", value: selectedDealer.phone },
                    { label: "Email Address", value: selectedDealer.email || "—" },
                    { label: "State", value: selectedDealer.state || "Bihar" },
                    { label: "District", value: selectedDealer.district || "Patna" },
                    { label: "Village / City", value: selectedDealer.village || "—" },
                    { label: "Shop Address", value: selectedDealer.address || "—" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 shrink-0">{row.label}</span>
                      <span className="text-gray-800 font-semibold text-right truncate max-w-[150px]">{row.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setViewingModalDealer(selectedDealer)}
                  className="w-full mt-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" /> Inspect Full Dealer Modal
                </button>
              </div>

              {/* Admin Dealer Approval Action — Point 7 */}
              {selectedDealer.status === "pending" ? (
                <div className="p-3 bg-amber-50 border-t border-amber-100 space-y-2">
                  <p className="text-[11px] text-amber-800 font-semibold">⚠️ Pending Registration Approval</p>
                  <p className="text-[10px] text-gray-600">Review GST and License details before allotting credentials.</p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => openAllotCredModal(selectedDealer)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 rounded-lg cursor-pointer"
                    >
                      <KeyRound className="h-3.5 w-3.5 mr-1" /> Review & Allot Credentials
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDealers(prev => prev.map(d => d.id === selectedDealer.id ? { ...d, status: "suspended", verified: "unverified" } : d));
                        setSelectedDealer(prev => prev ? { ...prev, status: "suspended", verified: "unverified" } : null);
                        toast.error(`Dealer "${selectedDealer.businessName}" request rejected.`);
                      }}
                      className="border-red-200 text-red-600 hover:bg-red-50 text-xs py-1.5 rounded-lg cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Account Active & Verified
                  </span>
                  <button
                    onClick={() => openAllotCredModal(selectedDealer)}
                    className="text-[10px] text-emerald-700 underline font-medium cursor-pointer"
                  >
                    Reset Credentials
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FULL DEALER DETAILS MODAL */}
      {viewingModalDealer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {viewingModalDealer.avatar ? (
                  <img src={viewingModalDealer.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-sm" />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-white font-bold text-lg">
                    {viewingModalDealer.businessName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold leading-tight">{viewingModalDealer.businessName}</h2>
                  <p className="text-xs text-orange-200">Dealer Account Profile • #{viewingModalDealer.id}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingModalDealer(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Card 1: Business & Owner Registration Details */}
              <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5 border-b border-gray-200/60 pb-2">
                  <Building2 className="h-4 w-4 text-orange-600" /> Business & Owner Info
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Owner / Contact Name</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalDealer.owner}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Shop / Business Name</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalDealer.businessName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Dealer Business Type</span>
                    <span className="font-bold text-orange-700 text-xs">{viewingModalDealer.dealerType || viewingModalDealer.businessType}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Mandatory Verification Documents */}
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 space-y-3">
                <h3 className="font-bold text-emerald-800 text-xs flex items-center gap-1.5 border-b border-emerald-200/60 pb-2">
                  <FileText className="h-4 w-4 text-emerald-600" /> Mandatory Registration Verification Data
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-gray-500 block text-[10.5px] font-semibold">Section 1: 15-Digit GSTIN Number</span>
                    <span className="font-mono font-bold text-emerald-800 text-sm block mt-0.5">{viewingModalDealer.gstin || viewingModalDealer.gstNumber || "Not provided"}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-gray-500 block text-[10.5px] font-semibold">Section 2: License Details</span>
                    <span className="font-mono font-bold text-emerald-800 text-sm block mt-0.5">{viewingModalDealer.licenseNumber || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Contact & Address Information */}
              <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5 border-b border-gray-200/60 pb-2">
                  <MapPin className="h-4 w-4 text-orange-600" /> Contact & Shop Address Location
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Mobile Number</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalDealer.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Email Address</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalDealer.email || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">State</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalDealer.state || "Bihar"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">District</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalDealer.district || "Patna"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Village / City</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalDealer.village || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">Registration Date</span>
                    <span className="font-bold text-gray-800 text-xs">{viewingModalDealer.createdAt}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-gray-400 block text-[10.5px]">Shop / Business Address</span>
                    <span className="font-medium text-gray-800 text-xs">{viewingModalDealer.address || "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Database Record ID: {viewingModalDealer.id}</span>
              <Button
                onClick={() => setViewingModalDealer(null)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer"
              >
                Close Full Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DEALER CREDENTIAL ALLOTMENT MODAL (Point 7) ─── */}
      {allotCredDealer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setAllotCredDealer(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Allot Dealer Credentials</h3>
                <p className="text-[11px] text-gray-500">Assign login ID & password to activate account</p>
              </div>
            </div>

            {/* Dealer Summary */}
            <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-3.5 space-y-1.5 text-xs mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Business Name:</span>
                <span className="font-bold text-gray-900">{allotCredDealer.businessName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Owner:</span>
                <span className="font-medium text-gray-800">{allotCredDealer.owner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Phone / Email:</span>
                <span className="font-medium text-gray-800">{allotCredDealer.email || allotCredDealer.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">GSTIN:</span>
                <span className="font-mono font-bold text-emerald-800">{allotCredDealer.gstin || allotCredDealer.gstNumber || "Not provided"}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmAllotCredentials} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Dealer Login ID *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-orange-600" />
                    <Input
                      value={credLoginId}
                      onChange={e => setCredLoginId(e.target.value)}
                      placeholder="e.g. DLR-PATNA-102"
                      className="pl-9 h-9 text-xs font-mono font-bold text-orange-900 rounded-xl"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { const { loginId } = generateCredentials(allotCredDealer); setCredLoginId(loginId); }}
                    className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 cursor-pointer shrink-0"
                    title="Generate new Login ID"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Format: DLR-CITY-XXX (fully editable)</p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Temporary Password *</label>
                <div className="flex gap-2">
                  <Input
                    value={credPassword}
                    onChange={e => setCredPassword(e.target.value)}
                    placeholder="e.g. Dealer@2026"
                    className="h-9 text-xs font-mono font-bold rounded-xl flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => { const { pass } = generateCredentials(allotCredDealer); setCredPassword(pass); }}
                    className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 cursor-pointer shrink-0"
                    title="Generate new Password"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard?.writeText(credPassword); toast.info("Password copied!"); }}
                    className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 cursor-pointer shrink-0"
                    title="Copy password"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="sendCredEmail"
                  checked={credSendEmail}
                  onChange={e => setCredSendEmail(e.target.checked)}
                  className="mt-0.5 accent-orange-600"
                />
                <label htmlFor="sendCredEmail" className="text-[11px] text-gray-700 cursor-pointer">
                  <strong className="font-semibold">Dispatch credentials to dealer:</strong> Simulate sending Login ID & Password to <span className="font-mono text-orange-700">{allotCredDealer.email || allotCredDealer.phone}</span>
                </label>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  disabled={credIsAllotting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2 rounded-xl cursor-pointer"
                >
                  {credIsAllotting ? "Activating Account..." : "Allot Credentials & Activate Account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAllotCredDealer(null)}
                  className="text-gray-600 border-gray-200 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">
        © 2026 Farma. All rights reserved. &nbsp; Real-time Bihar Retailers & Dealers Database
      </div>
    </div>
  );
}

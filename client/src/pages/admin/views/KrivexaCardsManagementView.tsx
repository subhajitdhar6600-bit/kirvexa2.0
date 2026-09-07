import React, { useState, useEffect } from "react";
import {
  Search, Eye, Edit2, ChevronLeft, ChevronRight, Filter,
  Download, CheckCircle, XCircle, Clock, MapPin, Phone,
  Mail, CreditCard, Calendar, ArrowRight, ShieldCheck,
  Plus, MoreHorizontal, Users, UserCheck, Shield, Lock, RotateCcw,
  Sliders, FileText, Check
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useApp } from "@/context/AppContext.tsx";

interface CardItem {
  id: string;
  name: string;
  phone: string;
  district: string;
  cardNumber: string;
  cardType: "Basic" | "Premium" | "Gold";
  creditLimit: number;
  availableLimit: number;
  status: "Active" | "Inactive" | "Blocked";
  issuedOn: string;
  validThru: string;
  avatar: string;
}

export default function KrivexaCardsManagementView() {
  const { kccApplications } = useApp();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.getUsers().catch(() => []),
      api.getKccApplications().catch(() => [])
    ]).then(([users, dbApps]) => {
      if (!mounted || !users || !Array.isArray(users)) return;
      const allApps = (Array.isArray(dbApps) && dbApps.length > 0 ? dbApps : kccApplications) || [];
      const mapped: CardItem[] = users.map((u, idx) => {
        const name = u.fullName || u.name || "Farmer";
        const phone = u.phone || "—";
        const cleanPhone = phone.replace(/\D/g, "").slice(-10);
        const last4 = cleanPhone.slice(-4) || `${1000 + idx}`;
        const role = (u.role || "").toLowerCase();
        const cardType: "Basic" | "Premium" | "Gold" = role === "dealer" ? "Gold" : role === "service_provider" ? "Premium" : "Basic";

        const matchingKcc = allApps.find((k: any) => {
          const kPhone = (k.phone || "").replace(/\D/g, "").slice(-10);
          return (cleanPhone && kPhone && cleanPhone === kPhone) || (k.fullName && name && k.fullName.trim().toLowerCase() === name.trim().toLowerCase());
        });

        const cardNumber = u.kccCardNumber || matchingKcc?.cardNumber || `KCC-BH-2026-${last4}`;
        const creditLimit = u.kccCreditLimit || matchingKcc?.creditLimit || matchingKcc?.paymentAmount || (role === "dealer" ? 100000 : 50000);
        const availableLimit = u.isVerified ? Math.round(creditLimit * 0.8) : 0;
        const status: "Active" | "Inactive" | "Blocked" = (u.status === "inactive" || u.isActive === false) ? "Inactive" : "Active";

        return {
          id: u.id || u._id || `c_${idx}`,
          name,
          phone,
          district: u.district || "Patna",
          cardNumber,
          cardType,
          creditLimit,
          availableLimit,
          status,
          issuedOn: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "01 Jan 2026",
          validThru: "31 Dec 2030",
          avatar: name.slice(0, 2).toUpperCase(),
        };
      });

      setCards(mapped);
      if (mapped.length > 0) setSelectedCard(mapped[0]);
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => { mounted = false; };
  }, []);

  const filtered = cards.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.cardNumber.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchType = typeFilter === "all" || c.cardType.toLowerCase() === typeFilter.toLowerCase();
    const matchStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchDistrict = districtFilter === "all" || c.district.toLowerCase().includes(districtFilter.toLowerCase());
    return matchSearch && matchType && matchStatus && matchDistrict;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalCards = cards.length;
  const activeCards = cards.filter(c => c.status === "Active").length;
  const inactiveCards = cards.filter(c => c.status === "Inactive").length;
  const blockedCards = cards.filter(c => c.status === "Blocked").length;
  const totalCreditLimit = cards.reduce((sum, c) => sum + c.creditLimit, 0);

  const handleExport = () => {
    try {
      const headers = ["Card Number", "Farmer Name", "Mobile", "District", "Card Tier", "Credit Limit", "Status", "Issue Date"];
      const rows = cards.map(c => [c.cardNumber, c.name, c.phone, c.district, c.cardType, c.creditLimit, c.status, c.issuedOn]);
      const csv = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Krivexa_Cards_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Cards database exported successfully!");
    } catch {
      toast.error("Export failed");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Active") return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">Active</span>;
    if (status === "Inactive") return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">Inactive</span>;
    return <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold">Blocked</span>;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Krivexa Kisan Card Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Live database of issued cards, limits, and real account records</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span><span>›</span><span>Krivexa Card</span><span>›</span>
          <span className="text-emerald-600 font-medium">Krivexa Cards</span>
        </div>
      </div>

      {/* 5 KPI Cards - Real Counts */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total Cards Issued", value: totalCards.toString(), sub: `${totalCards} registered`, Icon: CreditCard, bg: "bg-emerald-50", tc: "text-emerald-600" },
          { label: "Active Cards", value: activeCards.toString(), sub: `${totalCards > 0 ? Math.round((activeCards / totalCards) * 100) : 0}% active`, Icon: Users, bg: "bg-blue-50", tc: "text-blue-600" },
          { label: "Inactive Cards", value: inactiveCards.toString(), sub: `${inactiveCards} dormant`, Icon: Clock, bg: "bg-amber-50", tc: "text-amber-600" },
          { label: "Blocked Cards", value: blockedCards.toString(), sub: `${blockedCards} suspended`, Icon: XCircle, bg: "bg-red-50", tc: "text-red-600" },
          { label: "Total Credit Limit", value: `₹ ${totalCreditLimit.toLocaleString("en-IN")}`, sub: "Platform limit sum", Icon: ShieldCheck, bg: "bg-purple-50", tc: "text-purple-600" },
        ].map((k, i) => {
          const CardIcon = k.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{k.label}</p>
                <div className={`w-8 h-8 rounded-xl ${k.bg} ${k.tc} flex items-center justify-center`}>
                  <CardIcon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-lg font-black text-gray-900 leading-tight">{k.value}</p>
              <p className={`text-[10px] text-gray-500 mt-1 font-medium`}>{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Split section */}
      <div className="flex gap-4">
        {/* Table Left */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by name, mobile no, or card no..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl"
              />
            </div>
            <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium cursor-pointer">
              <option value="all">All Card Types</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="gold">Gold</option>
            </select>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium cursor-pointer">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
            <select value={districtFilter} onChange={e => { setDistrictFilter(e.target.value); setCurrentPage(1); }} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium cursor-pointer">
              <option value="all">All Districts</option>
              <option value="patna">Patna</option>
              <option value="gaya">Gaya</option>
            </select>
            <button
              onClick={handleExport}
              className="h-8 px-3 flex items-center gap-1 border border-gray-200 rounded-xl bg-gray-50 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" /> Export
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 text-left">Farmer Details</th>
                  <th className="py-3 px-4 text-left">Card Type</th>
                  <th className="py-3 px-4 text-left">Card Number</th>
                  <th className="py-3 px-4 text-left">Issue Date</th>
                  <th className="py-3 px-4 text-left">Credit Limit</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold text-gray-600">No Kisan Cards found</p>
                      <p className="text-[11px] text-gray-400">Try changing your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  paged.map((c, idx) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCard(c)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedCard?.id === c.id ? "bg-emerald-50/50" : ""}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                            {c.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{c.name}</p>
                            <p className="text-[10px] text-gray-400">{c.phone} • {c.district}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700">
                          {c.cardType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-gray-700">{c.cardNumber}</td>
                      <td className="py-3 px-4 text-gray-500">{c.issuedOn}</td>
                      <td className="py-3 px-4 font-bold text-gray-800">₹ {c.creditLimit.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4">{getStatusBadge(c.status)}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedCard(c); }}
                            className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer"
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
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} cards
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

        {/* Right Details Panel */}
        {selectedCard && (
          <div className="w-72 space-y-4 shrink-0">
            {/* Realistic Krivexa Card Preview Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-xs font-bold text-gray-800 mb-3">Krivexa Kisan Card Preview</p>

              {/* The Visual Card */}
              <div className="relative w-full h-36 rounded-2xl bg-gradient-to-br from-[#0d4734] via-[#093527] to-[#041d15] p-3.5 text-white shadow-lg overflow-hidden border border-emerald-600/30">
                <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-400/10 rounded-full blur-xl" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="font-bold text-xs tracking-wider text-white">Krivexa</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    KISAN CARD
                  </span>
                </div>

                {/* Chip & Wi-Fi */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-5 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-center text-[7px] text-amber-900 font-bold shadow-inner">
                    CHIP
                  </div>
                  <span className="text-[10px] text-emerald-300 opacity-80">)))</span>
                </div>

                {/* Number */}
                <p className="font-mono text-xs tracking-widest text-emerald-100 mb-1">
                  {selectedCard.cardNumber}
                </p>

                {/* Name & Valid */}
                <div className="flex items-center justify-between text-[9px] text-emerald-300/80">
                  <span className="font-bold uppercase tracking-wider text-white truncate max-w-[130px]">{selectedCard.name}</span>
                  <span>EXP: 2030</span>
                </div>
              </div>

              {/* Detail Rows */}
              <div className="space-y-2 mt-3 text-xs">
                <div className="flex justify-between"><span className="text-gray-400">Card Type</span><span className="font-semibold text-emerald-700">{selectedCard.cardType}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Credit Limit</span><span className="font-bold text-gray-800">₹ {selectedCard.creditLimit.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Validity</span><span className="font-semibold text-gray-700">5 Years</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Status</span>{getStatusBadge(selectedCard.status)}</div>
              </div>
            </div>

            {/* Real Card Status Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-xs font-bold text-gray-800 mb-3">Card Status Breakdown</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>Active</span></div>
                  <span className="font-bold text-gray-800">{activeCards} ({totalCards > 0 ? Math.round((activeCards / totalCards) * 100) : 0}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span>Inactive</span></div>
                  <span className="font-bold text-gray-800">{inactiveCards} ({totalCards > 0 ? Math.round((inactiveCards / totalCards) * 100) : 0}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /><span>Blocked</span></div>
                  <span className="font-bold text-gray-800">{blockedCards} ({totalCards > 0 ? Math.round((blockedCards / totalCards) * 100) : 0}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-[11px] text-gray-400">
        © 2026 Farma. All rights reserved. &nbsp; Real-time Bihar Kisan Card Database
      </div>
    </div>
  );
}

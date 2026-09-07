import React, { useState, useEffect } from "react";
import {
  Search, Eye, Edit2, ChevronLeft, ChevronRight, Filter,
  Download, CheckCircle, XCircle, Clock, MapPin, Phone,
  Mail, CreditCard, Calendar, ArrowRight, ShieldCheck,
  Plus, MoreHorizontal, Users, UserCheck, Shield, Lock, X, Check, Loader2
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
  cardNumber: string;
  cardType: "Kisan Card Basic" | "Kisan Card Premium" | "Kisan Card Gold";
  creditLimit: number;
  availableLimit: number;
  status: "Active" | "Inactive" | "Blocked";
  issuedOn: string;
  validThru: string;
  avatar: string;
  isVerified: boolean;
}

const CARD_BADGES = {
  "Kisan Card Basic": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Kisan Card Premium": "bg-blue-50 text-blue-700 border-blue-200",
  "Kisan Card Gold": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function AllCardsView() {
  const { kccApplications, updateKccLimit } = useApp();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [search, setSearch] = useState("");
  const [cardTypeFilter, setCardTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [showCardNumbers, setShowCardNumbers] = useState(true); // Admin sees unmasked by default (Point 9)

  // Modals state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardItem | null>(null);
  const [rawUsers, setRawUsers] = useState<any[]>([]);

  // Form for issuing a new card
  const [issueForm, setIssueForm] = useState({
    userId: "",
    cardType: "Kisan Card Basic" as "Kisan Card Basic" | "Kisan Card Premium" | "Kisan Card Gold",
    creditLimit: 50000,
  });

  const loadCards = async () => {
    try {
      setLoading(true);
      const [users, dbApps] = await Promise.all([
        api.getUsers().catch(() => []),
        api.getKccApplications().catch(() => [])
      ]);
      const allApps = (Array.isArray(dbApps) && dbApps.length > 0 ? dbApps : kccApplications) || [];
      if (Array.isArray(users)) {
        setRawUsers(users);
        const mappedCards: CardItem[] = users.map((u: any, idx: number) => {
          const name = u.fullName || u.name || "Farmer User";
          const phone = u.phone || "—";
          const cleanPhone = phone.replace(/\D/g, "").slice(-10);
          const last4 = cleanPhone.slice(-4) || `${1000 + idx}`;
          const isVerified = u.isVerified === true || u.verificationStatus === "Verified";
          const role = (u.role || "").toLowerCase();
          const cardType = role === "dealer" ? "Kisan Card Gold" : role === "service_provider" ? "Kisan Card Premium" : "Kisan Card Basic";

          const matchingKcc = allApps.find((k: any) => {
            const kPhone = (k.phone || "").replace(/\D/g, "").slice(-10);
            return (cleanPhone && kPhone && cleanPhone === kPhone) || (k.fullName && name && k.fullName.trim().toLowerCase() === name.trim().toLowerCase());
          });

          const cardNumber = u.kccCardNumber || matchingKcc?.cardNumber || `KCC-BH-2026-${last4}`;
          const creditLimit = u.kccCreditLimit || matchingKcc?.creditLimit || matchingKcc?.paymentAmount || (role === "dealer" ? 100000 : 50000);
          const availableLimit = isVerified ? Math.round(creditLimit * 0.75) : 0;
          const status = (u.status === "inactive" || u.isActive === false) ? "Inactive" : "Active";

          return {
            id: u.id || u._id || `c_${idx}`,
            name,
            phone,
            cardNumber,
            cardType,
            creditLimit,
            availableLimit,
            status,
            issuedOn: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "01 Jan 2026",
            validThru: "31 Dec 2030",
            avatar: name.slice(0, 2).toUpperCase(),
            isVerified,
          };
        });

        setCards(mappedCards);
        if (mappedCards.length > 0) {
          setSelectedCard(mappedCards[0]);
        }
      }
    } catch (err: any) {
      console.error("Failed to load cards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const filtered = cards.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cardNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchType = cardTypeFilter === "all" || c.cardType.toLowerCase().includes(cardTypeFilter.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalCards = cards.length;
  const activeCards = cards.filter(c => c.status === "Active").length;
  const pendingRequests = cards.filter(c => !c.isVerified).length;
  const inactiveCards = cards.filter(c => c.status !== "Active").length;

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
          Active
        </span>
      );
    }
    if (status === "Inactive") {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
          Inactive
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold">
        Blocked
      </span>
    );
  };

  // 1. Issue New Card handler
  const handleIssueCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.userId) {
      toast.error("Please select a user to issue card to");
      return;
    }
    const targetUser = rawUsers.find(u => (u.id || u._id) === issueForm.userId);
    if (!targetUser) return;

    const newCard: CardItem = {
      id: `card_${Date.now()}`,
      name: targetUser.fullName || targetUser.name || "User",
      phone: targetUser.phone || "—",
      cardNumber: targetUser.kccCardNumber || `KCC-BH-2026-${targetUser.phone ? targetUser.phone.replace(/\D/g, "").slice(-4) : "8899"}`,
      cardType: issueForm.cardType,
      creditLimit: Number(issueForm.creditLimit) || 50000,
      availableLimit: Number(issueForm.creditLimit) || 50000,
      status: "Active",
      issuedOn: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      validThru: "31 Dec 2030",
      avatar: (targetUser.fullName || targetUser.name || "U").slice(0, 2).toUpperCase(),
      isVerified: true,
    };

    setCards(prev => [newCard, ...prev]);
    setSelectedCard(newCard);
    setIsIssueModalOpen(false);
    toast.success(`Kisan Card issued successfully to ${newCard.name}!`);
  };

  // 2. Save Edit Card handler
  const handleSaveEditCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    const newLimit = Number(editingCard.creditLimit) || 50000;
    const cardNum = editingCard.cardNumber;
    const cardPhone = editingCard.phone;

    setCards(prev => prev.map(c => c.id === editingCard.id ? editingCard : c));
    if (selectedCard?.id === editingCard.id) {
      setSelectedCard(editingCard);
    }
    updateKccLimit(cardNum, newLimit, cardPhone);
    setEditingCard(null);
    toast.success(`Card #${cardNum} limit updated to ₹${newLimit.toLocaleString("en-IN")} and synced to user account!`);
  };

  // 3. Download CSV Report
  const handleDownloadCsv = () => {
    try {
      const headers = ["Card Number", "Card Holder", "Phone", "Card Type", "Credit Limit", "Available Limit", "Status", "Issued On"];
      const rows = cards.map(c => [
        c.cardNumber,
        c.name,
        c.phone,
        c.cardType,
        c.creditLimit,
        c.availableLimit,
        c.status,
        c.issuedOn
      ]);
      const csv = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Krivexa_Kisan_Cards_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Kisan Cards report exported successfully!");
    } catch {
      toast.error("Failed to export cards report");
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Krivexa Card Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all Krivexa Kisan Cards, limits, and real account activities</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span>
          <span>›</span>
          <span>Krivexa Card</span>
          <span>›</span>
          <span className="text-emerald-600 font-medium">All Cards</span>
        </div>
      </div>

      {/* KPI Cards - Real Dynamic Numbers */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Cards Issued", value: totalCards.toString(), sub: `${totalCards} registered cards`, Icon: CreditCard, bg: "bg-emerald-50", tc: "text-emerald-600" },
          { label: "Active Cards", value: activeCards.toString(), sub: `${totalCards > 0 ? Math.round((activeCards / totalCards) * 100) : 0}% active cards`, Icon: Users, bg: "bg-blue-50", tc: "text-blue-600" },
          { label: "Pending Verification", value: pendingRequests.toString(), sub: "Unverified accounts", Icon: Clock, bg: "bg-amber-50", tc: "text-amber-600" },
          { label: "Blocked / Inactive", value: inactiveCards.toString(), sub: "Deactivated cards", Icon: XCircle, bg: "bg-red-50", tc: "text-red-600" },
        ].map((stat, i) => {
          const CardIcon = stat.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.tc} flex items-center justify-center`}>
                  <CardIcon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Split layout: Table + Right Details Panel */}
      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by name, mobile or card number..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl"
              />
            </div>
            <select
              value={cardTypeFilter}
              onChange={(e) => { setCardTypeFilter(e.target.value); setCurrentPage(1); }}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium cursor-pointer"
            >
              <option value="all">All Card Types</option>
              <option value="basic">Kisan Card Basic</option>
              <option value="premium">Kisan Card Premium</option>
              <option value="gold">Kisan Card Gold</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
            <button
              onClick={handleDownloadCsv}
              title="Download CSV Report"
              className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
            </button>
            {/* Eye toggle for card numbers (Point 9) */}
            <button
              onClick={() => setShowCardNumbers(v => !v)}
              title={showCardNumbers ? "Hide full card numbers" : "Show full card numbers"}
              className={`h-8 w-8 flex items-center justify-center border rounded-xl cursor-pointer transition-colors shadow-2xs ${
                showCardNumbers ? "border-emerald-300 bg-emerald-50 hover:bg-emerald-100" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <Eye className={`h-3.5 w-3.5 ${showCardNumbers ? "text-emerald-600" : "text-gray-500"}`} />
            </button>
            <Button
              onClick={() => setIsIssueModalOpen(true)}
              className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 rounded-xl font-semibold gap-1.5 ml-auto cursor-pointer shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" /> Issue New Card
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 text-left w-8">#</th>
                  <th className="py-3 px-4 text-left">Card Holder Details</th>
                  <th className="py-3 px-4 text-left">Card Number</th>
                  <th className="py-3 px-4 text-left">Card Type</th>
                  <th className="py-3 px-4 text-left">Credit Limit</th>
                  <th className="py-3 px-4 text-left">Available Limit</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Issued On</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400">
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
                      <td className="py-3.5 px-4 text-gray-400 font-medium">
                        {(currentPage - 1) * rowsPerPage + idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                            {c.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{c.name}</p>
                            <p className="text-[10px] text-gray-400">{c.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-700 text-[11px]">
                        {showCardNumbers ? c.cardNumber : c.cardNumber.replace(/\d{4}(\s\d{4})(\s\d{4})/, '???? ???? ????')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${CARD_BADGES[c.cardType]}`}>
                          {c.cardType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">₹ {c.creditLimit.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">₹ {c.availableLimit.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(c.status)}</td>
                      <td className="py-3.5 px-4 text-gray-500">{c.issuedOn}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedCard(c); }}
                            title="View Card"
                            className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingCard({ ...c }); }}
                            title="Edit Card Details"
                            className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 cursor-pointer transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
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
            {/* Visual Card Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-xs font-bold text-gray-800 mb-3">Krivexa Card Overview</p>

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
                  <span>VALID: 2030</span>
                </div>
              </div>

              {/* Detail Rows */}
              <div className="space-y-2 mt-3 text-xs">
                <div className="flex justify-between"><span className="text-gray-400">Card Holder</span><span className="font-semibold text-gray-800">{selectedCard.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Card Number</span><span className="font-mono text-gray-700">{selectedCard.cardNumber}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Card Type</span><span className="font-semibold text-emerald-600">{selectedCard.cardType}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Status</span>{getStatusBadge(selectedCard.status)}</div>
                <div className="flex justify-between"><span className="text-gray-400">Credit Limit</span><span className="font-bold text-gray-900">₹ {selectedCard.creditLimit.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Available Limit</span><span className="font-bold text-emerald-600">₹ {selectedCard.availableLimit.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Issued On</span><span className="text-gray-600">{selectedCard.issuedOn}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Valid Thru</span><span className="text-gray-600">{selectedCard.validThru}</span></div>
              </div>

              <Button
                onClick={() => setEditingCard({ ...selectedCard })}
                className="w-full mt-3 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Modify Card Limits
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Issue New Card Modal ─── */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsIssueModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-1">Issue New Kisan Card</h3>
            <p className="text-xs text-gray-500 mb-4">Select a registered farmer or dealer to issue an official Krivexa card</p>

            <form onSubmit={handleIssueCardSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select User *</label>
                <select
                  value={issueForm.userId}
                  onChange={(e) => setIssueForm({ ...issueForm, userId: e.target.value })}
                  className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer"
                  required
                >
                  <option value="">-- Select Registered User --</option>
                  {rawUsers.map((u: any) => (
                    <option key={u.id || u._id} value={u.id || u._id}>
                      {u.fullName || u.name} ({u.phone}) - {u.role || "Farmer"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Card Tier</label>
                <select
                  value={issueForm.cardType}
                  onChange={(e: any) => setIssueForm({ ...issueForm, cardType: e.target.value })}
                  className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer"
                >
                  <option value="Kisan Card Basic">Kisan Card Basic (₹ 25,000 Limit)</option>
                  <option value="Kisan Card Premium">Kisan Card Premium (₹ 50,000 Limit)</option>
                  <option value="Kisan Card Gold">Kisan Card Gold (₹ 1,00,000 Limit)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Credit Limit (₹)</label>
                <Input
                  type="number"
                  value={issueForm.creditLimit}
                  onChange={(e) => setIssueForm({ ...issueForm, creditLimit: Number(e.target.value) })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="h-9 text-xs rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 rounded-xl font-semibold gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="h-3.5 w-3.5" /> Issue Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Edit Card Modal ─── */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setEditingCard(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-1">Modify Kisan Card</h3>
            <p className="text-xs text-gray-500 mb-4">{editingCard.name} • {editingCard.cardNumber}</p>

            <form onSubmit={handleSaveEditCard} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Card Tier</label>
                <select
                  value={editingCard.cardType}
                  onChange={(e: any) => setEditingCard({ ...editingCard, cardType: e.target.value })}
                  className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium"
                >
                  <option value="Kisan Card Basic">Kisan Card Basic</option>
                  <option value="Kisan Card Premium">Kisan Card Premium</option>
                  <option value="Kisan Card Gold">Kisan Card Gold</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Credit Limit (₹)</label>
                  <Input
                    type="number"
                    value={editingCard.creditLimit}
                    onChange={(e) => setEditingCard({ ...editingCard, creditLimit: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Available Limit (₹)</label>
                  <Input
                    type="number"
                    value={editingCard.availableLimit}
                    onChange={(e) => setEditingCard({ ...editingCard, availableLimit: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Card Status</label>
                <select
                  value={editingCard.status}
                  onChange={(e: any) => setEditingCard({ ...editingCard, status: e.target.value })}
                  className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCard(null)}
                  className="h-9 text-xs rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 rounded-xl font-semibold gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="h-3.5 w-3.5" /> Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">
        © 2026 Farma. All rights reserved. &nbsp; Real-time Bihar Kisan Cards Database
      </div>
    </div>
  );
}

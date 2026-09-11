import { useState, useEffect } from "react";
import {
  Download, Eye, ArrowDownLeft, ArrowUpRight, ShieldCheck,
  AlertCircle, ChevronRight, Plus, Building2, Sliders, Calendar,
  Headphones, Zap, Wallet, CreditCard, Pencil, Trash2, X, Save, RefreshCw, Filter, Search, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { api } from "@/services/api";

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-800",
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-amber-100 text-amber-800",
  "bg-teal-100 text-teal-800",
  "bg-indigo-100 text-indigo-800",
];

export interface TransactionRecord {
  id: string;
  rawId: string;
  isPaymentModel: boolean;
  date: string;
  time: string;
  user: string;
  userType: string;
  avatar: string;
  type: "Debit" | "Credit";
  description: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
  method: string;
  rawStatus: string;
}

interface TransactionsViewProps {
  orders?: any[];
}

export default function TransactionsView({ orders: propOrders }: TransactionsViewProps) {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit & Delete Modal states
  const [editingTx, setEditingTx] = useState<TransactionRecord | null>(null);
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editUser, setEditUser] = useState("");
  const [editAmount, setEditAmount] = useState(0);
  const [editMethod, setEditMethod] = useState("UPI");
  const [editStatus, setEditStatus] = useState<"Success" | "Pending" | "Failed">("Success");

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, paymentsRes, labourRes, machineryRes, expertRes, usersRes] = await Promise.allSettled([
        api.getOrders(),
        api.getPayments(),
        api.getLabourBookings(),
        api.getMachineryBookings(),
        api.getExpertQueries(),
        api.getUsers(),
      ]);

      const usersList = usersRes.status === "fulfilled" && Array.isArray(usersRes.value) ? usersRes.value : [];
      const usersMap = new Map<string, any>();
      usersList.forEach((u: any) => {
        if (u.id) usersMap.set(u.id, u);
        if (u._id) usersMap.set(u._id, u);
      });

      const txList: TransactionRecord[] = [];

      // 1. Payments / Deposits from MongoDB
      if (paymentsRes.status === "fulfilled" && Array.isArray(paymentsRes.value)) {
        paymentsRes.value.forEach((p: any, idx: number) => {
          const amt = Number(p.amount || 0);
          const st = (p.status || "").toUpperCase();
          const isFailed = st === "FAILED" || st === "CANCELLED";
          const isPending = st === "PENDING" || st === "INITIATED";

          const matchingUser = usersMap.get(p.userId);
          const uName = p.userName || p.user || (matchingUser ? (matchingUser.name || matchingUser.fullName) : p.userId === 'usr_admin_01' ? 'Super Admin' : (p.userId || 'Registered User'));
          const uRole = p.userRole || (matchingUser ? (matchingUser.role === 'admin' ? 'Admin' : matchingUser.role === 'dealer' ? 'Dealer' : 'Farmer') : p.userId === 'usr_admin_01' ? 'Admin' : 'Farmer');
          const avatar = uName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

          txList.push({
            id: p.id || `PAY${1000 + idx}`,
            rawId: p.id || p._id,
            isPaymentModel: true,
            date: p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-IN") : (p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "Today"),
            time: p.paidAt ? new Date(p.paidAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:30 AM",
            user: uName,
            userType: uRole,
            avatar,
            type: (p.type === "Debit" || p.type === "debit" || (p.purpose && p.purpose.includes("POS"))) ? "Debit" : "Credit",
            description: p.purpose || p.notes || p.description || `Platform Deposit Reserve`,
            amount: amt,
            status: isFailed ? "Failed" : isPending ? "Pending" : "Success",
            method: (p.method || p.paymentMethod || p.gateway || "BANK TRANSFER").toUpperCase(),
            rawStatus: p.status,
          });
        });
      }

      // 2. Orders from MongoDB
      if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value)) {
        ordersRes.value.forEach((o: any, idx: number) => {
          const amt = Number(o.totalAmount || o.amount || 0);
          const st = (o.status || "").toLowerCase();
          const isFailed = st === "cancelled" || st === "rejected";
          const isPending = st === "pending" || st === "placed" || st === "processing";

          const matchingUser = usersMap.get(o.userId);
          const uName = o.userName || o.customerName || o.buyer || (matchingUser ? (matchingUser.name || matchingUser.fullName) : (o.userId || 'Registered User'));
          const uRole = o.userRole || (matchingUser ? (matchingUser.role === 'admin' ? 'Admin' : matchingUser.role === 'dealer' ? 'Dealer' : 'Farmer') : 'Farmer');
          const avatar = uName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

          txList.push({
            id: o.id || `ORD${8000 + idx}`,
            rawId: o.id || o._id,
            isPaymentModel: false,
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "Today",
            time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:00 AM",
            user: uName,
            userType: uRole,
            avatar,
            type: "Debit",
            description: `Order Payment #${o.id || idx}`,
            amount: amt,
            status: isFailed ? "Failed" : isPending ? "Pending" : "Success",
            method: (o.paymentMethod || "COD").toUpperCase(),
            rawStatus: o.status,
          });
        });
      }

      // 3. Labour Bookings from MongoDB
      if (labourRes.status === "fulfilled" && Array.isArray(labourRes.value)) {
        labourRes.value.forEach((l: any, idx: number) => {
          const amt = (Number(l.count) || 1) * 450;
          const uName = l.userName || l.user || "Farmer Customer";
          const avatar = uName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

          txList.push({
            id: l.id || `LAB${100 + idx}`,
            rawId: l.id || l._id,
            isPaymentModel: false,
            date: l.startDate || (l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-IN") : "Today"),
            time: "09:00 AM",
            user: uName,
            userType: "Farmer",
            avatar,
            type: "Debit",
            description: `Labour Booking (${l.labourType || 'Harvesting'})`,
            amount: amt,
            status: l.status === "assigned" || l.status === "completed" ? "Success" : "Pending",
            method: "UPI",
            rawStatus: l.status,
          });
        });
      }

      // 4. Machinery Bookings from MongoDB
      if (machineryRes.status === "fulfilled" && Array.isArray(machineryRes.value)) {
        machineryRes.value.forEach((m: any, idx: number) => {
          const amt = (Number(m.durationHours) || 1) * 350;
          const uName = m.userName || m.user || "Farmer Customer";
          const avatar = uName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

          txList.push({
            id: m.id || `MAC${100 + idx}`,
            rawId: m.id || m._id,
            isPaymentModel: false,
            date: m.bookingDate || (m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN") : "Today"),
            time: "10:30 AM",
            user: uName,
            userType: "Farmer",
            avatar,
            type: "Debit",
            description: `Machinery Rental (${m.machineryType || 'Tractor'})`,
            amount: amt,
            status: m.status === "allotted" ? "Success" : m.status === "rejected" ? "Failed" : "Pending",
            method: "UPI",
            rawStatus: m.status,
          });
        });
      }

      setTransactions(txList);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Real Computed KPIs
  const totalTx = transactions.length;
  const totalCredit = transactions.filter((t) => t.type === "Credit" && t.status === "Success").reduce((s, t) => s + t.amount, 0);
  const totalDebit = transactions.filter((t) => t.type === "Debit" && t.status === "Success").reduce((s, t) => s + t.amount, 0);
  const refundCount = transactions.filter((t) => t.status === "Failed").length;
  const refundTotal = transactions.filter((t) => t.status === "Failed").reduce((s, t) => s + t.amount, 0);
  const pendingCount = transactions.filter((t) => t.status === "Pending").length;
  const successCount = transactions.filter((t) => t.status === "Success").length;
  const failedCount = transactions.filter((t) => t.status === "Failed").length;
  const avgTxValue = totalTx > 0 ? (totalCredit + totalDebit) / totalTx : 0;

  const walletTotal = totalCredit + totalDebit;
  const walletAvailable = transactions.filter((t) => t.status === "Success").reduce((s, t) => s + t.amount, 0);
  const walletOnHold = transactions.filter((t) => t.status === "Pending").reduce((s, t) => s + t.amount, 0);

  const failedTransactions = transactions.filter((t) => t.status === "Failed");

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [userTypeFilter, setUserTypeFilter] = useState("All User Types");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.id.toLowerCase().includes(q) || t.user.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    const matchType = typeFilter === "All Types" || t.type === typeFilter;
    const matchStatus = statusFilter === "All Status" || t.status === statusFilter;
    const matchUserType = userTypeFilter === "All User Types" || t.userType === userTypeFilter;
    const matchMethod = methodFilter === "All Methods" || t.method.includes(methodFilter.toUpperCase());
    return matchSearch && matchType && matchStatus && matchUserType && matchMethod;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("All Types");
    setStatusFilter("All Status");
    setUserTypeFilter("All User Types");
    setMethodFilter("All Methods");
    setCurrentPage(1);
  };

  const handleOpenEdit = (t: TransactionRecord) => {
    setEditingTx(t);
    setEditUser(t.user);
    setEditAmount(t.amount);
    setEditMethod(t.method);
    setEditStatus(t.status);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;

    setIsSubmitting(true);
    try {
      const targetId = editingTx.rawId;
      if (editingTx.isPaymentModel) {
        await api.updatePayment(targetId, {
          userName: editUser,
          amount: Number(editAmount),
          paymentMethod: editMethod,
          status: editStatus === "Success" ? "SUCCESS" : editStatus === "Pending" ? "PENDING" : "FAILED",
        });
      } else {
        await api.updateOrder(targetId, {
          buyer: editUser,
          userName: editUser,
          amount: Number(editAmount),
          totalAmount: Number(editAmount),
          paymentMethod: editMethod,
          status: editStatus === "Success" ? "completed" : editStatus === "Pending" ? "processing" : "cancelled",
        });
      }

      setTransactions((prev) =>
        prev.map((t) => (t.id === editingTx.id ? { ...t, user: editUser, amount: Number(editAmount), method: editMethod, status: editStatus } : t))
      );

      toast.success(`Transaction #${editingTx.id} updated in MongoDB!`);
      setEditingTx(null);
    } catch (err: any) {
      console.error("Error updating transaction:", err);
      toast.error(err.message || "Failed to update transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTx = async (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;

    setIsSubmitting(true);
    try {
      if (target.isPaymentModel) {
        await api.deletePayment(target.rawId);
      } else {
        await api.deleteOrder(target.rawId);
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success(`Transaction #${id} deleted from database!`);
      setDeletingTxId(null);
    } catch (err: any) {
      console.error("Error deleting transaction:", err);
      toast.error(err.message || "Failed to delete transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">System Transaction Ledger</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time audit log of all financial debits, credits, and deposits across MongoDB</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            title="Refresh MongoDB Data"
            className="h-8 px-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-600" : "text-gray-500"}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => toast.success("Exporting transaction CSV log...")}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-gray-500" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Volume</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">₹ {walletTotal.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{totalTx} DB transactions</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Settled / Settling</p>
            <p className="text-xl font-black text-blue-600 mt-0.5">₹ {walletAvailable.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{successCount} successful</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Pending Transactions</p>
            <p className="text-xl font-black text-amber-600 mt-0.5">₹ {walletOnHold.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{pendingCount} in progress</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">Failed / Cancelled</p>
            <p className="text-xl font-black text-red-600 mt-0.5">₹ {refundTotal.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-red-600 font-semibold mt-0.5">{failedCount} failed</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search TXN ID, user, notes..."
              className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 text-xs pl-9 h-9 rounded-xl focus:border-emerald-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="All Types">All Types</option>
            <option value="Debit">Debit (Purchases)</option>
            <option value="Credit">Credit (Deposits)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          {(search || typeFilter !== "All Types" || statusFilter !== "All Status") && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs text-gray-500 hover:text-emerald-700">
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">TXN ID</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-400 text-xs">
                    Loading live transactions from MongoDB...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-400 text-xs">
                    No transactions matching your criteria.
                  </td>
                </tr>
              ) : (
                paged.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 text-[11px]">{t.id}</td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                      <div>{t.date}</div>
                      <div className="text-[10px] text-gray-400">{t.time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                          {t.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-xs">{t.user}</div>
                          <div className="text-[10px] text-gray-400">{t.userType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{t.description}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${t.type === "Credit" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">₹ {t.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4 font-medium text-gray-600 text-[11px]">{t.method}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${t.status === "Success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : t.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          title="Edit Transaction"
                          className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 flex items-center justify-center cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingTxId(t.id)}
                          title="Delete Transaction"
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Edit Transaction #{editingTx.id}</h3>
              <button onClick={() => setEditingTx(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">User Name</label>
                <Input value={editUser} onChange={(e) => setEditUser(e.target.value)} className="bg-gray-50 border-gray-200 text-xs" required />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Amount (₹)</label>
                <Input type="number" value={editAmount} onChange={(e) => setEditAmount(Number(e.target.value))} className="bg-gray-50 border-gray-200 text-xs" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Payment Method</label>
                  <select value={editMethod} onChange={(e) => setEditMethod(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer">
                    <option value="UPI">UPI</option>
                    <option value="COD">COD</option>
                    <option value="KCC">KCC</option>
                    <option value="BANK TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Status</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer">
                    <option value="Success">Success</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setEditingTx(null)} className="text-xs text-gray-600">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingTxId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Transaction #{deletingTxId}?</h3>
              <p className="text-xs text-gray-500 mt-1">Are you sure you want to delete this transaction record from MongoDB?</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setDeletingTxId(null)} className="text-xs text-gray-600">Cancel</Button>
              <Button disabled={isSubmitting} onClick={() => handleDeleteTx(deletingTxId)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer">
                {isSubmitting ? "Deleting..." : "Delete Permanently"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import {
  Download, Eye, ArrowDownLeft, ArrowUpRight, ShieldCheck,
  AlertCircle, ChevronRight, Plus, Building2, Sliders, Calendar,
  Headphones, Zap, Wallet, CreditCard, Pencil, Trash2, X, Save, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { api } from "@/services/api";

interface PaymentRecord {
  id: string;
  rawId: string;
  isPaymentModel: boolean;
  rawAmount: number;
  date: string;
  user: string;
  userNameOnly: string;
  amount: string;
  method: string;
  status: "Success" | "Pending" | "Failed";
}

interface PaymentsViewProps {
  transactions?: any[];
  orders?: any[];
  onNavigateTab?: (tab: string) => void;
}

export default function PaymentsView({ orders: propOrders, onNavigateTab }: PaymentsViewProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "payments" | "withdrawals">("all");

  // Edit payment modal state
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editForm, setEditForm] = useState({
    user: "",
    rawAmount: 0,
    method: "UPI",
    status: "Success" as PaymentRecord["status"],
  });

  const loadPaymentsData = async () => {
    setLoading(true);
    try {
      const [ordersRes, paymentsRes, usersRes] = await Promise.allSettled([
        api.getOrders(),
        api.getPayments(),
        api.getUsers(),
      ]);

      const usersList = usersRes.status === "fulfilled" && Array.isArray(usersRes.value) ? usersRes.value : [];
      const usersMap = new Map<string, any>();
      usersList.forEach((u: any) => {
        if (u.id) usersMap.set(u.id, u);
        if (u._id) usersMap.set(u._id, u);
      });

      const records: PaymentRecord[] = [];

      // 1. Database Payments
      if (paymentsRes.status === "fulfilled" && Array.isArray(paymentsRes.value)) {
        paymentsRes.value.forEach((p: any, idx: number) => {
          const amt = Number(p.amount || 0);
          const st = (p.status || "").toUpperCase();
          const isFailed = st === "FAILED" || st === "CANCELLED";
          const isPending = st === "PENDING" || st === "INITIATED";
          const dateStr = p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-IN") : (p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "Today");
          const timeStr = p.paidAt ? new Date(p.paidAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:30 am";

          const matchingUser = usersMap.get(p.userId);
          const uName = p.userName || p.user || (matchingUser ? (matchingUser.name || matchingUser.fullName) : p.userId === 'usr_admin_01' ? 'Super Admin' : (p.userId || 'Registered User'));
          const uRole = p.userRole || (matchingUser ? (matchingUser.role === 'admin' ? 'Admin' : matchingUser.role === 'dealer' ? 'Dealer' : 'Farmer') : p.userId === 'usr_admin_01' ? 'Admin' : 'Farmer');

          records.push({
            id: p.id || `PAY${1000 + idx}`,
            rawId: p.id || p._id,
            isPaymentModel: true,
            rawAmount: amt,
            date: `${dateStr}\n${timeStr}`,
            user: `${uName}\n(${uRole})`,
            userNameOnly: uName,
            amount: `â¹ ${amt.toLocaleString("en-IN")}`,
            method: (p.paymentMethod || p.gateway || "UPI").toUpperCase(),
            status: isFailed ? "Failed" : isPending ? "Pending" : "Success",
          });
        });
      }

      // 2. Database Orders
      if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value)) {
        ordersRes.value.forEach((o: any, idx: number) => {
          const orderAmt = Number(o.totalAmount || o.amount || 0);
          const st = (o.status || "").toLowerCase();
          const isFailed = st === "cancelled" || st === "rejected";
          const isPending = st === "pending" || st === "placed" || st === "processing";
          const dateStr = o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "Today");
          const timeStr = o.createdAt ? new Date(o.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:30 am";

          const matchingUser = usersMap.get(o.userId);
          const uName = o.userName || o.customerName || o.buyer || (matchingUser ? (matchingUser.name || matchingUser.fullName) : (o.userId || 'Registered User'));
          const uRole = o.userRole || (matchingUser ? (matchingUser.role === 'admin' ? 'Admin' : matchingUser.role === 'dealer' ? 'Dealer' : 'Farmer') : 'Farmer');

          records.push({
            id: o.id || `ORD${8000 + idx}`,
            rawId: o.id || o._id,
            isPaymentModel: false,
            rawAmount: orderAmt,
            date: `${dateStr}\n${timeStr}`,
            user: `${uName}\n(${uRole})`,
            userNameOnly: uName,
            amount: `â¹ ${orderAmt.toLocaleString("en-IN")}`,
            method: (o.paymentMethod || "COD").toUpperCase(),
            status: isFailed ? "Failed" : isPending ? "Pending" : "Success",
          });
        });
      }

      setPayments(records);
    } catch (err) {
      console.error("Error loading payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentsData();
  }, []);

  const handleOpenEdit = (p: PaymentRecord) => {
    setEditingPayment(p);
    setEditForm({
      user: p.userNameOnly || p.user.split("\n")[0],
      rawAmount: p.rawAmount,
      method: p.method,
      status: p.status,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;

    setIsSubmitting(true);
    try {
      const newAmt = Number(editForm.rawAmount) || 0;
      const targetId = editingPayment.rawId;

      if (editingPayment.isPaymentModel) {
        await api.updatePayment(targetId, {
          userName: editForm.user,
          amount: newAmt,
          paymentMethod: editForm.method,
          status: editForm.status === "Success" ? "SUCCESS" : editForm.status === "Pending" ? "PENDING" : "FAILED",
        });
      } else {
        await api.updateOrder(targetId, {
          buyer: editForm.user,
          userName: editForm.user,
          amount: newAmt,
          totalAmount: newAmt,
          paymentMethod: editForm.method,
          status: editForm.status === "Success" ? "completed" : editForm.status === "Pending" ? "processing" : "cancelled",
        });
      }

      setPayments((prev) =>
        prev.map((p) => {
          if (p.id === editingPayment.id) {
            return {
              ...p,
              user: `${editForm.user}\n(User)`,
              userNameOnly: editForm.user,
              rawAmount: newAmt,
              amount: `â¹ ${newAmt.toLocaleString("en-IN")}`,
              method: editForm.method,
              status: editForm.status,
            };
          }
          return p;
        })
      );

      toast.success(`Transaction ${editingPayment.id} updated in MongoDB!`);
      setEditingPayment(null);
    } catch (err: any) {
      console.error("Error updating transaction:", err);
      toast.error(err.message || "Failed to update transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePayment = async (id: string) => {
    const target = payments.find((p) => p.id === id);
    if (!target) return;

    setIsSubmitting(true);
    try {
      if (target.isPaymentModel) {
        await api.deletePayment(target.rawId);
      } else {
        await api.deleteOrder(target.rawId);
      }

      setPayments((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Transaction ${id} deleted from database!`);
      setDeletingPaymentId(null);
    } catch (err: any) {
      console.error("Error deleting transaction:", err);
      toast.error(err.message || "Failed to delete transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real KPI calculations from database
  const totalPaymentsAmt = payments.filter((p) => p.status !== "Failed").reduce((sum, p) => sum + p.rawAmount, 0);
  const totalWithdrawalsAmt = 0;
  const successfulAmt = totalPaymentsAmt;
  const failedAmt = payments.filter((p) => p.status === "Failed").reduce((sum, p) => sum + p.rawAmount, 0);
  const grandTotal = totalPaymentsAmt + totalWithdrawalsAmt + failedAmt;

  // Donut chart percentages
  const pctPayments = grandTotal > 0 ? Math.round((totalPaymentsAmt / grandTotal) * 100) : 100;
  const pctFailed = grandTotal > 0 ? Math.round((failedAmt / grandTotal) * 100) : 0;

  // Payment Methods Breakdown
  const upiTotal = payments.filter((p) => p.method.includes("UPI")).reduce((sum, p) => sum + p.rawAmount, 0);
  const codTotal = payments.filter((p) => p.method.includes("COD")).reduce((sum, p) => sum + p.rawAmount, 0);
  const kccTotal = payments.filter((p) => p.method.includes("KCC") || p.method.includes("CARD") || p.method.includes("BANK")).reduce((sum, p) => sum + p.rawAmount, 0);
  const otherTotal = totalPaymentsAmt - upiTotal - codTotal - kccTotal;

  const upiPct = totalPaymentsAmt > 0 ? ((upiTotal / totalPaymentsAmt) * 100).toFixed(1) : "0";
  const codPct = totalPaymentsAmt > 0 ? ((codTotal / totalPaymentsAmt) * 100).toFixed(1) : "0";
  const kccPct = totalPaymentsAmt > 0 ? ((kccTotal / totalPaymentsAmt) * 100).toFixed(1) : "0";

  const getStatusBadge = (status: string) => {
    if (status === "Success") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Success
        </span>
      );
    }
    if (status === "Pending") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Pending
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
        Failed
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payments &amp; Withdrawals</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all payments and withdrawals in real-time from MongoDB</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadPaymentsData}
            disabled={loading}
            title="Refresh MongoDB Data"
            className="h-8 px-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-600" : "text-gray-500"}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => toast.success("Exporting payments report...")}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-gray-500" />
            Download Report
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterType === "all"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType("payments")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterType === "payments"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <ArrowDownLeft className="h-3.5 w-3.5" />
          Payments
        </button>
        <button
          onClick={() => setFilterType("withdrawals")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterType === "withdrawals"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Withdrawals
        </button>
      </div>

      {/* 4 KPI Cards with Real Computed Amounts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Total Payments */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Payments</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">â¹ {totalPaymentsAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">From {payments.length} transactions</p>
          </div>
        </div>

        {/* Total Withdrawals */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Withdrawals</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">â¹ {totalWithdrawalsAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-purple-600 font-semibold mt-0.5">Wallet payouts</p>
          </div>
        </div>

        {/* Successful */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Successful</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">â¹ {successfulAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Processed successfully</p>
          </div>
        </div>

        {/* Failed / Cancelled */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Failed / Cancelled</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">â¹ {failedAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-red-500 font-semibold mt-0.5">{payments.filter((p) => p.status === "Failed").length} failed</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Tables + Right Sidebar Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-4">
          {/* Recent Payments */}
          {(filterType === "all" || filterType === "payments") && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800">Recent Payments</h3>
                <span className="text-xs text-gray-400">{payments.length} real transactions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50/70 text-gray-400 font-semibold text-[10px] uppercase tracking-wider border-b border-gray-100">
                      <th className="py-2.5 px-4 whitespace-nowrap">Transaction ID</th>
                      <th className="py-2.5 px-4 whitespace-nowrap">Date &amp; Time</th>
                      <th className="py-2.5 px-4 whitespace-nowrap">User</th>
                      <th className="py-2.5 px-4 whitespace-nowrap">Amount</th>
                      <th className="py-2.5 px-4 whitespace-nowrap">Payment Method</th>
                      <th className="py-2.5 px-4 whitespace-nowrap">Status</th>
                      <th className="py-2.5 px-4 text-center whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400">
                          Loading payments from MongoDB database...
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400">
                          No transactions found in database.
                        </td>
                      </tr>
                    ) : (
                      payments.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[11px] text-gray-800 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              {row.id}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-500 whitespace-pre-line text-[11px]">
                            {row.date}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800 whitespace-pre-line text-[11px]">
                            {row.user}
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900 text-[11px] whitespace-nowrap">
                            {row.amount}
                          </td>
                          <td className="py-3 px-4 text-gray-600 font-medium text-[11px] whitespace-nowrap">
                            {row.method}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {getStatusBadge(row.status)}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* View Button */}
                              <button
                                onClick={() => toast.info(`Transaction ${row.id}: ${row.amount} (${row.method})`)}
                                title="View Details"
                                className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => handleOpenEdit(row)}
                                title="Edit Transaction"
                                className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors cursor-pointer"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => setDeletingPaymentId(row.id)}
                                title="Void / Delete Transaction"
                                className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors cursor-pointer"
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
          )}

          {/* Recent Withdrawals */}
          {(filterType === "all" || filterType === "withdrawals") && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800">Recent Withdrawals</h3>
                <span className="text-xs text-gray-400">0 pending</span>
              </div>
              <div className="p-8 text-center text-xs text-gray-400">
                No withdrawal requests at this time.
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Donut Summary Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-800 mb-3">Payments &amp; Withdrawals Summary</h3>
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
                    strokeDasharray={`${pctPayments}, 100`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {pctFailed > 0 && (
                    <path
                      className="text-red-500"
                      strokeDasharray={`${pctFailed}, 100`}
                      strokeDashoffset={`-${pctPayments}`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-gray-400 font-medium">Total</span>
                  <span className="text-[11px] font-black text-gray-900 leading-tight">â¹ {grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 flex-1 text-[11px]">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Payments</span>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-3.5">â¹ {totalPaymentsAmt.toLocaleString("en-IN")} ({pctPayments}%)</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Withdrawals</span>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-3.5">â¹ 0.00 (0%)</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Failed / Cancelled</span>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-3.5">â¹ {failedAmt.toLocaleString("en-IN")} ({pctFailed}%)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-800 mb-2.5">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab?.("add_money")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">Add Money</p>
                    <p className="text-[10px] text-gray-400">Add funds to wallet</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button
                onClick={() => onNavigateTab?.("bank_accounts")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">Manage Bank Accounts</p>
                    <p className="text-[10px] text-gray-400">Add or manage bank accounts</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* Payment Methods Overview */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-800 mb-3">Payment Methods Overview</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Zap className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-medium">UPI</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800">â¹ {upiTotal.toLocaleString("en-IN")}</span>
                  <span className="text-gray-400 ml-1.5 text-[10px] font-semibold">{upiPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                  <span className="font-medium">KCC / Card</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800">â¹ {kccTotal.toLocaleString("en-IN")}</span>
                  <span className="text-gray-400 ml-1.5 text-[10px] font-semibold">{kccPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Wallet className="h-3.5 w-3.5 text-amber-600" />
                  <span className="font-medium">COD</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800">â¹ {codTotal.toLocaleString("en-IN")}</span>
                  <span className="text-gray-400 ml-1.5 text-[10px] font-semibold">{codPct}%</span>
                </div>
              </div>

              {otherTotal > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="h-3.5 w-3.5 text-purple-600" />
                    <span className="font-medium">Other</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">â¹ {otherTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Payment Modal Dialog */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Edit Transaction</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">#{editingPayment.id}</p>
              </div>
              <button
                onClick={() => setEditingPayment(null)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">User / Customer Name</label>
                <Input
                  value={editForm.user}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, user: e.target.value }))}
                  placeholder="User Name"
                  className="h-9 text-xs rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Amount (â¹)</label>
                <Input
                  type="number"
                  value={editForm.rawAmount}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, rawAmount: parseFloat(e.target.value) || 0 }))}
                  placeholder="Transaction Amount"
                  className="h-9 text-xs rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Payment Method</label>
                <select
                  value={editForm.method}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, method: e.target.value }))}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-800 font-medium outline-none cursor-pointer"
                >
                  <option value="UPI">UPI</option>
                  <option value="COD">COD</option>
                  <option value="KCC">KCC / Card</option>
                  <option value="BANK TRANSFER">Bank Transfer</option>
                  <option value="NET BANKING">Net Banking</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as PaymentRecord["status"] }))}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-800 font-medium outline-none cursor-pointer"
                >
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPayment(null)}
                  className="h-8 text-xs rounded-xl border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-bold gap-1.5 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" /> {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Payment Modal Dialog */}
      {deletingPaymentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Transaction #{deletingPaymentId}?</h3>
              <p className="text-xs text-gray-500 mt-1">Are you sure you want to permanently delete this transaction record from MongoDB?</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setDeletingPaymentId(null)} className="text-xs text-gray-600">Cancel</Button>
              <Button disabled={isSubmitting} onClick={() => handleDeletePayment(deletingPaymentId)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer">
                {isSubmitting ? "Deleting..." : "Delete Permanently"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">Â© {new Date().getFullYear()} Farma. All rights reserved.</div>
    </div>
  );
}

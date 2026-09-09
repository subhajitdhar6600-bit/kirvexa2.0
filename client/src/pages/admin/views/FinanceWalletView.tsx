import React, { useState, useEffect } from "react";
import {
  Wallet, Plus, ArrowUpRight, ArrowDownLeft, Send, RefreshCw,
  Eye, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle,
  TrendingUp, TrendingDown, Download, CreditCard, MoreVertical, History,
  ShieldCheck, Gift, Sparkles, Building2, ShoppingCart, Tractor, Users, Stethoscope,
  Search, X, Check
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FinanceWalletViewProps {
  onNavigateTab?: (tab: string) => void;
}

export default function FinanceWalletView({ onNavigateTab }: FinanceWalletViewProps) {
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Add Funds Modal state
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState<number>(5000);
  const [fundNotes, setFundNotes] = useState("Platform Reserve Deposit");
  const [paymentMode, setPaymentMode] = useState("Bank Transfer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search filter for transactions
  const [searchTx, setSearchTx] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes, labourRes, machineryRes, expertRes, paymentsRes] = await Promise.allSettled([
        api.getOrders(),
        api.getUsers(),
        api.getLabourBookings(),
        api.getMachineryBookings(),
        api.getExpertQueries(),
        api.getPayments(),
      ]);

      const txList: any[] = [];

      // 1. Database Payments / Deposits
      if (paymentsRes.status === "fulfilled" && Array.isArray(paymentsRes.value)) {
        paymentsRes.value.forEach((p: any, idx: number) => {
          txList.push({
            id: p.id || p._id || `PAY${100 + idx}`,
            type: "Deposit",
            icon: Plus,
            iconColor: "text-emerald-600 bg-emerald-50",
            label: `Deposit #${(p.id || p._id || `PAY${idx}`).slice(-6).toUpperCase()}`,
            customer: "Admin Reserve Deposit",
            amount: Number(p.amount) || 0,
            status: "Delivered",
            date: p.paidAt || (p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "Recent"),
          });
        });
      }

      // 2. Orders from MongoDB
      if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value)) {
        ordersRes.value.forEach((o: any, idx: number) => {
          const isCancelled = (o.status || "").toLowerCase() === "cancelled";
          const isDelivered = (o.status || "").toLowerCase() === "delivered" || (o.status || "").toLowerCase() === "completed";
          txList.push({
            id: o.id || o._id || `ORD${100 + idx}`,
            type: "Order",
            icon: ShoppingCart,
            iconColor: isCancelled ? "text-red-500 bg-red-50" : "text-emerald-600 bg-emerald-50",
            label: `Store Order #${(o.id || o._id || `ORD${idx}`).slice(-6).toUpperCase()}`,
            customer: o.customerName || o.userName || o.buyer || "Customer",
            amount: Number(o.totalAmount) || Number(o.amount) || 0,
            status: isDelivered ? "Delivered" : isCancelled ? "Cancelled" : "Processing",
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "Recent",
          });
        });
      }

      // 3. Labour Bookings from MongoDB
      if (labourRes.status === "fulfilled" && Array.isArray(labourRes.value)) {
        labourRes.value.forEach((l: any, idx: number) => {
          const isAssigned = l.status === "assigned" || l.status === "completed";
          txList.push({
            id: l.id || `LAB${100 + idx}`,
            type: "Labour",
            icon: Users,
            iconColor: "text-blue-600 bg-blue-50",
            label: `Labour Booking #${(l.id || `LAB${idx}`).slice(-6).toUpperCase()}`,
            customer: l.userName || "Farmer Customer",
            amount: (Number(l.count) || 1) * 450,
            status: isAssigned ? "Delivered" : "Processing",
            date: l.startDate || (l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-IN") : "Recent"),
          });
        });
      }

      // 4. Machinery Bookings from MongoDB
      if (machineryRes.status === "fulfilled" && Array.isArray(machineryRes.value)) {
        machineryRes.value.forEach((m: any, idx: number) => {
          const isAllotted = m.status === "allotted";
          const isRejected = m.status === "rejected";
          txList.push({
            id: m.id || `MAC${100 + idx}`,
            type: "Machinery",
            icon: Tractor,
            iconColor: isRejected ? "text-red-500 bg-red-50" : "text-amber-600 bg-amber-50",
            label: `Machinery #${(m.id || `MAC${idx}`).slice(-6).toUpperCase()}`,
            customer: m.userName || "Farmer Customer",
            amount: (Number(m.durationHours) || 1) * 350,
            status: isAllotted ? "Delivered" : isRejected ? "Cancelled" : "Processing",
            date: m.bookingDate || (m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN") : "Recent"),
          });
        });
      }

      // 5. Expert Queries from MongoDB
      if (expertRes.status === "fulfilled" && Array.isArray(expertRes.value)) {
        expertRes.value.forEach((e: any, idx: number) => {
          const isResolved = e.status === "resolved";
          txList.push({
            id: e.id || `EXP${100 + idx}`,
            type: "Expert",
            icon: Stethoscope,
            iconColor: "text-purple-600 bg-purple-50",
            label: `Agri Advisory #${(e.id || `EXP${idx}`).slice(-6).toUpperCase()}`,
            customer: e.farmerName || "Farmer Customer",
            amount: 500.0,
            status: isResolved ? "Delivered" : "Processing",
            date: e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN") : "Recent",
          });
        });
      }

      if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value)) {
        setUsersCount(usersRes.value.length);
      }

      setAllTransactions(txList);
    } catch (err) {
      console.error("Error loading financial data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute live aggregates across all database records
  const totalVolume = allTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const deliveredList = allTransactions.filter(t => t.status === "Delivered");
  const availableBalance = deliveredList.reduce((sum, t) => sum + (t.amount || 0), 0);

  const pendingList = allTransactions.filter(t => t.status === "Processing");
  const onHoldBalance = pendingList.reduce((sum, t) => sum + (t.amount || 0), 0);

  const cancelledList = allTransactions.filter(t => t.status === "Cancelled");
  const totalWithdrawn = cancelledList.reduce((sum, t) => sum + (t.amount || 0), 0);

  const currentMonthLabel = new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  const filteredTransactions = allTransactions.filter(t =>
    t.label.toLowerCase().includes(searchTx.toLowerCase()) ||
    t.customer.toLowerCase().includes(searchTx.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTx.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTx.toLowerCase())
  );

  const handleAddFundsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundAmount || fundAmount <= 0) {
      toast.error("Please enter a valid fund amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payId = `pay-${Date.now()}`;
      const txId = `tx-${Date.now()}`;
      await api.createPayment({
        id: payId,
        orderId: `ORD-DEP-${Date.now()}`,
        userId: "usr_admin_01",
        transactionId: txId,
        gateway: paymentMode.toUpperCase().replace(" ", "_"),
        amount: Number(fundAmount),
        currency: "INR",
        status: "SUCCESS",
        paymentMethod: paymentMode,
        paidAt: new Date().toISOString(),
      });

      const newTx = {
        id: payId,
        type: "Deposit",
        icon: Plus,
        iconColor: "text-emerald-600 bg-emerald-50",
        label: `Platform Deposit #${payId.slice(-6).toUpperCase()}`,
        customer: "Admin Reserve Deposit",
        amount: Number(fundAmount),
        status: "Delivered",
        date: "Today",
      };

      setAllTransactions((prev) => [newTx, ...prev]);
      toast.success(`Successfully added ₹ ${fundAmount.toLocaleString("en-IN")} to platform balance and saved to MongoDB!`);
      setIsAddFundsOpen(false);
      setFundAmount(5000);
    } catch (err: any) {
      console.error("Error adding funds:", err);
      toast.error(err.message || "Failed to process fund deposit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Finance &amp; Wallet</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time financial breakdown calculated from live MongoDB orders, bookings &amp; advice queries</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            title="Refresh MongoDB Data"
            className="h-9 px-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-600" : "text-gray-500"}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsAddFundsOpen(true)}
            className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Funds
          </button>
          <button
            onClick={() => onNavigateTab?.("payments")}
            className="h-9 px-4 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-4 w-4 text-gray-500" /> Payments &amp; Payouts
          </button>
        </div>
      </div>

      {/* 5 KPI Cards - Aggregated from MongoDB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Platform Volume", value: `₹ ${totalVolume.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, trend: `${allTransactions.length} DB records`, isPositive: true, icon: Wallet, bg: "bg-emerald-50", tc: "text-emerald-600" },
          { label: "Available Balance", value: `₹ ${availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, trend: `${deliveredList.length} delivered/settled`, isPositive: true, icon: CheckCircle2, bg: "bg-blue-50", tc: "text-blue-600" },
          { label: "On Hold Balance", value: `₹ ${onHoldBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, trend: `${pendingList.length} in transit/pending`, isPositive: false, icon: Clock, bg: "bg-amber-50", tc: "text-amber-500" },
          { label: "Total Transactions", value: allTransactions.length.toString(), trend: "MongoDB transactions", isPositive: true, icon: RefreshCw, bg: "bg-violet-50", tc: "text-violet-600" },
          { label: "Refunds / Cancelled", value: `₹ ${totalWithdrawn.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, trend: `${cancelledList.length} cancelled`, isPositive: false, icon: ArrowUpRight, bg: "bg-red-50", tc: "text-red-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-gray-500 font-medium leading-tight">{s.label}</p>
              <div className={`w-9 h-9 ${s.bg} ${s.tc} rounded-xl flex items-center justify-center`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 leading-tight">{s.value}</p>
              <p className={`text-[10px] ${s.tc} mt-1 font-semibold flex items-center gap-1`}>
                {s.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Wallet Card + Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Wallet Balance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-gray-700 mb-2">Main Platform Balance</p>
            <p className="text-3xl font-black text-emerald-600 mb-4">₹ {totalVolume.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>

            {/* Wallet card visual */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 mb-4 relative overflow-hidden text-white shadow-md">
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 right-4 w-20 h-20 rounded-full bg-white/5" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-lg">
                    F
                  </div>
                  <CreditCard className="h-5 w-5 text-white/80" />
                </div>
                <div className="space-y-1">
                  <div>
                    <p className="text-emerald-100 text-[9px] font-medium">Available Balance</p>
                    <p className="text-white font-bold text-sm">₹ {availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="pt-1">
                    <p className="text-emerald-100 text-[9px] font-medium">On Hold (Pending Orders &amp; Services)</p>
                    <p className="text-white font-bold text-sm">₹ {onHoldBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsAddFundsOpen(true)}
              className="flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Money
            </button>
            <button
              onClick={() => onNavigateTab?.("transactions")}
              className="flex-1 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" /> Transactions
            </button>
          </div>
        </div>

        {/* Volume Breakdown Bars */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-700">Financial Performance Breakdown</p>
              <span className="text-[11px] text-gray-400 font-medium">{currentMonthLabel}</span>
            </div>

            <div className="bg-emerald-50 rounded-xl p-2.5 mb-3 text-xs flex items-center justify-between">
              <span className="text-emerald-800 font-medium">Delivered Volume Ratio</span>
              <span className="font-black text-emerald-700">{totalVolume > 0 ? Math.round((availableBalance / totalVolume) * 100) : 0}%</span>
            </div>

            {/* Volume breakdown bars */}
            <div className="space-y-3 pt-2">
              {[
                { label: "Delivered & Settled", value: availableBalance, color: "bg-emerald-500", count: deliveredList.length },
                { label: "In Transit / Processing", value: onHoldBalance, color: "bg-amber-400", count: pendingList.length },
                { label: "Cancelled / Refunded", value: totalWithdrawn, color: "bg-red-400", count: cancelledList.length },
              ].map((b, idx) => {
                const pct = totalVolume > 0 ? Math.round((b.value / totalVolume) * 100) : 0;
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-600">{b.label} ({b.count})</span>
                      <span className="font-bold text-gray-800">₹ {b.value.toLocaleString("en-IN")} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full ${b.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Total Registered Accounts:</span>
            <span className="font-bold text-gray-800">{usersCount} users</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-gray-700 mb-3">Quick Navigation</p>
            <div className="space-y-2">
              {[
                { label: "Add Money to Wallet", sub: "Instant deposit simulation", action: () => setIsAddFundsOpen(true), icon: Plus, color: "bg-emerald-50 text-emerald-600" },
                { label: "All Orders", sub: "View full store order records", tab: "orders", icon: ShoppingCart, color: "bg-blue-50 text-blue-600" },
                { label: "Transaction Ledger", sub: "Audit all transactions", tab: "transactions", icon: History, color: "bg-violet-50 text-violet-600" },
                { label: "Users & Accounts", sub: "View registered users", tab: "all_users", icon: Users, color: "bg-amber-50 text-amber-600" },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => a.action ? a.action() : onNavigateTab?.(a.tab!)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors text-left group cursor-pointer"
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

      {/* Row 3: Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Recent Platform Transactions</h3>
            <p className="text-[11px] text-gray-500">Live transactions aggregated from MongoDB orders, labour, machinery &amp; expert advice</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                value={searchTx}
                onChange={(e) => setSearchTx(e.target.value)}
                placeholder="Search transaction..."
                className="pl-8 h-8 text-xs bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>
            <button
              onClick={() => onNavigateTab?.("transactions")}
              className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer shrink-0"
            >
              View All ({allTransactions.length})
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-gray-400 py-8 text-center">Loading transactions from MongoDB database...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-xs text-gray-400 py-8 text-center">No transactions found in database matching your search</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTransactions.slice(0, 6).map((t, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-emerald-50/20 transition-colors">
                <div className={`w-9 h-9 rounded-xl ${t.iconColor} flex items-center justify-center shrink-0`}>
                  <t.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{t.label}</p>
                  <p className="text-[10px] text-gray-400 truncate">{t.customer} • {t.date}</p>
                </div>
                <span className={`text-xs font-bold ${t.status === "Cancelled" ? "text-red-500" : "text-emerald-600"} shrink-0`}>
                  ₹ {t.amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD FUNDS MODAL DIALOG */}
      {isAddFundsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Add Funds to Platform Balance</h3>
                <p className="text-xs text-gray-500">Inject reserve funds directly into platform volume</p>
              </div>
              <button onClick={() => setIsAddFundsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddFundsSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Deposit Amount (₹) <span className="text-red-500">*</span></label>
                <Input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(Number(e.target.value))}
                  placeholder="e.g. 5000"
                  className="bg-gray-50 border-gray-200 text-xs font-bold text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-emerald-500"
                >
                  <option value="Bank Transfer">Bank Transfer / NEFT / RTGS</option>
                  <option value="UPI Deposit">UPI Deposit</option>
                  <option value="Debit Card">Debit / Credit Card</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Deposit Notes / Reference</label>
                <Input
                  value={fundNotes}
                  onChange={(e) => setFundNotes(e.target.value)}
                  placeholder="e.g. Platform Liquidity Addition"
                  className="bg-gray-50 border-gray-200 text-xs text-gray-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setIsAddFundsOpen(false)} className="text-xs text-gray-600">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  {isSubmitting ? "Processing Deposit..." : "Add Funds Now"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">
        © 2026 Farma. All rights reserved. &nbsp; Real-time Bihar Financial Database
      </div>
    </div>
  );
}

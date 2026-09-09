import { useState, useEffect } from "react";
import {
  Search, Eye, FileText, ChevronLeft, ChevronRight, Filter,
  Download, CheckCircle, Clock, XCircle, Truck, Package,
  MoreHorizontal, Plus, Printer, RefreshCw, Send, ArrowRight,
  ShoppingBag, IndianRupee, Tag, RotateCcw, Mail, Pencil, Trash2, X, Save
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { api } from "@/services/api.ts";
import type { OrderItem } from "../types.ts";

interface OrdersViewProps {
  orders?: OrderItem[];
  setOrders?: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  onViewInvoice?: (invoiceId: string) => void;
}

export default function OrdersView({ orders: propOrders = [], setOrders, onViewInvoice }: OrdersViewProps) {
  const [localOrders, setLocalOrders] = useState<any[]>(propOrders);

  useEffect(() => {
    setLocalOrders(propOrders);
  }, [propOrders]);

  const orders = localOrders.map((o: any, idx: number) => ({
    id: o.id || `ORD${8000 + idx}`,
    itemsCount: parseInt(o.qty || "1") || 1,
    customer: o.buyer || "Customer",
    phone: o.phone || "â",
    amount: o.amount || 0,
    paymentMode: o.paymentMethod || "COD",
    paymentProvider: o.paymentMethod === "kcc" ? "Kisan Credit Card" : o.paymentMethod === "upi" ? "UPI Payment" : "Cash on Delivery",
    orderStatus: (o.status === "delivered" || o.status === "completed" ? "Confirmed" :
                  o.status === "processing" ? "Processing" :
                  o.status === "cancelled" || o.status === "rejected" ? "Cancelled" : "Pending"),
    deliveryStatus: (o.status === "delivered" || o.status === "completed" ? "Delivered" :
                     o.status === "shipped" || o.status === "dispatched" ? "Shipped" :
                     o.status === "processing" ? "Out for Delivery" : "Pending"),
    date: o.date || "Today",
  }));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  // Edit and Delete state
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    buyer: "",
    amount: 0,
    orderStatus: "Confirmed",
    deliveryStatus: "Delivered",
    paymentMode: "UPI",
  });

  const handleOpenEdit = (order: any) => {
    setEditingOrder(order);
    setEditForm({
      buyer: order.customer,
      amount: order.amount,
      orderStatus: order.orderStatus,
      deliveryStatus: order.deliveryStatus,
      paymentMode: order.paymentMode,
    });
  };

  const handleSaveEditOrder = async () => {
    if (!editingOrder) return;
    try {
      await api.updateOrder(editingOrder.id, {
        buyer: editForm.buyer,
        amount: editForm.amount,
        totalAmount: editForm.amount,
        status: editForm.orderStatus.toLowerCase(),
        orderStatus: editForm.orderStatus,
        deliveryStatus: editForm.deliveryStatus,
        paymentMethod: editForm.paymentMode,
      });
      toast.success(`Order #${editingOrder.id} updated`);
      const updateFn = (prev: any[]) => prev.map((o: any) => {
        if (o.id === editingOrder.id) {
          return {
            ...o,
            buyer: editForm.buyer,
            amount: editForm.amount,
            totalAmount: editForm.amount,
            status: editForm.orderStatus.toLowerCase(),
            orderStatus: editForm.orderStatus,
            deliveryStatus: editForm.deliveryStatus,
            paymentMethod: editForm.paymentMode,
          };
        }
        return o;
      });
      setLocalOrders(updateFn);
      if (typeof setOrders === "function") {
        setOrders(updateFn);
      }
      setEditingOrder(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update order");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete Order #${orderId}?`)) return;
    try {
      await api.deleteOrder(orderId);
      toast.success(`Order #${orderId} deleted successfully`);
      setLocalOrders((prev: any[]) => prev.filter((o: any) => o.id !== orderId));
      if (typeof setOrders === "function") {
        setOrders((prev: any[]) => prev.filter((o: any) => o.id !== orderId));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete order");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer", "Phone", "Amount", "Payment Mode", "Order Status", "Delivery Status", "Date"];
    const rows = filtered.map(o => [o.id, o.customer, o.phone, o.amount, o.paymentMode, o.orderStatus, o.deliveryStatus, o.date]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `krivexo_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported to CSV");
  };

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.deliveryStatus === "Delivered").length;
  const pendingOrders = orders.filter(o => o.deliveryStatus === "Pending" || o.orderStatus === "Pending").length;
  const canceledOrders = orders.filter(o => o.orderStatus === "Cancelled").length;
  const totalSales = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()) || o.phone.includes(search);
    const matchStatus = statusFilter === "all" || o.orderStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchPayment = paymentFilter === "all" || o.paymentMode.toLowerCase() === paymentFilter.toLowerCase();
    const matchDelivery = deliveryFilter === "all" || o.deliveryStatus.toLowerCase() === deliveryFilter.toLowerCase();
    return matchSearch && matchStatus && matchPayment && matchDelivery;
  });

  const getOrderStatusBadge = (s: string) => {
    if (s === "Confirmed") return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">Confirmed</span>;
    if (s === "Processing") return <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold">Processing</span>;
    if (s === "Pending") return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold">Pending</span>;
    return <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-semibold">Cancelled</span>;
  };

  const getDeliveryStatusBadge = (s: string) => {
    if (s === "Delivered") return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">Delivered</span>;
    if (s === "Shipped") return <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold">Shipped</span>;
    if (s === "Out for Delivery") return <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-semibold">Out for Delivery</span>;
    if (s === "Pending") return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold">Pending</span>;
    return <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-semibold">Cancelled</span>;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders & Sales Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track, manage and fulfil all orders placed on Krivexo platform.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span><span>âº</span><span>Orders & Sales</span><span>âº</span>
          <span className="text-emerald-600 font-medium">All Orders</span>
        </div>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total Orders", value: totalOrders.toLocaleString("en-IN"), sub: "Real orders from database", Icon: ShoppingBag, bg: "bg-emerald-50", tc: "text-emerald-600" },
          { label: "Delivered Orders", value: deliveredOrders.toLocaleString("en-IN"), sub: "Completed deliveries", Icon: Truck, bg: "bg-blue-50", tc: "text-blue-600" },
          { label: "Pending Orders", value: pendingOrders.toLocaleString("en-IN"), sub: "Awaiting fulfilment", Icon: Clock, bg: "bg-amber-50", tc: "text-amber-600" },
          { label: "Canceled Orders", value: canceledOrders.toLocaleString("en-IN"), sub: "Cancelled orders", Icon: XCircle, bg: "bg-purple-50", tc: "text-purple-600" },
          { label: "Total Sales (â¹)", value: `â¹ ${totalSales.toLocaleString("en-IN")}`, sub: "Gross sales volume", Icon: IndianRupee, bg: "bg-pink-50", tc: "text-pink-600" },
        ].map((k, i) => {
          const IconComp = k.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{k.label}</p>
                <div className={`w-8 h-8 rounded-xl ${k.bg} flex items-center justify-center`}>
                  <IconComp className={`h-4.5 w-4.5 ${k.tc}`} />
                </div>
              </div>
              <p className="text-lg font-black text-gray-900 leading-tight">{k.value}</p>
              <p className={`text-[10px] ${k.tc} mt-1 font-medium`}>{k.sub}</p>
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
              <Input placeholder="Search by Order ID, Customer..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600">
              <option value="all">All Payment Mode</option>
              <option value="upi">UPI</option>
              <option value="wallet">Wallet</option>
              <option value="cod">COD</option>
              <option value="net banking">Net Banking</option>
            </select>
            <select value={deliveryFilter} onChange={e => setDeliveryFilter(e.target.value)} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600">
              <option value="all">All Delivery Status</option>
              <option value="delivered">Delivered</option>
              <option value="shipped">Shipped</option>
              <option value="out for delivery">Out for Delivery</option>
            </select>
            <button onClick={() => { setSearch(""); setStatusFilter("all"); setPaymentFilter("all"); setDeliveryFilter("all"); }} className="h-8 px-3 flex items-center gap-1 border border-gray-200 rounded-xl bg-gray-50 text-xs text-gray-600 hover:bg-gray-100"><Filter className="h-3 w-3" /> Reset</button>
            <button onClick={handleExportCSV} className="h-8 px-3 flex items-center gap-1 border border-gray-200 rounded-xl bg-gray-50 text-xs text-gray-600 hover:bg-gray-100"><Download className="h-3 w-3" /> Export</button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3 text-left w-6"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="py-3 px-4 text-left">Order Details</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Amount (â¹)</th>
                  <th className="py-3 px-4 text-left">Payment Mode</th>
                  <th className="py-3 px-4 text-left">Order Status</th>
                  <th className="py-3 px-4 text-left">Delivery Status</th>
                  <th className="py-3 px-4 text-left">Order Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-emerald-700 text-xs">#{o.id}</p>
                      <p className="text-[10px] text-gray-400">{o.itemsCount} Items</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-800">{o.customer}</p>
                      <p className="text-[10px] text-gray-400">{o.phone}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">â¹ {o.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-800 text-[11px]">{o.paymentMode}</p>
                      <p className="text-[9px] text-gray-400">{o.paymentProvider}</p>
                    </td>
                    <td className="py-3 px-4">{getOrderStatusBadge(o.orderStatus)}</td>
                    <td className="py-3 px-4">{getDeliveryStatusBadge(o.deliveryStatus)}</td>
                    <td className="py-3 px-4 text-gray-500 text-[11px] whitespace-nowrap">{o.date}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewInvoice?.(o.id) || toast.info(`Viewing order #${o.id}`)}
                          title="View Order / Invoice"
                          className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onViewInvoice?.(o.id) || toast.info(`Invoice for #${o.id}`)}
                          title="Tax Invoice"
                          className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(o)}
                          title="Edit Order"
                          className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(o.id)}
                          title="Delete Order"
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Showing 1 to {Math.min(filtered.length, 10)} of {filtered.length.toLocaleString("en-IN")} orders</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-semibold text-xs">1</button>
              {filtered.length > 10 && <button className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 text-xs">2</button>}
              {filtered.length > 20 && <button className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 text-xs">3</button>}
              {filtered.length > 30 && <span className="text-gray-400">...</span>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-72 space-y-4 shrink-0">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-gray-800">Order Summary (This Month)</p>
              <button className="text-[10px] text-emerald-600 font-semibold hover:underline">View Report</button>
            </div>
            <p className="text-xl font-black text-gray-900 mb-1">â¹ {totalSales.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-emerald-600 font-medium mb-3">From {totalOrders} real orders</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-gray-400 text-[10px]">Total Orders</p>
                <p className="font-bold text-gray-800">{totalOrders.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-gray-400 text-[10px]">Delivered</p>
                <p className="font-bold text-emerald-600">{deliveredOrders.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-gray-400 text-[10px]">Pending</p>
                <p className="font-bold text-amber-600">{pendingOrders.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-gray-400 text-[10px]">Cancelled</p>
                <p className="font-bold text-red-600">{canceledOrders.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* Sales by Payment Mode */}
          {(() => {
            const upiOrders = orders.filter(o => o.paymentMode.toLowerCase() === "upi");
            const codOrders = orders.filter(o => o.paymentMode.toLowerCase() === "cod");
            const kccOrders = orders.filter(o => o.paymentMode.toLowerCase() === "kcc");
            const otherPayOrders = orders.filter(o => !["upi","cod","kcc"].includes(o.paymentMode.toLowerCase()));
            const upiSales = upiOrders.reduce((s,o) => s + o.amount, 0);
            const codSales = codOrders.reduce((s,o) => s + o.amount, 0);
            const kccSales = kccOrders.reduce((s,o) => s + o.amount, 0);
            const otherSales = otherPayOrders.reduce((s,o) => s + o.amount, 0);
            const pctU = totalSales ? ((upiSales/totalSales)*100).toFixed(1) : "0";
            const pctC = totalSales ? ((codSales/totalSales)*100).toFixed(1) : "0";
            const pctK = totalSales ? ((kccSales/totalSales)*100).toFixed(1) : "0";
            const pctO = totalSales ? ((otherSales/totalSales)*100).toFixed(1) : "0";
            return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-gray-800">Sales by Payment</p>
              <button className="text-[10px] text-emerald-600 hover:underline">View All</button>
            </div>
            <div className="flex items-center justify-center mb-3">
              <svg width="95" height="95" viewBox="0 0 95 95">
                <circle cx="47.5" cy="47.5" r="35" fill="none" stroke="#e5e7eb" strokeWidth="13" />
                <circle cx="47.5" cy="47.5" r="35" fill="none" stroke="#059669" strokeWidth="13" strokeDasharray={`${Number(pctU)*2.2} 220`} strokeLinecap="round" transform="rotate(-90 47.5 47.5)" />
                <circle cx="47.5" cy="47.5" r="35" fill="none" stroke="#f59e0b" strokeWidth="13" strokeDasharray={`${Number(pctC)*2.2} 220`} strokeLinecap="round" transform={`rotate(${Number(pctU)*3.6-90} 47.5 47.5)`} strokeDashoffset="-2" />
                <circle cx="47.5" cy="47.5" r="35" fill="none" stroke="#6366f1" strokeWidth="13" strokeDasharray={`${Number(pctK)*2.2} 220`} strokeLinecap="round" transform={`rotate(${(Number(pctU)+Number(pctC))*3.6-90} 47.5 47.5)`} strokeDashoffset="-2" />
                <text x="47.5" y="44" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#111">â¹{totalSales.toLocaleString("en-IN")}</text>
                <text x="47.5" y="55" textAnchor="middle" fontSize="8" fill="#9ca3af">Total</text>
              </svg>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>UPI</span></div><span className="font-bold text-gray-800">â¹{upiSales.toLocaleString("en-IN")} ({pctU}%)</span></div>
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span>COD</span></div><span className="font-bold text-gray-800">â¹{codSales.toLocaleString("en-IN")} ({pctC}%)</span></div>
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /><span>KCC</span></div><span className="font-bold text-gray-800">â¹{kccSales.toLocaleString("en-IN")} ({pctK}%)</span></div>
              {otherSales > 0 && <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500" /><span>Others</span></div><span className="font-bold text-gray-800">â¹{otherSales.toLocaleString("en-IN")} ({pctO}%)</span></div>}
            </div>
          </div>
            );
          })()}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-800 mb-3">Quick Actions</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Create Order", Icon: Plus, color: "bg-emerald-50 text-emerald-700" },
                { label: "Bulk Invoice", Icon: FileText, color: "bg-purple-50 text-purple-700" },
                { label: "Print Labels", Icon: Tag, color: "bg-amber-50 text-amber-700" },
                { label: "Download Report", Icon: Download, color: "bg-blue-50 text-blue-700" },
                { label: "Send Invoice", Icon: Mail, color: "bg-teal-50 text-teal-700" },
                { label: "Order Return", Icon: RotateCcw, color: "bg-red-50 text-red-700" },
              ].map((a, i) => {
                const ActionIcon = a.Icon;
                return (
                  <button key={i} onClick={() => toast.info(a.label)} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border border-gray-100 text-[9px] font-semibold ${a.color} hover:opacity-80 cursor-pointer`}>
                    <ActionIcon className="h-4 w-4" />
                    <span className="text-center leading-tight">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts - computed from real data */}
      {(() => {
        const upiCount = orders.filter(o => o.paymentMode.toLowerCase() === "upi").length;
        const codCount = orders.filter(o => o.paymentMode.toLowerCase() === "cod").length;
        const kccCount = orders.filter(o => o.paymentMode.toLowerCase() === "kcc").length;
        const otherCount = totalOrders - upiCount - codCount - kccCount;
        const shippedCount = orders.filter(o => o.deliveryStatus === "Shipped").length;
        const outForDeliveryCount = orders.filter(o => o.deliveryStatus === "Out for Delivery").length;
        const pU = totalOrders ? ((upiCount/totalOrders)*100).toFixed(1) : "0";
        const pC = totalOrders ? ((codCount/totalOrders)*100).toFixed(1) : "0";
        const pK = totalOrders ? ((kccCount/totalOrders)*100).toFixed(1) : "0";
        const pO = totalOrders ? ((otherCount/totalOrders)*100).toFixed(1) : "0";
        const pDel = totalOrders ? ((deliveredOrders/totalOrders)*100).toFixed(1) : "0";
        const pShp = totalOrders ? ((shippedCount/totalOrders)*100).toFixed(1) : "0";
        const pOfd = totalOrders ? ((outForDeliveryCount/totalOrders)*100).toFixed(1) : "0";
        return (
      <div className="grid grid-cols-3 gap-4">
        {/* Order Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold text-gray-800">Order Summary</p>
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50">
              <span className="text-gray-700 font-medium">Confirmed</span>
              <span className="font-bold text-emerald-700">{orders.filter(o => o.orderStatus === "Confirmed").length}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50">
              <span className="text-gray-700 font-medium">Processing</span>
              <span className="font-bold text-blue-700">{orders.filter(o => o.orderStatus === "Processing").length}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50">
              <span className="text-gray-700 font-medium">Pending</span>
              <span className="font-bold text-amber-700">{pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-red-50">
              <span className="text-gray-700 font-medium">Cancelled</span>
              <span className="font-bold text-red-700">{canceledOrders}</span>
            </div>
          </div>
        </div>

        {/* Orders by Payment Mode */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-800 mb-2">Orders by Payment Mode</p>
          <div className="flex items-center gap-3">
            <svg width="75" height="75" viewBox="0 0 75 75" className="shrink-0">
              <circle cx="37.5" cy="37.5" r="28" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle cx="37.5" cy="37.5" r="28" fill="none" stroke="#059669" strokeWidth="10" strokeDasharray={`${Number(pU)*1.76} 176`} strokeLinecap="round" transform="rotate(-90 37.5 37.5)" />
              <circle cx="37.5" cy="37.5" r="28" fill="none" stroke="#f59e0b" strokeWidth="10" strokeDasharray={`${Number(pC)*1.76} 176`} strokeLinecap="round" transform={`rotate(${Number(pU)*3.6-90} 37.5 37.5)`} strokeDashoffset="-2" />
              <circle cx="37.5" cy="37.5" r="28" fill="none" stroke="#6366f1" strokeWidth="10" strokeDasharray={`${Number(pK)*1.76} 176`} strokeLinecap="round" transform={`rotate(${(Number(pU)+Number(pC))*3.6-90} 37.5 37.5)`} strokeDashoffset="-2" />
              <text x="37.5" y="35" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#111">{totalOrders.toLocaleString("en-IN")}</text>
              <text x="37.5" y="44" textAnchor="middle" fontSize="7" fill="#9ca3af">Total</text>
            </svg>
            <div className="space-y-1 text-[10px] flex-1">
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>UPI</span></div><span className="font-bold text-gray-800">{upiCount} ({pU}%)</span></div>
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span>COD</span></div><span className="font-bold text-gray-800">{codCount} ({pC}%)</span></div>
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /><span>KCC</span></div><span className="font-bold text-gray-800">{kccCount} ({pK}%)</span></div>
              {otherCount > 0 && <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500" /><span>Other</span></div><span className="font-bold text-gray-800">{otherCount} ({pO}%)</span></div>}
            </div>
          </div>
        </div>

        {/* Orders by Delivery Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-800 mb-2">Orders by Delivery Status</p>
          <div className="flex items-center gap-3">
            <svg width="75" height="75" viewBox="0 0 75 75" className="shrink-0">
              <circle cx="37.5" cy="37.5" r="28" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle cx="37.5" cy="37.5" r="28" fill="none" stroke="#059669" strokeWidth="10" strokeDasharray={`${Number(pDel)*1.76} 176`} strokeLinecap="round" transform="rotate(-90 37.5 37.5)" />
              <circle cx="37.5" cy="37.5" r="28" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray={`${Number(pShp)*1.76} 176`} strokeLinecap="round" transform={`rotate(${Number(pDel)*3.6-90} 37.5 37.5)`} strokeDashoffset="-2" />
              <circle cx="37.5" cy="37.5" r="28" fill="none" stroke="#f59e0b" strokeWidth="10" strokeDasharray={`${Number(pOfd)*1.76} 176`} strokeLinecap="round" transform={`rotate(${(Number(pDel)+Number(pShp))*3.6-90} 37.5 37.5)`} strokeDashoffset="-2" />
              <text x="37.5" y="35" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#111">{totalOrders.toLocaleString("en-IN")}</text>
              <text x="37.5" y="44" textAnchor="middle" fontSize="7" fill="#9ca3af">Total</text>
            </svg>
            <div className="space-y-1 text-[10px] flex-1">
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>Delivered</span></div><span className="font-bold text-gray-800">{deliveredOrders} ({pDel}%)</span></div>
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /><span>Shipped</span></div><span className="font-bold text-gray-800">{shippedCount} ({pShp}%)</span></div>
              <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span>Out for Delivery</span></div><span className="font-bold text-gray-800">{outForDeliveryCount} ({pOfd}%)</span></div>
            </div>
          </div>
        </div>
      </div>
        );
      })()}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Edit Order Details</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">#{editingOrder.id}</p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Customer / Buyer Name</label>
                <Input
                  value={editForm.buyer}
                  onChange={(e) => setEditForm(prev => ({ ...prev, buyer: e.target.value }))}
                  placeholder="Customer Name"
                  className="h-9 text-xs rounded-xl border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Total Amount (â¹)</label>
                <Input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  placeholder="Order Amount"
                  className="h-9 text-xs rounded-xl border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Order Status</label>
                  <select
                    value={editForm.orderStatus}
                    onChange={(e) => setEditForm(prev => ({ ...prev, orderStatus: e.target.value }))}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Delivery Status</label>
                  <select
                    value={editForm.deliveryStatus}
                    onChange={(e) => setEditForm(prev => ({ ...prev, deliveryStatus: e.target.value }))}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium"
                  >
                    <option value="Delivered">Delivered</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Payment Method</label>
                <select
                  value={editForm.paymentMode}
                  onChange={(e) => setEditForm(prev => ({ ...prev, paymentMode: e.target.value }))}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium"
                >
                  <option value="UPI">UPI</option>
                  <option value="COD">COD (Cash on Delivery)</option>
                  <option value="KCC">KCC (Kisan Credit Card)</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setEditingOrder(null)}
                className="h-8 text-xs rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEditOrder}
                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-semibold gap-1.5"
              >
                <Save className="h-3.5 w-3.5" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">Â© {new Date().getFullYear()} Krivexo. All rights reserved.</div>
    </div>
  );
}

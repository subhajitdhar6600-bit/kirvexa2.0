import { useState, useMemo } from "react";
import {
  Search, Eye, Copy, Filter, Download, ChevronLeft, ChevronRight,
  Truck, CheckCircle2, Clock, XCircle, RotateCcw, AlertTriangle,
  Plus, Settings, Package, Send, ArrowRight, Pencil, Trash2, X, Save
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";

interface ShipmentItem {
  awb: string;
  orderId: string;
  customer: string;
  phone: string;
  courier: string;
  courierInitial: string;
  courierColor: string;
  status: "Delivered" | "In Transit" | "Delivery Failed" | "Returned";
  shippedOn: string;
  expectedDelivery: string;
}

interface ShippingManagementViewProps {
  orders?: any[];
  onViewShipment?: (awb: string) => void;
}

const COURIER_PARTNERS = [
  { name: "Delhivery", initial: "D", color: "bg-red-600" },
  { name: "Blue Dart", initial: "BD", color: "bg-blue-600" },
  { name: "Ekart Logistics", initial: "ek", color: "bg-amber-600" },
  { name: "India Post", initial: "IP", color: "bg-rose-600" },
];

interface ShippingSettings {
  defaultCourier: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  autoGenerateAwb: boolean;
  standardSlaDays: number;
  expressSlaDays: number;
  returnPickupWindowDays: number;
  enableTrackingSms: boolean;
  apiKey: string;
}

const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  defaultCourier: "Delhivery",
  freeShippingThreshold: 999,
  flatShippingRate: 49,
  autoGenerateAwb: true,
  standardSlaDays: 3,
  expressSlaDays: 1,
  returnPickupWindowDays: 7,
  enableTrackingSms: true,
  apiKey: "dlhv_live_89f92a0134bc",
};

export default function ShippingManagementView({ orders: propOrders, onViewShipment }: ShippingManagementViewProps) {
  const { orders: appOrders } = useApp();
  const rawOrders = (propOrders && propOrders.length > 0 ? propOrders : (appOrders || []));

  // Shipping Settings from localStorage
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(() => {
    try {
      const saved = localStorage.getItem("krivexa_shipping_settings");
      return saved ? { ...DEFAULT_SHIPPING_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SHIPPING_SETTINGS;
    } catch {
      return DEFAULT_SHIPPING_SETTINGS;
    }
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempSettings, setTempSettings] = useState<ShippingSettings>(shippingSettings);

  const handleSaveSettings = () => {
    setShippingSettings(tempSettings);
    try {
      localStorage.setItem("krivexa_shipping_settings", JSON.stringify(tempSettings));
    } catch {
      // ignore
    }
    toast.success("Shipping settings saved successfully!");
    setShowSettingsModal(false);
  };

  // Generate real shipments list from actual orders
  const initialShipments = useMemo<ShipmentItem[]>(() => {
    return rawOrders.map((o: any, idx: number) => {
      const courier = COURIER_PARTNERS[idx % COURIER_PARTNERS.length];
      const st = (o.status || "").toLowerCase();
      const status: ShipmentItem["status"] =
        st === "delivered" || st === "completed" ? "Delivered" :
        st === "cancelled" || st === "rejected" ? "Delivery Failed" :
        st === "returned" ? "Returned" : "In Transit";

      const cleanNum = String(o.id || idx).replace(/[^0-9]/g, "").padStart(8, "0").slice(-8);
      const awb = `KRVX4${cleanNum}N`;
      const dateStr = o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "Today");

      return {
        awb,
        orderId: `#${o.id || `ORD${8000 + idx}`}`,
        customer: o.buyer || o.userName || "Customer",
        phone: o.phone || "—",
        courier: courier.name,
        courierInitial: courier.initial,
        courierColor: courier.color,
        status,
        shippedOn: `${dateStr}, 10:30 AM`,
        expectedDelivery: status === "Delivered" ? `${dateStr}, 05:00 PM` : `${dateStr}, Expected Tomorrow`,
      };
    });
  }, [rawOrders]);

  const [shipments, setShipments] = useState<ShipmentItem[]>(initialShipments);

  useMemo(() => {
    if (shipments.length === 0 && initialShipments.length > 0) {
      setShipments(initialShipments);
    }
  }, [initialShipments]);

  // Edit shipment state
  const [editingShipment, setEditingShipment] = useState<ShipmentItem | null>(null);
  const [editForm, setEditForm] = useState({
    customer: "",
    courier: "Delhivery",
    status: "In Transit" as ShipmentItem["status"],
  });

  // Create shipment modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    orderId: "",
    customer: "",
    phone: "",
    courier: "Delhivery",
  });

  const handleOpenEdit = (shipment: ShipmentItem) => {
    setEditingShipment(shipment);
    setEditForm({
      customer: shipment.customer,
      courier: shipment.courier,
      status: shipment.status,
    });
  };

  const handleSaveEdit = () => {
    if (!editingShipment) return;
    const courierObj = COURIER_PARTNERS.find(c => c.name === editForm.courier) || COURIER_PARTNERS[0];
    setShipments(prev => prev.map(s => {
      if (s.awb === editingShipment.awb) {
        return {
          ...s,
          customer: editForm.customer,
          courier: courierObj.name,
          courierInitial: courierObj.initial,
          courierColor: courierObj.color,
          status: editForm.status,
        };
      }
      return s;
    }));
    toast.success(`Shipment ${editingShipment.awb} updated`);
    setEditingShipment(null);
  };

  const handleDeleteShipment = (awb: string) => {
    if (!window.confirm(`Are you sure you want to cancel/delete shipment ${awb}?`)) return;
    setShipments(prev => prev.filter(s => s.awb !== awb));
    toast.success(`Shipment ${awb} removed`);
  };

  const handleCreateShipment = () => {
    if (!createForm.orderId || !createForm.customer) {
      toast.error("Please fill in Order ID and Customer Name");
      return;
    }
    const courierObj = COURIER_PARTNERS.find(c => c.name === createForm.courier) || COURIER_PARTNERS[0];
    const newAwb = `KRVX4${Math.floor(10000000 + Math.random() * 90000000)}N`;
    const today = new Date().toLocaleDateString("en-IN");

    const newShipment: ShipmentItem = {
      awb: newAwb,
      orderId: `#${createForm.orderId.replace(/^#/, "")}`,
      customer: createForm.customer,
      phone: createForm.phone || "—",
      courier: courierObj.name,
      courierInitial: courierObj.initial,
      courierColor: courierObj.color,
      status: "In Transit",
      shippedOn: `${today}, 10:30 AM`,
      expectedDelivery: `${today}, Expected Tomorrow`,
    };

    setShipments(prev => [newShipment, ...prev]);
    toast.success(`Shipment ${newAwb} created successfully`);
    setShowCreateModal(false);
    setCreateForm({ orderId: "", customer: "", phone: "", courier: "Delhivery" });
  };

  const [activeTab, setActiveTab] = useState("All Shipments");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courierFilter, setCourierFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count++;
    if (statusFilter !== "all") count++;
    if (courierFilter !== "all") count++;
    if (dateFilter !== "all") count++;
    return count;
  }, [search, statusFilter, courierFilter, dateFilter]);

  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter(s => s.status === "In Transit").length;
  const deliveredCount = shipments.filter(s => s.status === "Delivered").length;
  const failedCount = shipments.filter(s => s.status === "Delivery Failed").length;
  const returnedCount = shipments.filter(s => s.status === "Returned").length;
  const shippedCount = totalShipments - failedCount - returnedCount;
  const successRate = totalShipments > 0 ? Math.round((deliveredCount / (totalShipments - inTransitCount || 1)) * 100) : 100;

  const resetAllFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCourierFilter("all");
    setDateFilter("all");
    toast.success("Filters reset");
  };

  const isShipmentInDateFilter = (shippedOn: string, filter: string) => {
    if (filter === "all") return true;
    const now = new Date();
    const todayStr = now.toLocaleDateString("en-IN");

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-IN");

    const cleanDate = shippedOn.split(",")[0].trim();

    if (filter === "today") {
      return cleanDate === "Today" || cleanDate === todayStr;
    }
    if (filter === "yesterday") {
      return cleanDate === yesterdayStr;
    }
    if (filter === "last7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const parts = cleanDate.split("/");
      if (parts.length === 3) {
        const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        return d >= sevenDaysAgo && d <= now;
      }
      return true;
    }
    if (filter === "thismonth") {
      const parts = cleanDate.split("/");
      if (parts.length === 3) {
        return Number(parts[1]) === now.getMonth() + 1 && Number(parts[2]) === now.getFullYear();
      }
      return true;
    }
    return true;
  };

  const filtered = shipments.filter((s) => {
    const matchSearch = s.awb.toLowerCase().includes(search.toLowerCase()) || s.orderId.toLowerCase().includes(search.toLowerCase()) || s.customer.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      activeTab === "All Shipments" ||
      (activeTab === "In Transit" && s.status === "In Transit") ||
      (activeTab === "Delivered" && s.status === "Delivered") ||
      (activeTab === "Failed" && s.status === "Delivery Failed") ||
      (activeTab === "Returned" && s.status === "Returned");
    const matchCourier = courierFilter === "all" || s.courier.toLowerCase().includes(courierFilter.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status.toLowerCase() === statusFilter.toLowerCase();
    const matchDate = isShipmentInDateFilter(s.shippedOn, dateFilter);

    return matchSearch && matchTab && matchCourier && matchStatus && matchDate;
  });

  const getStatusBadge = (status: string) => {
    if (status === "Delivered") return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">Delivered</span>;
    if (status === "In Transit") return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">In Transit</span>;
    if (status === "Delivery Failed") return <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold">Delivery Failed</span>;
    return <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold">Returned</span>;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Shipping Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track and manage all shipments and deliveries in real time</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setTempSettings(shippingSettings);
              setShowSettingsModal(true);
            }}
            className="h-8 text-xs gap-1.5 rounded-xl border-gray-200 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
          >
            <Settings className="h-3.5 w-3.5 text-gray-500" /> Shipping Settings
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-xl font-semibold">
            <Plus className="h-3.5 w-3.5" /> Create Shipment
          </Button>
        </div>
      </div>

      {/* 5 KPI Cards - with SVG Icons and Real Computed Counts */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total Shipments", value: totalShipments.toLocaleString("en-IN"), sub: "From live database", Icon: Package, bg: "bg-blue-50", tc: "text-blue-600" },
          { label: "Shipped", value: shippedCount.toLocaleString("en-IN"), sub: "Active deliveries", Icon: Send, bg: "bg-emerald-50", tc: "text-emerald-600" },
          { label: "In Transit", value: inTransitCount.toLocaleString("en-IN"), sub: "On the way", Icon: Truck, bg: "bg-amber-50", tc: "text-amber-600" },
          { label: "Delivered", value: deliveredCount.toLocaleString("en-IN"), sub: "Successfully received", Icon: CheckCircle2, bg: "bg-purple-50", tc: "text-purple-600" },
          { label: "Delivery Failed", value: failedCount.toLocaleString("en-IN"), sub: "Cancelled / returned", Icon: XCircle, bg: "bg-red-50", tc: "text-red-600" },
        ].map((k, i) => {
          const IconComponent = k.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{k.label}</p>
                <div className={`w-8 h-8 rounded-xl ${k.bg} flex items-center justify-center text-base`}>
                  <IconComponent className={`w-4 h-4 ${k.tc}`} />
                </div>
              </div>
              <p className="text-xl font-black text-gray-900 leading-tight">{k.value}</p>
              <p className={`text-[10px] ${k.tc} mt-1 font-medium`}>{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Split section */}
      <div className="flex gap-4">
        {/* Table Left */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Subtabs Header */}
          <div className="flex items-center gap-6 px-5 pt-3 border-b border-gray-100 text-xs font-semibold">
            {["All Shipments", "In Transit", "Delivered", "Failed", "Returned"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 border-b-2 transition-colors ${activeTab === tab ? "border-emerald-600 text-emerald-700 font-bold" : "border-transparent text-gray-400 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter toolbar */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input placeholder="Search by Order ID, AWB..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600">
              <option value="all">Select Status</option>
              <option value="delivered">Delivered</option>
              <option value="in transit">In Transit</option>
              <option value="delivery failed">Delivery Failed</option>
              <option value="returned">Returned</option>
            </select>
            <select value={courierFilter} onChange={(e) => setCourierFilter(e.target.value)} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600">
              <option value="all">Select Courier</option>
              <option value="delhivery">Delhivery</option>
              <option value="blue dart">Blue Dart</option>
              <option value="ekart">Ekart Logistics</option>
              <option value="india post">India Post</option>
            </select>
            <Button onClick={resetAllFilters} variant="outline" className="h-8 text-xs gap-1 rounded-xl border-gray-200">
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
            <Button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`h-8 text-white text-xs gap-1.5 rounded-xl font-semibold ml-auto transition-all ${
                showFilterDrawer || activeFilterCount > 0 ? "bg-emerald-700 hover:bg-emerald-800 ring-2 ring-emerald-300" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              <Filter className="h-3 w-3" /> Filter
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-emerald-700 text-[10px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Advanced Filter Drawer / Tray */}
          {showFilterDrawer && (
            <div className="bg-emerald-50/40 border-b border-emerald-100 p-4 space-y-3 animate-in slide-in-from-top-2 duration-150 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-emerald-600" /> Advanced Filter Options
                </span>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-0.5"
                >
                  <X className="w-3.5 h-3.5" /> Close
                </button>
              </div>

              {/* Date Filter Range Pills */}
              <div>
                <span className="text-[11px] font-semibold text-gray-600 block mb-1.5">Dispatch Date</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: "all", label: "All Time" },
                    { key: "today", label: "Today" },
                    { key: "yesterday", label: "Yesterday" },
                    { key: "last7days", label: "Last 7 Days" },
                    { key: "thismonth", label: "This Month" },
                  ].map((df) => (
                    <button
                      key={df.key}
                      onClick={() => setDateFilter(df.key)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        dateFilter === df.key
                          ? "bg-emerald-600 text-white font-semibold shadow-xs"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {df.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courier Quick Select Pills */}
              <div>
                <span className="text-[11px] font-semibold text-gray-600 block mb-1.5">Courier Partner</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setCourierFilter("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      courierFilter === "all" ? "bg-emerald-600 text-white font-semibold" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All Couriers
                  </button>
                  {COURIER_PARTNERS.map((cp) => (
                    <button
                      key={cp.name}
                      onClick={() => setCourierFilter(cp.name.toLowerCase())}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        courierFilter === cp.name.toLowerCase() ? "bg-emerald-600 text-white font-semibold" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {cp.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
                <span>Showing <strong>{filtered.length}</strong> of {totalShipments} shipments</span>
                <button
                  onClick={resetAllFilters}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 text-left whitespace-nowrap">AWB / Tracking ID</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Order ID</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Customer</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Courier Partner</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Shipped On</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Expected Delivery</th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      No shipments matching criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 whitespace-nowrap flex items-center gap-1.5">
                        <span>{s.awb}</span>
                        <button onClick={() => { navigator.clipboard.writeText(s.awb); toast.success("Copied AWB"); }} className="text-gray-400 hover:text-emerald-600"><Copy className="h-3 w-3" /></button>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">{s.orderId}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-gray-800">{s.customer}</p>
                        <p className="text-[10px] text-gray-400">{s.phone}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-md ${s.courierColor} text-white flex items-center justify-center font-black text-[9px]`}>{s.courierInitial}</div>
                          <span className="font-medium text-gray-800 text-[11px]">{s.courier}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(s.status)}</td>
                      <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">{s.shippedOn}</td>
                      <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">{s.expectedDelivery}</td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Button */}
                          <button
                            onClick={() => onViewShipment ? onViewShipment(s.awb) : toast.info(`Tracking ${s.awb}`)}
                            title="View Shipment"
                            className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(s)}
                            title="Edit Shipment"
                            className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteShipment(s.awb)}
                            title="Delete Shipment"
                            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors"
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

          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Showing 1 to {filtered.length} of {totalShipments} entries</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-semibold text-xs">1</button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-72 space-y-4 shrink-0">
          {/* Shipping Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
            <p className="font-bold text-gray-800 mb-2">Shipping Summary</p>
            <div className="flex justify-between"><span className="text-gray-400">Total Shipments</span><span className="font-semibold text-gray-800">{totalShipments}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Shipped</span><span className="font-semibold text-gray-800">{shippedCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">In Transit</span><span className="font-semibold text-amber-600">{inTransitCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Delivered</span><span className="font-semibold text-emerald-600">{deliveredCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Delivery Failed</span><span className="font-semibold text-red-500">{failedCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Returned</span><span className="font-semibold text-purple-600">{returnedCount}</span></div>
            <div className="flex justify-between pt-2 border-t border-gray-100 text-xs font-bold text-emerald-700">
              <span>Delivery Success Rate</span><span>{successRate}%</span>
            </div>
          </div>

          {/* Top Courier Partners */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-800 mb-3">Courier Partners Active</p>
            <div className="space-y-2 text-[11px]">
              {COURIER_PARTNERS.map((cp, i) => {
                const count = shipments.filter(s => s.courier === cp.name).length;
                const pct = totalShipments > 0 ? Math.round((count / totalShipments) * 100) : 0;
                return (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md ${cp.color} text-white flex items-center justify-center font-bold text-[8px]`}>{cp.initial}</div>
                      <span className="text-gray-700">{cp.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Shipment Modal */}
      {editingShipment && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Edit Shipment</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{editingShipment.awb}</p>
              </div>
              <button
                onClick={() => setEditingShipment(null)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Customer Name</label>
                <Input
                  value={editForm.customer}
                  onChange={(e) => setEditForm(prev => ({ ...prev, customer: e.target.value }))}
                  placeholder="Customer Name"
                  className="h-9 text-xs rounded-xl border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Courier Partner</label>
                <select
                  value={editForm.courier}
                  onChange={(e) => setEditForm(prev => ({ ...prev, courier: e.target.value }))}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium"
                >
                  {COURIER_PARTNERS.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Shipment Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as ShipmentItem["status"] }))}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium"
                >
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delivery Failed">Delivery Failed</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setEditingShipment(null)}
                className="h-8 text-xs rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-semibold gap-1.5"
              >
                <Save className="h-3.5 w-3.5" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Create New Shipment</h3>
                <p className="text-xs text-gray-400 mt-0.5">Assign courier and generate AWB</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Order ID</label>
                <Input
                  value={createForm.orderId}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, orderId: e.target.value }))}
                  placeholder="e.g. KVX-2026-1052"
                  className="h-9 text-xs rounded-xl border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Customer / Farmer Name</label>
                <Input
                  value={createForm.customer}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, customer: e.target.value }))}
                  placeholder="Customer Name"
                  className="h-9 text-xs rounded-xl border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Contact Phone</label>
                <Input
                  value={createForm.phone}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="10-digit Mobile Number"
                  className="h-9 text-xs rounded-xl border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Courier Partner</label>
                <select
                  value={createForm.courier}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, courier: e.target.value }))}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium"
                >
                  {COURIER_PARTNERS.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="h-8 text-xs rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateShipment}
                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-semibold gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Create &amp; Dispatch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowSettingsModal(false); }}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Shipping Settings</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Configure courier partners, rates and SLAs</p>
                </div>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Default Courier */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5">Default Courier Partner</label>
                <select
                  value={tempSettings.defaultCourier}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, defaultCourier: e.target.value }))}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium focus:outline-none focus:border-emerald-500"
                >
                  {COURIER_PARTNERS.map(c => (<option key={c.name} value={c.name}>{c.name}</option>))}
                </select>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5">Free Shipping Threshold (₹)</label>
                  <Input
                    type="number"
                    value={tempSettings.freeShippingThreshold}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                    className="h-9 text-xs rounded-xl border-gray-200"
                    min={0}
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Orders above this get free shipping</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5">Flat Shipping Rate (₹)</label>
                  <Input
                    type="number"
                    value={tempSettings.flatShippingRate}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, flatShippingRate: Number(e.target.value) }))}
                    className="h-9 text-xs rounded-xl border-gray-200"
                    min={0}
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Applied below free threshold</p>
                </div>
              </div>

              {/* SLA Days */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5">Standard SLA (days)</label>
                  <Input
                    type="number"
                    value={tempSettings.standardSlaDays}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, standardSlaDays: Number(e.target.value) }))}
                    className="h-9 text-xs rounded-xl border-gray-200"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5">Express SLA (days)</label>
                  <Input
                    type="number"
                    value={tempSettings.expressSlaDays}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, expressSlaDays: Number(e.target.value) }))}
                    className="h-9 text-xs rounded-xl border-gray-200"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5">Return Pickup (days)</label>
                  <Input
                    type="number"
                    value={tempSettings.returnPickupWindowDays}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, returnPickupWindowDays: Number(e.target.value) }))}
                    className="h-9 text-xs rounded-xl border-gray-200"
                    min={1}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5">
                <label className="block text-gray-700 font-semibold mb-1">Automation</label>
                {[
                  { key: "autoGenerateAwb" as keyof ShippingSettings, label: "Auto-Generate AWB Numbers", desc: "Automatically assign AWBs on order dispatch" },
                  { key: "enableTrackingSms" as keyof ShippingSettings, label: "Enable SMS Tracking Alerts", desc: "Send customer SMS updates on shipment events" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-800 text-xs">{label}</p>
                      <p className="text-[10px] text-gray-400">{desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTempSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${tempSettings[key] ? "bg-emerald-600" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${tempSettings[key] ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                ))}
              </div>

              {/* API Key */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5">Courier API Key</label>
                <Input
                  type="password"
                  value={tempSettings.apiKey}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter API key..."
                  className="h-9 text-xs rounded-xl border-gray-200 font-mono"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">Used for AWB generation and real-time tracking</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button variant="outline" onClick={() => setShowSettingsModal(false)} className="h-8 text-xs rounded-xl border-gray-200">Cancel</Button>
              <Button onClick={handleSaveSettings} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-semibold gap-1.5">
                <Save className="h-3.5 w-3.5" /> Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">© {new Date().getFullYear()} Krivexa. All rights reserved.</div>
    </div>
  );
}

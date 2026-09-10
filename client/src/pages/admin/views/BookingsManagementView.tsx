import { useState, useEffect } from "react";
import {
  Search, Eye, Filter, Download, ChevronLeft, ChevronRight,
  Plus, Calendar, Clock, RotateCcw, MoreHorizontal,
  ArrowRight, Tractor, Users, Stethoscope, FlaskConical,
  Warehouse, Truck, Pencil, Trash2, X, AlertCircle, CheckCircle2, IndianRupee, Check
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { api } from "@/services/api.ts";
import { useApp } from "@/context/AppContext.tsx";

export interface BookingRow {
  id: string;
  serviceType: string;
  icon: string;
  customer: string;
  phone: string;
  date: string;
  time: string;
  status: "Confirmed" | "Ongoing" | "Completed" | "Cancelled";
  bookingStatus?: "pending_rate" | "rate_quoted" | "rate_accepted" | "allotted" | "cancelled" | "pending" | string;
  amount: number;
  rawType?: string;
  rateQuote?: string;
  rateQuoteAmount?: number;
  rateNotes?: string;
  duration?: string;
  location?: string;
  allottedMachine?: any;
  allottedMachineDetails?: string;
  assignedLabours?: any[];
  userResponse?: string;
}

interface BookingsManagementViewProps {
  initialServiceFilter?: string;
  onViewBookingDetails?: (bookingId: string) => void;
}

export default function BookingsManagementView({ initialServiceFilter = "all", onViewBookingDetails }: BookingsManagementViewProps) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("All Bookings");
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState(initialServiceFilter);
  const [statusFilter, setStatusFilter] = useState("all");

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createServiceType, setCreateServiceType] = useState("Tractor Booking");
  const [createCustomer, setCreateCustomer] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createDate, setCreateDate] = useState(new Date().toISOString().split("T")[0]);
  const [createLocation, setCreateLocation] = useState("Patna, Bihar");
  const [createDetails, setCreateDetails] = useState("");
  const [createAmount, setCreateAmount] = useState(1800);

  // Edit & Delete modal states
  const [editingBooking, setEditingBooking] = useState<BookingRow | null>(null);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Form Fields
  const [editCustomer, setEditCustomer] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editServiceType, setEditServiceType] = useState("");
  const [editStatus, setEditStatus] = useState<"Confirmed" | "Ongoing" | "Completed" | "Cancelled">("Confirmed");
  const [editAmount, setEditAmount] = useState(0);

  const {
    addNotification,
    quoteMachineryRate,
    quoteLabourRate,
    allotMachineryBookingWithResources,
    allotLabourBookingWithResources,
  } = useApp();

  // Rate Allotment Modal State (Step 1)
  const [rateBooking, setRateBooking] = useState<BookingRow | null>(null);
  const [isRateOpen, setIsRateOpen] = useState(false);
  const [rateQuoteInput, setRateQuoteInput] = useState("");
  const [rateQuoteAmountInput, setRateQuoteAmountInput] = useState<number>(0);
  const [rateNotesInput, setRateNotesInput] = useState("");

  // Resource Allotment Modal State (Step 2: after User Accepts)
  const [resourceBooking, setResourceBooking] = useState<BookingRow | null>(null);
  const [isResourceOpen, setIsResourceOpen] = useState(false);
  const [resWorkerNames, setResWorkerNames] = useState("");
  const [resLeadPhone, setResLeadPhone] = useState("");
  const [resMachineName, setResMachineName] = useState("");
  const [resNumberPlate, setResNumberPlate] = useState("");
  const [resOperatorName, setResOperatorName] = useState("");
  const [resOperatorPhone, setResOperatorPhone] = useState("");
  const [resNotes, setResNotes] = useState("");

  // Details View Modal State
  const [detailsBooking, setDetailsBooking] = useState<BookingRow | null>(null);

  // Open Rate Allotment Modal
  const handleOpenRateModal = (b: BookingRow) => {
    setRateBooking(b);
    const isMach = (b.rawType || "").includes("machin") || b.serviceType.toLowerCase().includes("tractor");
    if (isMach) {
      setRateQuoteInput(b.rateQuote || "₹400 / hour (Driver & Fuel included)");
      setRateQuoteAmountInput(b.rateQuoteAmount || b.amount || 1600);
    } else {
      setRateQuoteInput(b.rateQuote || "₹450 / day per worker");
      setRateQuoteAmountInput(b.rateQuoteAmount || b.amount || 1350);
    }
    setRateNotesInput(b.rateNotes || "Standard day shift terms applicable.");
    setIsRateOpen(true);
  };

  // Submit Rate Quote to Customer
  const handleSubmitRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rateBooking) return;
    setIsSubmitting(true);
    try {
      const isMach = (rateBooking.rawType || "").includes("machin") || rateBooking.serviceType.toLowerCase().includes("tractor");
      if (isMach) {
        await quoteMachineryRate(rateBooking.id, rateQuoteInput, rateQuoteAmountInput, rateNotesInput);
      } else {
        await quoteLabourRate(rateBooking.id, rateQuoteInput, rateQuoteAmountInput, rateNotesInput);
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === rateBooking.id
            ? {
                ...b,
                bookingStatus: "rate_quoted",
                status: "Ongoing",
                rateQuote: rateQuoteInput,
                rateQuoteAmount: rateQuoteAmountInput,
                rateNotes: rateNotesInput,
                amount: rateQuoteAmountInput || b.amount,
              }
            : b
        )
      );

      toast.success(`Rate quoted for #${rateBooking.id}! Customer has been notified in their profile.`);
      setIsRateOpen(false);
      setRateBooking(null);
    } catch (err: any) {
      toast.error("Failed to quote rate: " + (err?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Resource Allotment Modal (when status is rate_accepted)
  const handleOpenResourceModal = (b: BookingRow) => {
    setResourceBooking(b);
    const isMach = (b.rawType || "").includes("machin") || b.serviceType.toLowerCase().includes("tractor");
    if (isMach) {
      setResMachineName(b.allottedMachine?.machineName || "Mahindra 575 DI (45 HP)");
      setResNumberPlate(b.allottedMachine?.numberPlate || "BR-01-AX-4892");
      setResOperatorName(b.allottedMachine?.operatorName || "Vikram Singh (Certified Operator)");
      setResOperatorPhone(b.allottedMachine?.operatorPhone || b.phone || "9812345678");
    } else {
      setResWorkerNames(b.assignedLabours?.map(l => l.name).join(", ") || "Ramesh Yadav, Mukesh Kumar, Sunita Devi");
      setResLeadPhone(b.assignedLabours?.[0]?.phone || b.phone || "9876543210");
    }
    setResNotes("");
    setIsResourceOpen(true);
  };

  // Submit Resource Allotment
  const handleSubmitResources = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceBooking) return;
    setIsSubmitting(true);
    try {
      const isMach = (resourceBooking.rawType || "").includes("machin") || resourceBooking.serviceType.toLowerCase().includes("tractor");
      if (isMach) {
        await allotMachineryBookingWithResources(resourceBooking.id, {
          machineName: resMachineName,
          numberPlate: resNumberPlate,
          operatorName: resOperatorName,
          operatorPhone: resOperatorPhone,
          detailsText: `Machine: ${resMachineName} (${resNumberPlate}) | Operator: ${resOperatorName} (${resOperatorPhone})`,
          adminNotes: resNotes,
        });
      } else {
        await allotLabourBookingWithResources(resourceBooking.id, {
          workerNames: resWorkerNames,
          leadPhone: resLeadPhone,
          adminNotes: resNotes,
        });
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === resourceBooking.id
            ? {
                ...b,
                bookingStatus: "allotted",
                status: "Confirmed",
                allottedMachineDetails: `Machine: ${resMachineName} (${resNumberPlate}) | Operator: ${resOperatorName} (${resOperatorPhone})`,
              }
            : b
        )
      );

      toast.success(`Resources allotted for #${resourceBooking.id}! Final confirmation sent to customer.`);
      setIsResourceOpen(false);
      setResourceBooking(null);
    } catch (err: any) {
      toast.error("Failed to allot resources: " + (err?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sync initialServiceFilter prop when updated from sidebar clicks
  useEffect(() => {
    if (initialServiceFilter) {
      setServiceFilter(initialServiceFilter);
    }
  }, [initialServiceFilter]);

  // Load live bookings from MongoDB database
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      api.getLabourBookings(),
      api.getMachineryBookings(),
      api.getExpertQueries(),
      api.getOrders()
    ]).then(([labourRes, machineryRes, expertRes, ordersRes]) => {
      if (!isMounted) return;
      const combined: BookingRow[] = [];

      // 1. Labour Bookings
      if (labourRes.status === "fulfilled" && Array.isArray(labourRes.value)) {
        labourRes.value.forEach((l: any, idx: number) => {
          const bStatus = l.status || "pending_rate";
          combined.push({
            id: l.id || `LAB${100 + idx}`,
            serviceType: l.labourType ? `${l.labourType} Booking` : "Labour Booking",
            icon: "👥",
            customer: l.userName || "Farmer Customer",
            phone: l.phone || "—",
            date: l.startDate || (l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-IN") : "Today"),
            time: "09:00 AM",
            status: bStatus === "allotted" || bStatus === "assigned" || bStatus === "completed" ? "Confirmed" : bStatus === "cancelled" ? "Cancelled" : "Ongoing",
            bookingStatus: bStatus,
            amount: l.rateQuoteAmount || (Number(l.count) || 1) * (Number(l.days) || 1) * 450,
            rawType: "labour",
            rateQuote: l.rateQuote || "",
            rateQuoteAmount: l.rateQuoteAmount || 0,
            rateNotes: l.rateNotes || "",
            duration: `${l.days || 1} Day(s), ${l.count || 1} Worker(s)`,
            location: l.location || "",
            assignedLabours: l.assignedLabours || [],
            userResponse: l.userResponse || "",
          });
        });
      }

      // 2. Machinery Bookings
      if (machineryRes.status === "fulfilled" && Array.isArray(machineryRes.value)) {
        machineryRes.value.forEach((m: any, idx: number) => {
          const bStatus = m.status || "pending_rate";
          combined.push({
            id: m.id || `MAC${100 + idx}`,
            serviceType: m.machineryType || "Tractor Booking",
            icon: "🚜",
            customer: m.userName || "Farmer Customer",
            phone: m.phone || "—",
            date: m.bookingDate || (m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN") : "Today"),
            time: "10:30 AM",
            status: bStatus === "allotted" || bStatus === "completed" ? "Confirmed" : (bStatus === "rejected" || bStatus === "cancelled") ? "Cancelled" : "Ongoing",
            bookingStatus: bStatus,
            amount: m.rateQuoteAmount || (Number(m.durationHours) || 1) * 350,
            rawType: "machinery",
            rateQuote: m.rateQuote || "",
            rateQuoteAmount: m.rateQuoteAmount || 0,
            rateNotes: m.rateNotes || "",
            duration: `${m.durationHours || 4} Hour(s)`,
            location: m.location || "",
            allottedMachine: m.allottedMachine || null,
            allottedMachineDetails: m.allottedMachineDetails || "",
            userResponse: m.userResponse || "",
          });
        });
      }

      // 3. Expert Queries
      if (expertRes.status === "fulfilled" && Array.isArray(expertRes.value)) {
        expertRes.value.forEach((e: any, idx: number) => {
          combined.push({
            id: e.id || `EXP${100 + idx}`,
            serviceType: "Doctor Booking",
            icon: "🩺",
            customer: e.farmerName || "Farmer Customer",
            phone: e.phone || "—",
            date: e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN") : "Today",
            time: "11:00 AM",
            status: e.status === "resolved" ? "Completed" : "Confirmed",
            amount: 500.0,
            rawType: "expert",
          });
        });
      }

      setBookings(combined);
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);

    const matchTab =
      activeTab === "All Bookings" ||
      (activeTab === "Confirmed" && b.status === "Confirmed") ||
      (activeTab === "Ongoing" && b.status === "Ongoing") ||
      (activeTab === "Completed" && b.status === "Completed") ||
      (activeTab === "Cancelled" && b.status === "Cancelled");

    const matchService =
      serviceFilter === "all" ||
      b.serviceType.toLowerCase().includes(serviceFilter.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      b.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchTab && matchService && matchStatus;
  });

  const getStatusBadge = (b: BookingRow) => {
    const s = String(b.bookingStatus || b.status);
    if (s === "pending_rate" || s === "pending") {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
          Pending Rate
        </span>
      );
    }
    if (s === "rate_quoted") {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
          Rate Quoted
        </span>
      );
    }
    if (s === "rate_accepted") {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold animate-pulse">
          ✓ Rate Accepted
        </span>
      );
    }
    if (s === "allotted" || s === "assigned" || s === "Confirmed" || s === "completed" || s === "Completed") {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
          ✓ Allotted
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold">
        Cancelled
      </span>
    );
  };

  // Create Booking Submission
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createCustomer.trim() || !createPhone.trim()) {
      toast.error("Customer name and phone number are required!");
      return;
    }

    setIsSubmitting(true);
    try {
      let createdRow: BookingRow;
      const typeLower = createServiceType.toLowerCase();

      if (typeLower.includes("labour")) {
        const id = `lab-${Date.now()}`;
        const res = await api.addLabourBooking({
          id,
          userName: createCustomer,
          phone: createPhone,
          labourType: createDetails || "Harvesting Labour",
          count: 1,
          days: 1,
          startDate: createDate,
          location: createLocation,
          status: "pending",
        });
        createdRow = {
          id: res.id || id,
          serviceType: "Labour Booking",
          icon: "👥",
          customer: createCustomer,
          phone: createPhone,
          date: createDate,
          time: "09:00 AM",
          status: "Confirmed",
          amount: Number(createAmount) || 1200,
          rawType: "labour",
        };
      } else if (typeLower.includes("expert") || typeLower.includes("doctor")) {
        const id = `exp-${Date.now()}`;
        const res = await api.addExpertQuery({
          id,
          farmerName: createCustomer,
          phone: createPhone,
          cropName: "Agri Crop Advisory",
          problemDetails: createDetails || "Crop Consultation",
          address: createLocation,
          status: "pending",
        });
        createdRow = {
          id: res.id || id,
          serviceType: "Doctor Booking",
          icon: "🩺",
          customer: createCustomer,
          phone: createPhone,
          date: createDate,
          time: "11:00 AM",
          status: "Confirmed",
          amount: Number(createAmount) || 500,
          rawType: "expert",
        };
      } else {
        const id = `mac-${Date.now()}`;
        const res = await api.addMachineryBooking({
          id,
          userName: createCustomer,
          phone: createPhone,
          machineryType: createServiceType,
          bookingDate: createDate,
          durationHours: 4,
          location: createLocation,
          status: "pending",
        });
        createdRow = {
          id: res.id || id,
          serviceType: createServiceType,
          icon: typeLower.includes("soil") ? "🧪" : typeLower.includes("warehouse") ? "🏬" : typeLower.includes("transport") ? "🚚" : "🚜",
          customer: createCustomer,
          phone: createPhone,
          date: createDate,
          time: "10:30 AM",
          status: "Confirmed",
          amount: Number(createAmount) || 2450,
          rawType: "machinery",
        };
      }

      setBookings((prev) => [createdRow, ...prev]);
      toast.success(`New ${createServiceType} #${createdRow.id} created & saved to MongoDB!`);
      setIsCreateOpen(false);
      setCreateCustomer("");
      setCreatePhone("");
      setCreateDetails("");
    } catch (err: any) {
      console.error("Error creating booking:", err);
      toast.error(err.message || "Failed to create booking in database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (b: BookingRow) => {
    setEditingBooking(b);
    setEditCustomer(b.customer);
    setEditPhone(b.phone);
    setEditServiceType(b.serviceType);
    setEditStatus(b.status);
    setEditAmount(b.amount);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setIsSubmitting(true);
    try {
      const id = editingBooking.id;
      const raw = editingBooking.rawType || "";

      if (raw === "labour") {
        await api.updateLabourBooking(id, { status: editStatus.toLowerCase(), adminNotes: `Updated to ${editStatus}` });
      } else if (raw === "machinery") {
        await api.updateMachineryBooking(id, { status: editStatus === "Confirmed" ? "allotted" : editStatus === "Cancelled" ? "rejected" : "pending" });
      } else if (raw === "expert") {
        await api.updateExpertQuery(id, editStatus === "Completed" ? "resolved" : "pending");
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                customer: editCustomer,
                phone: editPhone,
                serviceType: editServiceType,
                status: editStatus,
                amount: editAmount,
              }
            : b
        )
      );

      toast.success(`Booking #${id} updated successfully!`);
      setEditingBooking(null);
    } catch (err: any) {
      console.error("Error updating booking:", err);
      toast.error(err.message || "Failed to update booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    setIsSubmitting(true);
    try {
      const target = bookings.find((b) => b.id === id);
      const raw = target?.rawType || "";

      if (raw === "labour") {
        await api.deleteLabourBooking(id);
      } else if (raw === "machinery") {
        await api.deleteMachineryBooking(id);
      } else if (raw === "expert") {
        await api.deleteExpertQuery(id);
      }

      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success(`Booking #${id} deleted from database!`);
      setDeletingBookingId(null);
    } catch (err: any) {
      console.error("Error deleting booking:", err);
      toast.error(err.message || "Failed to delete booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all service bookings in real-time from MongoDB</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-xl font-semibold cursor-pointer shadow-xs transition-all px-4"
          >
            <Plus className="h-4 w-4" /> Create New Booking
          </Button>
        </div>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Bookings", value: bookings.length.toString(), sub: "Live MongoDB records", icon: "📅", bg: "bg-emerald-50", tc: "text-emerald-600" },
          { label: "Confirmed", value: bookings.filter(b => b.status === "Confirmed").length.toString(), sub: "Confirmed bookings", icon: "✅", bg: "bg-blue-50", tc: "text-blue-600" },
          { label: "Ongoing", value: bookings.filter(b => b.status === "Ongoing").length.toString(), sub: "In-progress services", icon: "⏳", bg: "bg-amber-50", tc: "text-amber-600" },
          { label: "Completed", value: bookings.filter(b => b.status === "Completed").length.toString(), sub: "Fulfilled bookings", icon: "🏆", bg: "bg-purple-50", tc: "text-purple-600" },
          { label: "Cancelled", value: bookings.filter(b => b.status === "Cancelled").length.toString(), sub: "Cancelled bookings", icon: "❌", bg: "bg-red-50", tc: "text-red-600" },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-gray-500 font-medium leading-tight">{k.label}</p>
              <div className={`w-8 h-8 rounded-xl ${k.bg} flex items-center justify-center text-base`}>{k.icon}</div>
            </div>
            <p className="text-xl font-black text-gray-900 leading-tight">{k.value}</p>
            <p className={`text-[10px] ${k.tc} mt-1 font-medium`}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Service Type Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { label: "All Services", value: "all", icon: "📋" },
          { label: "Tractor Booking", value: "tractor", icon: "🚜" },
          { label: "Labour Booking", value: "labour", icon: "👥" },
          { label: "Doctor Booking", value: "doctor", icon: "🩺" },
          { label: "Soil Test", value: "soil", icon: "🧪" },
          { label: "Warehouse", value: "warehouse", icon: "🏬" },
          { label: "Transport", value: "transport", icon: "🚚" },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => setServiceFilter(s.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              serviceFilter === s.value
                ? "bg-emerald-600 text-white shadow-xs font-bold"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Subtabs Header */}
        <div className="flex items-center gap-6 px-5 pt-3 border-b border-gray-100 text-xs font-semibold">
          {["All Bookings", "Confirmed", "Ongoing", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === tab ? "border-emerald-600 text-emerald-700 font-bold" : "border-transparent text-gray-400 hover:text-gray-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input placeholder="Search by Booking ID, Service, Customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl" />
          </div>
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none cursor-pointer">
            <option value="all">All Services</option>
            <option value="tractor">Tractor Booking</option>
            <option value="labour">Labour Booking</option>
            <option value="doctor">Doctor Booking</option>
            <option value="soil">Soil Test Booking</option>
            <option value="warehouse">Warehouse Booking</option>
            <option value="transport">Transport Booking</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 outline-none cursor-pointer">
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button onClick={() => { setSearch(""); setServiceFilter("all"); setStatusFilter("all"); }} variant="outline" className="h-8 text-xs gap-1 rounded-xl border-gray-200 cursor-pointer">
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 text-left">Booking ID</th>
                <th className="py-3 px-4 text-left">Service Type</th>
                <th className="py-3 px-4 text-left">Customer Name</th>
                <th className="py-3 px-4 text-left">Phone Number</th>
                <th className="py-3 px-4 text-left">Booking Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400 text-xs">
                    Loading live bookings from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Calendar className="h-8 w-8 text-gray-300" />
                      <p className="text-sm font-bold text-gray-800">No Bookings Found</p>
                      <p className="text-xs text-gray-400">There are currently no bookings matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 text-[11px]">{b.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{b.icon}</span>
                        <span className="font-semibold text-gray-800">{b.serviceType}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{b.customer}</td>
                    <td className="py-3.5 px-4 text-gray-600">{b.phone}</td>
                    <td className="py-3.5 px-4 text-gray-500">{b.date}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(b)}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">₹ {b.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* Step 1: Allot Rate button when pending */}
                        {(b.bookingStatus === "pending_rate" || b.bookingStatus === "pending") && (b.rawType === "machinery" || b.rawType === "labour") && (
                          <button
                            onClick={() => handleOpenRateModal(b)}
                            title="Allot Rate & Charges"
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                          >
                            <IndianRupee className="h-3 w-3" /> Allot Rate
                          </button>
                        )}

                        {/* Step 2: Allot Resources button when rate accepted */}
                        {b.bookingStatus === "rate_accepted" && (
                          <button
                            onClick={() => handleOpenResourceModal(b)}
                            title="Allot Resources (Machine / Labour details)"
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs animate-pulse cursor-pointer transition-all"
                          >
                            {b.rawType === "labour" ? <Users className="h-3 w-3" /> : <Tractor className="h-3 w-3" />} Allot Resources
                          </button>
                        )}

                        {/* If Rate Quoted */}
                        {b.bookingStatus === "rate_quoted" && (
                          <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                            Awaiting User
                          </span>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => setDetailsBooking(b)}
                          title="View Full Booking Details"
                          className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(b)}
                          title="Edit Booking"
                          className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeletingBookingId(b.id)}
                          title="Delete Booking"
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center justify-center transition-colors cursor-pointer"
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

      {/* CREATE NEW BOOKING MODAL DIALOG */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Create New Service Booking</h3>
                <p className="text-xs text-gray-500">Add a new booking directly into MongoDB database</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Service Type <span className="text-red-500">*</span></label>
                <select
                  value={createServiceType}
                  onChange={(e) => setCreateServiceType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-emerald-500"
                  required
                >
                  <option value="Tractor Booking">🚜 Tractor Booking</option>
                  <option value="Labour Booking">👥 Labour Booking</option>
                  <option value="Doctor Booking">🩺 Doctor Booking / Crop Advisory</option>
                  <option value="Soil Test Booking">🧪 Soil Test Booking</option>
                  <option value="Warehouse Booking">🏬 Warehouse Booking</option>
                  <option value="Transport Booking">🚚 Transport Booking</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Customer / Farmer Name <span className="text-red-500">*</span></label>
                  <Input value={createCustomer} onChange={(e) => setCreateCustomer(e.target.value)} placeholder="e.g. Ramesh Kumar" className="bg-gray-50 border-gray-200 text-xs" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Phone Number <span className="text-red-500">*</span></label>
                  <Input value={createPhone} onChange={(e) => setCreatePhone(e.target.value)} placeholder="e.g. 9876543210" className="bg-gray-50 border-gray-200 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Booking Date</label>
                  <Input type="date" value={createDate} onChange={(e) => setCreateDate(e.target.value)} className="bg-gray-50 border-gray-200 text-xs" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Booking Amount (₹)</label>
                  <Input type="number" value={createAmount} onChange={(e) => setCreateAmount(Number(e.target.value))} className="bg-gray-50 border-gray-200 text-xs" required />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Location / Address</label>
                <Input value={createLocation} onChange={(e) => setCreateLocation(e.target.value)} placeholder="e.g. Village Rampur, Danapur, Patna" className="bg-gray-50 border-gray-200 text-xs" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Service Details / Notes</label>
                <Input value={createDetails} onChange={(e) => setCreateDetails(e.target.value)} placeholder="e.g. 45 HP Tractor with Cultivator attachment" className="bg-gray-50 border-gray-200 text-xs" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-xs text-gray-600">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  {isSubmitting ? "Creating & Saving..." : "Create & Save to DB"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL DIALOG */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Edit Booking #{editingBooking.id}</h3>
                <p className="text-xs text-gray-500">Service: {editingBooking.serviceType}</p>
              </div>
              <button onClick={() => setEditingBooking(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Customer Name</label>
                  <Input value={editCustomer} onChange={(e) => setEditCustomer(e.target.value)} className="bg-gray-50 border-gray-200 text-xs" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Phone Number</label>
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="bg-gray-50 border-gray-200 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Service Type</label>
                  <select value={editServiceType} onChange={(e) => setEditServiceType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer">
                    <option value="Tractor Booking">Tractor Booking</option>
                    <option value="Labour Booking">Labour Booking</option>
                    <option value="Doctor Booking">Doctor Booking</option>
                    <option value="Soil Test Booking">Soil Test Booking</option>
                    <option value="Warehouse Booking">Warehouse Booking</option>
                    <option value="Transport Booking">Transport Booking</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Status</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer">
                    <option value="Confirmed">Confirmed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Booking Amount (₹)</label>
                <Input type="number" value={editAmount} onChange={(e) => setEditAmount(Number(e.target.value))} className="bg-gray-50 border-gray-200 text-xs" required />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setEditingBooking(null)} className="text-xs text-gray-600">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: STEP 1 - ALLOT RATE & CHARGES MODAL ─── */}
      {isRateOpen && rateBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => { setIsRateOpen(false); setRateBooking(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full bg-gray-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-xl font-bold shrink-0">
                <IndianRupee className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Step 1: Allot Rate & Booking Charges</h3>
                <p className="text-xs text-gray-500">Booking #{rateBooking.id} • {rateBooking.serviceType}</p>
              </div>
            </div>

            {/* Request Summary */}
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Customer Name:</span>
                <span className="font-bold text-gray-900">{rateBooking.customer} ({rateBooking.phone})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Requested Service:</span>
                <span className="font-semibold text-gray-800">{rateBooking.serviceType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Scheduled Date & Time:</span>
                <span className="font-semibold text-gray-800">{rateBooking.date} • {rateBooking.duration || "Standard"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="font-medium text-gray-800">{rateBooking.location || "On site"}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitRate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Rate / Price Quote Terms (Visible to user) <span className="text-red-500">*</span>
                </label>
                <Input
                  value={rateQuoteInput}
                  onChange={(e) => setRateQuoteInput(e.target.value)}
                  placeholder="e.g. ₹400 / hr (Fuel and driver included)"
                  className="text-xs bg-gray-50 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Total Estimated / Payable Amount (₹) <span className="text-red-500">*</span></label>
                <Input
                  type="number"
                  value={rateQuoteAmountInput || ""}
                  onChange={(e) => setRateQuoteAmountInput(Number(e.target.value))}
                  placeholder="e.g. 1600"
                  className="text-xs bg-gray-50 rounded-xl font-bold text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Admin Notes / Remarks for Farmer</label>
                <Input
                  value={rateNotesInput}
                  onChange={(e) => setRateNotesInput(e.target.value)}
                  placeholder="e.g. Standard day shift. Please keep field clear."
                  className="text-xs bg-gray-50 rounded-xl"
                />
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-800">
                ℹ️ Once submitted, this rate quote will be directly sent to <strong>{rateBooking.customer}</strong>'s profile as a notification. The user will be given <strong>Accept</strong> or <strong>Cancel</strong> options.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => { setIsRateOpen(false); setRateBooking(null); }}
                  className="text-xs text-gray-600 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer shadow-md"
                >
                  {isSubmitting ? "Submitting Quote..." : "Submit Rate & Notify User →"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: STEP 2 - ALLOT RESOURCES MODAL (After User Accepts) ─── */}
      {isResourceOpen && resourceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => { setIsResourceOpen(false); setResourceBooking(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full bg-gray-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xl font-bold shrink-0">
                {resourceBooking.rawType === "labour" ? <Users className="h-6 w-6" /> : <Tractor className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Step 2: Allot Resources</h3>
                <p className="text-xs text-gray-500">Booking #{resourceBooking.id} • Rate Accepted by {resourceBooking.customer}</p>
              </div>
            </div>

            {/* Accepted Rate Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs flex items-center justify-between">
              <div>
                <span className="text-gray-500 block text-[11px]">Agreed & Accepted Rate:</span>
                <span className="font-bold text-emerald-800 text-sm">{resourceBooking.rateQuote || `₹${resourceBooking.amount}`}</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-black border border-emerald-300">
                ✓ User Accepted
              </span>
            </div>

            <form onSubmit={handleSubmitResources} className="space-y-3.5 text-xs">
              {/* If Labour Booking */}
              {resourceBooking.rawType === "labour" ? (
                <>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Labour / Worker Names (Comma-separated) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={resWorkerNames}
                      onChange={(e) => setResWorkerNames(e.target.value)}
                      placeholder="e.g. Ramesh Yadav, Mukesh Kumar, Sunita Devi"
                      className="text-xs bg-gray-50 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Lead Worker / Supervisor Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={resLeadPhone}
                      onChange={(e) => setResLeadPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className="text-xs bg-gray-50 rounded-xl"
                      required
                    />
                  </div>
                </>
              ) : (
                /* Machinery Booking */
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Machine Name / Model <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={resMachineName}
                        onChange={(e) => setResMachineName(e.target.value)}
                        placeholder="e.g. John Deere 5050D"
                        className="text-xs bg-gray-50 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Number Plate / Reg No. <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={resNumberPlate}
                        onChange={(e) => setResNumberPlate(e.target.value.toUpperCase())}
                        placeholder="e.g. BR-01-AX-4892"
                        className="text-xs font-mono font-bold bg-gray-50 rounded-xl uppercase"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Operator / Driver Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={resOperatorName}
                        onChange={(e) => setResOperatorName(e.target.value)}
                        placeholder="e.g. Vikram Singh"
                        className="text-xs bg-gray-50 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Operator Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={resOperatorPhone}
                        onChange={(e) => setResOperatorPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        maxLength={10}
                        placeholder="10-digit phone"
                        className="text-xs bg-gray-50 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Additional Notes / Instructions</label>
                <Input
                  value={resNotes}
                  onChange={(e) => setResNotes(e.target.value)}
                  placeholder="e.g. Operator will reach 15 mins before start time"
                  className="text-xs bg-gray-50 rounded-xl"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800">
                ✅ Submitting this will allot the resources and automatically send the <strong>Final Confirmation Notification</strong> with all details (Time, Duration, Address, Rate, Machine/Labour details) directly to the user profile.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => { setIsResourceOpen(false); setResourceBooking(null); }}
                  className="text-xs text-gray-600 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-md"
                >
                  {isSubmitting ? "Allotting Resources..." : "Confirm & Send Final Notification →"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: VIEW BOOKING DETAILS MODAL ─── */}
      {detailsBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => setDetailsBooking(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full bg-gray-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-bold shrink-0">
                {detailsBooking.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{detailsBooking.serviceType}</h3>
                <p className="text-xs text-gray-500">Booking ID #{detailsBooking.id}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Current Status:</span>
                <div>{getStatusBadge(detailsBooking)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Customer:</span>
                  <span className="font-bold text-gray-900">{detailsBooking.customer}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Phone:</span>
                  <span className="font-bold text-gray-900">{detailsBooking.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Date:</span>
                  <span className="font-medium text-gray-800">{detailsBooking.date}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Duration / Workers:</span>
                  <span className="font-medium text-gray-800">{detailsBooking.duration || "N/A"}</span>
                </div>
              </div>

              {detailsBooking.location && (
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Location:</span>
                  <span className="font-medium text-gray-800">{detailsBooking.location}</span>
                </div>
              )}

              {detailsBooking.rateQuote && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <span className="text-amber-800 font-bold block text-[11px]">Quoted Rate:</span>
                  <span className="font-bold text-gray-900 text-sm">{detailsBooking.rateQuote}</span>
                  {detailsBooking.rateNotes && <p className="text-[11px] text-gray-500 mt-0.5 italic">"{detailsBooking.rateNotes}"</p>}
                </div>
              )}

              {detailsBooking.allottedMachineDetails && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-emerald-800 font-bold block text-[11px]">Allotted Resources:</span>
                  <span className="font-bold text-gray-900">{detailsBooking.allottedMachineDetails}</span>
                </div>
              )}

              {detailsBooking.assignedLabours && detailsBooking.assignedLabours.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-blue-800 font-bold block text-[11px]">Assigned Labours:</span>
                  <span className="font-bold text-gray-900">
                    {detailsBooking.assignedLabours.map((l: any) => `${l.name} (${l.phone || "N/A"})`).join(", ")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <Button onClick={() => setDetailsBooking(null)} className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-xl">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Booking #{deletingBookingId}?</h3>
              <p className="text-xs text-gray-500 mt-1">Are you sure you want to delete this booking record from MongoDB?</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setDeletingBookingId(null)} className="text-xs text-gray-600">Cancel</Button>
              <Button disabled={isSubmitting} onClick={() => handleDeleteBooking(deletingBookingId)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer">
                {isSubmitting ? "Deleting..." : "Delete Permanently"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

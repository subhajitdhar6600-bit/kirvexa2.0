import React, { useState, useEffect } from "react";
import {
  Search, Eye, Edit2, Trash2, Plus, Download, Filter,
  CheckCircle, ChevronRight, Layers, ShieldCheck, CreditCard,
  Percent, ArrowRight, Shield, Award, Users, ShoppingBag, X, Check,
  Power, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { api } from "@/services/api";

interface CardType {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  desc: string;
  price: number;
  creditLimit: number;
  validity: string;
  status: "Active" | "Inactive";
  color: string;
  border: string;
  benefits: string[];
}

const DEFAULT_CARD_TYPES: CardType[] = [
  {
    id: "1",
    name: "Kisan Card Basic",
    tag: "Most Popular",
    tagColor: "bg-emerald-100 text-emerald-800",
    desc: "बुनियादी सुविधाओं के साथ आपके कृषि कार्यों के लिए सबसे उपयुक्त कार्ड।",
    price: 299,
    creditLimit: 10000,
    validity: "1 Year",
    status: "Active",
    color: "from-emerald-700 to-teal-900",
    border: "border-emerald-600/40",
    benefits: [
      "Online Shopping Discounts",
      "Mandi Rate Access",
      "Weather Updates",
      "Agri Expert Support",
    ],
  },
  {
    id: "2",
    name: "Kisan Card Premium",
    tag: "Best Value",
    tagColor: "bg-blue-100 text-blue-800",
    desc: "उन्नत सुविधाओं के साथ कृषि यंत्र बुकिंग और विशेष छूट।",
    price: 799,
    creditLimit: 25000,
    validity: "2 Years",
    status: "Active",
    color: "from-blue-700 to-indigo-900",
    border: "border-blue-600/40",
    benefits: [
      "All Basic Card Benefits",
      "Higher Credit Limit",
      "Priority Machinery Booking",
      "Free Soil Health Test",
    ],
  },
  {
    id: "3",
    name: "Kisan Card Gold",
    tag: "Exclusive",
    tagColor: "bg-amber-100 text-amber-800",
    desc: "अधिकतम क्रेडिट सीमा और संपूर्ण कृषि सहायता पैकेज।",
    price: 1499,
    creditLimit: 50000,
    validity: "3 Years",
    status: "Active",
    color: "from-amber-600 to-orange-800",
    border: "border-amber-600/40",
    benefits: [
      "All Premium Benefits",
      "Maximum Credit Facility",
      "Dedicated Farm Advisor",
      "Zero Processing Fee on Loans",
    ],
  },
];

export default function CardTypesView() {
  const [cardTypes, setCardTypes] = useState<CardType[]>(DEFAULT_CARD_TYPES);
  const [selectedType, setSelectedType] = useState<CardType>(DEFAULT_CARD_TYPES[0]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState("all");

  const [totalCardsIssued, setTotalCardsIssued] = useState(6);
  const [totalRevenue, setTotalRevenue] = useState(10440);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<CardType | null>(null);

  // New card type form
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeTag, setNewTypeTag] = useState("Custom Tier");
  const [newTypeDesc, setNewTypeDesc] = useState("");
  const [newTypePrice, setNewTypePrice] = useState(499);
  const [newTypeLimit, setNewTypeLimit] = useState(15000);
  const [newTypeProcessingFee, setNewTypeProcessingFee] = useState(0);
  const [newTypeInterestRate, setNewTypeInterestRate] = useState(0);
  const [newTypeValidity, setNewTypeValidity] = useState("1 Year");
  const [newTypeStatus, setNewTypeStatus] = useState<"Active" | "Inactive">("Active");
  const [newTypeColor, setNewTypeColor] = useState("from-emerald-700 to-teal-900");
  const [newTypeBenefits, setNewTypeBenefits] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([api.getUsers(), api.getOrders()]).then(([usersRes, ordersRes]) => {
      if (!mounted) return;
      if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value)) {
        setTotalCardsIssued(usersRes.value.length);
      }
      if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value)) {
        const rev = ordersRes.value.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || Number(o.amount) || 0), 0);
        setTotalRevenue(rev);
      }
    });
    return () => { mounted = false; };
  }, []);

  const filtered = cardTypes.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchPrice =
      priceRangeFilter === "all" ||
      (priceRangeFilter === "low" && c.price < 500) ||
      (priceRangeFilter === "mid" && c.price >= 500 && c.price <= 1500) ||
      (priceRangeFilter === "high" && c.price > 1500);
    return matchSearch && matchStatus && matchPrice;
  });

  // 1. Toggle Active / Inactive
  const handleToggleStatus = (id: string) => {
    setCardTypes(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === "Active" ? "Inactive" : "Active";
        toast.success(`"${c.name}" status updated to ${nextStatus}!`);
        const updated = { ...c, status: nextStatus as "Active" | "Inactive" };
        if (selectedType.id === id) setSelectedType(updated);
        return updated;
      }
      return c;
    }));
  };

  // 2. Delete Card Type
  const handleDeleteType = (id: string, name: string) => {
    if (cardTypes.length <= 1) {
      toast.error("At least one card tier must remain active");
      return;
    }
    const remaining = cardTypes.filter(c => c.id !== id);
    setCardTypes(remaining);
    if (selectedType.id === id) {
      setSelectedType(remaining[0]);
    }
    toast.success(`Card Tier "${name}" has been deleted successfully!`);
  };

  // 3. Save Edit Card Type
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;
    setCardTypes(prev => prev.map(c => c.id === editingType.id ? editingType : c));
    if (selectedType.id === editingType.id) {
      setSelectedType(editingType);
    }
    setEditingType(null);
    toast.success(`Card Tier "${editingType.name}" updated successfully!`);
  };

  // 4. Add New Card Type
  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName) return;
    const colorBorderMap: Record<string, string> = {
      "from-emerald-700 to-teal-900": "border-emerald-600/40",
      "from-blue-700 to-indigo-900": "border-blue-600/40",
      "from-amber-600 to-orange-900": "border-amber-600/40",
      "from-purple-700 to-indigo-900": "border-purple-600/40",
      "from-rose-700 to-pink-900": "border-rose-600/40",
      "from-slate-700 to-gray-900": "border-slate-600/40",
    };
    const tagColorMap: Record<string, string> = {
      "Most Popular": "bg-emerald-100 text-emerald-800",
      "Best Value": "bg-blue-100 text-blue-800",
      "Premium": "bg-amber-100 text-amber-800",
      "Exclusive": "bg-purple-100 text-purple-800",
      "New": "bg-rose-100 text-rose-800",
      "Custom Tier": "bg-gray-100 text-gray-700",
    };
    const benefitsList = newTypeBenefits
      ? newTypeBenefits.split(",").map(b => b.trim()).filter(Boolean)
      : ["Online Shopping Discounts", "Priority Farming Support", "Expert Advice"];
    const newType: CardType = {
      id: `type_${Date.now()}`,
      name: newTypeName,
      tag: newTypeTag || "Custom Tier",
      tagColor: tagColorMap[newTypeTag] || "bg-gray-100 text-gray-700",
      desc: newTypeDesc || "Custom card tier with curated agricultural benefits and smart credit limit.",
      price: Number(newTypePrice) || 499,
      creditLimit: Number(newTypeLimit) || 15000,
      validity: newTypeValidity,
      status: newTypeStatus,
      color: newTypeColor,
      border: colorBorderMap[newTypeColor] || "border-gray-600/40",
      benefits: benefitsList,
    };
    setCardTypes(prev => [...prev, newType]);
    setSelectedType(newType);
    setIsAddModalOpen(false);
    setNewTypeName("");
    setNewTypeTag("Custom Tier");
    setNewTypeDesc("");
    setNewTypePrice(499);
    setNewTypeLimit(15000);
    setNewTypeProcessingFee(0);
    setNewTypeInterestRate(0);
    setNewTypeValidity("1 Year");
    setNewTypeStatus("Active");
    setNewTypeColor("from-emerald-700 to-teal-900");
    setNewTypeBenefits("");
    toast.success(`Card Tier "${newTypeName}" created successfully!`);
  };

  const handleExport = () => {
    try {
      const headers = ["Card Tier", "Price (INR)", "Credit Limit", "Validity", "Status"];
      const rows = cardTypes.map(c => [c.name, c.price, c.creditLimit, c.validity, c.status]);
      const csv = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Card_Tiers_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Card tiers exported successfully!");
    } catch {
      toast.error("Failed to export card tiers");
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Card Types Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Create and manage all Krivexa Kisan Card types, limits, and features</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span>
          <span>›</span>
          <span>Krivexa Card</span>
          <span>›</span>
          <span className="text-emerald-600 font-medium">Card Types</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Card Types", value: cardTypes.length.toString(), sub: "Available tiers", Icon: CreditCard, bg: "bg-emerald-50", tc: "text-emerald-600" },
          { label: "Active Card Types", value: cardTypes.filter(c => c.status === "Active").length.toString(), sub: "Active tiers", Icon: ShieldCheck, bg: "bg-blue-50", tc: "text-blue-600" },
          { label: "Total Cards Issued", value: totalCardsIssued.toString(), sub: "Database accounts", Icon: Users, bg: "bg-purple-50", tc: "text-purple-600" },
          { label: "Total Revenue", value: `₹ ${totalRevenue.toLocaleString("en-IN")}`, sub: "Delivered volume", Icon: ShoppingBag, bg: "bg-amber-50", tc: "text-amber-600" },
        ].map((s, i) => {
          const CardIcon = s.Icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.tc} flex items-center justify-center`}>
                  <CardIcon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Split: Cards List Left + Right Details Panel */}
      <div className="flex gap-4">
        {/* Left List */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by card type name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs border-gray-200 bg-gray-50 rounded-xl"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={priceRangeFilter}
              onChange={(e) => setPriceRangeFilter(e.target.value)}
              className="h-8 px-3 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium cursor-pointer"
            >
              <option value="all">All Price Range</option>
              <option value="low">Under ₹500</option>
              <option value="mid">₹500 - ₹1500</option>
              <option value="high">Above ₹1500</option>
            </select>
            <button
              onClick={handleExport}
              title="Download CSV"
              className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
            </button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 rounded-xl font-semibold gap-1.5 ml-auto cursor-pointer shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add New Card Type
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 text-left w-8">#</th>
                  <th className="py-3 px-4 text-left">Card Type Details</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Credit Limit</th>
                  <th className="py-3 px-4 text-left">Validity</th>
                  <th className="py-3 px-4 text-left">Benefits</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c, idx) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedType(c)}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedType.id === c.id ? "bg-emerald-50/50" : ""}`}
                  >
                    <td className="py-4 px-4 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-9 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-[8px] font-bold shrink-0 shadow-2xs`}>
                          KRIVEXA
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900">{c.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${c.tagColor}`}>
                              {c.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 max-w-xs truncate">{c.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-black text-gray-900">₹ {c.price}</td>
                    <td className="py-4 px-4 font-bold text-emerald-700">Up to ₹ {c.creditLimit.toLocaleString("en-IN")}</td>
                    <td className="py-4 px-4 text-gray-600 font-medium">{c.validity}</td>
                    <td className="py-4 px-4">
                      <div className="space-y-0.5 max-w-[140px]">
                        {c.benefits.slice(0, 2).map((b, bi) => (
                          <div key={bi} className="flex items-center gap-1 text-[10px] text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* STATUS TOGGLE BUTTON */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(c.id);
                        }}
                        title={`Click to set as ${c.status === "Active" ? "Inactive" : "Active"}`}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          c.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {c.status}
                      </button>
                    </td>

                    {/* ACTIONS: VIEW, EDIT, INACTIVE TOGGLE, DELETE */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedType(c); }}
                          title="View Details"
                          className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingType({ ...c }); }}
                          title="Edit Card Type"
                          className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 cursor-pointer transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Inactive / Power Toggle Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(c.id); }}
                          title={c.status === "Active" ? "Set Inactive" : "Set Active"}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                            c.status === "Active"
                              ? "bg-amber-50 hover:bg-amber-100 text-amber-700"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteType(c.id, c.name); }}
                          title="Delete Card Type"
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 cursor-pointer transition-colors"
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
        </div>

        {/* Right Details Panel */}
        <div className="w-72 space-y-4 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-800 mb-3">Card Tier Overview</p>

            {/* The Visual Card */}
            <div className={`relative w-full h-36 rounded-2xl bg-gradient-to-br ${selectedType.color} p-3.5 text-white shadow-lg overflow-hidden border ${selectedType.border}`}>
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-white" />
                  <span className="font-bold text-xs tracking-wider text-white">Krivexa</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold border border-white/30">
                  {selectedType.name.replace("Kisan Card ", "").toUpperCase()}
                </span>
              </div>

              {/* Number */}
              <p className="font-mono text-xs tracking-widest text-white/90 mb-2">
                KVX 1256 **** 8899
              </p>

              {/* Price & Credit */}
              <div className="flex items-center justify-between text-[10px] text-white/80">
                <span>Fee: ₹{selectedType.price}</span>
                <span className="font-bold text-white">Limit: ₹{selectedType.creditLimit.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mt-3 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">Tier Name</span><span className="font-bold text-gray-800">{selectedType.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Card Fee</span><span className="font-bold text-emerald-700">₹ {selectedType.price}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Credit Limit</span><span className="font-bold text-gray-900">₹ {selectedType.creditLimit.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Validity</span><span className="font-semibold text-gray-700">{selectedType.validity}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  selectedType.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"
                }`}>
                  {selectedType.status}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
              <Button
                onClick={() => setEditingType({ ...selectedType })}
                className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-semibold gap-1 cursor-pointer"
              >
                <Edit2 className="h-3 w-3" /> Edit Tier
              </Button>
              <Button
                onClick={() => handleToggleStatus(selectedType.id)}
                variant="outline"
                className={`h-8 text-xs rounded-xl font-semibold cursor-pointer ${
                  selectedType.status === "Active" ? "text-amber-700 border-amber-200 hover:bg-amber-50" : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                {selectedType.status === "Active" ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Edit Card Type Modal ─── */}
      {editingType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setEditingType(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-1">Edit Card Tier</h3>
            <p className="text-xs text-gray-500 mb-4">Modify card tier specifications, limits, and status</p>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs max-h-[75vh] overflow-y-auto pr-1">
              {/* Row 1: Name */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Card Tier Name *</label>
                <Input
                  value={editingType.name}
                  onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              {/* Row 2: Tag + Color */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tag / Label</label>
                  <select
                    value={editingType.tag}
                    onChange={(e) => {
                      const tagColorMap: Record<string, string> = {
                        "Most Popular": "bg-emerald-100 text-emerald-800",
                        "Best Value": "bg-blue-100 text-blue-800",
                        "Premium": "bg-amber-100 text-amber-800",
                        "Exclusive": "bg-purple-100 text-purple-800",
                        "New": "bg-rose-100 text-rose-800",
                        "Custom Tier": "bg-gray-100 text-gray-700",
                      };
                      setEditingType({ ...editingType, tag: e.target.value, tagColor: tagColorMap[e.target.value] || "bg-gray-100 text-gray-700" });
                    }}
                    className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    <option value="Most Popular">Most Popular</option>
                    <option value="Best Value">Best Value</option>
                    <option value="Premium">Premium</option>
                    <option value="Exclusive">Exclusive</option>
                    <option value="New">New</option>
                    <option value="Custom Tier">Custom Tier</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Card Color</label>
                  <select
                    value={editingType.color}
                    onChange={(e) => {
                      const borderMap: Record<string, string> = {
                        "from-emerald-700 to-teal-900": "border-emerald-600/40",
                        "from-blue-700 to-indigo-900": "border-blue-600/40",
                        "from-amber-600 to-orange-900": "border-amber-600/40",
                        "from-purple-700 to-indigo-900": "border-purple-600/40",
                        "from-rose-700 to-pink-900": "border-rose-600/40",
                        "from-slate-700 to-gray-900": "border-slate-600/40",
                      };
                      setEditingType({ ...editingType, color: e.target.value, border: borderMap[e.target.value] || "border-gray-600/40" });
                    }}
                    className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    <option value="from-emerald-700 to-teal-900">🟢 Emerald (Green)</option>
                    <option value="from-blue-700 to-indigo-900">🔵 Blue Indigo</option>
                    <option value="from-amber-600 to-orange-900">🟠 Amber Gold</option>
                    <option value="from-purple-700 to-indigo-900">🟣 Purple Indigo</option>
                    <option value="from-rose-700 to-pink-900">🔴 Rose Pink</option>
                    <option value="from-slate-700 to-gray-900">⚫ Slate Gray</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingType.desc}
                  onChange={(e) => setEditingType({ ...editingType, desc: e.target.value })}
                  rows={2}
                  placeholder="Card tier description (can include Hindi text)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              {/* Row 4: Annual Fee + Credit Limit */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Annual Fee (₹)</label>
                  <Input
                    type="number"
                    value={editingType.price}
                    onChange={(e) => setEditingType({ ...editingType, price: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Credit Limit (₹)</label>
                  <Input
                    type="number"
                    value={editingType.creditLimit}
                    onChange={(e) => setEditingType({ ...editingType, creditLimit: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Row 5: Validity + Status */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Validity Period</label>
                  <select
                    value={editingType.validity}
                    onChange={(e) => setEditingType({ ...editingType, validity: e.target.value })}
                    className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={editingType.status}
                    onChange={(e: any) => setEditingType({ ...editingType, status: e.target.value })}
                    className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Benefits */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Benefits (comma-separated)</label>
                <Input
                  placeholder="e.g. Mandi Rate Access, Weather Updates, Expert Support"
                  value={editingType.benefits.join(", ")}
                  onChange={(e) => setEditingType({ ...editingType, benefits: e.target.value.split(",").map(b => b.trim()).filter(Boolean) })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingType(null)}
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

      {/* ─── Add New Card Type Modal ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-1">Add New Card Tier</h3>
            <p className="text-xs text-gray-500 mb-4">Define a new card tier for Bihar farmers and retailers</p>

            <form onSubmit={handleAddType} className="space-y-3 text-xs max-h-[75vh] overflow-y-auto pr-1">
              {/* Name */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Card Tier Name *</label>
                <Input
                  placeholder="e.g. Kisan Card Platinum"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              {/* Tag + Color */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tag / Label</label>
                  <select
                    value={newTypeTag}
                    onChange={(e) => setNewTypeTag(e.target.value)}
                    className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    <option value="Most Popular">Most Popular</option>
                    <option value="Best Value">Best Value</option>
                    <option value="Premium">Premium</option>
                    <option value="Exclusive">Exclusive</option>
                    <option value="New">New</option>
                    <option value="Custom Tier">Custom Tier</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Card Color</label>
                  <select
                    value={newTypeColor}
                    onChange={(e) => setNewTypeColor(e.target.value)}
                    className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    <option value="from-emerald-700 to-teal-900">🟢 Emerald (Green)</option>
                    <option value="from-blue-700 to-indigo-900">🔵 Blue Indigo</option>
                    <option value="from-amber-600 to-orange-900">🟠 Amber Gold</option>
                    <option value="from-purple-700 to-indigo-900">🟣 Purple Indigo</option>
                    <option value="from-rose-700 to-pink-900">🔴 Rose Pink</option>
                    <option value="from-slate-700 to-gray-900">⚫ Slate Gray</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTypeDesc}
                  onChange={(e) => setNewTypeDesc(e.target.value)}
                  rows={2}
                  placeholder="Short description of this card tier (Hindi/English)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              {/* Annual Fee + Credit Limit */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Annual Fee (₹) *</label>
                  <Input
                    type="number"
                    min="0"
                    value={newTypePrice}
                    onChange={(e) => setNewTypePrice(Number(e.target.value))}
                    className="h-9 text-xs rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Credit Limit (₹) *</label>
                  <Input
                    type="number"
                    min="0"
                    value={newTypeLimit}
                    onChange={(e) => setNewTypeLimit(Number(e.target.value))}
                    className="h-9 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Processing Fee + Interest Rate */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Processing Fee (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    value={newTypeProcessingFee}
                    onChange={(e) => setNewTypeProcessingFee(Number(e.target.value))}
                    className="h-9 text-xs rounded-xl"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Interest Rate (%)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={newTypeInterestRate}
                    onChange={(e) => setNewTypeInterestRate(Number(e.target.value))}
                    className="h-9 text-xs rounded-xl"
                    placeholder="0.0"
                  />
                </div>
              </div>

              {/* Validity + Status */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Validity Period</label>
                  <select
                    value={newTypeValidity}
                    onChange={(e) => setNewTypeValidity(e.target.value)}
                    className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={newTypeStatus}
                    onChange={(e: any) => setNewTypeStatus(e.target.value)}
                    className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Benefits (comma-separated)</label>
                <Input
                  placeholder="e.g. Mandi Rate Access, Weather Updates, Expert Support"
                  value={newTypeBenefits}
                  onChange={(e) => setNewTypeBenefits(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 text-xs rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 rounded-xl font-semibold gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="h-3.5 w-3.5" /> Create Tier
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-gray-400">
        © 2026 Farma. All rights reserved. &nbsp; Real-time Bihar Kisan Card Tiers
      </div>
    </div>
  );
}

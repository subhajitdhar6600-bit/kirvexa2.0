import { useState } from "react";
import { ArrowLeft, Edit3, MessageSquare, CheckCircle, MapPin, Phone, Mail, Calendar, ShieldCheck, FileText, Package, ShoppingCart, DollarSign, Award } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { Farmer } from "../types.ts";

interface FarmerProfileViewProps {
  farmer: Farmer;
  onBack: () => void;
}

export default function FarmerProfileView({ farmer, onBack }: FarmerProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "products" | "orders" | "earnings" | "activity" | "notes">("overview");

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-xs text-gray-300 hover:text-white border border-white/10">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Farmers List
        </Button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs border-white/10 text-gray-300">
            <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit Profile
          </Button>
          <Button size="sm" className="bg-emerald-500 text-black font-bold text-xs">
            <MessageSquare className="h-3.5 w-3.5 mr-1" /> Message Farmer
          </Button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-3xl shadow-lg">
            {farmer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-white">{farmer.name}</h1>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-xs">
                {farmer.id}
              </Badge>
              {farmer.verified === "verified" && (
                <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-4">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-emerald-400" /> {farmer.location}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-emerald-400" /> {farmer.phone}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-emerald-400" /> {farmer.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Total Products</span>
            <Package className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{farmer.totalProducts}</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Total Orders</span>
            <ShoppingCart className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{farmer.totalOrders}</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Total Sales</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">₹{farmer.totalSales.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Total Earnings</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">₹{farmer.totalEarnings.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Profile Details Cards: Personal & Farm Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-400">Full Name</p>
              <p className="font-bold text-white mt-0.5">{farmer.name}</p>
            </div>
            <div>
              <p className="text-gray-400">Phone</p>
              <p className="font-bold text-white mt-0.5">{farmer.phone}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-bold text-white mt-0.5">{farmer.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Date of Birth</p>
              <p className="font-bold text-white mt-0.5">{farmer.dob}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400">Address</p>
              <p className="font-bold text-white mt-0.5">{farmer.address}</p>
            </div>
          </div>
        </div>

        {/* Farm Info */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <FileText className="h-4 w-4 text-emerald-400" /> Farm Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-400">Farm Name</p>
              <p className="font-bold text-white mt-0.5">{farmer.farmName}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Land</p>
              <p className="font-bold text-white mt-0.5">{farmer.totalLand}</p>
            </div>
            <div>
              <p className="text-gray-400">Land Type</p>
              <p className="font-bold text-white mt-0.5">{farmer.landType}</p>
            </div>
            <div>
              <p className="text-gray-400">Organic Certified</p>
              <Badge className={farmer.organicCertified === "Yes" ? "bg-emerald-500/10 text-emerald-400 mt-0.5" : "bg-gray-500/10 text-gray-400 mt-0.5"}>
                {farmer.organicCertified}
              </Badge>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400">Main Crops</p>
              <p className="font-bold text-white mt-0.5">{farmer.mainCrops}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
        <div className="flex border-b border-white/10 gap-4 overflow-x-auto pb-2">
          {(["overview", "documents", "products", "orders", "earnings", "activity", "notes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-bold capitalize cursor-pointer px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="pt-4 text-xs text-gray-300">
          {activeTab === "overview" && (
            <p className="leading-relaxed">
              Farmer {farmer.name} has been an active member since {farmer.createdAt}. Maintains organic certified agricultural land produces high yield grade wheat & paddy crops.
            </p>
          )}
          {activeTab === "documents" && (
            <div className="space-y-2">
              <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                <span>Aadhaar_Card_Verified.pdf</span>
                <Badge className="bg-emerald-500/10 text-emerald-400">Verified</Badge>
              </div>
              <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                <span>Land_Ownership_Khatiyan.pdf</span>
                <Badge className="bg-emerald-500/10 text-emerald-400">Verified</Badge>
              </div>
            </div>
          )}
          {activeTab === "products" && <p className="text-gray-400">Displaying {farmer.totalProducts} active product listings submitted by farmer.</p>}
          {activeTab === "orders" && <p className="text-gray-400">Total {farmer.totalOrders} purchase orders completed successfully.</p>}
          {activeTab === "earnings" && <p className="text-gray-400">Total earnings processed via Krivexa Agri Portal: ₹{farmer.totalEarnings.toLocaleString("en-IN")}</p>}
          {activeTab === "activity" && <p className="text-gray-400">Last activity recorded: Logged in today at 10:15 AM</p>}
          {activeTab === "notes" && <p className="text-gray-400">Admin Note: Verified top-tier organic farmer with clean credit record.</p>}
        </div>
      </div>
    </div>
  );
}

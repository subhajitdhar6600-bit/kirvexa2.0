import { useState } from "react";
import { ArrowLeft, Edit3, MessageSquare, CheckCircle, MapPin, Phone, Mail, Store, ShoppingBag, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { Dealer } from "../types.ts";

interface DealerProfileViewProps {
  dealer: Dealer;
  onBack: () => void;
}

export default function DealerProfileView({ dealer, onBack }: DealerProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "orders" | "payments" | "products" | "activity" | "notes">("overview");

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-xs text-gray-300 hover:text-white border border-white/10">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dealers List
        </Button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs border-white/10 text-gray-300">
            <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit Dealer
          </Button>
          <Button size="sm" className="bg-emerald-500 text-black font-bold text-xs">
            <MessageSquare className="h-3.5 w-3.5 mr-1" /> Message Dealer
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 font-bold text-3xl shadow-lg">
            <Store className="h-10 w-10" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-white">{dealer.businessName}</h1>
              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-xs">
                {dealer.id}
              </Badge>
              {dealer.verified === "verified" && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-4">
              <span>Owner: <strong className="text-white">{dealer.owner}</strong></span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-amber-400" /> {dealer.location}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-amber-400" /> {dealer.phone}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Business Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Total Orders Fulfilled</span>
            <ShoppingBag className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{dealer.totalOrders}</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Total Purchases</span>
            <CreditCard className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">₹{dealer.totalPurchases.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Outstanding Balance</span>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">₹{(dealer.outstanding || 0).toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Business Information Card */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3">Business Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-gray-400">Owner Name</p>
            <p className="font-bold text-white mt-0.5">{dealer.owner}</p>
          </div>
          <div>
            <p className="text-gray-400">Phone</p>
            <p className="font-bold text-white mt-0.5">{dealer.phone}</p>
          </div>
          <div>
            <p className="text-gray-400">Email</p>
            <p className="font-bold text-white mt-0.5">{dealer.email}</p>
          </div>
          <div>
            <p className="text-gray-400">Business Type</p>
            <p className="font-bold text-white mt-0.5">{dealer.businessType}</p>
          </div>
          <div>
            <p className="text-gray-400">GSTIN No.</p>
            <p className="font-mono font-bold text-emerald-400 mt-0.5">{dealer.gstin}</p>
          </div>
          <div>
            <p className="text-gray-400">Registered Address</p>
            <p className="font-bold text-white mt-0.5">{dealer.address}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
        <h3 className="font-bold text-sm text-white mb-3">Recent Orders Handled</h3>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-mono font-bold text-emerald-400">ORD8756</span>
              <span className="text-gray-300 ml-3">Wheat - 30 Quintal</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-white">₹70,500</span>
              <Badge className="ml-3 bg-emerald-500/10 text-emerald-400">Confirmed</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

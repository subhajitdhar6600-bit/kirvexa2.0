import { ArrowLeft, CheckCircle2, ShoppingBag, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import type { OrderItem } from "../types.ts";
import { toast } from "sonner";

interface OrderDetailsViewProps {
  order: OrderItem;
  onOrderChange: (updated: OrderItem) => void;
  onBack: () => void;
}

export default function OrderDetailsView({ order, onOrderChange, onBack }: OrderDetailsViewProps) {
  const handleUpdateStatus = (newStatus: OrderItem["status"]) => {
    const updated: OrderItem = { ...order, status: newStatus };
    onOrderChange(updated);
    toast.success(`Order status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-xs text-gray-300 hover:text-white border border-white/10">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders List
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white font-mono">
            Order Details - {order.id}
          </h2>
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 capitalize">
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Order Info & Tracking Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info Card */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-emerald-400" /> Order Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400">Buyer Name</p>
                <p className="font-bold text-white mt-0.5">{order.buyer}</p>
              </div>
              <div>
                <p className="text-gray-400">Dealer Name</p>
                <p className="font-bold text-white mt-0.5">{order.dealer}</p>
              </div>
              <div>
                <p className="text-gray-400">Product</p>
                <p className="font-bold text-emerald-400 mt-0.5">{order.product}</p>
              </div>
              <div>
                <p className="text-gray-400">Quantity Purchased</p>
                <p className="font-bold text-white mt-0.5">{order.qty}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Amount</p>
                <p className="font-bold text-emerald-400 text-sm mt-0.5">₹{order.amount.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-gray-400">Payment Status & Method</p>
                <p className="font-bold text-white mt-0.5">
                  <Badge className="bg-emerald-500/10 text-emerald-400 mr-2">{order.paymentStatus}</Badge>
                  {order.paymentMethod}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">Order Date & Time</p>
                <p className="font-bold text-white mt-0.5">{order.date}</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-400" /> Order Delivery Tracking
            </h3>

            <div className="space-y-4 pt-2">
              {[
                { title: "Order Placed", date: "20 May 2024, 10:30 AM", stepStatus: "placed" },
                { title: "Confirmed", date: "20 May 2024, 11:15 AM", stepStatus: "confirmed" },
                { title: "Processing", date: "20 May 2024, 02:00 PM", stepStatus: "processing" },
                { title: "Ready to Dispatch", date: "21 May 2024, 09:00 AM", stepStatus: "ready_to_dispatch" },
                { title: "Dispatched", date: "21 May 2024, 11:30 AM", stepStatus: "dispatched" },
                { title: "Delivered", date: "22 May 2024, 04:00 PM", stepStatus: "delivered" },
                { title: "Completed", date: "22 May 2024, 04:30 PM", stepStatus: "completed" },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 text-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 border-b border-white/5 pb-2">
                    <p className="font-bold text-white">{step.title}</p>
                    <p className="text-[10px] text-gray-400">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Admin Controls */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4 h-fit shadow-xl">
          <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3">Update Order Status</h3>

          <div className="space-y-2">
            {(["placed", "confirmed", "processing", "dispatched", "delivered", "completed", "cancelled"] as const).map((st) => (
              <Button
                key={st}
                onClick={() => handleUpdateStatus(st)}
                variant="ghost"
                className={`w-full justify-start text-xs capitalize font-bold h-9 border ${
                  order.status === st
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "text-gray-300 border-white/5 hover:bg-white/5"
                }`}
              >
                Mark as {st}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import {
  ArrowLeft, Printer, Download, MoreHorizontal, CheckCircle2,
  Clock, Truck, MapPin, Phone, Mail, Package, AlertCircle,
  Copy, ExternalLink, HelpCircle, FileText, Check, Sprout, Bike
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";

interface ShipmentDetailsViewProps {
  shipmentAwb?: string;
  orders?: any[];
  onBack?: () => void;
}

export default function ShipmentDetailsView({ shipmentAwb, orders: propOrders, onBack }: ShipmentDetailsViewProps) {
  const { orders: appOrders } = useApp();
  const allOrders = propOrders && propOrders.length > 0 ? propOrders : (appOrders || []);

  const currentOrder = useMemo(() => {
    if (!allOrders || allOrders.length === 0) return null;
    if (shipmentAwb) {
      const cleanAwb = shipmentAwb.toLowerCase();
      const found = allOrders.find((o: any) =>
        cleanAwb.includes(String(o.id || "").toLowerCase())
      );
      if (found) return found;
    }
    return allOrders[0];
  }, [allOrders, shipmentAwb]);

  const awb = shipmentAwb || (currentOrder ? `KRVX4${String(currentOrder.id || "001").replace(/[^0-9]/g, "").padStart(8, "0").slice(-8)}N` : "KRVX41234567N");
  const customerName = currentOrder?.buyer || currentOrder?.userName || "Registered Farmer";
  const customerPhone = currentOrder?.phone || currentOrder?.contactNumber || "9876543210";
  const productName = currentOrder?.product || (currentOrder?.items?.[0]?.name) || "Agricultural Certified Inputs";
  const orderDate = currentOrder?.date || (currentOrder?.createdAt ? new Date(currentOrder.createdAt).toLocaleDateString("en-IN") : "Today");
  const isDelivered = currentOrder?.status === "delivered" || currentOrder?.status === "completed";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Shipment Details</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track and manage shipment information in real time</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span><span>›</span><span>Orders & Sales</span><span>›</span><span>Shipping</span><span>›</span>
          <span className="text-emerald-600 font-medium">{awb}</span>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to All Shipments
        </Button>
        <div className="flex items-center gap-2">
          <Button onClick={() => window.print()} variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
            <Printer className="h-3.5 w-3.5" /> Print Label
          </Button>
          <Button onClick={() => toast.success("Downloading AWB...")} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-xl font-semibold">
            <Download className="h-3.5 w-3.5" /> Download AWB
          </Button>
          <Button variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
            More Actions <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Top Tracking Card & Stepper */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">AWB / Tracking ID</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-black font-mono text-emerald-700">{awb}</span>
              <button onClick={() => { navigator.clipboard.writeText(awb); toast.success("Copied AWB"); }} className="text-gray-400 hover:text-emerald-600"><Copy className="h-3.5 w-3.5" /></button>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${isDelivered ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                {isDelivered ? "Delivered" : "In Transit"}
              </span>
            </div>
            <div className="flex items-center gap-6 mt-3 text-xs">
              <div><span className="text-gray-400">Courier Partner: </span><span className="font-semibold text-gray-800">Delhivery</span></div>
              <div><span className="text-gray-400">Service Type: </span><span className="font-semibold text-gray-800">Surface Express</span></div>
              <div><span className="text-gray-400">Shipping Method: </span><span className="font-semibold text-gray-800">Standard Shipping</span></div>
            </div>
          </div>

          {/* Delivered / In-Transit Status box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs max-w-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{isDelivered ? "Delivered Successfully" : "In Transit to Destination"}</span>
            </div>
            <p className="text-[11px] text-emerald-700">Shipment is handled via authorized logistics carrier.</p>
            <div className="pt-1 text-[11px] text-gray-600">
              <p>Recipient: <span className="font-bold text-gray-900">{customerName}</span></p>
              <p>Shipped Date: {orderDate}</p>
            </div>
          </div>
        </div>

        {/* 5-Step Horizontal Tracker */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-emerald-500 -z-0" />
            {[
              { step: "Order Placed", date: orderDate, time: "10:30 AM", Icon: Package, done: true },
              { step: "Picked Up", date: orderDate, time: "02:15 PM", Icon: Truck, done: true },
              { step: "In Transit", date: orderDate, time: "08:45 PM", Icon: Truck, done: true },
              { step: "Out for Delivery", date: orderDate, time: "09:30 AM", Icon: Bike, done: isDelivered },
              { step: "Delivered", date: orderDate, time: "03:42 PM", Icon: CheckCircle2, done: isDelivered },
            ].map((s, i) => {
              const StepIcon = s.Icon;
              return (
                <div key={i} className="flex flex-col items-center text-center relative z-10 bg-white px-2">
                  <div className={`w-8 h-8 rounded-full ${s.done ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-400"} flex items-center justify-center font-bold text-xs shadow-md mb-1`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-gray-900 text-[11px]">{s.step}</p>
                  <p className="text-[10px] text-gray-400">{s.date}</p>
                  <p className="text-[9px] text-gray-400">{s.time}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Package Info + Customer & Address */}
      <div className="grid grid-cols-2 gap-4">
        {/* Package Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
          <p className="text-xs font-bold text-gray-800">Package Information</p>
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <Sprout className="w-7 h-7" />
            </div>
            <div className="text-xs space-y-0.5">
              <p className="text-[10px] text-gray-400">Product Name</p>
              <p className="font-bold text-gray-900 leading-tight">{productName}</p>
              <div className="flex gap-4 pt-1">
                <div><span className="text-[10px] text-gray-400">Order ID</span><p className="font-mono text-gray-700 font-semibold text-[11px]">#{currentOrder?.id || "ORD001"}</p></div>
                <div><span className="text-[10px] text-gray-400">Category</span><p className="text-gray-700 font-semibold text-[11px]">Agricultural</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
          <p className="text-xs font-bold text-gray-800">Delivery Recipient</p>
          <div className="space-y-1 text-xs">
            <p className="font-bold text-gray-900">{customerName}</p>
            <p className="text-gray-500 text-[11px] flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" /> {customerPhone}</p>
            <p className="text-gray-500 text-[11px] flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-400" /> Samastipur, Bihar - 848101, India</p>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-gray-400">© {new Date().getFullYear()} Krivexo. All rights reserved.</div>
    </div>
  );
}

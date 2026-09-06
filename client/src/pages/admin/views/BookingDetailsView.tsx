import { useState } from "react";
import {
  ArrowLeft, Printer, Download, MoreHorizontal, CheckCircle,
  Clock, Phone, Mail, MapPin, Tractor, User, Calendar,
  FileText, Copy, MessageSquare, Edit2, RotateCcw, XCircle,
  ArrowRight, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";

interface BookingDetailsViewProps {
  bookingId?: string;
  onBack?: () => void;
}

export default function BookingDetailsView({ bookingId = "BK2505250001", onBack }: BookingDetailsViewProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-xs text-gray-500 mt-0.5">View and manage booking information</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span><span>›</span><span>Booking Management</span><span>›</span>
          <span className="text-emerald-600 font-medium">Booking Details</span>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Bookings
        </Button>
        <div className="flex items-center gap-2">
          <Button onClick={() => window.print()} variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <Button onClick={() => toast.success("Downloading Invoice...")} variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
            <Download className="h-3.5 w-3.5" /> Download Invoice
          </Button>
          <Button className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-xl font-semibold">
            More Actions <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Top Card: Booking ID, Stepper, Payment Info, 3D Tractor */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Metadata */}
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Booking ID</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-black font-mono text-emerald-700">{bookingId}</span>
              <button onClick={() => { navigator.clipboard.writeText(bookingId); toast.success("Copied Booking ID"); }} className="text-gray-400 hover:text-emerald-600"><Copy className="h-3.5 w-3.5" /></button>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">Confirmed</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs">
              <div><span className="text-gray-400">Service Type: </span><span className="font-semibold text-gray-800">Tractor Booking</span></div>
              <div><span className="text-gray-400">Customer Name: </span><span className="font-semibold text-gray-800">Ramesh Kumar</span></div>
              <div><span className="text-gray-400">Phone Number: </span><span className="font-semibold text-gray-800">9876543210</span></div>
              <div><span className="text-gray-400">Booking Date: </span><span className="text-gray-800">25 May 2025</span></div>
              <div><span className="text-gray-400">Booking Time: </span><span className="text-gray-800">10:30 AM</span></div>
            </div>
          </div>

          {/* 3D Tractor Illustration Box */}
          <div className="w-28 h-24 rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 flex flex-col items-center justify-center text-3xl shadow-inner border border-emerald-200/50">
            <span>🚜</span>
            <span className="text-[9px] font-black text-emerald-950 mt-1">45 HP TRACTOR</span>
          </div>

          {/* Payment Information Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs space-y-1 w-64">
            <div className="flex justify-between items-center">
              <span className="font-bold text-emerald-900">Payment Information</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">Paid</span>
            </div>
            <div className="flex justify-between"><span className="text-gray-500">Payment Method</span><span className="font-semibold text-gray-800">Online (UPI)</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total Amount</span><span className="font-bold text-gray-900">₹ 2,450.00</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Paid Amount</span><span className="font-bold text-emerald-700">₹ 2,450.00</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="font-mono text-[10px] text-gray-700">UPI25M5250001</span></div>
            <button onClick={() => toast.info("Viewing payment")} className="text-emerald-700 font-bold text-[11px] hover:underline block pt-1">
              View Payment Details →
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-800 mb-3">Booking Status Timeline</p>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-emerald-500 -z-0" />
            {[
              { title: "Booking Placed", date: "25 May 2025", time: "10:30 AM", icon: "📅", done: true },
              { title: "Confirmed", date: "25 May 2025", time: "10:35 AM", icon: "⏳", done: true },
              { title: "In Progress", date: "26 May 2025", time: "08:00 AM", icon: "🚜", done: true },
              { title: "Completed", date: "—", time: "—", icon: "🏁", done: false },
              { title: "Reviewed", date: "—", time: "—", icon: "⭐", done: false },
            ].map((st, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10 bg-white px-2">
                <div className={`w-8 h-8 rounded-full ${st.done ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"} flex items-center justify-center font-bold text-xs shadow-md mb-1`}>
                  {st.icon}
                </div>
                <p className="font-bold text-gray-900 text-[11px]">{st.title}</p>
                <p className="text-[10px] text-gray-400">{st.date}</p>
                <p className="text-[9px] text-gray-400">{st.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Service Info + Customer Info + Booking Schedule */}
      <div className="grid grid-cols-3 gap-4">
        {/* Service Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
          <p className="font-bold text-gray-800">Service Information</p>
          <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
            <span className="text-3xl">🚜</span>
            <div>
              <p className="font-bold text-gray-900 text-sm">Tractor Booking - 45 HP</p>
              <p className="text-gray-500 text-[11px]">Sonalika DI 745 III</p>
            </div>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between"><span className="text-gray-400">HP</span><span className="font-semibold text-gray-800">45 HP</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Fuel Type</span><span className="font-semibold text-gray-800">Diesel</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Attachments</span><span className="font-semibold text-gray-800">Rotavator</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Estimated Hours</span><span className="font-bold text-emerald-700">6 Hours</span></div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
          <p className="font-bold text-gray-800">Customer Information</p>
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">RK</div>
            <div>
              <p className="font-bold text-gray-900">Ramesh Kumar</p>
              <p className="text-gray-400 text-[11px]">9876543210</p>
            </div>
          </div>
          <div className="space-y-1 text-gray-600 pt-1">
            <p className="text-[11px]">rameshkumar@gmail.com</p>
            <p className="text-[11px]">Village - Belhari, Post - Belhari</p>
            <p className="text-[11px]">Tehsil - Darbhanga, District - Darbhanga, Bihar - 846004</p>
          </div>
          <button onClick={() => toast.info("View Profile")} className="text-emerald-600 font-bold text-[11px] hover:underline block pt-1">
            View Customer Profile →
          </button>
        </div>

        {/* Booking Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
          <p className="font-bold text-gray-800">Booking Schedule</p>
          <div className="space-y-1.5">
            <div className="flex justify-between"><span className="text-gray-400">Booking Date</span><span className="text-gray-800 font-semibold">25 May 2025</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Booking Time</span><span className="text-gray-800">10:30 AM</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Start Date</span><span className="text-gray-800 font-semibold">26 May 2025</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Start Time</span><span className="text-gray-800">08:00 AM</span></div>
            <div className="flex justify-between"><span className="text-gray-400">End Date</span><span className="text-gray-800 font-semibold">26 May 2025</span></div>
            <div className="flex justify-between"><span className="text-gray-400">End Time</span><span className="text-gray-800">02:00 PM</span></div>
            <div className="flex justify-between pt-1 border-t border-gray-100"><span className="text-gray-400">Total Duration</span><span className="font-bold text-emerald-700">6 Hours</span></div>
          </div>
        </div>
      </div>

      {/* Row 3: Booking Summary + Assigned To + Customer Notes */}
      <div className="grid grid-cols-3 gap-4">
        {/* Booking Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
          <p className="font-bold text-gray-800 mb-2">Booking Summary</p>
          <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="font-semibold text-gray-800">₹ 2,450.00</span></div>
          <div className="flex justify-between"><span className="text-gray-400">GST (12%)</span><span className="font-semibold text-gray-800">₹ 294.00</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Discount</span><span className="text-gray-800">₹ 0.00</span></div>
          <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-bold text-emerald-700">
            <span>Total Amount</span><span>₹ 2,450.00</span>
          </div>
        </div>

        {/* Assigned To */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
          <p className="font-bold text-gray-800 mb-2">Assigned To</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">MY</div>
            <div>
              <p className="text-[10px] text-gray-400">Driver / Operator</p>
              <p className="font-bold text-gray-900">Mahesh Yadav</p>
              <p className="text-gray-500 text-[11px]">9123456780</p>
            </div>
          </div>
          <button onClick={() => toast.info("View Assignment")} className="text-emerald-600 font-bold text-[11px] hover:underline pt-2 block">
            View Assignment →
          </button>
        </div>

        {/* Customer Notes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
          <p className="font-bold text-gray-800 mb-1">Customer Notes</p>
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/50 text-amber-950">
            <p className="text-[11px] leading-relaxed">"Please ensure tractor reaches before 8 AM. Field is ready for tillage."</p>
            <p className="text-[10px] text-gray-500 mt-2 font-semibold">- Ramesh Kumar, 25 May 2025, 09:15 AM</p>
          </div>
        </div>
      </div>

      {/* Row 4: Location Map + Activity Log + Documents + Actions */}
      <div className="grid grid-cols-12 gap-4 items-start">
        {/* Location Map Left */}
        <div className="col-span-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
          <p className="font-bold text-gray-800">Location Details</p>
          <div className="h-32 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-200 relative overflow-hidden flex items-center justify-center">
            <div className="p-2 rounded-xl bg-white shadow-md border border-gray-200 text-center text-xs">
              <span className="text-red-500 font-bold">📍 Belhari Village</span>
              <p className="text-[10px] text-gray-400">Darbhanga, Bihar</p>
            </div>
          </div>
          <p className="font-bold text-gray-800 pt-1">Pickup / Start Location</p>
          <p className="text-gray-500 text-[11px]">Village - Belhari, Post - Belhari, Tehsil - Darbhanga, District - Darbhanga, Bihar - 846004</p>
        </div>

        {/* Activity Log */}
        <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3 text-xs">
          <p className="font-bold text-gray-800">Booking Activity Log</p>
          <div className="space-y-3 border-l-2 border-emerald-500 ml-2 pl-3">
            {[
              { title: "Booking Confirmed", sub: "Your booking has been confirmed successfully.", time: "25 May 2025, 10:35 AM" },
              { title: "Tractor Assigned", sub: "Tractor and operator have been assigned.", time: "25 May 2025, 10:40 AM" },
              { title: "In Progress", sub: "Tractor has started work at your field.", time: "26 May 2025, 08:00 AM" },
            ].map((act, i) => (
              <div key={i} className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 absolute -left-[19px] top-1" />
                <p className="font-bold text-gray-900 text-[11px]">{act.title}</p>
                <p className="text-[10px] text-gray-500">{act.sub}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">{act.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3 text-xs">
          <p className="font-bold text-gray-800">Documents & Attachments</p>
          {[
            { name: "Booking Invoice", file: "invoice_BK2505250001.pdf" },
            { name: "Payment Receipt", file: "payment_BK2505250001.pdf" },
            { name: "T&C Agreement", file: "terms_BK2505250001.pdf" },
          ].map((doc, i) => (
            <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="font-bold text-gray-800 text-[11px]">{doc.name}</p>
                <p className="text-[9px] text-gray-400 font-mono">{doc.file}</p>
              </div>
              <button onClick={() => toast.success(`Downloading ${doc.name}`)} className="text-emerald-600 hover:text-emerald-800 p-1"><Download className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 text-xs">
          <p className="font-bold text-gray-800 mb-2">Actions</p>
          <Button onClick={() => toast.info("Edit Booking")} variant="outline" className="w-full justify-start h-7 text-[10px] gap-1.5 rounded-xl border-gray-200">
            <Edit2 className="h-3 w-3" /> Edit Booking
          </Button>
          <Button onClick={() => toast.info("Reschedule")} variant="outline" className="w-full justify-start h-7 text-[10px] gap-1.5 rounded-xl border-gray-200">
            <RotateCcw className="h-3 w-3" /> Reschedule
          </Button>
          <Button onClick={() => toast.error("Cancelled booking")} variant="outline" className="w-full justify-start h-7 text-[10px] gap-1.5 rounded-xl border-red-200 text-red-600">
            <XCircle className="h-3 w-3" /> Cancel Booking
          </Button>
          <Button onClick={() => toast.info("SMS Sent")} variant="outline" className="w-full justify-start h-7 text-[10px] gap-1.5 rounded-xl border-gray-200">
            <MessageSquare className="h-3 w-3" /> Send SMS
          </Button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-2">
        <Button onClick={() => toast.info("Previous")} variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
          ← Previous Booking
        </Button>
        <Button onClick={() => toast.info("Next")} variant="outline" className="h-8 text-xs gap-1.5 rounded-xl border-gray-200">
          Next Booking →
        </Button>
      </div>

      <div className="text-center text-[11px] text-gray-400">© 2025 Krivexa. All rights reserved. &nbsp; Made with ❤️ for Farmers 🌿</div>
    </div>
  );
}

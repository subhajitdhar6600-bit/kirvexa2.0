import { useState } from "react";
import { Check, X, Tractor, Users, Calendar, Clock, MapPin, AlertCircle, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useApp } from "@/context/AppContext.tsx";

export default function RateReviewModal() {
  const { activeReviewBooking, closeRateReviewModal, respondMachineryBooking, respondLabourBooking } = useApp();
  const [submitting, setSubmitting] = useState(false);

  if (!activeReviewBooking) return null;

  const { id, serviceType, bookingType, userName, phone, date, duration, location, rateQuote, rateNotes } = activeReviewBooking;

  const handleAction = async (response: "accepted" | "cancelled") => {
    setSubmitting(true);
    try {
      if (bookingType === "machinery") {
        await respondMachineryBooking(id, response);
      } else {
        await respondLabourBooking(id, response);
      }
      closeRateReviewModal();
    } catch (err) {
      console.error("Error responding to booking rate:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isMachinery = bookingType === "machinery";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
              isMachinery ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-blue-500/10 border-blue-500/30 text-blue-400"
            }`}>
              {isMachinery ? <Tractor className="h-6 w-6" /> : <Users className="h-6 w-6" />}
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Booking Quote #{id}</span>
              <h2 className="text-lg font-bold text-white leading-tight">{serviceType}</h2>
            </div>
          </div>
          <button
            onClick={closeRateReviewModal}
            disabled={submitting}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quoted Rate Highlight Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <IndianRupee className="h-3.5 w-3.5" /> Quoted Booking Rate / Charges
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono">
            {rateQuote || "Rate details on request"}
          </div>
          {rateNotes && (
            <p className="text-xs text-gray-300 italic pt-1 border-t border-emerald-500/20 mt-2">
              "{rateNotes}"
            </p>
          )}
        </div>

        {/* Booking Details Summary */}
        <div className="bg-white/5 rounded-xl p-3.5 space-y-2 text-xs text-gray-300">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Date: <span className="text-white font-medium">{date || "Scheduled"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock className="h-3.5 w-3.5 text-primary" /> Duration: <span className="text-white font-medium">{duration}</span>
            </div>
          </div>
          <div className="flex items-start gap-1.5 text-gray-400 pt-1 border-t border-white/5">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span>Location: <strong className="text-white font-medium">{location || "N/A"}</strong></span>
          </div>
          <div className="text-[11px] text-gray-400 pt-1">
            Applicant: <strong className="text-white">{userName}</strong> ({phone})
          </div>
        </div>

        {/* Clarification prompt */}
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p>
            Please review the quoted rate above. If you agree with this rate, click <strong>Accept</strong>. Otherwise, click <strong>Cancel</strong> to withdraw the request.
          </p>
        </div>

        {/* ONLY 2 Options: Accept or Cancel */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            disabled={submitting}
            onClick={() => handleAction("cancelled")}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-5 rounded-xl cursor-pointer transition-all"
          >
            <X className="h-4 w-4 mr-1.5" /> Cancel Request
          </Button>

          <Button
            type="button"
            disabled={submitting}
            onClick={() => handleAction("accepted")}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black py-5 rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
          >
            <Check className="h-4 w-4 mr-1.5" /> Accept Rate
          </Button>
        </div>

      </div>
    </div>
  );
}

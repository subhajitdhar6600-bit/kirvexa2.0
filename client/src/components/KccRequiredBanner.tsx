import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext.tsx";
import { CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";

export default function KccRequiredBanner() {
  const navigate = useNavigate();
  const { isKccIssued, setIsKccAppModalOpen, user, isAdminLoggedIn, hasAppliedKcc, kccApplicationStatus } = useApp();

  // If KCC has been verified & approved with a card number, do NOT show any banner
  if (isKccIssued) return null;

  return (
    <div className="bg-linear-to-r from-amber-950 via-[#1c160a] to-amber-950 border-b border-amber-500/40 px-4 py-2 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="h-3 w-3" />
          </div>
          <p className="text-gray-200 text-xs leading-relaxed">
            <span className="text-amber-300 font-bold">Kisan Credit Card (KCC) Required:</span>{" "}
            {hasAppliedKcc && kccApplicationStatus === "pending"
              ? "Your KCC Application is currently under Admin Review. Card will be issued soon."
              : "Apply for your KCC to unlock direct Crop Selling, Machinery & Labour Booking, and Cart Checkout."}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            if (!user && !isAdminLoggedIn) {
              toast.info("Please register or login first to apply for Kisan Credit Card.");
              navigate("/register", { state: { from: "/" } });
              return;
            }
            setIsKccAppModalOpen(true);
          }}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] h-7 px-3.5 rounded-full shadow-sm cursor-pointer shrink-0 border border-amber-300"
        >
          <CreditCard className="h-3 w-3 mr-1.5" />
          {hasAppliedKcc && kccApplicationStatus === "pending" ? "Track KCC Status →" : "Apply for KCC Now →"}
        </Button>
      </div>
    </div>
  );
}


import { useState } from "react";
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, ArrowRight, Shield, Eye, EyeOff, CreditCard, Clock, CheckCircle2, UserPlus, Search, ShoppingBag, Receipt, AlertCircle, Smartphone, KeyRound, Timer } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";
import FormPreviewModal from "@/components/FormPreviewModal.tsx";
import { generateFormPdf } from "@/lib/pdfGenerator.ts";

export default function WalletPage() {
  const {
    t,
    user,
    isKccIssued,
    kccApplicationStatus,
    kccDetails,
    hasAppliedKcc,
    setIsKccAppModalOpen,
    dealerApplyFarmerKcc,
    checkFarmerCardBalance,
    chargeFarmerCard,
    addNotification,
    walletTransactions,
    walletBalance,
  } = useApp();
  const [showBalance, setShowBalance] = useState(true);
  const [addAmount, setAddAmount] = useState("");

  // Dealer Feature 1: Apply KCC for Other Farmers state
  const [isDealerApplyModalOpen, setIsDealerApplyModalOpen] = useState(false);
  const [farmerForm, setFarmerForm] = useState({
    fullName: "",
    phone: "",
    aadhaar: "",
    address: "",
    district: "",
    landSize: "",
  });

  // Dealer Feature 2: POS Balance Check & Billing state
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [searchCardNum, setSearchCardNum] = useState("");
  const [foundCardInfo, setFoundCardInfo] = useState<any>(null);
  const [billAmount, setBillAmount] = useState("");
  const [billItem, setBillItem] = useState("");
  const [posPaymentMethod, setPosPaymentMethod] = useState<"kcc" | "wallet" | "upi" | "cod">("kcc");

  // OTP Verification States
  const [otpStep, setOtpStep] = useState<"idle" | "sending" | "verify" | "verified">("idle");
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  // Preview States
  const [showKccPreview, setShowKccPreview] = useState(false);
  const [showPosPreview, setShowPosPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Simulate sending a 6-digit OTP to buyer's registered phone */
  const sendOtp = () => {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otp);
    setOtpStep("sending");
    setTimeout(() => {
      setOtpStep("verify");
      setOtpSent(true);
      setOtpTimer(60);
      // Countdown timer
      let t = 60;
      const interval = setInterval(() => {
        t--;
        setOtpTimer(t);
        if (t <= 0) clearInterval(interval);
      }, 1000);
      // DEV: show OTP in toast so it can be tested
      toast.success(`OTP sent! (Demo OTP: ${otp})`, { duration: 8000 });
    }, 1200);
  };

  const verifyOtp = () => {
    if (otpInput.trim() === generatedOtp) {
      setOtpStep("verified");
      toast.success("✅ OTP verified! Proceed to checkout.");
    } else {
      toast.error("❌ Incorrect OTP. Please try again.");
      setOtpInput("");
    }
  };

  const resetPosModal = () => {
    setIsPosModalOpen(false);
    setFoundCardInfo(null);
    setSearchCardNum("");
    setBillAmount("");
    setBillItem("");
    setPosPaymentMethod("kcc");
    setOtpStep("idle");
    setOtpInput("");
    setGeneratedOtp("");
    setOtpSent(false);
    setOtpTimer(0);
  };

  const handleKccConfirm = () => {
    setShowKccPreview(false);
    setLoading(true);
    setTimeout(() => {
      const refId = `KCC-DL-${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate PDF
      const { dataUrl, fileName } = generateFormPdf({
        formTitle: "Farmer KCC Application (Dealer Portal)",
        referenceId: refId,
        userName: farmerForm.fullName,
        userPhone: farmerForm.phone,
        userRole: "Farmer",
        details: {
          "Applicant Full Name": farmerForm.fullName,
          "Contact Phone": farmerForm.phone,
          "Aadhaar UIDAI": farmerForm.aadhaar,
          "Land Holding Size": farmerForm.landSize || "Not Specified",
          "District/Village": farmerForm.district || "Not Specified",
          "Permanent Address": farmerForm.address || "Not Specified",
          "Submitted By (Dealer)": user?.name || "Krivexa Dealer",
        },
      });

      dealerApplyFarmerKcc(farmerForm);

      // Send notification with PDF receipt
      addNotification(
        "Farmer KCC Application Submitted 💳",
        `KCC Application for ${farmerForm.fullName} has been submitted on their behalf (Ref: ${refId}). Download PDF receipt.`,
        "success",
        "/wallet",
        "kcc",
        dataUrl,
        fileName
      );

      setLoading(false);
      setIsDealerApplyModalOpen(false);
      toast.success(`Kishan Credit Card Application for ${farmerForm.fullName} submitted successfully!`);
      setFarmerForm({ fullName: "", phone: "", aadhaar: "", address: "", district: "", landSize: "" });
    }, 1000);
  };

  const POS_PAYMENT_METHODS = [
    {
      id: "kcc" as const,
      label: "Kisan Credit Card (KCC)",
      sub: `Card: ${searchCardNum || "Enter card number first"}`,
      icon: "💳",
      recommended: true,
      color: "border-primary bg-primary/10",
      activeText: "text-primary",
    },
    {
      id: "wallet" as const,
      label: "Krivexa Kisan Wallet",
      sub: "Direct debit from wallet balance",
      icon: "👛",
      recommended: false,
      color: "border-blue-500 bg-blue-500/10",
      activeText: "text-blue-400",
    },
    {
      id: "upi" as const,
      label: "UPI / GPay / PhonePe",
      sub: "Instant online payment via UPI",
      icon: "📱",
      recommended: false,
      color: "border-purple-500 bg-purple-500/10",
      activeText: "text-purple-400",
    },
    {
      id: "cod" as const,
      label: "Cash on Delivery (COD)",
      sub: "Pay cash when items arrive",
      icon: "🚛",
      recommended: false,
      color: "border-amber-500 bg-amber-500/10",
      activeText: "text-amber-400",
    },
  ];

  const handlePosConfirm = () => {
    setShowPosPreview(false);
    setLoading(true);
    setTimeout(() => {
      const refId = `POS-${Math.floor(100000 + Math.random() * 900000)}`;
      const amt = parseFloat(billAmount);
      const payMethodLabel = POS_PAYMENT_METHODS.find(m => m.id === posPaymentMethod)?.label || posPaymentMethod;

      // Only charge KCC card if payment method is KCC
      if (posPaymentMethod === "kcc") {
        const res = chargeFarmerCard(searchCardNum, amt, billItem);
        if (!res.success) {
          toast.error(res.message);
          setLoading(false);
          return;
        }
        setFoundCardInfo({ ...foundCardInfo, balance: res.remainingBalance });
      }

      // Generate PDF Invoice
      const { dataUrl, fileName } = generateFormPdf({
        formTitle: "Dealer POS Sale Invoice",
        referenceId: refId,
        userName: posPaymentMethod === "kcc" ? (foundCardInfo?.cardHolder || "Customer") : (user?.name || "Customer"),
        userPhone: posPaymentMethod === "kcc" ? searchCardNum : "",
        userRole: "Farmer",
        details: {
          "Customer / Card Holder": posPaymentMethod === "kcc" ? foundCardInfo?.cardHolder || "N/A" : "Walk-in Customer",
          "Billing Item": billItem,
          "Bill Amount": `₹${amt}`,
          "Payment Method": payMethodLabel,
          ...(posPaymentMethod === "kcc" ? { "KCC Card Charged": searchCardNum } : {}),
          "Processed By (Dealer)": user?.name || "Krivexa Dealer",
        },
      });

      addNotification(
        "POS Sale Invoice Generated 🧾",
        `Sale of ₹${amt} for "${billItem}" via ${payMethodLabel} processed (Invoice: ${refId}). Download PDF.`,
        "success",
        "/wallet",
        "wallet",
        dataUrl,
        fileName
      );

      toast.success(`Payment of ₹${amt} via ${payMethodLabel} processed successfully!`);
      setIsPosModalOpen(false);
      setBillAmount("");
      setBillItem("");
      setLoading(false);
    }, 1000);
  };

  // KCC card number & wallet balances logic
  const isKccApproved = kccApplicationStatus === "approved";
  const kccCreditBalance = isKccApproved && kccDetails ? 25000 : 0;
  const totalIn = walletTransactions.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalOut = walletTransactions.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  const kccCardNumber = isKccApproved && kccDetails?.cardNumber
    ? kccDetails.cardNumber
    : null;
  const kccHolderName = kccDetails?.fullName || user?.name || "KRIVEXA KISAN";
  const kccIssueDate = kccDetails?.issueDate || null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="relative h-36 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              <span className="text-primary">{t.wallet.title.split(" ")[0]}</span> {t.wallet.title.split(" ").slice(1).join(" ")}
            </h1>
            <p className="text-gray-400 text-sm">{t.wallet.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* PROMINENT KCC APPLY CTA BANNER CARD (Visible when user has no active KCC) */}
        {!isKccIssued && (
          <div className="bg-linear-to-r from-amber-950/80 via-amber-900/40 to-black border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-1">
                  <AlertCircle className="h-3 w-3" /> Mandatory Account Verification
                </div>
                <h3 className="text-lg font-black text-amber-200">
                  Apply for Kisan Credit Card (KCC) Now
                </h3>
                <p className="text-xs text-gray-300 max-w-xl">
                  Get up to ₹3,00,000 credit limit &amp; unlock all buying, crop selling, machinery &amp; labour booking features across the Bihar platform.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsKccAppModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs py-3 px-6 rounded-xl shrink-0 cursor-pointer shadow-lg animate-pulse border border-amber-300"
            >
              <CreditCard className="h-4 w-4 mr-1.5 text-black" /> Apply for KCC Now →
            </Button>
          </div>
        )}

        {/* === DUAL WALLET: DEPOSIT BALANCE + CREDIT CARD BALANCE === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Two balance cards stacked + stats */}
          <div className="space-y-4">

            {/* Card 1: Krivexa Kisan Wallet (Deposit Balance) */}
            <div className="relative bg-linear-to-br from-[#1a2818] via-[#0f1a0e] to-[#0a0a0a] border border-primary/40 rounded-2xl p-5 overflow-hidden shadow-xl">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Wallet className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Deposit Wallet</div>
                    <div className="text-xs text-primary font-semibold">Krivexa Kisan Wallet</div>
                  </div>
                </div>
                <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400 hover:text-primary cursor-pointer">
                  {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-3xl font-black text-primary mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                {showBalance ? `₹${walletBalance.toLocaleString()}.00` : "₹ ****"}
              </div>
              <div className="text-[11px] text-gray-400">Available for purchases &amp; bookings</div>
              <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-2.5 text-center">
                  <ArrowUpRight className="h-3.5 w-3.5 text-primary mx-auto mb-0.5" />
                  <div className="text-sm font-black text-primary">₹{totalIn.toLocaleString()}</div>
                  <div className="text-[9px] text-gray-400">{t.wallet.totalIn}</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-center">
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-400 mx-auto mb-0.5" />
                  <div className="text-sm font-black text-red-400">₹{totalOut.toLocaleString()}</div>
                  <div className="text-[9px] text-gray-400">{t.wallet.totalOut}</div>
                </div>
              </div>
            </div>

            {/* Card 2: Krivexa KCC Credit Card Balance */}
            <div className="relative bg-linear-to-br from-[#1a1508] via-[#110f00] to-[#0a0a0a] border border-amber-500/40 rounded-2xl overflow-hidden shadow-xl">
              {/* KCC Card Image */}
              <img
                src="/KCC.png"
                alt="Kishan Credit Card"
                className="w-full h-auto object-cover opacity-90"
              />
              {/* Balance overlay */}
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-amber-500/40 rounded-xl px-3 py-1.5">
                <div className="text-[9px] text-gray-400 font-bold uppercase">KCC Credit</div>
                <div className="text-sm font-black text-amber-400" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  {showBalance ? (isKccApproved ? `₹${kccCreditBalance.toLocaleString()}.00` : "Not Issued") : "₹ ****"}
                </div>
              </div>
              {/* Card number overlay */}
              <div className="absolute left-[5.5%] top-[56%] w-[88%]">
                <div
                  className="text-[#f5d77f] font-black tracking-[0.14em] leading-none drop-shadow-md truncate"
                  style={{ fontFamily: "Rajdhani, monospace", fontSize: "clamp(0.65rem, 2.2vw, 0.85rem)", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                >
                  {hasAppliedKcc
                    ? (isKccApproved ? kccCardNumber : "Will be generated after verification")
                    : "Apply KCC to Activate Card"}
                </div>
              </div>
              {/* Holder name overlay — always visible */}
              <div className="absolute left-[5.5%] top-[72%] w-[88%]">
                <div
                  className="text-[#f5d77f] font-black uppercase tracking-[0.12em] leading-none drop-shadow-md truncate"
                  style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(0.55rem, 1.8vw, 0.75rem)", textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}
                >
                  {kccHolderName}
                </div>
              </div>
              {/* KCC info footer */}
              <div className="px-4 py-3 border-t border-amber-500/20 bg-black/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400">Krivexa Credit Card</div>
                  <div className="text-xs font-bold text-amber-400">{isKccApproved ? `Active · Issued ${kccIssueDate || "Recently"}` : hasAppliedKcc ? "Under Review" : "Not Applied"}</div>
                </div>
                <div className="text-[10px] text-gray-500 text-right">
                  {isKccApproved ? "Credit Limit" : ""}
                  <div className="text-amber-400 font-black text-sm">{isKccApproved ? `₹${kccCreditBalance.toLocaleString()}` : ""}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold">{t.wallet.txHistory}</h3>
              <button className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
                {t.wallet.viewAll} <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {walletTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  <Receipt className="h-10 w-10 text-gray-600 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-gray-400">No transactions recorded yet</p>
                  <p className="text-xs text-gray-500 mt-1">Your wallet activity and payments will appear here automatically.</p>
                </div>
              ) : (
                walletTransactions.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.type === "credit" ? "bg-primary/20" : "bg-red-500/20"}`}>
                      {t.type === "credit" ? <ArrowUpRight className="h-4 w-4 text-primary" /> : <ArrowDownRight className="h-4 w-4 text-red-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{t.title}</div>
                      <div className="text-xs text-gray-500">{t.date} • {t.id}</div>
                    </div>
                    <Badge className={`text-[10px] ${t.type === "credit" ? "bg-primary/20 text-primary border-primary/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                      {t.category}
                    </Badge>
                    <div className={`text-sm font-bold shrink-0 ${t.type === "credit" ? "text-primary" : "text-red-400"}`}>
                      {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === MODAL 1: DEALER APPLY KCC FOR OTHER FARMERS === */}
      {isDealerApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111] border border-amber-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-amber-500/10">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Dealer Portal: Apply KCC for Farmer</h3>
              </div>
              <button onClick={() => setIsDealerApplyModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!farmerForm.fullName || !farmerForm.phone || !farmerForm.aadhaar) {
                  toast.error("Please fill all required fields");
                  return;
                }
                setShowKccPreview(true);
              }}
              className="p-5 space-y-4"
            >
              <div>
                <Label className="text-xs text-gray-300">Farmer Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={farmerForm.fullName}
                  onChange={(e) => setFarmerForm({ ...farmerForm, fullName: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-300">Farmer Phone Number *</Label>
                  <Input
                    required
                    type="tel"
                    placeholder="10-digit Mobile"
                    value={farmerForm.phone}
                    onChange={(e) => setFarmerForm({ ...farmerForm, phone: e.target.value })}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Aadhaar Card Number *</Label>
                  <Input
                    required
                    placeholder="12-digit Aadhaar"
                    value={farmerForm.aadhaar}
                    onChange={(e) => setFarmerForm({ ...farmerForm, aadhaar: e.target.value })}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-300">District / Village</Label>
                  <Input
                    placeholder="e.g. Patna / Danapur"
                    value={farmerForm.district}
                    onChange={(e) => setFarmerForm({ ...farmerForm, district: e.target.value })}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Land Size (Acres / Bigha)</Label>
                  <Input
                    placeholder="e.g. 3 Acres"
                    value={farmerForm.landSize}
                    onChange={(e) => setFarmerForm({ ...farmerForm, landSize: e.target.value })}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-300">Full Address</Label>
                <Input
                  placeholder="Village, Post Office, Block"
                  value={farmerForm.address}
                  onChange={(e) => setFarmerForm({ ...farmerForm, address: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsDealerApplyModalOpen(false)} className="text-xs text-gray-400">
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-6">
                  Submit Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL 2: DEALER POS - FARMER KCC BALANCE CHECK & CARD BILLING === */}
      {isPosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111] border border-primary/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-linear-to-r from-primary/20 via-[#111] to-amber-500/10 sticky top-0 bg-[#111] z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Dealer POS: Buyer Billing & Card Debit</h3>
                  <p className="text-xs text-gray-400">Verify farmer KCC balance, send buyer OTP, and generate branded invoice</p>
                </div>
              </div>
              <button onClick={resetPosModal} className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer p-1">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Step 1: Card Lookup Bar */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <Label className="text-xs text-gray-300 font-bold mb-1.5 block">Enter Farmer / Buyer KCC Card Number</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="e.g. KCC-BH-2026-9041"
                    value={searchCardNum}
                    onChange={(e) => {
                      setSearchCardNum(e.target.value);
                      if (otpStep !== "idle") setOtpStep("idle");
                    }}
                    className="bg-black/50 border-white/10 text-white font-mono text-xs flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (!searchCardNum.trim()) {
                        toast.error("Please enter a valid card number");
                        return;
                      }
                      const res = checkFarmerCardBalance(searchCardNum);
                      if (res && res.exists) {
                        setFoundCardInfo(res);
                        setOtpStep("idle");
                        toast.success(`Card verified! Holder: ${res.cardHolder}`);
                      } else {
                        setFoundCardInfo({ exists: false });
                        toast.error("Card number not found or inactive.");
                      }
                    }}
                    className="bg-primary text-black font-bold text-xs px-6 py-2 shrink-0"
                  >
                    <Search className="h-4 w-4 mr-1.5" /> Check Balance
                  </Button>
                </div>
                <div className="text-[11px] text-gray-400 mt-2 flex items-center gap-2">
                  <span>Demo cards:</span>
                  <button onClick={() => setSearchCardNum("KCC-BH-2026-9041")} className="text-primary hover:underline font-mono">KCC-BH-2026-9041</button>
                  <span>•</span>
                  <button onClick={() => setSearchCardNum("KCC-BH-2026-1002")} className="text-primary hover:underline font-mono">KCC-BH-2026-1002</button>
                </div>
              </div>

              {/* Step 2: Main Billing Interface */}
              {foundCardInfo && (
                <div>
                  {foundCardInfo.exists ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left Column: Buyer & Card Info + Order Summary */}
                      <div className="lg:col-span-5 space-y-4">
                        {/* Card Details Box */}
                        <div className="bg-linear-to-br from-primary/15 via-emerald-950/20 to-black border border-primary/30 rounded-2xl p-5 space-y-4 shadow-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Card Holder</div>
                              <div className="text-lg font-black text-white">{foundCardInfo.cardHolder}</div>
                            </div>
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold">
                              ✅ Active KCC
                            </Badge>
                          </div>

                          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Available KCC Credit Limit</div>
                              <div className="text-2xl font-black text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                                ₹{foundCardInfo.balance?.toLocaleString()}.00
                              </div>
                            </div>
                            <ShoppingBag className="h-8 w-8 text-primary/30" />
                          </div>

                          <div className="text-[11px] text-gray-400 pt-2 border-t border-white/10 flex items-center gap-1.5">
                            <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>OTP verification required before debiting</span>
                          </div>
                        </div>

                        {/* Summary Card */}
                        {billAmount && (
                          <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 space-y-2">
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Transaction Summary</div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Product/Service</span>
                              <span className="text-white font-medium truncate max-w-37.5">{billItem || "General Purchase"}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Subtotal</span>
                              <span className="text-white font-semibold">₹{parseFloat(billAmount || "0").toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Convenience Fee</span>
                              <span className="text-primary font-semibold">₹0.00</span>
                            </div>
                            <div className="flex justify-between text-sm font-black pt-2 border-t border-white/10 text-white">
                              <span>Total Amount</span>
                              <span className="text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                                ₹{parseFloat(billAmount || "0").toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Billing Inputs, Payment Options & Buyer OTP */}
                      <div className="lg:col-span-7 space-y-5 bg-[#161616] border border-white/10 rounded-2xl p-5">
                        <div className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                          <Receipt className="h-4 w-4 text-amber-400" /> Enter Sale & Payment Details
                        </div>

                        {/* Bill Details */}
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-300 font-medium">Product / Service Description *</Label>
                            <Input
                              placeholder="e.g. 2 Bags NPK Fertilizer + Pesticides"
                              value={billItem}
                              onChange={(e) => setBillItem(e.target.value)}
                              className="mt-1 bg-white/5 border-white/10 text-white text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-300 font-medium">Bill Amount (₹) *</Label>
                            <Input
                              type="number"
                              placeholder="e.g. 1450"
                              value={billAmount}
                              onChange={(e) => {
                                setBillAmount(e.target.value);
                                if (otpStep !== "idle") setOtpStep("idle");
                              }}
                              className="mt-1 bg-white/5 border-white/10 text-xs font-bold text-primary"
                            />
                          </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div>
                          <Label className="text-xs text-gray-300 font-bold uppercase tracking-wider mb-2 block">Select Payment Method</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {POS_PAYMENT_METHODS.map((method) => (
                              <button
                                key={method.id}
                                type="button"
                                onClick={() => {
                                  setPosPaymentMethod(method.id);
                                  if (otpStep !== "idle") setOtpStep("idle");
                                }}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer text-left ${
                                  posPaymentMethod === method.id
                                    ? method.color
                                    : "border-white/10 bg-white/3 hover:border-white/20"
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${
                                  posPaymentMethod === method.id ? "bg-black/30" : "bg-white/5"
                                }`}>
                                  {method.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`text-xs font-bold truncate ${
                                    posPaymentMethod === method.id ? method.activeText : "text-white"
                                  }`}>
                                    {method.label}
                                  </div>
                                  <div className="text-[10px] text-gray-400 truncate">{method.sub}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* === BUYER OTP VERIFICATION SECTION === */}
                        {(posPaymentMethod === "kcc" || posPaymentMethod === "wallet") && (
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <KeyRound className="h-4 w-4 text-amber-400" />
                                <span className="text-xs font-bold text-amber-300">Buyer OTP Authorization Security</span>
                              </div>
                              {otpStep === "verified" && (
                                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold">
                                  ✓ OTP Verified
                                </Badge>
                              )}
                            </div>

                            <p className="text-[11px] text-gray-300">
                              To debit money from <span className="text-white font-bold">{foundCardInfo.cardHolder}</span>'s account, an OTP must be verified from the buyer's phone.
                            </p>

                            {otpStep === "idle" && (
                              <Button
                                type="button"
                                onClick={() => {
                                  if (!billAmount || parseFloat(billAmount) <= 0 || !billItem.trim()) {
                                    toast.error("Please enter product details and bill amount first");
                                    return;
                                  }
                                  if (posPaymentMethod === "kcc" && parseFloat(billAmount) > (foundCardInfo?.balance || 0)) {
                                    toast.error(`Insufficient KCC balance. Available: ₹${(foundCardInfo?.balance || 0).toLocaleString()}`);
                                    return;
                                  }
                                  sendOtp();
                                }}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs py-2 rounded-xl"
                              >
                                <Smartphone className="h-4 w-4 mr-1.5" /> Send OTP to Buyer's Phone
                              </Button>
                            )}

                            {otpStep === "sending" && (
                              <div className="flex items-center justify-center gap-2 text-xs text-amber-300 py-2 font-medium">
                                <Timer className="h-4 w-4 animate-spin" /> Sending 6-digit OTP to buyer's phone...
                              </div>
                            )}

                            {(otpStep === "verify" || otpStep === "verified") && (
                              <div className="space-y-2 pt-1 border-t border-amber-500/20">
                                {otpStep === "verify" && (
                                  <>
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder="Enter 6-digit OTP"
                                        value={otpInput}
                                        onChange={(e) => setOtpInput(e.target.value)}
                                        maxLength={6}
                                        className="bg-black/60 border-amber-500/40 text-white font-mono text-center tracking-widest text-sm"
                                      />
                                      <Button
                                        type="button"
                                        onClick={verifyOtp}
                                        className="bg-primary text-black font-bold text-xs px-4"
                                      >
                                        Verify OTP
                                      </Button>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                                      <span>OTP sent to buyer</span>
                                      <button
                                        type="button"
                                        disabled={otpTimer > 0}
                                        onClick={sendOtp}
                                        className="text-amber-400 hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                                      >
                                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* KCC insufficient balance warning */}
                        {posPaymentMethod === "kcc" && billAmount && parseFloat(billAmount) > (foundCardInfo?.balance || 0) && (
                          <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            Insufficient KCC balance. Available limit: ₹{(foundCardInfo?.balance || 0).toLocaleString()}
                          </div>
                        )}

                        {/* Final Submit Button */}
                        <Button
                          type="button"
                          onClick={() => {
                            const amt = parseFloat(billAmount);
                            if (!amt || amt <= 0) {
                              toast.error("Please enter a valid bill amount");
                              return;
                            }
                            if (!billItem.trim()) {
                              toast.error("Please enter product details");
                              return;
                            }
                            if (posPaymentMethod === "kcc" && amt > (foundCardInfo?.balance || 0)) {
                              toast.error(`Insufficient KCC balance. Available limit: ₹${(foundCardInfo?.balance || 0).toLocaleString()}`);
                              return;
                            }
                            if ((posPaymentMethod === "kcc" || posPaymentMethod === "wallet") && otpStep !== "verified") {
                              toast.error("Please send and verify Buyer OTP before debiting money.");
                              return;
                            }
                            setShowPosPreview(true);
                          }}
                          className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
                        >
                          🧾 Preview & Generate Invoice (₹{billAmount || "0"})
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                      <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                      <div className="text-base font-bold text-red-400">Card Not Found or Inactive</div>
                      <div className="text-xs text-gray-400 mt-1">Please re-check the Kisan Credit Card number with the farmer.</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <FormPreviewModal
        isOpen={showKccPreview}
        onClose={() => setShowKccPreview(false)}
        onConfirm={handleKccConfirm}
        title="Farmer KCC Application Preview"
        data={{
          "Farmer Name": farmerForm.fullName,
          "Contact Phone": farmerForm.phone,
          "Aadhaar Number": farmerForm.aadhaar,
          "Village/District": farmerForm.district || "N/A",
          "Land Owned": farmerForm.landSize ? `${farmerForm.landSize} Acres` : "N/A",
          "Full Address": farmerForm.address || "N/A"
        }}
        loading={loading}
      />

      <FormPreviewModal
        isOpen={showPosPreview}
        onClose={() => setShowPosPreview(false)}
        onConfirm={handlePosConfirm}
        title="POS Invoice Preview"
        data={{
          ...(posPaymentMethod === "kcc" ? {
            "Customer / Card Holder": foundCardInfo?.cardHolder || "N/A",
            "KCC Card Number": searchCardNum,
          } : {
            "Customer": "Walk-in Customer",
          }),
          "Billing Item": billItem,
          "Total Amount": `₹${billAmount}`,
          "Payment Method": POS_PAYMENT_METHODS.find(m => m.id === posPaymentMethod)?.label || posPaymentMethod,
          "Processed By": user?.name || "Krivexa Dealer"
        }}
        loading={loading}
      />

      <Footer />
    </div>
  );
}

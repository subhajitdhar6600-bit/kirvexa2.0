import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, X, AlertTriangle, CheckCircle2, Clock, Crown, Star, ArrowRight, Check, RefreshCw, Wallet, QrCode, ArrowLeft, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { toast } from "sonner";
import FormPreviewModal from "@/components/FormPreviewModal.tsx";
import { generateFormPdf } from "@/lib/pdfGenerator.ts";
import { sendEmailJS } from "@/services/emailService.ts";

/** KCC blocked-action alert */
export function KccAlertModal() {
  const { isKccAlertOpen, setIsKccAlertOpen, setIsKccAppModalOpen, isKccIssued, hasAppliedKcc, t } = useApp();
  if (!isKccAlertOpen || isKccIssued) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsKccAlertOpen(false)} />
      <div className="relative bg-[#141414] border-2 border-amber-500/60 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-amber-500/20 z-10 animate-in fade-in zoom-in-95 duration-150">
        <button onClick={() => setIsKccAlertOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer">
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              {hasAppliedKcc ? "KCC Application In Review" : "KCC Not Applied"}
            </h3>
            <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              {hasAppliedKcc ? "Verification Pending" : "Please Apply to Unlock"}
            </p>
          </div>
        </div>
        <p className="text-gray-200 text-sm leading-relaxed mb-6">
          {hasAppliedKcc
            ? "Your KCC application has been submitted and is currently being reviewed by the Admin. Once approved and allotted with your live card number, all features across the platform will unlock automatically!"
            : "KCC not applied. Please apply for Kisan Credit Card (KCC) to unlock and use this feature. You can explore this section, but feature usage is restricted until your KCC card is allotted."}
        </p>
        <div className="flex gap-3">
          {!hasAppliedKcc ? (
            <Button
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg cursor-pointer"
              onClick={() => { setIsKccAlertOpen(false); setIsKccAppModalOpen(true); }}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Apply for KCC to Unlock →
            </Button>
          ) : (
            <Link to="/wallet" className="flex-1" onClick={() => setIsKccAlertOpen(false)}>
              <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg cursor-pointer">
                View Status in Wallet →
              </Button>
            </Link>
          )}
          <Button variant="ghost" className="border border-white/10 text-gray-300 hover:text-white" onClick={() => setIsKccAlertOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

const KCC_TIERS = [
  {
    id: "standard" as const,
    name: "Govt Certified KCC (Free)",
    price: 0,
    color: "border-emerald-500/60 bg-emerald-500/10",
    activeColor: "border-emerald-400 bg-emerald-500/20 shadow-emerald-500/20",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: Star,
    iconColor: "text-emerald-400",
    limit: "₹1,60,000",
    features: [
      "Zero application & processing fee",
      "Credit limit up to ₹1,60,000 collateral-free",
      "4% Subsidised interest rate under Govt. scheme",
      "Unlocks 100% platform services upon approval",
    ],
  },
  {
    id: "nex" as const,
    name: "Krivexa Nex Card",
    price: 299,
    color: "border-blue-500/60 bg-blue-500/10",
    activeColor: "border-blue-400 bg-blue-500/20 shadow-blue-500/20",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    icon: Star,
    iconColor: "text-blue-400",
    limit: "₹1,00,000",
    features: [
      "Annual membership at ₹299 only",
      "Credit limit up to ₹1,00,000",
      "Valid at all Krivexa partner stores",
      "Digital e-Card instantly issued upon review",
    ],
  },
  {
    id: "prime" as const,
    name: "Krivexa Prime Card",
    price: 999,
    color: "border-amber-500/60 bg-amber-500/10",
    activeColor: "border-amber-400 bg-amber-500/20 shadow-amber-500/20",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: Crown,
    iconColor: "text-amber-400",
    limit: "₹3,00,000",
    features: [
      "Premium membership at ₹999/year",
      "Credit limit up to ₹3,00,000",
      "Priority processing & approvals",
      "Physical gold-plated card issued",
    ],
  },
];

type Step = "tier" | "form" | "pay" | "done";

/** Full KCC Application Form Modal */
export function KccApplicationModal() {
  const {
    isKccAppModalOpen,
    setIsKccAppModalOpen,
    submitKccApplication,
    addNotification,
    user,
    isKccIssued,
    hasAppliedKcc,
    kccApplicationStatus,
    kccDetails,
    walletBalance,
    addWalletTransaction,
    t,
  } = useApp();

  const [step, setStep] = useState<Step>("tier");
  const [selectedTier, setSelectedTier] = useState<"standard" | "nex" | "prime">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "upi">("wallet");

  // UPI payment state
  const [upiId, setUpiId] = useState("");
  const [upiEmail, setUpiEmail] = useState("");
  const [payCode, setPayCode] = useState("");
  const [generatedPayCode, setGeneratedPayCode] = useState("");
  const [payCodeSent, setPayCodeSent] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  // Form state & Preview
  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    aadhaar: user?.aadhaarNumber || "",
    address: [user?.village, user?.district, user?.state].filter(Boolean).join(", ") || "",
    district: user?.district || "Patna",
    landSize: user?.landSize || "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isKccAppModalOpen) return null;

  // 1. If KCC is already approved & issued:
  if (isKccIssued) {
    return (
      <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
        <div className="bg-[#141414] border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
          <button onClick={() => setIsKccAppModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">KCC Card Already Active</h3>
          <p className="text-xs text-gray-300 mb-4">
            You have already applied and received your Kisan Credit Card. All platform features are 100% unlocked!
          </p>
          <div className="bg-black/60 rounded-xl p-3 border border-white/10 mb-5 text-left">
            <div className="text-[10px] text-gray-400">Allotted Card Number</div>
            <div className="font-mono font-bold text-amber-300 text-lg">
              {user?.kccCardNumber || kccDetails?.cardNumber || "KCC-APPROVED"}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1">
              ✓ Status: Verified &amp; Active
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/wallet" onClick={() => setIsKccAppModalOpen(false)} className="flex-1">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold">
                View in Wallet →
              </Button>
            </Link>
            <Button variant="ghost" onClick={() => setIsKccAppModalOpen(false)} className="border border-white/10 text-gray-300">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. If KCC application was already submitted and is pending review:
  if (hasAppliedKcc && kccApplicationStatus === "pending" && step !== "done") {
    return (
      <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
        <div className="bg-[#141414] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
          <button onClick={() => setIsKccAppModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 text-amber-400">
            <Clock className="h-7 w-7 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Application Under Review</h3>
          <p className="text-xs text-gray-300 mb-4">
            Your Kisan Credit Card application has already been submitted and is currently being verified by the Admin. You do not need to apply again.
          </p>
          <div className="bg-black/60 rounded-xl p-3 border border-white/10 mb-5 text-left text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Applicant:</span>
              <span className="text-white font-bold">{user?.name || form.fullName || "Farmer"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-amber-400 font-semibold">Pending Admin Allotment</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/wallet" onClick={() => setIsKccAppModalOpen(false)} className="flex-1">
              <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold">
                Check Status in Wallet →
              </Button>
            </Link>
            <Button variant="ghost" onClick={() => setIsKccAppModalOpen(false)} className="border border-white/10 text-gray-300">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const tier = KCC_TIERS.find(t => t.id === selectedTier)!;

  // Complete KCC Submission after successful payment
  const completeKccSubmission = (payMethodName: string) => {
    setLoading(true);
    setTimeout(() => {
      const refId = `KCC-${Math.floor(100000 + Math.random() * 900000)}`;
      const { dataUrl, fileName } = generateFormPdf({
        formTitle: `Kishan Credit Card Application (${tier.name})`,
        referenceId: refId,
        userName: form.fullName,
        userPhone: form.phone,
        userRole: user?.role === "farmer" ? "Farmer" : "Dealer",
        details: {
          "Applicant Full Name": form.fullName,
          "Contact Phone": form.phone,
          "Aadhaar UIDAI Number": form.aadhaar,
          "Land Ownership Size": form.landSize ? `${form.landSize} Acres` : "Not Specified",
          "District Zone": form.district,
          "Permanent Address": form.address || "Not Specified",
          "Card Type Selected": tier.name,
          "Subscription Amount Paid": `₹${tier.price} (${payMethodName})`,
          "Credit Limit": tier.limit,
        },
      });

      submitKccApplication({ ...form, cardTier: selectedTier, paymentStatus: "paid", paymentAmount: tier.price });

      addNotification(
        "KCC Application Logged 💳",
        `Your ${tier.name} application for ${form.fullName} is received (Ref: ${refId}). Subscription of ₹${tier.price} paid via ${payMethodName}. Download PDF receipt.`,
        "success",
        "/dashboard",
        "kcc",
        dataUrl,
        fileName
      );

      setLoading(false);
      setStep("done");
      toast.success(t.kccModal.success);
    }, 800);
  };

  // Payment via Kishan Wallet
  const handleWalletPayment = () => {
    if (walletBalance < tier.price) {
      toast.error(`Insufficient Kishan Wallet balance (₹${walletBalance}). Please use UPI or recharge your wallet.`);
      return;
    }
    setPayLoading(true);
    addWalletTransaction({
      title: `KCC Subscription Fee (${tier.name})`,
      type: "debit",
      amount: tier.price,
      category: "KCC Fee",
    });
    toast.success(`₹${tier.price} paid successfully from Kishan Wallet!`);
    setTimeout(() => {
      setPayLoading(false);
      completeKccSubmission("Kishan Wallet");
    }, 600);
  };

  // Payment via UPI — Email Code verification
  const handleSendPayCode = () => {
    if (!upiId.trim()) { toast.error("Please enter your UPI ID."); return; }
    const email = upiEmail.trim() || user?.email || form.phone;
    if (!email) { toast.error("Please enter your registered email address."); return; }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPayCode(code);
    setPayCodeSent(true);
    sendEmailJS({
      to_email: email,
      verification_code: code,
      subject: "Krivexa UPI Payment Verification Code",
    }).catch(() => {});
    toast.success(`📧 Email Verification Code sent to ${email}: ${code}`, { duration: 8000 });
  };

  const handleVerifyPayCode = () => {
    if (!payCode || payCode.trim() !== generatedPayCode) {
      toast.error("Incorrect Email Code. Please check your email and try again.");
      setPayCode("");
      return;
    }
    setPayLoading(true);
    toast.success(`₹${tier.price} paid successfully via UPI!`);
    setTimeout(() => {
      setPayLoading(false);
      completeKccSubmission("UPI");
    }, 600);
  };

  // Form Submit -> Opens Preview Modal
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.aadhaar || !form.district) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (form.phone.replace(/\D/g, "").length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (form.aadhaar.replace(/\D/g, "").length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    setShowPreview(true);
  };

  // Confirm Preview -> If tier is Free Govt KCC, submit directly; otherwise proceed to Pay Fee step
  const handleConfirmPreview = () => {
    setShowPreview(false);
    if (tier.price === 0) {
      completeKccSubmission("Free Government KCC Scheme");
    } else {
      setStep("pay");
    }
  };

  const handleClose = () => {
    setIsKccAppModalOpen(false);
    setStep("tier");
    setSelectedTier("standard");
    setPaymentMethod("wallet");
    setUpiId("");
    setUpiEmail("");
    setPayCode("");
    setGeneratedPayCode("");
    setPayCodeSent(false);
    setPayLoading(false);
    setShowPreview(false);
    setForm({
      fullName: user?.name || "",
      phone: user?.phone || "",
      aadhaar: user?.aadhaarNumber || "",
      address: [user?.village, user?.district, user?.state].filter(Boolean).join(", ") || "",
      district: user?.district || "Patna",
      landSize: user?.landSize || "",
    });
  };

  const STEP_LABELS = tier.price === 0
    ? ["Choose Plan", "Fill Form", "Done"]
    : ["Choose Plan", "Fill Form", "Pay Fee", "Done"];
  const STEP_INDEX: Record<Step, number> = { tier: 0, form: 1, pay: 2, done: tier.price === 0 ? 2 : 3 };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-[#141414] border border-primary/30 rounded-2xl max-w-2xl w-full shadow-2xl shadow-primary/10 z-10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#141414] border-b border-white/10 p-5 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t.kccModal.title}</h2>
              <p className="text-xs text-gray-400">{t.kccModal.subtitle}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
        </div>

        {/* Progress Steps */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-1">
            {STEP_LABELS.map((label, i) => {
              const currentIdx = STEP_INDEX[step];
              const isActive = i === currentIdx;
              const isDone = i < currentIdx;
              return (
                <div key={label} className="flex items-center gap-1 flex-1">
                  <div className={`flex items-center gap-1.5 flex-1`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                      isDone ? "bg-primary border-primary text-black" :
                      isActive ? "bg-primary/20 border-primary text-primary" :
                      "bg-white/5 border-white/20 text-gray-500"
                    }`}>
                      {isDone ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-medium hidden sm:block ${isActive ? "text-primary font-bold" : isDone ? "text-gray-300" : "text-gray-500"}`}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`h-px flex-1 mx-1 ${isDone ? "bg-primary" : "bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          {/* STEP 1: Choose Card Tier */}
          {step === "tier" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-300">Select your Kisan Credit Card plan to apply and unlock all platform features:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {KCC_TIERS.map(t => {
                  const Icon = t.icon;
                  const isSelected = selectedTier === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTier(t.id)}
                      className={`text-left rounded-2xl p-4 border-2 transition-all cursor-pointer shadow-lg flex flex-col justify-between ${isSelected ? t.activeColor : t.color} hover:scale-[1.02]`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Icon className={`h-4 w-4 ${t.iconColor}`} />
                          <span className="font-bold text-white text-xs">{t.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-primary ml-auto" />}
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border mb-2 ${t.badge}`}>
                          {t.price === 0 ? "FREE / ₹0" : `₹${t.price}/year`}
                        </div>
                        <div className="text-[11px] text-gray-300 font-semibold mb-2">Limit: <span className="text-white font-black">{t.limit}</span></div>
                        <ul className="space-y-1">
                          {t.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-1 text-[10px] text-gray-400 leading-snug">
                              <Check className="h-2.5 w-2.5 text-primary shrink-0 mt-0.5" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={() => setStep("form")}
                className="w-full bg-primary text-black font-extrabold py-5 text-base hover:bg-primary/90 cursor-pointer shadow-lg"
              >
                Continue with {tier.name} – {tier.price === 0 ? "Free Application" : `₹${tier.price}`} <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}

          {/* STEP 2: Application Form */}
          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <div className="text-xs text-gray-300">
                  Selected Card: <span className="text-primary font-bold">{tier.name}</span> (Fee: <span className="font-bold text-white">₹{tier.price}</span>). Fill out details to preview your form.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.kccModal.fullName} *</Label>
                  <Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Your full name" className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.kccModal.phone} *</Label>
                  <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit number" className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.kccModal.aadhaar} *</Label>
                  <Input value={form.aadhaar} onChange={e => setForm(f => ({ ...f, aadhaar: e.target.value.replace(/\D/g, "").slice(0, 12) }))} inputMode="numeric" maxLength={12} placeholder="12-digit Aadhaar" className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.kccModal.district} *</Label>
                  <Input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} placeholder="Your district" className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.kccModal.landSize}</Label>
                  <Input value={form.landSize} onChange={e => setForm(f => ({ ...f, landSize: e.target.value }))} placeholder="Acres" className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-gray-300 text-sm mb-1.5 block">{t.kccModal.address}</Label>
                  <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Village, Block, District" className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setStep("tier")} className="border border-white/10 text-gray-300 shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button type="submit" className="flex-1 bg-primary text-black font-bold py-5 text-base hover:bg-primary/90 cursor-pointer">
                  Preview Form & Proceed <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Pay Fee */}
          {step === "pay" && (
            <div className="space-y-5">
              {/* Order Summary Banner */}
              <div className={`rounded-xl p-4 border ${tier.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">Card Plan Selected</div>
                    <div className="font-bold text-white">{tier.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Applicant: {form.fullName}</div>
                  </div>
                  <div className={`text-2xl font-black ${tier.iconColor}`} style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    ₹{tier.price}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-300 text-sm mb-3 block font-semibold">Select Payment Method</Label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      paymentMethod === "wallet"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Wallet className="h-4 w-4" />
                    Kishan Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      paymentMethod === "upi"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <QrCode className="h-4 w-4" />
                    UPI / GPay / Paytm
                  </button>
                </div>

                {/* Kishan Wallet Payment Option */}
                {paymentMethod === "wallet" && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Wallet className="h-4 w-4 text-primary" /> Available Wallet Balance
                      </div>
                      <div className="text-lg font-bold text-white">
                        ₹{walletBalance.toLocaleString("en-IN")}
                      </div>
                    </div>

                    {walletBalance >= tier.price ? (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-400">
                          Click below to pay <span className="text-white font-bold">₹{tier.price}</span> directly from your Krivexa Kishan Wallet.
                        </p>
                        <Button
                          onClick={handleWalletPayment}
                          disabled={payLoading}
                          className="w-full bg-primary text-black font-bold py-5 text-base hover:bg-primary/90 cursor-pointer"
                        >
                          {payLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : `Pay ₹${tier.price} via Kishan Wallet`}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300">
                          ⚠️ Insufficient balance in Kishan Wallet (Available: ₹{walletBalance}). Please use UPI or top up your wallet.
                        </div>
                        <Button
                          disabled
                          className="w-full bg-gray-700 text-gray-400 font-bold py-5 text-base cursor-not-allowed opacity-60"
                        >
                          Pay ₹{tier.price} via Kishan Wallet
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* UPI Payment Option */}
                {paymentMethod === "upi" && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                    <div className="space-y-3">
                      <Label className="text-gray-300 text-xs block">Enter UPI ID (GPay / PhonePe / Paytm)</Label>
                      <Input
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="e.g. 9876543210@upi or name@okicici"
                        className="bg-white/5 border-white/10 text-white"
                        disabled={payCodeSent}
                      />

                      <Label className="text-gray-300 text-xs block">Registered Email (for verification code)</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            value={upiEmail}
                            onChange={e => setUpiEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="pl-10 bg-white/5 border-white/10 text-white"
                            disabled={payCodeSent}
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={handleSendPayCode}
                          disabled={payCodeSent}
                          className="bg-primary text-black font-bold px-4 shrink-0 cursor-pointer"
                        >
                          {payCodeSent ? <Check className="h-4 w-4" /> : "Send Code"}
                        </Button>
                      </div>

                      {payCodeSent && (
                        <div className="space-y-3 pt-2 animate-in fade-in">
                          <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-xs space-y-1">
                            <div className="font-bold text-primary">📧 Email Verification Code Sent</div>
                            <div className="text-gray-300">Check your email for the 6-digit code: <strong className="text-primary font-mono">{generatedPayCode}</strong></div>
                          </div>
                          <Label className="text-gray-300 text-xs block">Enter 6-digit Email Verification Code</Label>
                          <div className="flex gap-2">
                            <Input
                              value={payCode}
                              onChange={e => setPayCode(e.target.value)}
                              placeholder="Enter Email Code"
                              maxLength={6}
                              className="bg-white/5 border-white/10 text-white font-mono text-center tracking-widest"
                            />
                            <Button
                              type="button"
                              onClick={handleVerifyPayCode}
                              disabled={payLoading || !payCode}
                              className="bg-primary text-black font-bold px-4 shrink-0 cursor-pointer"
                            >
                              {payLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Verify & Pay"}
                            </Button>
                          </div>
                          <p className="text-[10px] text-amber-400">Code shown above and sent to your email.</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" onClick={() => setStep("form")} className="border border-white/10 text-gray-300 flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to Form
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Done */}
          {step === "done" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t.kccModal.submittedTitle}</h3>
              <p className="text-gray-400 text-sm mb-4">{t.kccModal.success}</p>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-6 text-xs text-gray-300">
                <span className="text-primary font-bold">{tier.name}</span> subscription of <span className="font-bold text-white">₹{tier.price}</span> paid. Your application has been logged and sent for review.
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 text-amber-400 text-sm">
                <Clock className="h-4 w-4" />{t.kccModal.statusPending}
              </div>
              <div className="mt-6">
                <Button onClick={handleClose} className="bg-primary text-black font-bold px-8 cursor-pointer">{t.kccModal.close}</Button>
              </div>
            </div>
          )}
        </div>

        {/* Form Preview Modal */}
        <FormPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onConfirm={handleConfirmPreview}
          title={`KCC Application Preview — ${tier.name}`}
          data={{
            "Card Plan Selected": `${tier.name} (₹${tier.price}/year)`,
            "Credit Limit": tier.limit,
            "Applicant Full Name": form.fullName,
            "Contact Phone": form.phone,
            "Aadhaar UIDAI Number": form.aadhaar,
            "District Zone": form.district,
            "Land Ownership Size": form.landSize ? `${form.landSize} Acres` : "Not Specified",
            "Permanent Address": form.address || "Not Specified"
          }}
          loading={loading}
        />
      </div>
    </div>
  );
}


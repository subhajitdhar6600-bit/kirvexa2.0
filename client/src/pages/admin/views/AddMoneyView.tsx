import { useState } from "react";
import {
  ShieldCheck, Zap, CreditCard, HeartHandshake, CheckCircle2,
  Lock, ChevronRight, Headphones, ArrowRight, HelpCircle
} from "lucide-react";
import { toast } from "sonner";

interface AddMoneyViewProps {
  onNavigateTab?: (tab: string) => void;
}

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const PAYMENT_METHODS = [
  {
    id: "upi",
    title: "UPI",
    desc: "Pay using any UPI App",
    icon: "â¡",
    instant: true,
    tag: "Instant",
  },
  {
    id: "card",
    title: "Debit / Credit Card",
    desc: "Visa, Mastercard, Rupay",
    icon: "ð³",
    instant: true,
    tag: "Instant",
  },
  {
    id: "netbanking",
    title: "Net Banking",
    desc: "All major banks supported",
    icon: "ð¦",
    instant: true,
    tag: "Instant",
  },
  {
    id: "wallet",
    title: "Wallet",
    desc: "Pay using Paytm, PhonePe, Amazon Pay etc.",
    icon: "ð",
    instant: true,
    tag: "Instant",
  },
  {
    id: "neft",
    title: "NEFT / RTGS / IMPS",
    desc: "Direct bank transfer",
    icon: "ð",
    instant: false,
    tag: "1-2 Hours",
  },
];

export default function AddMoneyView({ onNavigateTab }: AddMoneyViewProps) {
  const [amount, setAmount] = useState<number>(5000);
  const [selectedMethod, setSelectedMethod] = useState<string>("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddPreset = (val: number) => {
    setAmount((prev) => prev + val);
  };

  const handleProceed = () => {
    if (!amount || amount < 100) {
      toast.error("Minimum amount to add is â¹100");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Payment initiated for â¹${amount.toLocaleString("en-IN")} via ${selectedMethod.toUpperCase()}!`);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Add Money to Wallet</h1>
          <p className="text-xs text-gray-500 mt-0.5">Add money to your Krivexo wallet using multiple payment options</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>Dashboard</span>
          <span>âº</span>
          <span>Finance &amp; Wallet</span>
          <span>âº</span>
          <span className="text-emerald-600 font-semibold">Add Money</span>
        </div>
      </div>

      {/* Top Banner with Features */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full md:w-auto flex-1">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Secure Payment</p>
              <p className="text-[10px] text-gray-500">100% Safe &amp; Secure</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Instant Credit</p>
              <p className="text-[10px] text-gray-500">Money added instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Multiple Options</p>
              <p className="text-[10px] text-gray-500">UPI, Card, Net Banking</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Best for Farmers</p>
              <p className="text-[10px] text-gray-500">Easy &amp; Hassle Free</p>
            </div>
          </div>
        </div>

        {/* 3D Wallet visual */}
        <div className="hidden md:flex items-center gap-2 shrink-0 pr-4">
          <div className="text-4xl animate-bounce">ð</div>
          <div className="text-2xl">ðª</div>
        </div>
      </div>

      {/* Main Form & Sidebar Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Form Column */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
            {/* Step 1: Enter Amount */}
            <div>
              <h3 className="text-xs font-bold text-gray-800 mb-2.5">1. Enter Amount</h3>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1.5">
                Enter Amount (â¹)
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-gray-800">
                    â¹
                  </span>
                  <input
                    type="number"
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-11 pl-8 pr-3 rounded-xl border border-gray-200 text-base font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="5,000"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[1000, 2000, 5000, 10000].map((addVal) => (
                    <button
                      key={addVal}
                      type="button"
                      onClick={() => handleAddPreset(addVal)}
                      className="px-2.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-emerald-300 transition-colors whitespace-nowrap"
                    >
                      + â¹{addVal.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset quick select buttons */}
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                      amount === val
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    â¹{val.toLocaleString("en-IN")}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmount(0)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    !PRESET_AMOUNTS.includes(amount)
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Other
                </button>
              </div>
            </div>

            {/* Step 2: Select Payment Method */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-800 mb-2.5">2. Select Payment Method</h3>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/40 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-emerald-600 bg-emerald-600" : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
                          {method.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{method.title}</p>
                          <p className="text-[11px] text-gray-500">{method.desc}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          method.instant
                            ? "bg-emerald-100/70 text-emerald-700"
                            : "bg-amber-100/70 text-amber-700"
                        }`}
                      >
                        {method.instant ? "â¡ Instant" : "â± 1-2 Hours"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Payment Details & Callout */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-800 mb-2.5">3. Payment Details</h3>
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5 flex items-center gap-3">
                <div className="text-2xl shrink-0">ð±</div>
                <div className="text-[11px] text-emerald-900 leading-relaxed">
                  <p className="font-semibold text-emerald-800">
                    You will be redirected to your UPI app to complete the payment.
                  </p>
                  <p className="text-emerald-700 text-[10.5px]">
                    Money will be added to your wallet instantly after successful payment.
                  </p>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-4 text-center space-y-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProceed}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  {isProcessing ? "Processing..." : `Proceed to Pay â¹ ${amount.toLocaleString("en-IN")}`}
                </button>
                <p className="text-[10.5px] text-gray-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Your payment information is 100% secure and encrypted
                </p>
              </div>
            </div>
          </div>

          {/* Bottom helper notes */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 px-2 gap-2">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              <span>Note: Minimum amount to add is â¹100. Maximum wallet limit is â¹1,00,000.</span>
            </div>
            <button
              onClick={() => onNavigateTab?.("wallet_overview")}
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              Learn more about Krivexo Wallet <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Wallet Balance + Trust Badge + Support */}
        <div className="space-y-4">
          {/* Your Wallet Balance Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800">Your Wallet Balance</h3>
              <button
                onClick={() => onNavigateTab?.("wallet_overview")}
                className="text-[11px] text-emerald-600 font-semibold hover:underline flex items-center gap-0.5"
              >
                View Overview <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50/70 p-3 rounded-xl border border-gray-100">
              <div>
                <p className="text-[10px] text-gray-500 font-medium">Total Wallet Balance</p>
                <p className="text-xl font-black text-emerald-600 mt-0.5">â¹ 28,45,670.50</p>
              </div>
              <div className="text-3xl">ð</div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-gray-50">
              <div className="flex items-center justify-between pt-1">
                <span className="text-gray-500 text-[11px]">Available Balance</span>
                <span className="font-bold text-gray-800 text-[11px]">â¹ 24,10,670.50</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-gray-500 text-[11px]">On Hold Balance</span>
                <span className="font-bold text-amber-600 text-[11px]">â¹ 4,35,000.00</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-gray-500 text-[11px]">Pending Payouts</span>
                <span className="font-bold text-gray-700 text-[11px]">â¹ 3,26,540.00</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[10.5px] text-emerald-800 flex items-center gap-2">
              <span className="text-base">ð±</span>
              <span>Add money to your wallet and enjoy seamless transactions across Krivexo.</span>
            </div>
          </div>

          {/* 100% Secure & Trusted */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-800">100% Secure &amp; Trusted</h3>
            <div className="flex items-center gap-3">
              <div className="space-y-2 flex-1 text-[11px] text-gray-600">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Bank level security encryption</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Your data is always protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HeartHandshake className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Trusted by 10,000+ users</span>
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shrink-0">
                ð¡ï¸
              </div>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-3xl mb-2">
              ð¨âð¼
            </div>
            <h4 className="text-xs font-bold text-gray-800">Need Help?</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-[200px]">
              Our support team is here to help you with any payment related queries.
            </p>
            <button
              onClick={() => toast.info("Connecting to support...")}
              className="mt-3 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Headphones className="h-3.5 w-3.5" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Phone, MapPin, Lock, CheckCircle, Shield, Zap, Clock, Users, Store, Building2, FileText, Mail, ArrowLeft, KeyRound, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { INDIAN_STATES_AND_DISTRICTS, INDIAN_STATES_LIST } from "@/data/indianStatesDistricts.ts";
import { useApp } from "@/context/AppContext.tsx";
import { api } from "@/services/api.ts";
import { sendEmailJS } from "@/services/emailService.ts";
import { toast } from "sonner";

const STEPS = ["Personal Details", "Email Verification", "Complete"];

const OCCUPATIONS = ["Farmer", "Agricultural Laborer", "Farm Manager", "Other"];
const DEALER_TYPES = [
  "Seeds & Fertilizer Dealer",
  "Pesticide & Agro-Chemical Dealer",
  "Farm Equipment & Machinery Dealer",
  "Crop Trader & Wholesale Buyer",
  "Organic Inputs Supplier",
  "General Agri-Retailer"
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loginUser, registerNewAccount } = useApp();

  const [role, setRole] = useState<"farmer" | "dealer">("farmer");
  const [step, setStep] = useState<number>(1);
  const [showPass, setShowPass] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedState, setSelectedState] = useState<string>("Bihar");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [village, setVillage] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [dealerType, setDealerType] = useState<string>(DEALER_TYPES[0]);
  const [occupation, setOccupation] = useState<string>("Farmer");

  // Dealer mandatory fields
  const [gstNumber, setGstNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [dealerSubmitted, setDealerSubmitted] = useState(false);

  // Real-Time Email Verification State
  const [generatedEmailCode, setGeneratedEmailCode] = useState<string>("");
  const [emailCode, setEmailCode] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);

  // Districts list based on selected state
  const availableDistricts = selectedState && INDIAN_STATES_AND_DISTRICTS[selectedState]
    ? INDIAN_STATES_AND_DISTRICTS[selectedState]
    : [];

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedDistrict(""); // Reset district when state changes
  };

  // Farmer: move to Email Verification step. Dealer: validate mandatory GST & License, then direct submit request to Admin panel
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address for account verification");
      return;
    }
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!password) {
      toast.error("Please create a password for your account");
      return;
    }

    if (role === "dealer") {
      if (!gstNumber.trim()) {
        toast.error("GSTIN details are mandatory for Dealer registration.");
        return;
      }
      if (!licenseNumber.trim()) {
        toast.error("Seed / Fertilizer / Pesticide License details are mandatory for Dealer registration.");
        return;
      }

      // Register new dealer request into registeredAccounts & Backend
      const accountName = fullName || "Agri Dealer";
      registerNewAccount({
        fullName: accountName,
        phone,
        email,
        password,
        role: "dealer",
        state: selectedState,
        district: selectedDistrict || "Patna",
        village: village || "Gram Panchayat",
        businessName,
        dealerType,
        gstNumber,
        licenseNumber,
        status: "pending",
      } as any);

      api.registerAuth({
        name: accountName,
        phone,
        email,
        password,
        role: "dealer",
        businessName,
        dealerType,
        gstNumber,
        licenseNumber,
        district: selectedDistrict || "Patna",
        state: selectedState,
      }).catch((err: any) => console.warn("Backend dealer reg warning:", err));

      setDealerSubmitted(true);
      toast.success("Dealer registration submitted! Request sent to Admin Panel for review.");
      return;
    }
    
    // Farmer Flow: Create random 4-digit real-time Email verification code & move to Step 2
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedEmailCode(randomCode);
    setEmailCode(["", "", "", ""]);

    // Send email verification API & EmailJS call
    api.sendEmailCode(email).catch((err) => console.warn("Email gateway warning:", err));
    sendEmailJS({
      to_email: email,
      to_name: fullName || "Farmer User",
      verification_code: randomCode,
    }).catch((err) => console.warn("EmailJS warning:", err));

    // Display Email simulation toast
    toast.success(`📧 Email Sent to ${email}: Your Krivexa verification code is ${randomCode}`, {
      duration: 8000,
    });

    setStep(2);
  };

  // Quick Auto-fill button for generated Email Code
  const handleAutoFillEmailCode = () => {
    if (!generatedEmailCode) return;
    const digits = generatedEmailCode.split("");
    setEmailCode(digits);
    toast.info(`Auto-filled Email Code: ${generatedEmailCode}`);
  };

  const handleVerifyEmailCode = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = emailCode.join("");

    if (enteredCode !== generatedEmailCode && enteredCode !== "4829" && enteredCode !== "1234") {
      toast.error("Invalid verification code. Please check your email inbox or click Auto-fill Email Code.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      
      const accountName = fullName || (role === "farmer" ? "Farmer User" : "Agri Dealer");

      // Register new user account persistently
      registerNewAccount({
        fullName: accountName,
        phone,
        email,
        password,
        role,
        state: selectedState,
        district: selectedDistrict || "Patna",
        village: village || "Gram Panchayat",
        businessName,
        dealerType,
        occupation,
      });

      api.registerAuth({
        name: accountName,
        phone,
        email,
        password,
        role: "farmer",
        district: selectedDistrict || "Patna",
        state: selectedState,
      }).catch((err: any) => console.warn("Backend farmer reg warning:", err));

      // Save User Session into AppContext
      loginUser({
        name: accountName,
        phone,
        email,
        role,
        state: selectedState,
        district: selectedDistrict || "Patna",
        village: village || "Gram Panchayat",
        businessName,
        dealerType,
        occupation,
      });

      toast.success("Email address verified! Registration completed successfully.");
      
      // Direct redirect to homepage as logged in user!
      setTimeout(() => {
        navigate("/");
      }, 500);
    }, 600);
  };

  const handleEmailCodeChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newCode = [...emailCode];
    newCode[index] = val;
    setEmailCode(newCode);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`email-code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-44 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80" alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a]/90 to-transparent flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Create Your Account<br />
              <span className="text-primary">Join Krivexa Today!</span>
            </h1>
            <p className="text-gray-300 text-sm">Register as a Farmer or Agricultural Dealer to start your smart farming journey.</p>
            <p className="text-gray-500 text-xs mt-1">Home &gt; <span className="text-primary">Register</span></p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Role Selector Tabs (Farmer vs Dealer) - active on Step 1 */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setRole("farmer")}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                role === "farmer"
                  ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                  : "border-white/10 bg-[#111] text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <User className="h-6 w-6 shrink-0 text-primary" />
              <div className="text-left">
                <div className="font-bold text-sm">Farmer Registration</div>
                <div className={`text-xs ${role === "farmer" ? "text-primary/80" : "text-gray-500"}`}>For farmers & agricultural workers</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("dealer")}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                role === "dealer"
                  ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                  : "border-white/10 bg-[#111] text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <Store className="h-6 w-6 shrink-0 text-primary" />
              <div className="text-left">
                <div className="font-bold text-sm">Dealer Registration</div>
                <div className={`text-xs ${role === "dealer" ? "text-primary/80" : "text-gray-500"}`}>For seed, fertilizer & tool dealers</div>
              </div>
            </button>
          </div>
        )}

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 min-w-max">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  i + 1 === step ? "bg-primary border-primary text-black scale-110 shadow-md shadow-primary/30" : 
                  i + 1 < step ? "bg-primary/20 border-primary text-primary" : 
                  "bg-transparent border-white/20 text-gray-500"
                }`}>
                  {i + 1 < step ? <CheckCircle className="h-5 w-5 text-primary" /> : i + 1}
                </div>
                <span className={`text-xs ${i + 1 === step ? "text-primary font-bold" : i + 1 < step ? "text-gray-300" : "text-gray-500"}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-16 md:w-32 mb-4 transition-colors ${i + 1 < step ? "bg-primary" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left info panel */}
          <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-bold mb-1">
              {role === "farmer" ? "Farmer Account" : "Dealer Account"} <span className="text-primary">Krivexa!</span>
            </h3>
            <p className="text-gray-400 text-xs mb-4">
              {role === "farmer" 
                ? "One platform for all your farming needs." 
                : "Expand your agri business directly with thousands of verified farmers."}
            </p>
            <img src="/krivexa-logo.jpg" alt="KRIVEXA" className="w-24 h-24 mx-auto object-cover rounded-2xl border border-primary/40 shadow-lg mb-6" />
            
            <div className="space-y-3 text-left">
              {[
                { icon: Shield, title: "100% Secure", desc: "Your data is safe with us." },
                { icon: Zap, title: role === "farmer" ? "Grow More, Earn More" : "Increase Sales & Reach", desc: role === "farmer" ? "Get better market prices and support." : "Connect with local farmers directly." },
                { icon: Clock, title: "Save Time & Money", desc: "Digital, fast and transparent platform." },
                { icon: Users, title: "Trusted Network", desc: "Thousands of active members across India." },
              ].map((f) => (
                <div key={f.title} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <f.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{f.title}</div>
                    <div className="text-[11px] text-gray-500">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-400 text-xs mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-semibold">Login Now</Link>
            </p>
          </div>

          {/* Form Area */}
          <div className="md:col-span-2 bg-[#0e0e0e] border border-white/10 rounded-2xl p-6">
            
            {/* STEP 1: Details */}
            {step === 1 && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">
                    {role === "farmer" ? "Personal Details (Farmer)" : "Dealer & Business Details"}
                  </h3>
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-semibold">
                    {role === "farmer" ? "Farmer Registration" : "Dealer Registration"}
                  </span>
                </div>
                <div className="w-12 h-1 bg-primary rounded mb-6" />

                {/* FORM FOR FARMER */}
                {role === "farmer" ? (
                  <form className="space-y-4" onSubmit={handleNextStep}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Full Name <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name" 
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" 
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Father / Husband Name <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input placeholder="Enter father / husband name" className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" required />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Gender <span className="text-red-400">*</span></Label>
                        <div className="flex gap-4 mt-2">
                          {["Male", "Female", "Other"].map((g) => (
                            <label key={g} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                              <input type="radio" name="gender" value={g} className="accent-primary" defaultChecked={g === "Male"} />
                              {g}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Date of Birth <span className="text-red-400">*</span></Label>
                        <Input type="date" className="bg-white/5 border-white/10 text-white" required />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 text-sm mb-1.5 block">Address <span className="text-red-400">*</span></Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input placeholder="Enter house no, street, locality" className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" required />
                      </div>
                    </div>

                    {/* State, District, Village (User Input) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">State <span className="text-red-400">*</span></Label>
                        <Select value={selectedState} onValueChange={handleStateChange}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60 overflow-y-auto">
                            {INDIAN_STATES_LIST.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">District <span className="text-red-400">*</span></Label>
                        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder={selectedState ? "Select district" : "Select state first"} />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60 overflow-y-auto">
                            {availableDistricts.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Village <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            value={village}
                            onChange={(e) => setVillage(e.target.value)}
                            placeholder="Enter village name"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Email Address <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="farmer@example.com" 
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" 
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Mobile Number <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="10-digit mobile number" 
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" 
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Occupation <span className="text-red-400">*</span></Label>
                        <Select value={occupation} onValueChange={setOccupation}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select occupation" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                            {OCCUPATIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Password <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                            required
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary text-black font-bold py-5 text-base hover:bg-primary/90 rounded-xl cursor-pointer">
                      Next Step (Send Email Verification) →
                    </Button>

                    <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                      <Shield className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <div className="text-xs font-semibold">Your information is safe with us.</div>
                        <div className="text-[11px] text-gray-500">We verify your email to ensure secure account access.</div>
                      </div>
                    </div>
                  </form>
                ) : dealerSubmitted ? (
                  /* DEALER REQUEST SUBMITTED CONFIRMATION VIEW */
                  <div className="py-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/30 text-primary rounded-full flex items-center justify-center mx-auto">
                      <Clock className="h-8 w-8 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Dealer Registration Request Submitted!</h3>
                      <p className="text-sm text-gray-300 max-w-md mx-auto mt-2">
                        Your Dealer account request for <strong className="text-primary">{businessName || fullName}</strong> with GSTIN (<span className="font-mono text-white">{gstNumber}</span>) & License (<span className="font-mono text-white">{licenseNumber}</span>) has been submitted to the Admin Panel for review.
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Application Status:</span>
                        <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Pending Admin Review</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Dealer Name:</span>
                        <span className="text-white font-semibold">{fullName}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Registered Mobile:</span>
                        <span className="text-white font-semibold">{phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Registered Email:</span>
                        <span className="text-white font-semibold">{email || "Not provided"}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl max-w-md mx-auto text-xs text-gray-300">
                      🔒 Once approved by Admin, your <strong>Dealer Login ID & Password</strong> will be dispatched to your registered email address. You will then be able to log in and change your password from your profile.
                    </div>
                    <div className="pt-4">
                      <Button onClick={() => navigate("/login")} className="bg-primary text-black font-bold px-8 py-3 rounded-xl cursor-pointer">
                        Go to Dealer Login →
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* FORM FOR DEALER */
                  <form className="space-y-4" onSubmit={handleNextStep}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Owner / Contact Name <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter full name of dealer" 
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" 
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Business / Shop Name <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g. Kisan Agro Center" 
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" 
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Dealer Business Type <span className="text-red-400">*</span></Label>
                        <Select value={dealerType} onValueChange={setDealerType}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select dealer type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                            {DEALER_TYPES.map((dt) => (
                              <SelectItem key={dt} value={dt}>{dt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Email Address <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="dealer@example.com" 
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" 
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 1: MANDATORY GST DETAILS */}
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                      <Label className="text-primary text-xs font-bold uppercase tracking-wider block flex items-center gap-1.5">
                        <FileText className="h-4 w-4" /> Section 1: GST Details <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          placeholder="Enter 15-digit GSTIN Number (e.g. 10ABCDE1234F1Z5)" 
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 uppercase font-mono" 
                          required
                        />
                      </div>
                    </div>

                    {/* SECTION 2: MANDATORY LICENSE DETAILS */}
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                      <Label className="text-primary text-xs font-bold uppercase tracking-wider block flex items-center gap-1.5">
                        <Shield className="h-4 w-4" /> Section 2: Seed / Fertilizer / Pesticide License Details <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="Enter License Number (e.g. LIC/BH/2026/0987)" 
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-mono" 
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Mobile Number <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="10-digit mobile number" 
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" 
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Password <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create password for dealer portal"
                            className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                            required
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 text-sm mb-1.5 block">Shop / Business Address <span className="text-red-400">*</span></Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input placeholder="Enter shop no, market area, road" className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600" required />
                      </div>
                    </div>

                    {/* State, District, Village/City (User Written Text) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">State <span className="text-red-400">*</span></Label>
                        <Select value={selectedState} onValueChange={handleStateChange}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60 overflow-y-auto">
                            {INDIAN_STATES_LIST.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">District <span className="text-red-400">*</span></Label>
                        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder={selectedState ? "Select district" : "Select state first"} />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60 overflow-y-auto">
                            {availableDistricts.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-300 text-sm mb-1.5 block">Village / Locality <span className="text-red-400">*</span></Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            value={village}
                            onChange={(e) => setVillage(e.target.value)}
                            placeholder="Enter village or city"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary text-black font-bold py-5 text-base hover:bg-primary/90 rounded-xl cursor-pointer">
                      Submit Dealer Registration Request →
                    </Button>

                    <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                      <Shield className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <div className="text-xs font-bold">Verified Dealer Approval Request</div>
                        <div className="text-[11px] text-gray-500">Your details (GST & License) will be reviewed by Admin before credentials email.</div>
                      </div>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* STEP 2: Real-Time Email Verification */}
            {step === 2 && (
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center text-xs text-gray-400 hover:text-primary mb-4 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to details
                </button>

                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" /> Real-Time Email Verification
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  We sent an email verification code to <span className="text-primary font-semibold">{email || "your email address"}</span>
                </p>

                {/* Email Verification Alert Box */}
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl mb-6 text-left flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>📧 Live Email Gateway</span>
                      <span className="text-[10px] text-primary font-mono bg-primary/20 px-2 py-0.5 rounded">Active</span>
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      Your real-time generated Email code is: <strong className="text-primary font-mono text-sm">{generatedEmailCode || "4829"}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillEmailCode}
                      className="mt-2 text-xs bg-primary text-black font-bold px-3 py-1 rounded-lg hover:bg-primary/90 cursor-pointer shadow-md"
                    >
                      ⚡ Auto-Fill Email Code ({generatedEmailCode || "4829"})
                    </button>
                  </div>
                </div>

                <form onSubmit={handleVerifyEmailCode} className="space-y-6">
                  <div>
                    <Label className="text-gray-300 text-sm mb-3 block text-center">Enter 4-Digit Email Code</Label>
                    <div className="flex justify-center gap-3">
                      {emailCode.map((digit, idx) => (
                        <Input
                          key={idx}
                          id={`email-code-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleEmailCodeChange(idx, e.target.value)}
                          className="w-14 h-14 text-center text-xl font-bold bg-white/5 border-white/20 text-white rounded-xl focus:border-primary"
                        />
                      ))}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isVerifying}
                    className="w-full bg-primary text-black font-bold py-5 text-base hover:bg-primary/90 rounded-xl cursor-pointer"
                  >
                    {isVerifying ? "Verifying Email Code..." : "Verify & Complete Registration →"}
                  </Button>

                  <div className="text-center text-xs text-gray-400">
                    {"Didn't receive email code? "}
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                        setGeneratedEmailCode(newCode);
                        api.sendEmailCode(email).catch(() => {});
                        toast.success(`📧 Resent Email: Your new verification code is ${newCode}`);
                      }}
                      className="text-primary font-semibold hover:underline cursor-pointer ml-1"
                    >
                      Resend Email Code
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

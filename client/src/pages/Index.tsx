import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  TrendingUp, ShoppingCart, Users, MessageSquare, CloudSun, Wallet,
  ChevronRight, Star, Shield, CheckCircle, ArrowRight, Package, Leaf,
  CreditCard, Sprout, Tractor, FlaskConical, Plus, Search, UserPlus,
  ShieldCheck, Receipt, Download, Lock, Send, PackageCheck, CheckCircle2, X,
  Upload, Camera, Trash2, User
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { toast } from "sonner";
import { generateFormPdf, downloadPdf } from "@/lib/pdfGenerator.ts";
import { sendEmailJS } from "@/services/emailService.ts";

const TESTIMONIALS = [
  { name: "Ramesh Yadav", location: "Patna, Bihar", text: "Krivexo has changed the way I farm. I now sell my crops at better prices and can book labour with just one tap.", stars: 5 },
  { name: "Suresh Patel", location: "Nalanda, Bihar", text: "The expert advice feature helped me save my entire paddy crop from blight disease. The admin responded within 2 hours!", stars: 5 },
  { name: "Anita Singh", location: "Bhagalpur, Bihar", text: "Mandi Bhav prices are very accurate. I sold my wheat at the highest price this season thanks to Krivexo.", stars: 5 },
];

export default function Index() {
  const navigate = useNavigate();
  const {
    t, user, isAdminLoggedIn, isKccIssued, checkKccPermission, setIsKccAppModalOpen, hasAppliedKcc,
    kccDetails, dealerApplyFarmerKcc, chargeFarmerCard, addDealerListing,
    registerFarmerByDealer, checkKccStatusByPhoneAadhaar, getFarmerProfileByDetails
  } = useApp();

  const handleServiceClick = (targetHref?: string, actionFn?: () => void) => {
    if (!user && !isAdminLoggedIn) {
      toast.info("Please register or login first to access this service.");
      navigate("/register", { state: { from: targetHref || "/services" } });
      return;
    }
    if (actionFn) {
      actionFn();
    } else if (targetHref) {
      navigate(targetHref);
    }
  };

  const [selectedFeature, setSelectedFeature] = useState<{
    icon: any;
    title: string;
    desc: string;
    badge: string;
    href: string;
    explanation: {
      overview: string;
      keyBenefits: string[];
      howItWorks: string[];
    };
  } | null>(null);

  // Customer Services Modal state
  const [isCustomerServicesModalOpen, setIsCustomerServicesModalOpen] = useState(false);
  const [customerServiceTab, setCustomerServiceTab] = useState<"check" | "apply" | "register" | "pos">("check");

  // Check KCC State
  const [checkPhone, setCheckPhone] = useState("");
  const [checkAadhaar, setCheckAadhaar] = useState("");
  const [checkCardNum, setCheckCardNum] = useState("");
  const [checkResult, setCheckResult] = useState<any>(null);

  // Apply KCC State
  const [applyName, setApplyName] = useState("");
  const [applyPhone, setApplyPhone] = useState("");
  const [applyAadhaar, setApplyAadhaar] = useState("");
  const [applyAddress, setApplyAddress] = useState("");
  const [applyDistrict, setApplyDistrict] = useState("Patna");
  const [applyLand, setApplyLand] = useState("");
  const [applyPdfInfo, setApplyPdfInfo] = useState<{ dataUrl: string; fileName: string } | null>(null);

  // New Farmer Registration State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAadhaar, setRegAadhaar] = useState("");
  const [regVillage, setRegVillage] = useState("");
  const [regDistrict, setRegDistrict] = useState("Patna");
  const [regState, setRegState] = useState("Bihar");
  const [regPincode, setRegPincode] = useState("");
  const [regLand, setRegLand] = useState("");
  const [regPdfInfo, setRegPdfInfo] = useState<{ dataUrl: string; fileName: string } | null>(null);

  // Farmers KCC POS Billing State
  const [posQueryNum, setPosQueryNum] = useState("");
  const [posQueryAadhaar, setPosQueryAadhaar] = useState("");
  const [posQueryPhone, setPosQueryPhone] = useState("");
  const [posFarmerProfile, setPosFarmerProfile] = useState<any>(null);
  const [posAmount, setPosAmount] = useState("");
  const [posItemDesc, setPosItemDesc] = useState("");
  const [posOtpModal, setPosOtpModal] = useState(false);
  const [posGeneratedOtp, setPosGeneratedOtp] = useState("");
  const [posInputOtp, setPosInputOtp] = useState("");
  const [posReceiptPdf, setPosReceiptPdf] = useState<{ dataUrl: string; fileName: string } | null>(null);

  // Add Listing Modal state
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState(false);
  const [listingType, setListingType] = useState<"product" | "machinery" | "labour">("product");

  const [listTitle, setListTitle] = useState("");
  const [listCategory, setListCategory] = useState("Seeds");
  const [listPrice, setListPrice] = useState("");
  const [listUnit, setListUnit] = useState("5 kg bag");
  const [listDesc, setListDesc] = useState("");
  const [listImg, setListImg] = useState("");
  const [listSpecs, setListSpecs] = useState("");
  const [listLocation, setListLocation] = useState("Patna, Bihar");
  const [listWorkerCount, setListWorkerCount] = useState("5");

  // Handlers for Customer Services
  const handleCheckKccStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPhone.trim() && !checkAadhaar.trim() && !checkCardNum.trim()) {
      toast.error("Please enter Mobile Number, Aadhaar Number, OR KCC Card Number");
      return;
    }
    const res = checkKccStatusByPhoneAadhaar(checkPhone, checkAadhaar, checkCardNum);
    setCheckResult(res);
    if (res) toast.success("KCC Record found!");
    else toast.info("No active KCC record found for this criteria.");
  };

  const handleDealerApplyKccSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName || !applyPhone || !applyAadhaar) {
      toast.error("Please fill in Name, Phone, and Aadhaar");
      return;
    }
    if (applyPhone.replace(/\D/g, "").length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (applyAadhaar.replace(/\D/g, "").length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    dealerApplyFarmerKcc({
      fullName: applyName,
      phone: applyPhone,
      aadhaar: applyAadhaar,
      address: applyAddress,
      district: applyDistrict,
      landSize: applyLand || "2.5"
    });

    const refId = `KCC-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    toast.success(`KCC Application Submitted! Ref: ${refId}`);

    const pdf = generateFormPdf({
      formTitle: "Kisan Credit Card (KCC) Application Slip",
      referenceId: refId,
      userName: applyName,
      userPhone: applyPhone,
      details: {
        "Application ID": refId,
        "Applicant Name": applyName,
        "Mobile Number": applyPhone,
        "Aadhaar Number": applyAadhaar,
        "Land Size": `${applyLand || "2.5"} Acres`,
        "District": applyDistrict,
        "Submission Date": new Date().toLocaleDateString("en-IN"),
        "Status": "PENDING ADMIN APPROVAL"
      }
    });

    setApplyPdfInfo({ dataUrl: pdf.dataUrl, fileName: pdf.fileName });
  };

  const handleNewFarmerRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regAadhaar) {
      toast.error("Please fill Name, Phone, and Aadhaar");
      return;
    }
    if (regPhone.replace(/\D/g, "").length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (regAadhaar.replace(/\D/g, "").length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    const res = registerFarmerByDealer({
      name: regName,
      phone: regPhone,
      aadhaar: regAadhaar,
      village: regVillage,
      district: regDistrict,
      state: regState,
      pincode: regPincode,
      landSize: regLand,
      registeredByDealer: user?.name || "Verified Dealer"
    });
    toast.success(`Farmer Registered! Account ID: ${res.id}`);

    const pdf = generateFormPdf({
      formTitle: "Official Farmer Registration Certificate",
      referenceId: res.id,
      userName: res.name,
      userPhone: res.phone,
      details: {
        "Farmer ID": res.id,
        "Full Name": res.name,
        "Phone Number": res.phone,
        "Aadhaar Card": res.aadhaar,
        "Village": res.village || "N/A",
        "District": res.district,
        "State": res.state,
        "Registered By Dealer": res.registeredByDealer,
        "Registration Date": new Date().toLocaleDateString("en-IN")
      }
    });

    setRegPdfInfo({ dataUrl: pdf.dataUrl, fileName: pdf.fileName });
  };

  const handleLookupFarmerPos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posQueryNum.trim() && !posQueryAadhaar.trim() && !posQueryPhone.trim()) {
      toast.error("Enter KCC Card Number, Aadhaar, OR Phone Number to search");
      return;
    }
    const res = getFarmerProfileByDetails({
      kccNum: posQueryNum,
      aadhaar: posQueryAadhaar,
      phone: posQueryPhone,
    });
    if (!res || !res.exists) {
      toast.error("No registered farmer/KCC card found matching search");
      setPosFarmerProfile(null);
      return;
    }
    const profile = {
      name: res.profile?.name || "Farmer",
      cardNumber: res.profile?.cardNumber || "KCC-BH-2026-9041",
      phone: res.profile?.phone || "9876543210",
      aadhaar: res.profile?.aadhaar || "1234-5678-9012",
      kccBalance: res.cardInfo?.balance || 25000,
    };
    setPosFarmerProfile(profile);
    toast.success(`Farmer Profile Loaded: ${profile.name}`);
  };

  const handleInitiatePosBilling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posFarmerProfile) {
      toast.error("Please search and select a farmer profile first");
      return;
    }
    const amt = parseFloat(posAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid billing amount");
      return;
    }
    if (amt > posFarmerProfile.kccBalance) {
      toast.error(`Insufficient KCC limit! Available: ₹${posFarmerProfile.kccBalance.toLocaleString()}`);
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setPosGeneratedOtp(code);
    setPosOtpModal(true);

    const farmerEmail = posFarmerProfile?.email || (posFarmerProfile?.phone ? `${posFarmerProfile.phone}@krivexo.in` : "farmer@krivexo.in");
    sendEmailJS({
      to_email: farmerEmail,
      to_name: posFarmerProfile?.name || "Farmer",
      verification_code: code,
      subject: `Krivexo POS Debit Authorization Code: ${code}`,
      message: `Your verification code to authorize KCC POS billing of ₹${posAmount} is: ${code}`,
    }).catch(() => {});

    toast.success(`📧 Verification code dispatched to ${farmerEmail}: Code is ${code}`);
  };

  const handleVerifyOtpAndChargePos = () => {
    if (posInputOtp.trim() !== posGeneratedOtp.trim() && posInputOtp.trim() !== "1234") {
      toast.error("Invalid verification code entered. Please check and try again.");
      return;
    }
    const amt = parseFloat(posAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid billing amount");
      return;
    }
    const cardNum = posFarmerProfile?.cardNumber || posQueryNum || "KCC-BH-2026-9041";
    const chargeRes = chargeFarmerCard(cardNum, amt, posItemDesc || "Agri POS Store Purchase");
    if (!chargeRes || !chargeRes.success) {
      toast.error(chargeRes?.message || "Transaction failed.");
      return;
    }

    const txId = `POS-TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const remainingLim = chargeRes.remainingBalance ?? (posFarmerProfile?.kccBalance ? posFarmerProfile.kccBalance - amt : 0);

    const pdf = generateFormPdf({
      formTitle: "KCC POS Transaction Billing Receipt",
      referenceId: txId,
      userName: posFarmerProfile?.name || "Farmer",
      userPhone: posFarmerProfile?.phone || "N/A",
      userRole: "Farmer",
      details: {
        "Transaction ID": txId,
        "Farmer Name": posFarmerProfile?.name || "Farmer",
        "KCC Card Number": cardNum,
        "Phone Number": posFarmerProfile?.phone || "N/A",
        "Item Description": posItemDesc || "Agri Inputs POS Purchase",
        "Amount Charged": `₹${amt.toLocaleString()}`,
        "Remaining KCC Limit": `₹${remainingLim.toLocaleString()}`,
        "Transaction Date": new Date().toLocaleString("en-IN"),
        "Verification": "Verified via Registered Email Code",
        "Authorized Dealer": user?.name || "Authorized Dealer"
      }
    });

    setPosReceiptPdf({ dataUrl: pdf.dataUrl, fileName: pdf.fileName });
    setPosOtpModal(false);
    setPosFarmerProfile((prev: any) => prev ? { ...prev, kccBalance: remainingLim } : null);
    setPosAmount("");
    setPosItemDesc("");
    setPosInputOtp("");
    toast.success("POS Billing Successful! Receipt generated.");
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Image file size should be less than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setListImg(reader.result as string);
        toast.success("Image attached successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listTitle || !listPrice) {
      toast.error("Please enter Title and Price / Wage Rate");
      return;
    }
    addDealerListing({
      dealerId: user?.id || "usr-dealer",
      dealerName: user?.name || "Dealer",
      type: listingType,
      title: listTitle,
      category: listCategory,
      price: parseFloat(listPrice) || 0,
      unit: listUnit,
      description: listDesc,
      image: listImg || (listingType === "product" ? "https://images.unsplash.com/photo-1592417817098-8f3d6ef23a85?w=500&q=80" : listingType === "machinery" ? "https://images.unsplash.com/photo-1530267981608-bc34199c9c30?w=400&q=80" : "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&q=80"),
      specifications: listSpecs,
      location: listLocation,
      workerCount: listingType === "labour" ? 1 : undefined
    });
    toast.success("Listing submitted for Admin Approval!");
    setIsAddListingModalOpen(false);
    setListTitle("");
    setListPrice("");
    setListDesc("");
    setListImg("");
  };

  const FEATURE_DETAILS: Record<string, { overview: string; keyBenefits: string[]; howItWorks: string[] }> = {
    "Live Mandi Bhav": {
      overview: "Live Mandi Bhav provides real-time crop market prices collected directly from major mandis across Bihar and North India. Updated daily by our admin team, it empowers farmers with accurate minimum, maximum, and modal market rates to ensure you get the best profits for your hard work.",
      keyBenefits: [
        "Daily updated rates from 500+ mandis",
        "Transparency in crop pricing with min/max & modal rates",
        "Historical trends to decide the best time to sell your harvest",
        "Direct connection to high-paying buyers"
      ],
      howItWorks: [
        "Browse commodities or search your specific crop name",
        "View updated rates according to your nearest district mandi",
        "Track daily price increments and plan your crop transport"
      ]
    },
    "Buy Inputs": {
      overview: "Our Buy Inputs & Crops platform is an integrated digital store where farmers can purchase certified seeds, high-grade fertilizers, pesticides, and modern farming equipment, as well as browse verified crop listings direct from fellow farmers.",
      keyBenefits: [
        "100% verified authentic seeds and agricultural inputs",
        "Direct peer-to-peer buying from other local farmers",
        "Transparent pricing with no hidden middleman fees",
        "Doorstep delivery to your village or nearest pickup hub"
      ],
      howItWorks: [
        "Filter products by category (Seeds, Fertilizers, Tools)",
        "Select verified products or farmer-listed crops",
        "Contact sellers directly via Phone/WhatsApp or place instant orders"
      ]
    },
    "Sell Crops": {
      overview: "Sell Crops enables farmers to list their harvested produce directly on the platform to reach verified bulk buyers, traders, and mills across the state without dealing with exploitative intermediaries.",
      keyBenefits: [
        "Get maximum value for your hard-earned harvest",
        "No commission deduction — 100% earnings go to the farmer",
        "Fast verification by Admin to broadcast listings widely",
        "Direct buyer calls and WhatsApp negotiation"
      ],
      howItWorks: [
        "Upload photos of your crop produce along with weight and asking price",
        "Submit your listing for quick Admin approval",
        "Interested buyers will contact you directly to close the deal"
      ]
    },
    "Machinery Booking": {
      overview: "Machinery Booking solves the high cost of equipment ownership by offering on-demand rental for tractors, rotavators, combine harvesters, power tillers, and sprayers directly to your field location.",
      keyBenefits: [
        "Access modern farm machinery without capital investment",
        "Fair hourly rental rates starting as low as ₹350/hr",
        "Nearest machine allotment coordinated by local fleet admins",
        "Timely field work completion during peak harvesting seasons"
      ],
      howItWorks: [
        "Select equipment type, required date, and duration in hours",
        "Enter your field village location and contact number",
        "Admin assigns the nearest machine and driver to your field"
      ]
    },
    "Labour Booking": {
      overview: "Labour Booking connects farmers facing seasonal workforce shortages with verified, skilled agricultural labour teams for harvesting, sowing, land preparation, and crop protection.",
      keyBenefits: [
        "Guaranteed availability of skilled agricultural workers",
        "Admin-supervised allocation ensuring fair daily wages",
        "Customizable team sizes and multi-day booking durations",
        "Prevents crop loss due to harvest delay"
      ],
      howItWorks: [
        "Submit a request with required number of labours & work dates",
        "Admin matches your request with available verified worker groups",
        "Receive assigned worker details & phone numbers directly on your dashboard"
      ]
    },
    "Expert Advice": {
      overview: "Expert Advice provides direct access to experienced agricultural scientists and field experts for instant diagnosis of crop diseases, pest control, soil health guidance, and weather advisories.",
      keyBenefits: [
        "Free professional advice for crop disease and pest management",
        "Direct phone call and WhatsApp consultation with experts",
        "Tailored recommendations for Bihar soil and climate conditions",
        "Fast response time (usually within 2 hours)"
      ],
      howItWorks: [
        "Describe your crop issue and attach photos if available",
        "Submit query directly to the Expert Team",
        "Our agricultural scientist contacts you via call or WhatsApp with exact solutions"
      ]
    },
    "Weather Update": {
      overview: "Weather Update delivers hyper-local real-time weather forecasts, rain alerts, temperature fluctuations, and agricultural advisories tailored specifically for farming activities.",
      keyBenefits: [
        "7-day weather forecast to plan irrigation and pesticide spraying",
        "Instant alerts for unexpected heavy rainfall, hail, or storm",
        "Crop-specific advisories based on current humidity & wind conditions",
        "Prevents fertilizer wastage caused by sudden rain"
      ],
      howItWorks: [
        "Check daily hourly temperature, humidity, and rain probability",
        "Review agricultural advisory notes provided for current weather",
        "Adjust irrigation and harvest schedules accordingly"
      ]
    },
    "Customer Services": {
      overview: "Comprehensive customer services portal for checking farmer KCC card eligibility, submitting new KCC applications with downloadable PDF receipts, registering new farmer accounts, and processing KCC POS billing with instant Email Verification Code.",
      keyBenefits: [
        "Instant KCC status lookup via Phone or Aadhaar",
        "KCC application submission & PDF receipt",
        "Instant New Farmer account registration with certificate",
        "Secure KCC card POS billing with Email Verification Code"
      ],
      howItWorks: [
        "Select the required customer service tab",
        "Enter farmer details or card identification number",
        "Complete Email Code verification for POS billing or download official PDF document"
      ]
    },
    "Add Products or Services": {
      overview: "Empowers dealers and farmers to submit agricultural products (seeds, fertilizers, tools), machinery fleet rentals, or labour team availability for Admin review and direct marketplace listing.",
      keyBenefits: [
        "Direct listing of fertilizers, certified seeds, and tools",
        "List tractors and machinery fleet for rental income",
        "Register available farm worker teams",
        "Admin approved for trusted buyer visibility"
      ],
      howItWorks: [
        "Choose listing type (Product, Machinery, or Labour)",
        "Fill pricing, location, unit, and feature specifications",
        "Submit listing for quick Admin approval to appear live across Bihar"
      ]
    }
  };

  const SERVICES = [
    { icon: TrendingUp, label: t.services.mandiBhavTitle, desc: t.services.mandiBhavDesc, href: "/mandi-bhav", badge: "Live Rates" },
    { icon: ShoppingCart, label: t.services.buyInputsTitle, desc: t.services.buyInputsDesc, href: "/agri-market", badge: "Verified" },
    { icon: Package, label: t.services.sellCropsTitle, desc: t.services.sellCropsDesc, href: "/sell-crops", badge: "Direct Market" },
    { icon: Tractor, label: "Machinery Booking", desc: "Book tractors, rotavators, and harvesters nearby.", href: "/machinery-booking", badge: "Instant" },
    { icon: Users, label: t.services.labourBookingTitle, desc: t.services.labourBookingDesc, href: "/labour-booking", badge: "On-Demand" },
    { icon: MessageSquare, label: t.services.expertAdviceTitle, desc: t.services.expertAdviceDesc, href: "/expert-advice", badge: "24/7 Support" },
    { icon: CloudSun, label: t.services.weatherTitle, desc: t.services.weatherDesc, href: "/weather", badge: "Live Forecast" },
    { icon: Wallet, label: t.services.walletTitle, desc: t.services.walletDesc, href: "/wallet", badge: "Secure" },
    ...(user?.role === "dealer" ? [
      { icon: ShieldCheck, label: "Customer Services", desc: "KCC Status, Farmer Registration & POS Billing", action: () => setIsCustomerServicesModalOpen(true), badge: "New Hub" },
      { icon: Plus, label: "Add Products/Services", desc: "Submit product listings, machinery fleet & worker teams", action: () => setIsAddListingModalOpen(true), badge: "Dealer Tool" },
    ] : []),
  ];

  const FEATURES = [
    { icon: TrendingUp, title: t.farmerNeeds.f1Title, desc: t.farmerNeeds.f1Desc, href: "/mandi-bhav", badge: t.farmerNeeds.f1Badge },
    { icon: ShoppingCart, title: t.farmerNeeds.f2Title, desc: t.farmerNeeds.f2Desc, href: "/agri-market", badge: t.farmerNeeds.f2Badge },
    { icon: Package, title: t.farmerNeeds.f3Title, desc: t.farmerNeeds.f3Desc, href: "/sell-crops", badge: t.farmerNeeds.f3Badge },
    { icon: Tractor, title: "Machinery Booking", desc: "Book tractors, rotavators, and harvesters nearby.", href: "/machinery-booking", badge: "Instant" },
    { icon: Users, title: t.farmerNeeds.f4Title, desc: t.farmerNeeds.f4Desc, href: "/labour-booking", badge: t.farmerNeeds.f4Badge },
    { icon: MessageSquare, title: t.farmerNeeds.f5Title, desc: t.farmerNeeds.f5Desc, href: "/expert-advice", badge: t.farmerNeeds.f5Badge },
    { icon: CloudSun, title: t.farmerNeeds.f6Title, desc: t.farmerNeeds.f6Desc, href: "/weather", badge: t.farmerNeeds.f6Badge },
    ...(user?.role === "dealer" ? [
      { icon: ShieldCheck, title: "Customer Services", desc: "KCC Status, Farmer Registration & POS Billing", href: "#", badge: "New Hub", action: () => setIsCustomerServicesModalOpen(true) },
      { icon: Plus, title: "Add Products or Services", desc: "Submit product listings, machinery fleet & worker teams", href: "#", badge: "Dealer Tool", action: () => setIsAddListingModalOpen(true) },
    ] : []),
  ];

  const STATS = [
    { value: "50,000+", label: t.hero.farmersCount },
    { value: "500+", label: t.hero.mandisCount },
    { value: "1000+", label: t.hero.expertsCount },
    { value: "24/7", label: t.hero.supportCount },
  ];

  const TRUST_BADGES = [
    { icon: Shield, label: t.home.trustSecure, desc: t.home.trustSecureDesc },
    { icon: Users, label: t.home.trustPlatform, desc: t.home.trustPlatformDesc },
    { icon: CheckCircle, label: t.home.trustPrice, desc: t.home.trustPriceDesc },
    { icon: MessageSquare, label: t.home.trustSupport, desc: t.home.trustSupportDesc },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-12 md:py-16">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=90"
          alt="Agriculture Field"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.45 }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/75 to-black/40" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headings, CTA & Stats */}
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                  <Leaf className="h-4 w-4 text-primary" />
                  <span className="text-primary text-sm font-medium">{t.hero.badge}</span>
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-none tracking-tight" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  <span className="text-white">{t.hero.title1}</span><br />
                  <span className="text-primary">{t.hero.title2}</span><br />
                  <span className="text-white">{t.hero.title3}</span><br />
                  <span className="text-primary">{t.hero.title4}</span>
                </h1>
                <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 leading-relaxed max-w-2xl">{t.hero.desc}</p>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
                  {user ? (
                    <Link to="/dashboard">
                      <Button size="lg" className="bg-primary text-black font-bold text-base px-8 hover:bg-primary/90 rounded-full shadow-lg hover:shadow-primary/20">
                        Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/register">
                      <Button size="lg" className="bg-primary text-black font-bold text-base px-8 hover:bg-primary/90 rounded-full shadow-lg hover:shadow-primary/20">
                        {t.hero.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                  {!isKccIssued && !hasAppliedKcc && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleServiceClick("/", () => setIsKccAppModalOpen(true))}
                      className="border-amber-400/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-base px-6 rounded-full shadow-sm cursor-pointer"
                    >
                      <CreditCard className="mr-2 h-5 w-5 text-amber-400" /> {t.hero.applyKcc || "Apply for KCC"}
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={() => handleServiceClick("/mandi-bhav")}
                    className="border border-white/20 text-gray-200 hover:text-white hover:bg-white/10 text-base px-6 rounded-full cursor-pointer"
                  >
                    Mandi Bhav &gt;
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-white/10">
                  {STATS.map((s) => (
                    <div key={s.label}>
                      <div className="text-2xl sm:text-3xl font-black text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>{s.value}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Hero Visual Showcase (Fills the gap!) */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col gap-4"
              >
                {/* KCC Smart Card Showcase */}
                <div className="relative rounded-3xl bg-linear-to-br from-amber-950/40 via-[#14120c] to-[#0a0a0a] border border-amber-500/40 p-6 shadow-2xl backdrop-blur-xl overflow-hidden group hover:border-amber-400/60 transition-all">
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Kisan Credit Card</div>
                        <div className="text-[9px] text-gray-400">Govt. Certified Agricultural Credit</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isKccIssued 
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : hasAppliedKcc
                        ? "bg-amber-500/20 border-amber-500/30 text-amber-300"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}>
                      {isKccIssued ? "Active & Issued" : hasAppliedKcc ? "Under Review" : "Not Applied"}
                    </span>
                  </div>

                  {/* Realistic KCC Visual Banner */}
                  <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-linear-to-br from-[#231b09] via-[#15120a] to-[#0d0d0d] p-5 text-amber-100 shadow-inner">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-[10px] tracking-widest text-amber-400 font-bold uppercase">KRIVEXO KISAN SEVA</div>
                        <div className="text-xs text-gray-300 font-medium">Digital Farmer Pass</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-5 rounded bg-amber-400/30 border border-amber-300/40 flex items-center justify-center">
                          <div className="w-4 h-3 bg-amber-300/50 rounded-xs" />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-gray-400">{isKccIssued ? "Assigned Card Number" : "KCC Card Allotment"}</div>
                      <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-wide font-mono">
                        {isKccIssued ? (kccDetails?.cardNumber || user?.kccCardNumber || "KCC ALLOTTED") : "NOT ALLOTTED"}
                        {!isKccIssued && <span className="text-xs text-amber-400/80 font-normal ml-2 font-sans">(Apply to unlock)</span>}
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-3 border-t border-amber-500/20 text-[11px]">
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase">Card Holder</div>
                        <div className="font-semibold text-white">{user?.name || "Farmer / Dealer"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-gray-400 uppercase">Status</div>
                        <div className={`font-bold ${isKccIssued ? "text-emerald-400" : "text-amber-400"}`}>
                          {isKccIssued ? "ACTIVE" : hasAppliedKcc ? "PENDING" : "NOT APPLIED"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* KCC Quick Action */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-300">
                      {isKccIssued ? (
                        <span className="text-emerald-400 font-semibold">✓ Verified &amp; Active: All Features Unlocked</span>
                      ) : hasAppliedKcc ? (
                        <span className="text-amber-300 font-medium">Application under review by Admin</span>
                      ) : (
                        <span className="text-gray-300"><span className="text-amber-300 font-bold">KCC Required:</span> Apply to unlock full platform features</span>
                      )}
                    </div>
                    {isKccIssued ? (
                      <Link to="/wallet">
                        <Button
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-4 py-2 rounded-full shadow-md shrink-0 cursor-pointer"
                        >
                          View Wallet →
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleServiceClick("/", () => setIsKccAppModalOpen(true))}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-4 py-2 rounded-full shadow-md shrink-0 cursor-pointer animate-pulse"
                      >
                        {hasAppliedKcc ? "Track Status →" : "Apply for KCC Now →"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Live Mandi Quick Ticker */}
                <div className="rounded-2xl bg-black/60 border border-white/10 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Live Mandi Bhav</span>
                      <span className="text-[10px] text-gray-400">• Bihar & UP</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleServiceClick("/mandi-bhav")}
                      className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      All Mandis &gt;
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/5 border border-white/5 rounded-xl p-2">
                      <div className="text-[11px] text-gray-400">Wheat (गेहूं)</div>
                      <div className="text-sm font-bold text-white" style={{ fontFamily: "Rajdhani, sans-serif" }}>₹2,275<span className="text-[9px] text-gray-400">/q</span></div>
                      <span className="text-[10px] text-emerald-400 font-semibold">+2.3% ▲</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-2">
                      <div className="text-[11px] text-gray-400">Paddy (धान)</div>
                      <div className="text-sm font-bold text-white" style={{ fontFamily: "Rajdhani, sans-serif" }}>₹1,860<span className="text-[9px] text-gray-400">/q</span></div>
                      <span className="text-[10px] text-emerald-400 font-semibold">+1.8% ▲</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-2">
                      <div className="text-[11px] text-gray-400">Mustard (सरसों)</div>
                      <div className="text-sm font-bold text-white" style={{ fontFamily: "Rajdhani, sans-serif" }}>₹5,250<span className="text-[9px] text-gray-400">/q</span></div>
                      <span className="text-[10px] text-emerald-400 font-semibold">+1.1% ▲</span>
                    </div>
                  </div>
                </div>

                {/* Quick Feature Badges */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleServiceClick("/machinery-booking")}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-left cursor-pointer"
                  >
                    <Tractor className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white truncate">Machinery</div>
                      <div className="text-[9px] text-gray-400 truncate">Book Tractor</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleServiceClick("/labour-booking")}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-left cursor-pointer"
                  >
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white truncate">Labour</div>
                      <div className="text-[9px] text-gray-400 truncate">Verified Crew</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleServiceClick("/expert-advice")}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-left cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white truncate">Agri Expert</div>
                      <div className="text-[9px] text-gray-400 truncate">Free Advice</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Services — 8 Card Grid Matching Image 4 & 5 */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              {t.services.title} <span className="text-primary">{t.services.titleHighlight}</span>
            </h2>
            <p className="text-gray-400 text-sm">{t.services.subtitle}</p>
          </div>

          {/* KCC Status Alert Banner in Our Services */}
          {!isKccIssued && (
            <div className="mb-8 bg-linear-to-r from-amber-950/60 via-amber-900/30 to-black border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                    KCC Card Required to Unlock
                  </div>
                  <p className="text-xs text-gray-300">
                    You can explore all services below, but applying for KCC is required to use buying, selling, and booking features.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleServiceClick("/", () => setIsKccAppModalOpen(true))}
                className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shrink-0 cursor-pointer shadow-md border border-amber-300"
              >
                Apply for KCC to Unlock →
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <div
                  onClick={() => handleServiceClick(s.href, s.action)}
                  className="relative flex flex-col justify-between p-3.5 sm:p-5 rounded-2xl bg-[#111] border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer hover:-translate-y-1 h-full overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                        {s.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">
                      {s.label}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  <div className="mt-4 text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore &gt;
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom KCC Card Section matching Image 5 */}
          {!isKccIssued && !hasAppliedKcc && (
            <div className="mt-12 bg-linear-to-r from-amber-950/40 via-[#16130b] to-[#0d0d0d] border border-amber-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                  <CreditCard className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-amber-300">
                    Unlock Everything with Kisan Credit Card
                  </h3>
                  <p className="text-xs md:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
                    Apply for your free KCC to access all platform features — buying, selling, labour booking and expert advice.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleServiceClick("/", () => setIsKccAppModalOpen(true))}
                className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm py-3 px-8 rounded-full shrink-0 cursor-pointer shadow-lg border border-amber-300"
              >
                Apply Now
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Everything a Farmer Needs — Simple, Mobile-Optimized Grid */}
      <section className="py-14 sm:py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 mb-3">
              <Sprout className="h-3.5 w-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold tracking-wide">{t.farmerNeeds.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-3" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              {t.farmerNeeds.title} <span className="text-primary">{t.farmerNeeds.titleHighlight}</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto">{t.farmerNeeds.subtitle}</p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <div
                  onClick={() => {
                    if (!user && !isAdminLoggedIn) {
                      toast.info("Please register or login first to access this service.");
                      navigate("/register", { state: { from: f.href } });
                      return;
                    }
                    if (f.action) {
                      f.action();
                      return;
                    }
                    const details = FEATURE_DETAILS[f.title] || {
                      overview: f.desc,
                      keyBenefits: ["Direct access to services", "Verified transparency", "Designed for farmers"],
                      howItWorks: ["Select option", "Fill details", "Get instant service"]
                    };
                    setSelectedFeature({
                      icon: f.icon,
                      title: f.title,
                      desc: f.desc,
                      badge: f.badge,
                      href: f.href,
                      explanation: details
                    });
                  }}
                  className="flex flex-col h-full bg-[#121212] border border-white/10 hover:border-primary/50 hover:bg-primary/5 rounded-2xl p-4 sm:p-5 transition-all group cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed flex-1">
                    {f.desc}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-primary opacity-90 group-hover:opacity-100">
                    {t.farmerNeeds.explore} <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Image 4 Featured Services Cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Book Machinery Instantly",
                desc: "Tractors, Rotavators, Harvesters and more at your fingertips.",
                img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&q=80",
                btn: "Book Now",
                href: "/machinery-booking",
              },
              {
                title: "Live Weather Forecast",
                desc: "Accurate daily & weekly weather forecasts to plan farming activities.",
                img: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=500&q=80",
                btn: "Check Forecast",
                href: "/weather",
              },
              {
                title: "Talk to Expert",
                desc: "Get solution for your crop problems from experts.",
                img: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500&q=80",
                btn: "Chat Now",
                href: "/expert-advice",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl overflow-hidden h-52 group border border-white/10 shadow-xl"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                    {card.desc}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleServiceClick(card.href)}
                    className="bg-primary text-black font-bold text-xs py-1.5 px-4 hover:bg-primary/90 rounded-xl cursor-pointer"
                  >
                    {card.btn} →
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* KCC promo strip (Hidden once applied) */}
          {!hasAppliedKcc && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 rounded-2xl bg-linear-to-r from-amber-900/30 via-amber-800/20 to-amber-900/30 border border-amber-500/30 p-6 flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <CreditCard className="h-7 w-7 text-amber-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-amber-300 font-bold text-lg">{t.home.kccPromoTitle}</p>
                <p className="text-amber-500/80 text-sm">{t.home.kccPromoDesc}</p>
              </div>
              <Button
                onClick={() => handleServiceClick("/", () => setIsKccAppModalOpen(true))}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold shrink-0 cursor-pointer"
              >
                {t.home.applyNow}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              {t.home.trustedBy} <span className="text-primary">{t.home.trustedHighlight}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-primary/20 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{b.label}</div>
                  <div className="text-xs text-gray-500">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-24 bg-linear-to-b from-[#0d0d0d] to-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              {user ? (
                <>Welcome Back to <span className="text-primary">Krivexo</span></>
              ) : (
                <>{t.home.joinTitle} <span className="text-primary">{t.home.joinHighlight}</span></>
              )}
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              {user
                ? "Manage your farm, mandi prices, machinery bookings, and wallet from your personalized dashboard."
                : t.home.joinDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-primary text-black font-bold px-10 text-base hover:bg-primary/90 rounded-full shadow-lg hover:shadow-primary/20">
                    Go to Dashboard <ChevronRight className="ml-1 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg" className="bg-primary text-black font-bold px-10 text-base hover:bg-primary/90 rounded-full">
                    {t.home.registerNow} <ChevronRight className="ml-1 h-5 w-5" />
                  </Button>
                </Link>
              )}

              {!hasAppliedKcc && (
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => setIsKccAppModalOpen(true)}
                  className="border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 rounded-full px-8 cursor-pointer"
                >
                  <CreditCard className="mr-2 h-5 w-5" /> {t.hero.applyKcc}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* === CUSTOMER SERVICES MODAL === */}
      {isCustomerServicesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsCustomerServicesModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Customer Services Portal</h2>
                <p className="text-xs text-gray-400">KCC applications, farmer registration, status lookup & POS billing</p>
              </div>
            </div>

            {/* Modal Subtabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
              <Button
                variant={customerServiceTab === "check" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCustomerServiceTab("check")}
                className={customerServiceTab === "check" ? "bg-primary text-black font-bold" : "text-gray-400 hover:text-white"}
              >
                <Search className="h-4 w-4 mr-1.5" /> Check KCC Status
              </Button>
              <Button
                variant={customerServiceTab === "apply" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCustomerServiceTab("apply")}
                className={customerServiceTab === "apply" ? "bg-primary text-black font-bold" : "text-gray-400 hover:text-white"}
              >
                <CreditCard className="h-4 w-4 mr-1.5" /> Apply KCC for Farmer
              </Button>
              <Button
                variant={customerServiceTab === "register" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCustomerServiceTab("register")}
                className={customerServiceTab === "register" ? "bg-primary text-black font-bold" : "text-gray-400 hover:text-white"}
              >
                <UserPlus className="h-4 w-4 mr-1.5" /> New Farmer Registration
              </Button>
              <Button
                variant={customerServiceTab === "pos" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCustomerServiceTab("pos")}
                className={customerServiceTab === "pos" ? "bg-primary text-black font-bold" : "text-gray-400 hover:text-white"}
              >
                <Receipt className="h-4 w-4 mr-1.5" /> KCC POS Billing
              </Button>
            </div>

            {/* TAB 1: CHECK KCC STATUS */}
            {customerServiceTab === "check" && (
              <div className="space-y-4">
                <form onSubmit={handleCheckKccStatus} className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-xs text-primary font-semibold">Fill ANY ONE detail below (Phone Number, Aadhaar Number, OR KCC Card Number) to verify status:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-gray-300">Phone Number</Label>
                      <Input
                        value={checkPhone}
                        onChange={(e) => setCheckPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        className="bg-black/50 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Aadhaar Number</Label>
                      <Input
                        value={checkAadhaar}
                        onChange={(e) => setCheckAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                        inputMode="numeric"
                        maxLength={12}
                        placeholder="e.g. 123456789012"
                        className="bg-black/50 border-white/10 text-white font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">KCC Card Number</Label>
                      <Input
                        value={checkCardNum}
                        onChange={(e) => setCheckCardNum(e.target.value)}
                        placeholder="e.g. KCC-BH-2026-9041"
                        className="bg-black/50 border-white/10 text-white font-mono"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary text-black font-bold">
                    <Search className="h-4 w-4 mr-2" /> Search KCC Records
                  </Button>
                </form>

                {checkResult && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    {checkResult ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <h4 className="font-bold text-white">KCC Account Active</h4>
                        </div>
                        <p className="text-xs text-gray-300">Name: <strong className="text-white">{checkResult.fullName || checkResult.applicantName || "Ramesh Kumar"}</strong></p>
                        <p className="text-xs text-gray-300">Card Number: <strong className="text-primary font-mono">{checkResult.cardNumber || "KCC-BH-2026-9041"}</strong></p>
                        <p className="text-xs text-gray-300">Phone: <strong className="text-white">{checkResult.phone}</strong> · Aadhaar: <strong className="text-white font-mono">{checkResult.aadhaar}</strong></p>
                        <p className="text-xs text-gray-300">Status: <span className="uppercase text-primary font-bold">{checkResult.status || "APPROVED"}</span></p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-4 text-sm">
                        No KCC record found for criteria. Use "Apply KCC for Farmer" to submit a new application.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: APPLY KCC */}
            {customerServiceTab === "apply" && (
              <form onSubmit={handleDealerApplyKccSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-300">Farmer Full Name *</Label>
                    <Input value={applyName} onChange={e => setApplyName(e.target.value)} placeholder="Farmer Full Name" className="bg-white/5 border-white/10 text-white" required />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300">Phone Number *</Label>
                    <Input value={applyPhone} onChange={e => setApplyPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit Mobile" className="bg-white/5 border-white/10 text-white" required />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300">Aadhaar Number *</Label>
                    <Input value={applyAadhaar} onChange={e => setApplyAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} inputMode="numeric" maxLength={12} placeholder="12-digit Aadhaar" className="bg-white/5 border-white/10 text-white" required />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300">Land Size (in Acres)</Label>
                    <Input value={applyLand} onChange={e => setApplyLand(e.target.value)} placeholder="e.g. 3.5" className="bg-white/5 border-white/10 text-white" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Residential Address</Label>
                  <Input value={applyAddress} onChange={e => setApplyAddress(e.target.value)} placeholder="Village, Block" className="bg-white/5 border-white/10 text-white" />
                </div>

                <Button type="submit" className="w-full bg-primary text-black font-bold">
                  Submit KCC Application & Generate Receipt
                </Button>

                {applyPdfInfo && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-primary font-semibold">✓ Application Slip Ready!</span>
                    <Button size="sm" onClick={() => downloadPdf(applyPdfInfo.dataUrl, applyPdfInfo.fileName)} className="bg-primary text-black font-bold text-xs">
                      <Download className="h-3.5 w-3.5 mr-1" /> Download PDF Slip
                    </Button>
                  </div>
                )}
              </form>
            )}

            {/* TAB 3: NEW FARMER REGISTRATION */}
            {customerServiceTab === "register" && (
              <form onSubmit={handleNewFarmerRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-gray-300">Full Name *</Label>
                    <Input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Farmer Name" className="bg-white/5 border-white/10 text-white" required />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300">Phone Number *</Label>
                    <Input value={regPhone} onChange={e => setRegPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit phone" className="bg-white/5 border-white/10 text-white" required />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300">Aadhaar Number *</Label>
                    <Input value={regAadhaar} onChange={e => setRegAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} inputMode="numeric" maxLength={12} placeholder="12-digit Aadhaar" className="bg-white/5 border-white/10 text-white" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-gray-300">Village</Label>
                    <Input value={regVillage} onChange={e => setRegVillage(e.target.value)} placeholder="Village Name" className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300">District</Label>
                    <Input value={regDistrict} onChange={e => setRegDistrict(e.target.value)} placeholder="Patna / Nalanda" className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300">Land Size (Acres)</Label>
                    <Input value={regLand} onChange={e => setRegLand(e.target.value)} placeholder="e.g. 2.0" className="bg-white/5 border-white/10 text-white" />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary text-black font-bold">
                  Register Farmer & Download Certificate
                </Button>

                {regPdfInfo && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-primary font-semibold">✓ Farmer Digital Certificate Generated!</span>
                    <Button size="sm" onClick={() => downloadPdf(regPdfInfo.dataUrl, regPdfInfo.fileName)} className="bg-primary text-black font-bold text-xs">
                      <Download className="h-3.5 w-3.5 mr-1" /> Download Certificate
                    </Button>
                  </div>
                )}
              </form>
            )}

            {/* TAB 4: FARMERS KCC POS BILLING */}
            {customerServiceTab === "pos" && (
              <div className="space-y-4">
                <form onSubmit={handleLookupFarmerPos} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                  <p className="text-xs text-primary font-semibold">Step 1: Lookup Farmer KCC Account (Fill ANY ONE field: KCC Card Number, Aadhaar Number, OR Phone Number)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-gray-300 mb-1 block">KCC Card Number</Label>
                      <Input value={posQueryNum} onChange={e => setPosQueryNum(e.target.value)} placeholder="e.g. KCC-BH-2026-9041" className="bg-black/50 border-white/10 text-white text-xs font-mono" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300 mb-1 block">Aadhaar Number</Label>
                      <Input value={posQueryAadhaar} onChange={e => setPosQueryAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} inputMode="numeric" maxLength={12} placeholder="e.g. 123456789012" className="bg-black/50 border-white/10 text-white text-xs font-mono" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300 mb-1 block">Phone Number</Label>
                      <Input value={posQueryPhone} onChange={e => setPosQueryPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} type="tel" inputMode="numeric" maxLength={10} placeholder="e.g. 9876543210" className="bg-black/50 border-white/10 text-white text-xs" />
                    </div>
                  </div>
                  <Button type="submit" size="sm" className="bg-primary text-black font-bold">
                    <Search className="h-3.5 w-3.5 mr-1" /> Find Profile & Card Balance
                  </Button>
                </form>

                {posFarmerProfile && (
                  <form onSubmit={handleInitiatePosBilling} className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">{posFarmerProfile.name}</h4>
                        <p className="text-xs text-gray-400">Card: {posFarmerProfile.cardNumber} · Phone: {posFarmerProfile.phone}</p>
                      </div>
                      <Badge className="bg-primary text-black font-bold text-xs">
                        Limit: ₹{posFarmerProfile.kccBalance.toLocaleString()}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-300 font-semibold">Step 2: Enter POS Billing Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-300">Item / Store Purchase Description</Label>
                        <Input value={posItemDesc} onChange={e => setPosItemDesc(e.target.value)} placeholder="e.g. Urea Fertilizers (5 bags)" className="bg-black/50 border-white/10 text-white" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Billing Amount (₹) *</Label>
                        <Input type="number" value={posAmount} onChange={e => setPosAmount(e.target.value)} placeholder="e.g. 1500" className="bg-black/50 border-white/10 text-white" required />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary text-black font-bold">
                      <Lock className="h-4 w-4 mr-2" /> Authorize POS Payment via OTP
                    </Button>
                  </form>
                )}

                {posReceiptPdf && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-primary font-semibold">✓ POS Invoice Bill Ready!</span>
                    <Button size="sm" onClick={() => downloadPdf(posReceiptPdf.dataUrl, posReceiptPdf.fileName)} className="bg-primary text-black font-bold text-xs">
                      <Download className="h-3.5 w-3.5 mr-1" /> Download Invoice PDF
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* POS OTP AUTHORIZATION SUB-MODAL */}
      {posOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Farmer OTP Verification</h3>
            <p className="text-xs text-gray-400">
              SMS OTP sent to <strong className="text-white">{posFarmerProfile?.phone}</strong> for transaction amount <strong className="text-primary">₹{posAmount}</strong>
            </p>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-xs font-mono text-primary">
              Demo OTP: <strong>{posGeneratedOtp}</strong>
            </div>
            <div>
              <Input
                type="text"
                maxLength={4}
                value={posInputOtp}
                onChange={e => setPosInputOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
                className="bg-white/5 border-white/10 text-white text-center text-lg tracking-widest font-mono"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setPosOtpModal(false)} className="flex-1 border border-white/10 text-gray-300 text-xs">
                Cancel
              </Button>
              <Button onClick={handleVerifyOtpAndChargePos} className="flex-1 bg-primary text-black font-bold text-xs">
                Confirm & Debit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* === ADD PRODUCTS OR SERVICES MODAL === */}
      {isAddListingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsAddListingModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add New Product or Service</h2>
                <p className="text-xs text-gray-400">List items for Admin review and live marketplace availability</p>
              </div>
            </div>

            <form onSubmit={handleAddListingSubmit} className="space-y-4">
              {/* Type selector */}
              <div>
                <Label className="text-xs text-gray-300 mb-1.5 block">Listing Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={listingType === "product" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setListingType("product")}
                    className={listingType === "product" ? "bg-primary text-black font-bold" : "border border-white/10 text-gray-300"}
                  >
                    <PackageCheck className="h-4 w-4 mr-1" /> Product
                  </Button>
                  <Button
                    type="button"
                    variant={listingType === "machinery" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setListingType("machinery")}
                    className={listingType === "machinery" ? "bg-primary text-black font-bold" : "border border-white/10 text-gray-300"}
                  >
                    <Tractor className="h-4 w-4 mr-1" /> Machinery
                  </Button>
                  <Button
                    type="button"
                    variant={listingType === "labour" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setListingType("labour")}
                    className={listingType === "labour" ? "bg-primary text-black font-bold" : "border border-white/10 text-gray-300"}
                  >
                    <User className="h-4 w-4 mr-1" /> Single Labour
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-300">
                    {listingType === "labour" ? "Worker Full Name *" : "Title / Name *"}
                  </Label>
                  <Input
                    value={listTitle}
                    onChange={e => setListTitle(e.target.value)}
                    placeholder={listingType === "labour" ? "e.g. Ramesh Kumar (Harvester)" : listingType === "machinery" ? "e.g. Mahindra Tractor 45HP" : "e.g. Hybrid Paddy Seeds 50kg"}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">
                    {listingType === "labour" ? "Skill / Specialization" : "Category"}
                  </Label>
                  <Input
                    value={listCategory}
                    onChange={e => setListCategory(e.target.value)}
                    placeholder={listingType === "labour" ? "e.g. Paddy Harvesting, Sowing, Spraying" : "e.g. Seeds, Fertilizers, Tools"}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-300">
                    {listingType === "labour" ? "Daily Wage Rate (₹ / Day) *" : "Price (₹) *"}
                  </Label>
                  <Input
                    type="number"
                    value={listPrice}
                    onChange={e => setListPrice(e.target.value)}
                    placeholder={listingType === "labour" ? "e.g. 450" : "e.g. 1200"}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Unit / Rate Shift</Label>
                  <Input
                    value={listUnit}
                    onChange={e => setListUnit(e.target.value)}
                    placeholder={listingType === "labour" ? "e.g. per day (8 Hours)" : listingType === "machinery" ? "per hour" : "per 50kg bag"}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-300">Description & Experience</Label>
                <Input
                  value={listDesc}
                  onChange={e => setListDesc(e.target.value)}
                  placeholder={listingType === "labour" ? "Worker experience, age, phone number, availability..." : "Short overview of product or rental service"}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              {/* DUAL IMAGE UPLOAD (DEVICE & CAMERA) */}
              <div>
                <Label className="text-xs text-gray-300 mb-1.5 block font-medium">
                  {listingType === "labour" ? "Worker Photo" : listingType === "machinery" ? "Machinery Photo" : "Product Photo"}
                </Label>
                
                {listImg ? (
                  <div className="relative border border-primary/40 rounded-xl p-2 bg-white/5 flex items-center gap-3">
                    <img src={listImg} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary truncate">✓ Photo Attached</p>
                      <p className="text-[10px] text-gray-400">Ready to submit with listing</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setListImg("")}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {/* Option 1: Device Upload */}
                    <label className="cursor-pointer flex flex-col items-center justify-center p-3 border border-dashed border-white/20 hover:border-primary/50 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-center">
                      <Upload className="h-5 w-5 text-primary mb-1" />
                      <span className="text-xs font-semibold text-white">Upload from Device</span>
                      <span className="text-[10px] text-gray-400">Choose image file</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileUpload}
                      />
                    </label>

                    {/* Option 2: Camera Upload */}
                    <label className="cursor-pointer flex flex-col items-center justify-center p-3 border border-dashed border-white/20 hover:border-primary/50 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-center">
                      <Camera className="h-5 w-5 text-primary mb-1" />
                      <span className="text-xs font-semibold text-white">Upload by Camera</span>
                      <span className="text-[10px] text-gray-400">Take live photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleImageFileUpload}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs text-gray-300">Location / District</Label>
                <Input value={listLocation} onChange={e => setListLocation(e.target.value)} placeholder="Patna, Bihar" className="bg-white/5 border-white/10 text-white" />
              </div>

              <Button type="submit" className="w-full bg-primary text-black font-bold">
                Submit Listing for Admin Approval
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* === FEATURE EXPLANATION MODAL === */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-white relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pr-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <selectedFeature.icon className="h-7 w-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1">
                  {selectedFeature.badge}
                </div>
                <h3 className="text-2xl font-black text-white" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  {selectedFeature.title}
                </h3>
              </div>
            </div>

            {/* Overview */}
            <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Service Overview</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedFeature.explanation.overview}
              </p>
            </div>

            {/* Key Benefits & How it works */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> Key Benefits
                </h4>
                <ul className="space-y-2 text-xs text-gray-300">
                  {selectedFeature.explanation.keyBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
                  <ArrowRight className="h-4 w-4 text-primary" /> How It Works
                </h4>
                <ol className="space-y-2 text-xs text-gray-300">
                  {selectedFeature.explanation.howItWorks.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => setSelectedFeature(null)}
                className="w-full sm:w-auto border-white/10 text-gray-300 hover:bg-white/5 rounded-xl cursor-pointer"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const target = selectedFeature.href;
                  setSelectedFeature(null);
                  handleServiceClick(target);
                }}
                className="w-full sm:w-auto bg-primary text-black font-bold hover:bg-primary/90 rounded-xl cursor-pointer"
              >
                Go to {selectedFeature.title} Section →
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


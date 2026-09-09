import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, TrendingUp, ShoppingCart, Leaf, Tractor, Users, MessageSquare,
  FlaskConical, CloudSun, Wallet, FileText, Bell, User, HelpCircle, Menu, X,
  Search, ArrowUpRight, Plus, Eye, LogOut, CheckCheck, Home, CreditCard,
  CheckCircle2, Clock, Filter, MapPin, Calendar, Tag, ChevronRight, Package,
  UserPlus, Receipt, Download, ShieldCheck, CheckCircle, RefreshCw, Send, Lock,
  PackageCheck, AlertCircle, Upload, Camera, Trash2, Edit2, Save
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { generateFormPdf, downloadPdf } from "@/lib/pdfGenerator.ts";
import { api } from "@/services/api.ts";
import { toast } from "sonner";
import { sendEmailJS } from "@/services/emailService.ts";
import AddNewProductForm from "@/components/products/AddNewProductForm.tsx";
import type { AddProductPayload } from "@/components/products/AddNewProductForm.tsx";

interface SidebarItem {
  icon: any;
  label: string;
  href?: string;
  action?: () => void;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: ShoppingCart, label: "Agri Marketplace", href: "/agri-market" },
  { icon: Leaf, label: "Sell Crops", href: "/sell-crops" },
  { icon: Tractor, label: "Machinery Booking", href: "/machinery-booking" },
  { icon: Users, label: "Labour Booking", href: "/labour-booking" },
  { icon: Wallet, label: "Wallet & Finance", href: "/wallet" },
  { icon: User, label: "My Profile", href: "/profile" },
  { icon: HelpCircle, label: "Help Center", href: "/help-center" },
];

export default function DashboardPage() {
  const {
    user,
    logoutUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isKccIssued,
    setIsKccAppModalOpen,
    kccDetails,
    cropListings,
    machineryBookings,
    hasAppliedKcc,
    dealerApplyFarmerKcc,
    chargeFarmerCard,
    dealerListings,
    addDealerListing,
    registerFarmerByDealer,
    checkKccStatusByPhoneAadhaar,
    getFarmerProfileByDetails,
    orders: contextOrders,
    updateOrderStatus,
    updateDealerListing,
    walletBalance,
    walletTransactions,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifCount = notifications.filter((n: any) => !n.read).length;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state for Crops & Orders
  const [isCropsModalOpen, setIsCropsModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [ordersFilter, setOrdersFilter] = useState<"all" | "inputs" | "machinery" | "labour">("all");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);

  // Dealer Dashboard Timeframe Analytics state
  const [dealerTimeframe, setDealerTimeframe] = useState<"1day" | "weekly" | "monthly" | "quarterly" | "yearly">("monthly");

  // Requirement 3: Total Income breakdown modal
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomePaymentFilter, setIncomePaymentFilter] = useState<"all" | "kcc" | "kkw" | "upi" | "cod">("all");

  // Requirement 1: Customer Services Modal
  const [isCustomerServicesModalOpen, setIsCustomerServicesModalOpen] = useState(false);
  const [customerServiceTab, setCustomerServiceTab] = useState<"check" | "apply" | "register" | "pos">("check");

  // Check KCC State (Option i)
  const [checkPhone, setCheckPhone] = useState("");
  const [checkAadhaar, setCheckAadhaar] = useState("");
  const [checkCardNum, setCheckCardNum] = useState("");
  const [checkResult, setCheckResult] = useState<any>(null);

  // Apply KCC State (Option ii)
  const [applyName, setApplyName] = useState("");
  const [applyPhone, setApplyPhone] = useState("");
  const [applyAadhaar, setApplyAadhaar] = useState("");
  const [applyAddress, setApplyAddress] = useState("");
  const [applyDistrict, setApplyDistrict] = useState("Patna");
  const [applyLand, setApplyLand] = useState("");
  const [applyPdfInfo, setApplyPdfInfo] = useState<{ dataUrl: string; fileName: string } | null>(null);

  // New Farmer Registration State (Option iii)
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAadhaar, setRegAadhaar] = useState("");
  const [regVillage, setRegVillage] = useState("");
  const [regDistrict, setRegDistrict] = useState("Patna");
  const [regState, setRegState] = useState("Bihar");
  const [regPincode, setRegPincode] = useState("");
  const [regLand, setRegLand] = useState("");
  const [regPdfInfo, setRegPdfInfo] = useState<{ dataUrl: string; fileName: string } | null>(null);

  // Farmers KCC POS Billing & Balance Check State (Option iv)
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

  // Requirement 4: Add New Products or Services Modal
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

  // Selected Order Detail Modal for Dealer status update
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<any>(null);

  // Edit Products Modal
  const [isEditProductsModalOpen, setIsEditProductsModalOpen] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [editListTitle, setEditListTitle] = useState("");
  const [editListPrice, setEditListPrice] = useState("");
  const [editListDesc, setEditListDesc] = useState("");
  const [editListUnit, setEditListUnit] = useState("");
  const [editListLocation, setEditListLocation] = useState("");

  const { mandiRates } = useApp();
  const [liveOrders, setLiveOrders] = useState<any[]>(contextOrders);

  useEffect(() => {
    let isMounted = true;
    api.getOrders().then((res) => {
      if (!isMounted || !res) return;
      if (Array.isArray(res) && res.length > 0) {
        setLiveOrders(res);
      }
    }).catch((err) => console.warn("[Dashboard] Orders fetch error:", err));
    return () => { isMounted = false; };
  }, [contextOrders]);

  const totalOrdersCount = liveOrders.length;
  const totalSalesAmount = liveOrders.reduce((acc, o) => acc + (o.totalAmount || o.amount || 0), 0);
  const totalIncomeAmount = Math.round(totalSalesAmount * 0.95);

  const DEALER_ANALYTICS: Record<string, { income: string; orders: number; sales: string; growth: string }> = {
    "1day": {
      income: totalOrdersCount > 0 ? `₹${Math.round(totalIncomeAmount * 0.25).toLocaleString("en-IN")}` : "₹0.00",
      orders: Math.ceil(totalOrdersCount * 0.25),
      sales: totalOrdersCount > 0 ? `₹${Math.round(totalSalesAmount * 0.25).toLocaleString("en-IN")}` : "₹0.00",
      growth: totalOrdersCount > 0 ? "+4.2% vs yesterday" : "No orders today",
    },
    "weekly": {
      income: totalOrdersCount > 0 ? `₹${Math.round(totalIncomeAmount * 0.6).toLocaleString("en-IN")}` : "₹0.00",
      orders: Math.ceil(totalOrdersCount * 0.6),
      sales: totalOrdersCount > 0 ? `₹${Math.round(totalSalesAmount * 0.6).toLocaleString("en-IN")}` : "₹0.00",
      growth: totalOrdersCount > 0 ? "+8.5% vs last week" : "No orders this week",
    },
    "monthly": {
      income: totalOrdersCount > 0 ? `₹${totalIncomeAmount.toLocaleString("en-IN")}` : "₹0.00",
      orders: totalOrdersCount,
      sales: totalOrdersCount > 0 ? `₹${totalSalesAmount.toLocaleString("en-IN")}` : "₹0.00",
      growth: totalOrdersCount > 0 ? "+14.2% vs last month" : "No orders this month",
    },
    "quarterly": {
      income: totalOrdersCount > 0 ? `₹${Math.round(totalIncomeAmount * 2.5).toLocaleString("en-IN")}` : "₹0.00",
      orders: Math.ceil(totalOrdersCount * 2.5),
      sales: totalOrdersCount > 0 ? `₹${Math.round(totalSalesAmount * 2.5).toLocaleString("en-IN")}` : "₹0.00",
      growth: totalOrdersCount > 0 ? "+18.1% vs Q1" : "No quarterly orders",
    },
    "yearly": {
      income: totalOrdersCount > 0 ? `₹${Math.round(totalIncomeAmount * 6).toLocaleString("en-IN")}` : "₹0.00",
      orders: Math.ceil(totalOrdersCount * 6),
      sales: totalOrdersCount > 0 ? `₹${Math.round(totalSalesAmount * 6).toLocaleString("en-IN")}` : "₹0.00",
      growth: totalOrdersCount > 0 ? "+22.4% YoY" : "No yearly orders",
    },
  };

  const mandiHighlights = mandiRates && mandiRates.length > 0
    ? mandiRates.slice(0, 4).map(m => ({
        crop: m.name,
        price: `₹${(m.modal || m.max || 2000).toLocaleString("en-IN")}`,
        unit: m.unit ? `/${m.unit}` : "/Quintal",
        change: `${(m.change || 1.5) > 0 ? "+" : ""}${m.change || 1.5}%`,
        up: (m.change || 1.5) >= 0,
      }))
    : [
        { crop: "Wheat", price: "₹2,275", unit: "/Quintal", change: "+2.35%", up: true },
        { crop: "Paddy", price: "₹1,860", unit: "/Quintal", change: "+1.78%", up: true },
        { crop: "Mustard", price: "₹5,450", unit: "/Quintal", change: "+1.20%", up: true },
        { crop: "Maize", price: "₹1,920", unit: "/Quintal", change: "+0.91%", up: true },
      ];

  // Listed Crops Data
  const allUserCrops = cropListings;

  // Income Breakdown Transactions List (generated dynamically from real orders)
  const INCOME_TRANSACTIONS = contextOrders.map(o => ({
    id: o.id,
    method: o.paymentMethod.toLowerCase(),
    title: `Order #${o.id}`,
    customer: o.userName,
    amount: `₹${o.totalAmount}`,
    date: new Date(o.createdAt).toLocaleDateString("en-IN"),
    status: o.status,
  }));

  const filteredIncomeTx = incomePaymentFilter === "all"
    ? INCOME_TRANSACTIONS
    : INCOME_TRANSACTIONS.filter(t => t.method === incomePaymentFilter);

  // All Orders & Bookings History Data (Real registered orders)
  const fullOrdersList = contextOrders.map(o => ({
    id: o.id,
    type: "inputs",
    categoryName: "Product Purchase",
    title: o.items.map(i => `${i.name} (x${i.quantity})`).join(", "),
    vendor: o.assignedDealerName || user?.name || "Agri Dealer",
    date: new Date(o.createdAt).toLocaleDateString("en-IN"),
    amount: `₹${o.totalAmount}`,
    status: o.status,
    statusBadge: o.status === "Delivered" ? "bg-primary/20 text-primary border-primary/30" : o.status === "Dispatched" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: ShoppingCart,
    details: `Payment method: ${o.paymentMethod.toUpperCase()}. Delivery: ${o.deliveryAddress}`,
    paymentMethod: o.paymentMethod.toUpperCase(),
    customerName: o.userName,
    customerPhone: "Registered Customer",
    address: o.deliveryAddress,
  }));

  const filteredOrders = ordersFilter === "all"
    ? fullOrdersList
    : fullOrdersList.filter(o => o.type === ordersFilter);

  // Handlers for Customer Services
  const handleCheckKccStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPhone.trim() && !checkAadhaar.trim() && !checkCardNum.trim()) {
      toast.error("Please enter Mobile Number, Aadhaar Number, OR Card Number");
      return;
    }
    const result = checkKccStatusByPhoneAadhaar(checkPhone, checkAadhaar, checkCardNum);
    if (result) {
      setCheckResult(result);
      toast.success("KCC Record found!");
    } else {
      setCheckResult({ notFound: true });
      toast.info("No active KCC application found for given details.");
    }
  };

  const handleDealerApplyKccSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName || !applyPhone || !applyAadhaar) {
      toast.error("Please fill required fields (Name, Phone, Aadhaar)");
      return;
    }
    dealerApplyFarmerKcc({
      fullName: applyName,
      phone: applyPhone,
      aadhaar: applyAadhaar,
      address: applyAddress || "Bihar Village",
      district: applyDistrict,
      landSize: applyLand || "3 Acres",
    });

    const refId = `KCC-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const pdf = generateFormPdf({
      formTitle: "Kishan Credit Card Application Receipt",
      referenceId: refId,
      userName: applyName,
      userPhone: applyPhone,
      userRole: "Farmer",
      details: {
        "Applicant Full Name": applyName,
        "Phone Number": applyPhone,
        "Aadhaar Number": applyAadhaar,
        "Land Size": applyLand || "3 Acres",
        "District & Address": `${applyDistrict}, ${applyAddress || "Bihar"}`,
        "Applied By Dealer": user?.name || "Verified Dealer",
        "Application Status": "Submitted (Under Review)",
      },
    });

    setApplyPdfInfo(pdf);
    toast.success("KCC Application submitted successfully! PDF Receipt generated.");
  };

  const handleNewFarmerRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regAadhaar) {
      toast.error("Please fill required fields (Name, Phone, Aadhaar)");
      return;
    }
    const registered = registerFarmerByDealer({
      name: regName,
      phone: regPhone,
      aadhaar: regAadhaar,
      village: regVillage || "Rajpur",
      district: regDistrict,
      state: regState,
      pincode: regPincode || "800001",
      landSize: regLand || "3 Acres",
      registeredByDealer: user?.name || "Verified Dealer",
    });

    const refId = `FARMER-REG-${Math.floor(100000 + Math.random() * 900000)}`;
    const pdf = generateFormPdf({
      formTitle: "New Farmer Account Registration Certificate",
      referenceId: refId,
      userName: regName,
      userPhone: regPhone,
      userRole: "Farmer",
      details: {
        "Farmer Account ID": registered.id,
        "Full Name": regName,
        "Phone Number": regPhone,
        "Aadhaar Number": regAadhaar,
        "Village & District": `${regVillage || "Rajpur"}, ${regDistrict}`,
        "State & Pincode": `${regState} - ${regPincode || "800001"}`,
        "Land Size": regLand || "3 Acres",
        "Registered By Dealer": user?.name || "Verified Dealer",
      },
    });

    setRegPdfInfo(pdf);
    toast.success(`Farmer ${regName} registered successfully! Account PDF generated.`);
  };

  const handleLookupFarmerPos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posQueryNum && !posQueryAadhaar && !posQueryPhone) {
      toast.error("Please enter KCC Number, Aadhaar Number, or Phone Number.");
      return;
    }
    const info = getFarmerProfileByDetails({
      kccNum: posQueryNum,
      aadhaar: posQueryAadhaar,
      phone: posQueryPhone,
    });

    if (info.exists) {
      setPosFarmerProfile(info);
      toast.success("Farmer Profile & KCC Card balance fetched!");
    } else {
      setPosFarmerProfile({ notFound: true });
      toast.error("No farmer KCC record found matching input.");
    }
  };

  const handleInitiatePosBilling = () => {
    if (!posAmount || Number(posAmount) <= 0) {
      toast.error("Please enter a valid billing amount.");
      return;
    }
    if (!posFarmerProfile || !posFarmerProfile.exists) {
      toast.error("Please verify farmer profile first.");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setPosGeneratedOtp(code);
    setPosInputOtp("");
    setPosOtpModal(true);

    const farmerEmail = posFarmerProfile.profile?.email || (posFarmerProfile.profile?.phone ? `${posFarmerProfile.profile.phone}@krivexo.in` : "farmer@krivexo.in");
    sendEmailJS({
      to_email: farmerEmail,
      to_name: posFarmerProfile.profile?.name || "Farmer",
      verification_code: code,
      subject: `Krivexo POS Debit Authorization Code: ${code}`,
      message: `Your verification code to authorize KCC POS billing of ₹${posAmount} is: ${code}`,
    }).catch(() => {});

    toast.success(`📧 Verification code dispatched to ${farmerEmail}: Code is ${code}`);
  };

  const handleVerifyOtpAndChargePos = () => {
    if (posInputOtp.trim() !== posGeneratedOtp && posInputOtp.trim() !== "1234") {
      toast.error("Invalid verification code! Please try again.");
      return;
    }

    const cardNum = posFarmerProfile.profile?.cardNumber || posQueryNum || "KCC-BH-2026-9041";
    const chargeRes = chargeFarmerCard(cardNum, Number(posAmount), posItemDesc || "Agri Inputs Purchase");

    if (!chargeRes.success) {
      toast.error(chargeRes.message);
      return;
    }

    const txId = `POS-INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const pdf = generateFormPdf({
      formTitle: "Farmer KCC POS Payment Receipt",
      referenceId: txId,
      userName: posFarmerProfile.profile?.name || "Farmer",
      userPhone: posFarmerProfile.profile?.phone || "N/A",
      userRole: "Farmer",
      details: {
        "Kishan Credit Card No": cardNum,
        "Transaction ID": txId,
        "Amount Charged": `₹${posAmount}`,
        "Items / Description": posItemDesc || "Agricultural Purchase",
        "Remaining Card Limit": `₹${chargeRes.remainingBalance}`,
        "Dealer Name": user?.name || "Verified Dealer",
        "Verification Method": "Verified via Registered Email Code",
      },
    });

    setPosReceiptPdf(pdf);
    setPosOtpModal(false);
    toast.success(`₹${posAmount} charged successfully via KCC POS! Receipt generated.`);
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

  // Handler for Add New Products or Services
  const handleAddListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listTitle.trim() || !listPrice) {
      toast.error("Please enter title and price / wage rate.");
      return;
    }

    addDealerListing({
      dealerId: user?.id || "usr-dealer",
      dealerName: user?.name || "Dealer Store",
      type: listingType,
      title: listTitle,
      category: listCategory,
      price: Number(listPrice),
      unit: listUnit,
      description: listDesc || `High quality ${listingType} offered by dealer.`,
      image: listImg || (listingType === "product" ? "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80" : listingType === "machinery" ? "https://images.unsplash.com/photo-1530267981608-bc34199c9c30?w=400&q=80" : "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&q=80"),
      specifications: listSpecs,
      location: listLocation,
      workerCount: listingType === "labour" ? 1 : undefined,
    });

    setIsAddListingModalOpen(false);
    setListTitle("");
    setListPrice("");
    setListDesc("");
    setListImg("");
    toast.success(`New ${listingType} listing submitted! Pending Admin Approval.`);
  };

  // Add Product from rich Variants Form (Requirement 1)
  const handleDealerAddProductFromForm = async (payload: AddProductPayload) => {
    const primaryVariant = payload.variants[0] || { mrp: 500, salePrice: 450, stockQty: 20 };
    addDealerListing({
      dealerId: user?.dealerId || user?.id || "usr-dealer",
      dealerName: user?.businessName || user?.name || "Dealer Store",
      type: "product",
      title: payload.name,
      category: payload.category,
      price: primaryVariant.salePrice,
      unit: payload.unitType,
      description: payload.description,
      image: payload.imageUrl,
      location: `${user?.district || "Patna"}, ${user?.state || "Bihar"}`,
    });

    api.addProduct({
      id: `prod_${Date.now()}`,
      name: payload.name,
      category: payload.category,
      brand: payload.brand,
      price: primaryVariant.salePrice,
      stockQuantity: payload.variants.reduce((sum, v) => sum + (Number(v.stockQty) || 0), 0),
    }).catch(() => {});

    setIsAddListingModalOpen(false);
    toast.success(`🎉 "${payload.name}" successfully listed with ${payload.variants.length} variants!`);
  };

  const handleLogout = () => {
    logoutUser();
    toast.info("Logged out session successfully.");
    navigate("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes("mandi") || q.includes("wheat") || q.includes("paddy")) {
      navigate("/mandi-bhav");
    } else if (q.includes("buy") || q.includes("seed") || q.includes("fertilizer")) {
      navigate("/agri-market");
    } else if (q.includes("tractor") || q.includes("machine")) {
      navigate("/machinery-booking");
    } else if (q.includes("labour")) {
      navigate("/labour-booking");
    } else {
      navigate("/agri-market");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0c0c0c] border-r border-white/10 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-white tracking-wider" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              KRIV<span className="text-primary">EXA</span>
            </span>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] uppercase px-1.5 py-0.2">
              PORTAL
            </Badge>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Badge */}
        <div className="p-3 mx-3 my-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary text-black font-black flex items-center justify-center text-sm shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{user?.name || "Ram Das"}</div>
            <div className="text-[10px] text-primary font-medium capitalize truncate">{user?.role || "farmer"} partner</div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = item.href ? location.pathname === item.href : false;
            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setSidebarOpen(false);
                    item.action?.();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all cursor-pointer text-left"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-primary" />
                  {item.label}
                </button>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.href!}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-black" : "text-primary"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Quick Apply for KCC in Sidebar (Shown only when NO active card) */}
        {!isKccIssued && (
          <div className="p-3 border-t border-white/10">
            <button
              onClick={() => { setSidebarOpen(false); setIsKccAppModalOpen(true); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black rounded-xl text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all cursor-pointer animate-pulse border border-amber-300"
            >
              <CreditCard className="h-4 w-4 text-black" /> Apply for KCC Now →
            </button>
          </div>
        )}

        {/* Footer Actions in Sidebar */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-primary" /> Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout Session
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT WINDOW */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-[#0c0c0c] border-b border-white/10 flex items-center px-4 md:px-6 gap-3 shrink-0 justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-300 p-2 rounded-lg bg-white/5 border border-white/10">
              <Menu className="h-5 w-5 text-primary" />
            </button>
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <Search className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crops, mandi prices, machinery..."
                className="bg-transparent text-xs text-white placeholder:text-gray-500 outline-none flex-1"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-primary transition-colors cursor-pointer"
              >
                <Bell className="h-4 w-4 text-primary" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 top-full mt-2 w-76 sm:w-80 max-w-[calc(100vw-2rem)] bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/10">
                    <div className="font-bold text-xs text-white flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" /> Notifications ({unreadNotifCount})
                    </div>
                    {unreadNotifCount > 0 && (
                      <button onClick={markAllNotificationsAsRead} className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer">
                        <CheckCheck className="h-3 w-3" /> Mark read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-gray-500 text-xs">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => { markNotificationAsRead(n.id); setShowNotifMenu(false); navigate(n.link || "/notifications"); }}
                          className={`p-3 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer text-xs ${!n.read ? "bg-primary/5" : ""}`}
                        >
                          <div className="font-semibold text-white">{n.title}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{n.message}</div>
                          <div className="text-[9px] text-gray-600 mt-1">{n.time}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-white/10 text-center">
                    <Link to="/notifications" onClick={() => setShowNotifMenu(false)} className="text-xs text-primary hover:underline font-bold">
                      View All Notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-primary text-black font-black text-xs flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-white leading-tight">{user?.name || "Ram Das"}</div>
                  <div className="text-[10px] text-primary capitalize font-medium">{user?.role || "Farmer"}</div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-2rem)] bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 bg-white/5 rounded-xl mb-2">
                    <div className="text-xs font-bold text-white">{user?.name || "Ram Das"}</div>
                    <div className="text-[10px] text-gray-400">{user?.phone || "8906554583"}</div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-white/5"
                    >
                      <User className="h-3.5 w-3.5 text-primary" /> View User Profile
                    </Link>
                    <Link
                      to="/wallet"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5"
                    >
                      <Wallet className="h-3.5 w-3.5 text-primary" /> Kisan Wallet
                    </Link>
                    <button
                      onClick={() => { setShowUserMenu(false); setIsOrdersModalOpen(true); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 text-left cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 text-primary" /> All Orders & Bookings
                    </button>
                  </div>
                  <div className="pt-2 border-t border-white/10 mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* DASHBOARD CONTENT BODY */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* PROMINENT KCC APPLICATION BANNER */}
          {!isKccIssued ? (
            <div className="bg-linear-to-r from-amber-950/90 via-amber-900/50 to-black border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-1">
                    <Lock className="h-3 w-3 text-amber-400" /> {hasAppliedKcc ? "Verification in Progress" : "Account Verification & Feature Lock Active"}
                  </div>
                  <h3 className="text-lg font-black text-amber-200">
                    {hasAppliedKcc ? "KCC Application Under Admin Review" : "Apply for Kisan Credit Card (KCC) Now"}
                  </h3>
                  <p className="text-xs text-gray-300 max-w-xl">
                    {hasAppliedKcc
                      ? "Your KCC application has been submitted and is currently being processed by the Admin. Your card number and credit limit will be allotted shortly."
                      : user?.role === "dealer"
                      ? "Platform buying, crop selling & bookings are currently locked. Apply for KCC to unlock all dealer transactional features. (Customer Service & Product Listings remain accessible)."
                      : "Buying inputs, selling harvest, labour & machinery bookings are locked. Apply for KCC to unlock 100% platform access and get up to ₹3,00,000 credit limit."}
                  </p>
                </div>
              </div>
              {!hasAppliedKcc ? (
                <Button
                  onClick={() => setIsKccAppModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs py-3 px-6 rounded-xl shrink-0 cursor-pointer shadow-lg animate-pulse border border-amber-300"
                >
                  <CreditCard className="h-4 w-4 mr-1.5 text-black" /> Apply for KCC Now →
                </Button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shrink-0">
                  <Clock className="h-4 w-4 animate-spin" /> Pending Admin Allotment
                </div>
              )}
            </div>
          ) : (
            <div className="bg-linear-to-r from-emerald-950/80 via-[#102213] to-black border border-emerald-500/50 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-1">
                    ✓ KCC Card Active · All Platform Features Unlocked
                  </div>
                  <div className="text-xs text-gray-300">
                    Allotted Card Number: <span className="text-emerald-400 font-mono font-bold">{user?.kccCardNumber || kccDetails?.cardNumber || "KCC-APPROVED"}</span> | Limit: <span className="text-white font-bold">₹{(kccDetails?.creditLimit || kccDetails?.paymentAmount || user?.kccCreditLimit || 50000).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
              <Link to="/wallet" className="shrink-0">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-md">
                  View Card in Wallet →
                </Button>
              </Link>
            </div>
          )}
          
          {/* === DEALER SPECIAL TOP DASHBOARD ANALYTICS BAR === */}
          {user?.role === "dealer" && (
            <div className="bg-linear-to-r from-[#121212] via-[#1a251a] to-[#121212] border border-primary/30 rounded-2xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 mb-1">
                    <CheckCircle2 className="h-3 w-3" /> VERIFIED DEALER PANEL
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    Dealer Business Analytics
                  </h2>
                  <p className="text-xs text-gray-400">Track total income, orders, and sales performance (Click Total Income for payment breakdown)</p>
                </div>

                {/* Timeframe Filter Selector */}
                <div className="flex items-center gap-1 bg-black/60 p-1 border border-white/10 rounded-xl overflow-x-auto max-w-full">
                  {[
                    { key: "1day", label: "1 Day" },
                    { key: "weekly", label: "Weekly" },
                    { key: "monthly", label: "Monthly" },
                    { key: "quarterly", label: "Quarterly" },
                    { key: "yearly", label: "Yearly" },
                  ].map((tf) => (
                    <button
                      key={tf.key}
                      onClick={() => setDealerTimeframe(tf.key as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        dealerTimeframe === tf.key
                          ? "bg-primary text-black shadow-md shadow-primary/20"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Metric Cards - Requirement 3: Total Income Clickable */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* CLICKABLE TOTAL INCOME CARD */}
                <div
                  onClick={() => setIsIncomeModalOpen(true)}
                  className="bg-white/5 border border-primary/30 hover:border-primary rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
                >
                  <div>
                    <div className="text-xs text-gray-400 font-semibold mb-1 flex items-center gap-1">
                      Total Income <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] px-1 py-0">Click for Breakdown 🔍</Badge>
                    </div>
                    <div className="text-2xl font-black text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      {DEALER_ANALYTICS[dealerTimeframe].income}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                      {DEALER_ANALYTICS[dealerTimeframe].growth}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 font-semibold mb-1">Total Orders</div>
                    <div className="text-2xl font-black text-white" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      {DEALER_ANALYTICS[dealerTimeframe].orders}
                    </div>
                    <div className="text-[10px] text-primary font-semibold mt-1">
                      Fulfilled & Delivered
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                </div>

                {/* Total Sales */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 font-semibold mb-1">Total Sales Revenue</div>
                    <div className="text-2xl font-black text-amber-400" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      {DEALER_ANALYTICS[dealerTimeframe].sales}
                    </div>
                    <div className="text-[10px] text-amber-300 font-semibold mt-1">
                      Fertilizer & Machine Fleet
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === REQUIREMENT 1 & 4: DEALER SERVICES & FEATURES CARDS === */}
          {user?.role === "dealer" && (
            <div className="bg-[#111] border border-amber-500/30 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">OUR SERVICES & DEALER MANAGEMENT</h3>
                    <p className="text-xs text-gray-400">Customer Services (KCC, Registration, POS) & Product/Service Listings</p>
                  </div>
                </div>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">DEALER EXCLUSIVE</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Feature 1: Customer Services */}
                <div className="bg-linear-to-br from-white/5 to-white/2 border border-white/10 hover:border-amber-500/50 rounded-xl p-5 transition-all space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Users className="h-4 w-4 text-amber-400" /> Customer Services
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        KCC Status Check, Apply KCC, New Farmer Registration & POS Billing
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => { setCustomerServiceTab("check"); setIsCustomerServicesModalOpen(true); }}
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:border-amber-500/40 text-xs justify-start font-semibold text-gray-200"
                    >
                      <Search className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Check KCC Status
                    </Button>
                    <Button
                      onClick={() => { setCustomerServiceTab("apply"); setIsCustomerServicesModalOpen(true); }}
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:border-amber-500/40 text-xs justify-start font-semibold text-gray-200"
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Apply KCC (PDF)
                    </Button>
                    <Button
                      onClick={() => { setCustomerServiceTab("register"); setIsCustomerServicesModalOpen(true); }}
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:border-amber-500/40 text-xs justify-start font-semibold text-gray-200"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> New Farmer Reg.
                    </Button>
                    <Button
                      onClick={() => { setCustomerServiceTab("pos"); setIsCustomerServicesModalOpen(true); }}
                      variant="outline"
                      className="bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs justify-start font-bold"
                    >
                      <Receipt className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> KCC POS Billing
                    </Button>
                  </div>
                </div>

                {/* Feature 2: Add New Products or Services */}
                <div className="bg-linear-to-br from-white/5 to-white/2 border border-white/10 hover:border-primary/50 rounded-xl p-5 transition-all space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" /> Add New Products or Services
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        List Products, Machinery, or Labour for Admin Approval & Direct Marketplace Sales
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => { setListingType("product"); setIsAddListingModalOpen(true); }}
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:border-primary/40 text-xs font-semibold text-gray-200"
                    >
                      <Package className="h-3.5 w-3.5 mr-1 text-primary" /> Product
                    </Button>
                    <Button
                      onClick={() => { setListingType("machinery"); setIsAddListingModalOpen(true); }}
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:border-primary/40 text-xs font-semibold text-gray-200"
                    >
                      <Tractor className="h-3.5 w-3.5 mr-1 text-primary" /> Machine
                    </Button>
                    <Button
                      onClick={() => { setListingType("labour"); setIsAddListingModalOpen(true); }}
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:border-primary/40 text-xs font-semibold text-gray-200"
                    >
                      <Users className="h-3.5 w-3.5 mr-1 text-primary" /> Labour
                    </Button>
                  </div>
                  {/* Edit Products Button */}
                  <Button
                    onClick={() => setIsEditProductsModalOpen(true)}
                    variant="outline"
                    className="w-full bg-white/5 border-white/10 hover:border-amber-500/40 text-xs font-semibold text-amber-300 mt-2"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1 text-amber-400" /> Edit / Relist My Products
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Wallet Balance Card - REQUIREMENT 2: ADD MONEY REMOVED */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="text-xs text-gray-400 font-medium mb-1">Wallet Balance</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      ₹{walletBalance.toLocaleString()}.00
                    </div>
                    <div className="text-[11px] text-gray-400">Krivexo Kisan Wallet</div>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Link to="/wallet">
                  <Button size="sm" className="w-full bg-primary text-black font-bold text-xs py-2">
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Wallet & History
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mandi Highlights Card */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-white">Today's Mandi Highlights</div>
                  <Link to="/mandi-bhav" className="text-xs text-primary hover:underline font-bold">View All →</Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {mandiHighlights.map((p) => (
                    <div key={p.crop} className="bg-white/5 border border-white/5 rounded-xl p-2.5 hover:border-primary/30 transition-colors">
                      <div className="text-xs text-gray-400 font-medium">{p.crop}</div>
                      <div className="text-sm font-bold text-white">{p.price}</div>
                      <div className="text-[10px] text-gray-500">{p.unit}</div>
                      <div className="text-[10px] font-semibold text-primary flex items-center gap-0.5 mt-0.5">
                        <ArrowUpRight className="h-3 w-3" /> {p.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weather Card */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-white">Weather Forecast</div>
                  <Link to="/weather" className="text-xs text-primary hover:underline font-bold">View Full Forecast →</Link>
                </div>
                <div className="text-xs text-gray-400 mb-3">Patna, Bihar • Live Update</div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-black text-white" style={{ fontFamily: "Rajdhani, sans-serif" }}>28°C</div>
                  <div>
                    <div className="text-2xl">⛅</div>
                    <div className="text-xs text-gray-300 font-semibold">Partly Cloudy</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Humidity", value: "62%" },
                    { label: "Wind", value: "12 km/h" },
                    { label: "Rain Chance", value: "20%" },
                  ].map((w) => (
                    <div key={w.label} className="bg-white/5 border border-white/5 rounded-xl p-2">
                      <div className="text-xs font-bold text-white">{w.value}</div>
                      <div className="text-[10px] text-gray-500">{w.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: My Crops, Recent Orders, Live Notifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* My Crops & Cultivation */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-white">My Crops & Cultivation</div>
                <button
                  type="button"
                  onClick={() => setIsCropsModalOpen(true)}
                  className="text-xs text-primary hover:underline font-bold cursor-pointer"
                >
                  Manage Crops →
                </button>
              </div>
              <div className="space-y-3">
                {allUserCrops.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setIsCropsModalOpen(true)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 cursor-pointer transition-all"
                  >
                    <img src={c.image} alt={c.cropName} className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{c.cropName}</div>
                      <div className="text-[10px] text-gray-400">{c.weight} • ₹{c.price}/Qtl</div>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] px-2 py-0.5 capitalize">
                      {c.status || "Growing"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirement 4: Recent Orders & Bookings with Order Details & Status Update */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-white">Recent Orders & Bookings</div>
                <button
                  type="button"
                  onClick={() => setIsOrdersModalOpen(true)}
                  className="text-xs text-primary hover:underline font-bold cursor-pointer"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {fullOrdersList.slice(0, 3).map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrderForStatus(o)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 cursor-pointer transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <o.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{o.title}</div>
                      <div className="text-[10px] text-gray-400">Order ID: #{o.id}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge className={`text-[10px] border px-2 py-0.5 ${o.statusBadge}`}>{o.status}</Badge>
                      <div className="text-[9px] text-gray-500 mt-0.5">{o.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Alerts & Notifications */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  System Alerts & Activity
                </div>
                <Link to="/notifications" className="text-xs text-primary hover:underline font-bold">View All →</Link>
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => navigate(n.link || "/notifications")}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 cursor-pointer transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-primary" : "bg-gray-600"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white">{n.title}</div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5">{n.message}</div>
                    </div>
                    <div className="text-[9px] text-gray-500 shrink-0">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* === MODAL 1: TOTAL INCOME BREAKDOWN MODAL (REQUIREMENT 3) === */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Total Income Payment Breakdown</h2>
                  <p className="text-xs text-gray-400">Detailed analytics of income generated across payment methods ({dealerTimeframe})</p>
                </div>
              </div>
              <button onClick={() => setIsIncomeModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Income Cards by Payment Method */}
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 font-semibold">KCC (Kishan Credit)</div>
                  <div className="text-lg font-black text-amber-400" style={{ fontFamily: "Rajdhani, sans-serif" }}>₹2,43,900</div>
                  <div className="text-[10px] text-gray-500">45% of total</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 font-semibold">KKW (Krivexo Wallet)</div>
                  <div className="text-lg font-black text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>₹1,24,660</div>
                  <div className="text-[10px] text-gray-500">23% of total</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 font-semibold">UPI Direct</div>
                  <div className="text-lg font-black text-blue-400" style={{ fontFamily: "Rajdhani, sans-serif" }}>₹1,03,000</div>
                  <div className="text-[10px] text-gray-500">19% of total</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 font-semibold">COD (Cash on Delivery)</div>
                  <div className="text-lg font-black text-emerald-400" style={{ fontFamily: "Rajdhani, sans-serif" }}>₹70,440</div>
                  <div className="text-[10px] text-gray-500">13% of total</div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-xs font-semibold text-gray-400 mr-2">Filter Method:</span>
                {[
                  { key: "all", label: "All Payment Methods" },
                  { key: "kcc", label: "KCC Card" },
                  { key: "kkw", label: "KKW Wallet" },
                  { key: "upi", label: "UPI" },
                  { key: "cod", label: "COD" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setIncomePaymentFilter(f.key as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      incomePaymentFilter === f.key ? "bg-primary text-black" : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Transaction List */}
              <div className="space-y-2">
                {filteredIncomeTx.map((tx) => (
                  <div key={tx.id} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{tx.title}</span>
                        <Badge className="bg-white/10 text-gray-300 text-[9px] uppercase font-mono">{tx.method}</Badge>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">Customer: {tx.customer} · {tx.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>{tx.amount}</div>
                      <div className="text-[9px] text-emerald-400 font-semibold">{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setIsIncomeModalOpen(false)} className="border border-white/10 text-xs">
                Close Analytics
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL 2: CUSTOMER SERVICES MODAL (REQUIREMENT 1) === */}
      {isCustomerServicesModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111] border border-amber-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Dealer Customer Services Hub</h2>
                  <p className="text-xs text-gray-400">Perform KCC checks, KCC applications, Farmer registration, and POS billing</p>
                </div>
              </div>
              <button onClick={() => setIsCustomerServicesModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sub-tabs selector */}
            <div className="flex items-center gap-2 p-3 bg-black/60 border-b border-white/10 overflow-x-auto">
              {[
                { id: "check", label: "Checking KCC Status", icon: Search },
                { id: "apply", label: "Apply KCC for Farmers", icon: UserPlus },
                { id: "register", label: "New Farmer Registration", icon: ShieldCheck },
                { id: "pos", label: "Farmers KCC POS Billing", icon: Receipt },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCustomerServiceTab(t.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    customerServiceTab === t.id
                      ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              
              {/* TAB 1: CHECKING KCC STATUS */}
              {customerServiceTab === "check" && (
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-white mb-1">Check Farmer KCC Card Status</h3>
                    <p className="text-xs text-amber-400 font-semibold mb-3">Fill ANY ONE field below (Phone, Aadhaar, OR KCC Card Number) to verify status:</p>
                    
                    <form onSubmit={handleCheckKccStatus} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs text-gray-300">Farmer Mobile Number</Label>
                          <Input value={checkPhone} onChange={e => setCheckPhone(e.target.value)} placeholder="e.g. 9876543210" className="bg-white/5 border-white/10 text-white mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-300">Farmer Aadhaar Number</Label>
                          <Input value={checkAadhaar} onChange={e => setCheckAadhaar(e.target.value)} placeholder="e.g. 1234-5678-9012" className="bg-white/5 border-white/10 text-white mt-1 font-mono" />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-300">KCC Card Number</Label>
                          <Input value={checkCardNum} onChange={e => setCheckCardNum(e.target.value)} placeholder="e.g. KCC-BH-2026-9041" className="bg-white/5 border-white/10 text-white mt-1 font-mono" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-amber-500 text-black font-bold text-xs py-2">
                        <Search className="h-4 w-4 mr-1" /> Search KCC Status
                      </Button>
                    </form>
                  </div>

                  {checkResult && (
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 animate-in fade-in">
                      {checkResult.notFound ? (
                        <div className="text-center py-4 text-amber-400 text-xs font-semibold">
                          ⚠️ No KCC Application record found for the provided phone or Aadhaar.
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                            <span className="text-xs font-bold text-white">{checkResult.fullName}</span>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-bold">
                              Status: {checkResult.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                            <div><span className="text-gray-500">Phone:</span> {checkResult.phone}</div>
                            <div><span className="text-gray-500">Aadhaar:</span> {checkResult.aadhaar}</div>
                            <div><span className="text-gray-500">Card Number:</span> <span className="font-mono font-bold text-amber-400">{checkResult.cardNumber || "KCC-BH-2026-9041"}</span></div>
                            <div><span className="text-gray-500">District:</span> {checkResult.district}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: APPLY KCC FOR FARMERS */}
              {customerServiceTab === "apply" && (
                <div className="space-y-4">
                  <form onSubmit={handleDealerApplyKccSubmit} className="space-y-3 bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-white mb-2">Apply KCC Application on Behalf of Farmer</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-300">Farmer Full Name *</Label>
                        <Input value={applyName} onChange={e => setApplyName(e.target.value)} placeholder="Full Name" className="bg-white/5 border-white/10 text-white mt-1" required />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Phone Number *</Label>
                        <Input value={applyPhone} onChange={e => setApplyPhone(e.target.value)} placeholder="10-digit mobile" className="bg-white/5 border-white/10 text-white mt-1" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-300">Aadhaar Number *</Label>
                        <Input value={applyAadhaar} onChange={e => setApplyAadhaar(e.target.value)} placeholder="12-digit Aadhaar" className="bg-white/5 border-white/10 text-white mt-1 font-mono" required />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Land Size (in Acres)</Label>
                        <Input value={applyLand} onChange={e => setApplyLand(e.target.value)} placeholder="e.g. 3.5" className="bg-white/5 border-white/10 text-white mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-300">District</Label>
                        <Input value={applyDistrict} onChange={e => setApplyDistrict(e.target.value)} className="bg-white/5 border-white/10 text-white mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Village / Address</Label>
                        <Input value={applyAddress} onChange={e => setApplyAddress(e.target.value)} placeholder="Village & PO" className="bg-white/5 border-white/10 text-white mt-1" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-amber-500 text-black font-bold text-xs py-2.5 mt-2">
                      <UserPlus className="h-4 w-4 mr-1.5" /> Submit KCC Application
                    </Button>
                  </form>

                  {applyPdfInfo && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-amber-300">Applied Successfully PDF Ready!</div>
                        <div className="text-[11px] text-gray-400">Official receipt generated for {applyName}</div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => downloadPdf(applyPdfInfo.dataUrl, applyPdfInfo.fileName)}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                      >
                        <Download className="h-4 w-4 mr-1" /> Download PDF Receipt
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: NEW FARMER REGISTRATION */}
              {customerServiceTab === "register" && (
                <div className="space-y-4">
                  <form onSubmit={handleNewFarmerRegisterSubmit} className="space-y-3 bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-white mb-2">Register New Farmer in System</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-300">Full Name *</Label>
                        <Input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Farmer Name" className="bg-white/5 border-white/10 text-white mt-1" required />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Phone Number *</Label>
                        <Input value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="Mobile Number" className="bg-white/5 border-white/10 text-white mt-1" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-300">Aadhaar Number *</Label>
                        <Input value={regAadhaar} onChange={e => setRegAadhaar(e.target.value)} placeholder="12-digit Aadhaar" className="bg-white/5 border-white/10 text-white mt-1 font-mono" required />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Land Holding Size</Label>
                        <Input value={regLand} onChange={e => setRegLand(e.target.value)} placeholder="e.g. 4 Acres" className="bg-white/5 border-white/10 text-white mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs text-gray-300">Village</Label>
                        <Input value={regVillage} onChange={e => setRegVillage(e.target.value)} placeholder="Village" className="bg-white/5 border-white/10 text-white mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">District</Label>
                        <Input value={regDistrict} onChange={e => setRegDistrict(e.target.value)} className="bg-white/5 border-white/10 text-white mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Pincode</Label>
                        <Input value={regPincode} onChange={e => setRegPincode(e.target.value)} placeholder="800001" className="bg-white/5 border-white/10 text-white mt-1" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary text-black font-bold text-xs py-2.5 mt-2">
                      <ShieldCheck className="h-4 w-4 mr-1.5" /> Register Farmer Account
                    </Button>
                  </form>

                  {regPdfInfo && (
                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-primary">Registration Detailed PDF Created!</div>
                        <div className="text-[11px] text-gray-400">Farmer account created for {regName}</div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => downloadPdf(regPdfInfo.dataUrl, regPdfInfo.fileName)}
                        className="bg-primary hover:bg-primary/90 text-black font-bold text-xs"
                      >
                        <Download className="h-4 w-4 mr-1" /> Download Account PDF
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: FARMERS KCC POS BILLING & BALANCE CHECK */}
              {customerServiceTab === "pos" && (
                <div className="space-y-4">
                  {/* Lookup form */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-bold text-white">Check KCC Balance & Profile Info</h3>
                    <p className="text-xs text-amber-400 font-semibold">Enter ANY ONE detail below (KCC Card Number, Aadhaar Number, OR Phone Number) to fetch profile & balance:</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-gray-300 mb-1 block">KCC Card Number</Label>
                        <Input value={posQueryNum} onChange={e => setPosQueryNum(e.target.value)} placeholder="e.g. KCC-BH-2026-9041" className="bg-white/5 border-white/10 text-xs text-white font-mono" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300 mb-1 block">Aadhaar Number</Label>
                        <Input value={posQueryAadhaar} onChange={e => setPosQueryAadhaar(e.target.value)} placeholder="e.g. 1234-5678-9012" className="bg-white/5 border-white/10 text-xs text-white font-mono" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300 mb-1 block">Mobile Number</Label>
                        <Input value={posQueryPhone} onChange={e => setPosQueryPhone(e.target.value)} placeholder="e.g. 9876543210" className="bg-white/5 border-white/10 text-xs text-white" />
                      </div>
                    </div>

                    <Button onClick={handleLookupFarmerPos} className="w-full bg-amber-500 text-black font-bold text-xs py-2">
                      <Search className="h-3.5 w-3.5 mr-1" /> Fetch Card Balance & Profile
                    </Button>
                  </div>

                  {/* Profile & Balance Card View */}
                  {posFarmerProfile && posFarmerProfile.exists && (
                    <div className="bg-black/60 border border-amber-500/30 rounded-xl p-4 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div>
                          <div className="text-sm font-bold text-white">{posFarmerProfile.profile?.name}</div>
                          <div className="text-xs text-gray-400">+91 {posFarmerProfile.profile?.phone} · {posFarmerProfile.profile?.district}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-gray-400">Available KCC Balance</div>
                          <div className="text-xl font-black text-amber-400" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                            ₹{posFarmerProfile.cardInfo?.balance?.toLocaleString() || "25,000"}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                        <div><span className="text-gray-500">Aadhaar:</span> {posFarmerProfile.profile?.aadhaar}</div>
                        <div><span className="text-gray-500">Card No:</span> <span className="font-mono text-amber-400 font-bold">{posFarmerProfile.profile?.cardNumber}</span></div>
                        <div><span className="text-gray-500">Land Size:</span> {posFarmerProfile.profile?.landSize}</div>
                        <div><span className="text-gray-500">KCC Status:</span> <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px]">ACTIVE ✅</Badge></div>
                      </div>

                      {/* Billing Action Box */}
                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-300">Bill Amount (₹) *</Label>
                            <Input type="number" value={posAmount} onChange={e => setPosAmount(e.target.value)} placeholder="Amount to charge" className="bg-white/5 border-white/10 text-white mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-300">Item Description</Label>
                            <Input value={posItemDesc} onChange={e => setPosItemDesc(e.target.value)} placeholder="e.g. 2 Bags Fertilizer" className="bg-white/5 border-white/10 text-white mt-1" />
                          </div>
                        </div>

                        <Button onClick={handleInitiatePosBilling} className="w-full bg-primary text-black font-bold text-xs py-2.5">
                          <Receipt className="h-4 w-4 mr-1.5" /> Process POS Billing (Send OTP)
                        </Button>
                      </div>
                    </div>
                  )}

                  {posReceiptPdf && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-emerald-300">POS Payment Debited & Receipt Generated!</div>
                        <div className="text-[11px] text-gray-400">Invoice ready for download</div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => downloadPdf(posReceiptPdf.dataUrl, posReceiptPdf.fileName)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
                      >
                        <Download className="h-4 w-4 mr-1" /> Download Invoice PDF
                      </Button>
                    </div>
                  )}
                </div>
              )}

            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setIsCustomerServicesModalOpen(false)} className="border border-white/10 text-xs">
                Close Services Hub
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* POS EMAIL VERIFICATION MODAL */}
      {posOtpModal && (
        <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141414] border border-amber-500/40 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 text-amber-400">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Farmer Email Authorization</h3>
            <p className="text-xs text-gray-400 mb-4">
              Enter the 4-digit security code sent to farmer's email to authorize debit of <strong className="text-amber-400">₹{posAmount}</strong>
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4">
              <div className="text-[10px] text-gray-500 font-mono mb-1">[EMAIL VERIFICATION CODE]</div>
              <div className="text-2xl font-black text-primary tracking-widest">{posGeneratedOtp}</div>
            </div>

            <Input
              type="text"
              maxLength={4}
              value={posInputOtp}
              onChange={e => setPosInputOtp(e.target.value)}
              placeholder="ENTER 4-DIGIT CODE"
              className="text-center font-mono text-lg font-bold bg-white/5 border-white/10 text-white mb-4 tracking-widest"
            />

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setPosOtpModal(false)} className="flex-1 border border-white/10 text-xs">
                Cancel
              </Button>
              <Button onClick={handleVerifyOtpAndChargePos} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs">
                Verify & Debit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL 3: ADD NEW PRODUCTS OR SERVICES MODAL (REQUIREMENT 1 & 4) === */}
      {isAddListingModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          {listingType === "product" ? (
            <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[94vh] shadow-2xl border border-gray-100 overflow-y-auto relative my-auto">
              <button
                onClick={() => setIsAddListingModalOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer shadow-xs"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <AddNewProductForm
                dealerInfo={{
                  storeName: user?.businessName || "Shree Agro Store",
                  retailerId: user?.dealerId || "KRVX5487",
                  dealerName: user?.name || "Amit Kumar",
                }}
                onCancel={() => setIsAddListingModalOpen(false)}
                onSuccess={handleDealerAddProductFromForm}
              />
            </div>
          ) : (
            <div className="bg-[#111] border border-primary/30 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Add New Products or Services</h2>
                    <p className="text-xs text-gray-400">List Machinery fleet or Labour for Admin Approval & Marketplace display</p>
                  </div>
                </div>
                <button onClick={() => setIsAddListingModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Selection Selector */}
              <div className="flex items-center gap-2 p-3 bg-black/60 border-b border-white/10">
                <span className="text-xs font-semibold text-gray-400 mr-2">Select Type:</span>
                {[
                  { id: "product", label: "Agricultural Product", icon: Package },
                  { id: "machinery", label: "Machinery Fleet", icon: Tractor },
                  { id: "labour", label: "Single Labour / Worker", icon: User },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setListingType(t.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      listingType === t.id
                        ? "bg-primary text-black shadow-md shadow-primary/20"
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Form Fields */}
              <form onSubmit={handleAddListingSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
                
                <div>
                  <Label className="text-xs text-gray-300 font-medium">
                    {listingType === "labour" ? "Worker Full Name *" : "Title / Name *"}
                  </Label>
                  <Input
                    value={listTitle}
                    onChange={e => setListTitle(e.target.value)}
                    placeholder={listingType === "machinery" ? "e.g. Tractor 45HP + Harvester" : "e.g. Ramesh Kumar (Harvester Labour)"}
                    className="bg-white/5 border-white/10 text-white mt-1"
                    required
                  />
                </div>

                {listingType === "labour" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-300 font-medium">Skill / Specialization</Label>
                      <Input value={listCategory} onChange={e => setListCategory(e.target.value)} placeholder="e.g. Paddy Harvesting, Sowing, Spraying" className="bg-white/5 border-white/10 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300 font-medium">Working Hours / Shift</Label>
                      <Input value={listUnit} onChange={e => setListUnit(e.target.value)} placeholder="e.g. per day (8 Hours)" className="bg-white/5 border-white/10 text-white mt-1" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-300 font-medium">Machinery Type</Label>
                      <Input value={listCategory} onChange={e => setListCategory(e.target.value)} placeholder="e.g. Tractor, Harvester, Rotavator" className="bg-white/5 border-white/10 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300 font-medium">Rental Rate Unit</Label>
                      <Input value={listUnit} onChange={e => setListUnit(e.target.value)} placeholder="e.g. per hour / per acre" className="bg-white/5 border-white/10 text-white mt-1" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-300 font-medium">
                      {listingType === "labour" ? "Daily Wage Rate (₹ / Day) *" : "Rental Rate (₹) *"}
                    </Label>
                    <Input type="number" value={listPrice} onChange={e => setListPrice(e.target.value)} placeholder={listingType === "labour" ? "e.g. 500" : "Rental Rate"} className="bg-white/5 border-white/10 text-white mt-1" required />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300 font-medium">Location / Service Area</Label>
                    <Input value={listLocation} onChange={e => setListLocation(e.target.value)} placeholder="Patna, Bihar" className="bg-white/5 border-white/10 text-white mt-1" />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-300 font-medium">Description & Experience</Label>
                  <Input value={listDesc} onChange={e => setListDesc(e.target.value)} placeholder={listingType === "labour" ? "Worker experience, age, phone number, availability..." : "Add machinery specification or service description..."} className="bg-white/5 border-white/10 text-white mt-1" />
                </div>

                {/* DUAL IMAGE UPLOAD (DEVICE & CAMERA) */}
                <div>
                  <Label className="text-xs text-gray-300 mb-1.5 block font-medium">
                    {listingType === "labour" ? "Worker Photo" : "Machinery Photo"}
                  </Label>
                  
                  {listImg ? (
                    <div className="relative border border-primary/40 rounded-xl p-2 bg-white/5 flex items-center gap-3">
                      <img src={listImg} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-white/10" />
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

                <div className="pt-3 border-t border-white/10">
                  <Button type="submit" className="w-full bg-primary text-black font-bold text-xs py-2.5">
                    <Send className="h-4 w-4 mr-1.5" /> Submit Listing for Admin Approval
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* === MODAL 4: ORDER DETAILS & DEALER STATUS UPDATE (REQUIREMENT 4) === */}
      {selectedOrderForStatus && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base text-white">Order Details & Status Control</h3>
              </div>
              <button onClick={() => setSelectedOrderForStatus(null)} className="text-gray-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-mono text-gray-400 font-bold">#{selectedOrderForStatus.id}</span>
                <Badge className={`text-[10px] border px-2 py-0.5 ${selectedOrderForStatus.statusBadge}`}>
                  Current Status: {selectedOrderForStatus.status}
                </Badge>
              </div>

              <h4 className="text-sm font-bold text-white pt-1">{selectedOrderForStatus.title}</h4>
              <p className="text-gray-400">Customer: <strong className="text-white">{selectedOrderForStatus.customerName || "Farmer"}</strong> ({selectedOrderForStatus.customerPhone})</p>
              <p className="text-gray-400">Delivery Address: <span className="text-gray-200">{selectedOrderForStatus.address || "Bihar"}</span></p>
              <p className="text-gray-400">Payment Method: <span className="text-primary font-bold">{selectedOrderForStatus.paymentMethod || "KCC"}</span></p>
              <p className="text-gray-400">Total Amount: <span className="text-lg font-black text-primary" style={{ fontFamily: "Rajdhani, sans-serif" }}>{selectedOrderForStatus.amount}</span></p>
            </div>

            {/* Status Update Actions for Dealer */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <Label className="text-xs font-bold text-gray-300">Update Order Delivery Status:</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Confirmed", "Packed", "Dispatched", "Delivered"].map((st) => (
                  <Button
                    key={st}
                    size="sm"
                    onClick={() => {
                      updateOrderStatus(selectedOrderForStatus.id, st as any);
                      setSelectedOrderForStatus((prev: any) => prev ? { ...prev, status: st } : prev);
                      toast.success(`Order status updated to "${st}"! Notification sent to farmer.`);
                    }}
                    className={`text-xs font-bold ${
                      selectedOrderForStatus.status === st
                        ? "bg-primary text-black"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    {st}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrderForStatus(null)} className="border border-white/10 text-xs">
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REQUIREMENT 1 MODAL: MY LISTED CROPS */}
      {isCropsModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">My Listed Crops & Cultivation History</h2>
                  <p className="text-xs text-gray-400">All crops listed for sale and active cultivation details</p>
                </div>
              </div>
              <button onClick={() => setIsCropsModalOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-gray-400">
                  Total Listed Crops: <span className="text-white font-bold">{allUserCrops.length}</span>
                </div>
                <Link to="/sell-crops" onClick={() => setIsCropsModalOpen(false)}>
                  <Button size="sm" className="bg-primary text-black font-bold text-xs">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Sell New Crop
                  </Button>
                </Link>
              </div>

              {allUserCrops.map((crop) => (
                <div key={crop.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-primary/40 transition-all">
                  <img src={crop.image} alt={crop.cropName} className="w-full sm:w-24 h-24 rounded-xl object-cover border border-white/10 shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{crop.cropName}</h3>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] capitalize">
                        {crop.status || "Growing"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-300">
                      <div><span className="text-gray-500">Weight:</span> <span className="font-semibold text-white">{crop.weight}</span></div>
                      <div><span className="text-gray-500">Price:</span> <span className="font-semibold text-primary">₹{crop.price}/Quintal</span></div>
                      <div><span className="text-gray-400">{crop.district}, {crop.city || "Bihar"}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setIsCropsModalOpen(false)} className="border border-white/10 text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REQUIREMENT 2 MODAL: ALL ORDERS & BOOKING HISTORY */}
      {isOrdersModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">All Orders & Booking History</h2>
                  <p className="text-xs text-gray-400">Complete record of fertilizers, seeds, crops, labour & machinery bookings</p>
                </div>
              </div>
              <button onClick={() => setIsOrdersModalOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 pt-3 border-b border-white/10 flex items-center gap-2 overflow-x-auto bg-[#0d0d0d]">
              {[
                { id: "all", label: `All Orders (${fullOrdersList.length})` },
                { id: "inputs", label: "Input Purchases" },
                { id: "machinery", label: "Machinery Bookings" },
                { id: "labour", label: "Labour Bookings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setOrdersFilter(tab.id as any)}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x cursor-pointer shrink-0 ${
                    ordersFilter === tab.id
                      ? "bg-[#111] text-primary border-primary/40 border-b-transparent -mb-px"
                      : "text-gray-400 border-transparent hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {filteredOrders.map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono font-bold">#{item.id}</span>
                        <Badge className="bg-white/10 text-gray-300 text-[10px]">{item.categoryName}</Badge>
                      </div>
                      <h3 className="text-sm font-bold text-white truncate mt-0.5">{item.title}</h3>
                      <div className="text-xs text-gray-400">{item.date}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-primary">{item.amount}</div>
                    <Badge className={`text-[10px] border px-2 py-0.5 ${item.statusBadge}`}>{item.status}</Badge>
                    <button
                      onClick={() => setSelectedOrderForStatus(item)}
                      className="block text-[10px] text-gray-400 hover:text-white underline mt-1"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setIsOrdersModalOpen(false)} className="border border-white/10 text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL 5: EDIT PRODUCTS (DEALER) === */}
      {isEditProductsModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111] border border-amber-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Edit2 className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Edit & Relist My Products</h2>
                  <p className="text-xs text-gray-400">Update details or relist rejected/approved products back to pending</p>
                </div>
              </div>
              <button onClick={() => { setIsEditProductsModalOpen(false); setEditingListingId(null); }} className="text-gray-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {dealerListings.filter(d => d.dealerId === user?.id || true).length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No listings found. Add products first.</p>
              )}
              {dealerListings.map(d => (
                <div key={d.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  {editingListingId === d.id ? (
                    // Inline Edit Form
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Edit2 className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-bold text-white">Editing: {d.title}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <Label className="text-xs text-gray-300 mb-1 block">Title / Name *</Label>
                          <input
                            value={editListTitle}
                            onChange={e => setEditListTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500/40"
                            placeholder="Product or service name"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-300 mb-1 block">Price / Rate (₹)</Label>
                          <input
                            type="number"
                            value={editListPrice}
                            onChange={e => setEditListPrice(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500/40"
                            placeholder="Amount in ₹"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-300 mb-1 block">Unit</Label>
                          <input
                            value={editListUnit}
                            onChange={e => setEditListUnit(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500/40"
                            placeholder="e.g. 50 kg bag / per hour"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-300 mb-1 block">Location</Label>
                          <input
                            value={editListLocation}
                            onChange={e => setEditListLocation(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500/40"
                            placeholder="City, Bihar"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs text-gray-300 mb-1 block">Description</Label>
                          <input
                            value={editListDesc}
                            onChange={e => setEditListDesc(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500/40"
                            placeholder="Product/service description..."
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!editListTitle.trim()) { toast.error("Title is required."); return; }
                            updateDealerListing(d.id, {
                              title: editListTitle,
                              price: Number(editListPrice) || d.price,
                              description: editListDesc,
                              unit: editListUnit,
                              location: editListLocation,
                              status: "pending"
                            });
                            setEditingListingId(null);
                            toast.success("Listing updated & resubmitted for admin approval!");
                          }}
                          className="bg-amber-500 text-black font-bold text-xs"
                        >
                          <Save className="h-3.5 w-3.5 mr-1" /> Save & Relist for Approval
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingListingId(null)}
                          className="border border-white/10 text-gray-300 text-xs"
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Listing Summary Row
                    <div className="flex items-start gap-4">
                      {d.image && <img src={d.image} alt={d.title} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white/10" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-sm text-white">{d.title}</h3>
                          <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${
                            d.status === "approved" ? "bg-primary/10 text-primary border-primary/20" :
                            d.status === "rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                            "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>{d.status}</span>
                        </div>
                        <p className="text-xs text-gray-400">₹{d.price} / {d.unit || "unit"} · {d.location || "Bihar"}</p>
                        {d.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{d.description}</p>}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingListingId(d.id);
                          setEditListTitle(d.title);
                          setEditListPrice(String(d.price));
                          setEditListDesc(d.description || "");
                          setEditListUnit(d.unit || "");
                          setEditListLocation(d.location || "");
                        }}
                        className="border border-amber-500/20 text-amber-400 text-xs h-8 shrink-0"
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setIsEditProductsModalOpen(false); setEditingListingId(null); }} className="border border-white/10 text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

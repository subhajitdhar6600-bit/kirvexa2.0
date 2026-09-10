import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp, ShoppingCart, Package, Tractor, Users, FlaskConical,
  MessageSquare, CloudSun, Wallet, ShieldCheck, CheckCircle2,
  AlertCircle, ArrowRight, Search, PhoneCall, Sparkles, CreditCard,
  Building2, UserCheck, ShieldAlert, FileText, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { toast } from "sonner";

export default function ServicesPage() {
  const navigate = useNavigate();
  const {
    user,
    isKccIssued,
    hasAppliedKcc,
    kccDetails,
    setIsKccAppModalOpen,
    checkKccPermission,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "farming" | "market" | "advisory">("all");

  const SERVICES = [
    {
      id: "mandi-bhav",
      title: "Live Mandi Bhav",
      hindi: "लाइव मंडी भाव",
      desc: "Real-time crop market prices from 500+ mandis across Bihar and North India with daily price trends.",
      icon: TrendingUp,
      href: "/mandi-bhav",
      category: "market",
      badge: "Real-time",
      requiresKcc: false,
      kccNote: "Open to all verified farmers",
      color: "emerald"
    },
    {
      id: "agri-market",
      title: "Agri Marketplace & Inputs",
      hindi: "कृषि इनपुट्स एवं बीज",
      desc: "Buy certified seeds, quality fertilizers, pesticides, and modern farming equipment with direct delivery.",
      icon: ShoppingCart,
      href: "/agri-market",
      category: "market",
      badge: "Verified Products",
      requiresKcc: true,
      kccNote: "KCC limit or verified profile required for checkout",
      color: "blue"
    },
    {
      id: "sell-crops",
      title: "Direct Crop Selling",
      hindi: "फसल बिक्री (0% कमीशन)",
      desc: "Sell your harvest directly to verified buyers, millers, and bulk traders without exploitative middlemen.",
      icon: Package,
      href: "/sell-crops",
      category: "market",
      badge: "Zero Commission",
      requiresKcc: true,
      kccNote: "Requires active KCC card to post crop listings",
      color: "amber"
    },
    {
      id: "machinery-booking",
      title: "Machinery Booking",
      hindi: "कृषि यंत्र एवं ट्रैक्टर बुकिंग",
      desc: "On-demand tractor, rotavator, power tiller, and combine harvester rental coordinated to your field.",
      icon: Tractor,
      href: "/machinery-booking",
      category: "farming",
      badge: "Instant Allocation",
      requiresKcc: true,
      kccNote: "Requires active KCC card for equipment dispatch",
      color: "orange"
    },
    {
      id: "labour-booking",
      title: "Labour Booking",
      hindi: "श्रमिक एवं मजदूर सेवा",
      desc: "Book verified, experienced agricultural labour crews for harvesting, sowing, weeding, and land preparation.",
      icon: Users,
      href: "/labour-booking",
      category: "farming",
      badge: "Verified Crews",
      requiresKcc: true,
      kccNote: "Requires active KCC card for labour allotment",
      color: "purple"
    },
    {
      id: "soil-testing",
      title: "Soil Testing Laboratory",
      hindi: "मिट्टी परीक्षण प्रयोगशाला",
      desc: "Certified lab testing for pH, N-P-K, organic carbon, and micronutrients with doorstep sample pickup & PDF report.",
      icon: FlaskConical,
      href: "/soil-testing",
      category: "farming",
      badge: "Certified Lab",
      requiresKcc: true,
      kccNote: "Requires active KCC card or farmer account",
      color: "teal"
    },
    {
      id: "expert-advice",
      title: "Agricultural Scientist Advisory",
      hindi: "कृषि विशेषज्ञ परामर्श",
      desc: "24/7 direct consultation with senior agricultural scientists for crop diseases, pest remedies, and fertilizer dosage.",
      icon: MessageSquare,
      href: "/expert-advice",
      category: "advisory",
      badge: "24/7 Free Call",
      requiresKcc: false,
      kccNote: "Available to all registered farmers",
      color: "sky"
    },
    {
      id: "weather",
      title: "Hyperlocal Weather Update",
      hindi: "मौसम पूर्वानुमान एवं अलर्ट",
      desc: "Real-time rain forecast, temperature alerts, wind speed, and tailored weekly agricultural advisories.",
      icon: CloudSun,
      href: "/weather",
      category: "advisory",
      badge: "Live Forecast",
      requiresKcc: false,
      kccNote: "Open to all verified farmers",
      color: "cyan"
    },
    {
      id: "wallet",
      title: "Kisan Credit & Digital Wallet",
      hindi: "किसान क्रेडिट एवं वॉलेट",
      desc: "Check available KCC balance, manage payment statements, download transaction receipts, and settle dues securely.",
      icon: Wallet,
      href: "/wallet",
      category: "farming",
      badge: "Govt. Credit Link",
      requiresKcc: true,
      kccNote: "Active KCC allotment required",
      color: "emerald"
    },
    ...(user?.role === "dealer" ? [
      {
        id: "dealer-hub",
        title: "Dealer Control Hub & POS",
        hindi: "डीलर कंट्रोल हब एवं बिलिंग",
        desc: "Manage product inventory, tractor fleet listings, farmer KCC card verification, and instant POS billing.",
        icon: ShieldCheck,
        href: "/dealer-dashboard",
        category: "market" as const,
        badge: "Dealer Exclusive",
        requiresKcc: false,
        kccNote: "Authorized Dealer Feature",
        color: "amber"
      }
    ] : [])
  ];

  const filteredServices = SERVICES.filter((s) => {
    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleServiceClick = (service: typeof SERVICES[0]) => {
    if (service.requiresKcc && !isKccIssued && user?.role !== "dealer") {
      const permitted = checkKccPermission(`use ${service.title}`);
      if (!permitted) return;
    }
    navigate(service.href);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      {/* Hero Header Banner */}
      <section className="relative bg-linear-to-b from-[#121812] to-[#0a0a0a] border-b border-white/10 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary font-semibold">Services Hub</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                  Krivexo Services Platform
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                All Agricultural <span className="text-primary">Services & Solutions</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1.5 leading-relaxed">
                Explore our full suite of digital farming services tailored for Bihar and North Indian agriculture. Every feature is synchronized with your profile status.
              </p>
            </div>

            {/* Profile Status Summary Badge Card */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 sm:p-5 w-full md:w-80 shrink-0 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Profile Status</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  user?.role === "dealer"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-primary/20 text-primary border-primary/30"
                }`}>
                  {user?.role === "dealer" ? "Agri Dealer" : "Registered Farmer"}
                </span>
              </div>

              <div className="text-sm font-bold text-white mb-1 truncate">
                {user?.name || "Registered User"}
              </div>
              <div className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Status: <strong className="text-white font-medium">{user?.verificationStatus || "Active Member"}</strong></span>
              </div>

              {/* KCC Status indicator */}
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">KCC Allocation:</span>
                  <span className={`font-bold ${isKccIssued ? "text-emerald-400" : hasAppliedKcc ? "text-amber-400" : "text-gray-400"}`}>
                    {isKccIssued ? "Active & Issued" : hasAppliedKcc ? "Under Review" : "Not Applied"}
                  </span>
                </div>
                {!isKccIssued && (
                  <Button
                    size="sm"
                    onClick={() => setIsKccAppModalOpen(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold px-3 py-1 rounded-xl cursor-pointer"
                  >
                    {hasAppliedKcc ? "Track" : "Apply KCC"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g., Mandi, Tractor, Soil Testing, Seeds)..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-primary/50"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              {[
                { id: "all", label: "All Services" },
                { id: "farming", label: "Field & Farm" },
                { id: "market", label: "Market & Trading" },
                { id: "advisory", label: "Advisory & Weather" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? "bg-primary text-black font-bold shadow-sm"
                      : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Main Services Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Informational Alert on KCC Requirements if not issued */}
        {!isKccIssued && user?.role !== "dealer" && (
          <div className="mb-8 bg-linear-to-r from-amber-950/60 via-amber-900/30 to-black border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-1 sm:mt-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-300">
                  Profile Status Notice: Full Features Require Kisan Credit Card
                </h3>
                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                  Information & advisory services (Mandi Bhav, Weather, Expert Chat) are fully accessible. To book machinery, sell crops, or purchase inputs, apply for your free KCC allotment.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsKccAppModalOpen(true)}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs py-2.5 px-5 rounded-xl shrink-0 cursor-pointer shadow-md border border-amber-300"
            >
              {hasAppliedKcc ? "Check Application Status →" : "Apply for Free KCC →"}
            </Button>
          </div>
        )}

        {/* Services List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            const isLocked = service.requiresKcc && !isKccIssued && user?.role !== "dealer";

            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="group relative flex flex-col justify-between rounded-2xl bg-[#111] border border-white/10 hover:border-primary/50 hover:bg-white/2 p-5 sm:p-6 transition-all duration-200 cursor-pointer hover:-translate-y-1 shadow-md hover:shadow-xl"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {service.badge}
                      </span>
                      {isLocked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          KCC Required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Titles */}
                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-primary transition-colors flex items-center gap-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    {service.title}
                  </h3>
                  <div className="text-xs text-primary/80 font-semibold mb-2">
                    {service.hindi}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 mb-4">
                    {service.desc}
                  </p>
                </div>

                {/* Bottom Access Status & Action CTA */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    {isLocked ? (
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> Apply KCC to Unlock
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Ready &amp; Active
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {isLocked ? "Unlock Service →" : "Open Service →"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-[#111] border border-white/10 rounded-2xl">
            <Search className="h-10 w-10 text-gray-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No services found</h3>
            <p className="text-xs text-gray-400 mb-4">Try searching with different keywords or reset filter.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="border-white/20 text-gray-300 hover:text-white"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Bottom Support & Helpline Strip */}
        <div className="mt-12 bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Need help choosing or booking a service?</h4>
              <p className="text-xs text-gray-400 mt-0.5">Our agricultural helpline team is available 24/7 to assist farmers across Bihar.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a href="tel:+918708742170" className="w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto bg-primary text-black font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                Call Helpline: +91 87087 42170
              </Button>
            </a>
            <Link to="/help-center" className="w-full sm:w-auto">
              <Button size="sm" variant="outline" className="w-full sm:w-auto border-white/20 text-gray-300 text-xs px-4 py-2.5 rounded-xl cursor-pointer">
                Help Center
              </Button>
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

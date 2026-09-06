import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Globe, LogIn, CreditCard, Bell, User, LogOut, CheckCheck, MapPin, Store, Wallet, Sprout, MoreVertical, ChevronRight, LayoutDashboard, ShoppingCart, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { useApp } from "@/context/AppContext.tsx";
import type { Language } from "@/lib/translations.ts";
import { toast } from "sonner";
import KccRequiredBanner from "@/components/KccRequiredBanner.tsx";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { 
    language, 
    setLanguage, 
    t, 
    isKccIssued,
    setIsKccAppModalOpen,
    hasAppliedKcc,
    user, 
    logoutUser, 
    notifications, 
    markAllNotificationsAsRead,
    markNotificationAsRead,
    deleteNotification,
    cart,
    mongoConnected,
    mongoDatabase,
  } = useApp();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const unreadCount = notifications.filter(n => !n.read).length;

  const LANG_OPTIONS: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "hi", label: "हिंदी", flag: "🇮🇳" },
    { code: "bn", label: "বাংলা", flag: "🇧🇩" },
  ];

  const SERVICES_LINKS = [
    { label: t.nav.mandiBhav, href: "/mandi-bhav" },
    { label: t.nav.buyInputs, href: "/agri-market" },
    { label: t.nav.sellCrops, href: "/sell-crops" },
    { label: t.nav.labourBooking, href: "/labour-booking" },
    { label: t.nav.expertAdvice, href: "/expert-advice" },
    { label: t.nav.weather, href: "/weather" },
    { label: t.nav.wallet, href: "/wallet" },
  ];

  const RESOURCES_LINKS = [
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.cropCalendar, href: "/crop-calendar" },
    { label: t.nav.govSchemes, href: "/government-schemes" },
    { label: t.nav.farmingTips, href: "/farming-tips" },
    { label: t.nav.helpCenter, href: "/help-center" },
  ];

  const NAV_LINKS = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.aboutUs, href: "/about" },
    { label: t.nav.services, children: SERVICES_LINKS },
    { label: t.nav.resources, children: RESOURCES_LINKS },
    { label: t.nav.contactUs, href: "/contact" },
  ];

  const handleLogout = () => {
    logoutUser();
    setShowUserMenu(false);
    toast.info("Logged out successfully.");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/krivexa-logo.jpg" 
              alt="KRIVEXA Logo" 
              className="h-10 w-10 object-cover rounded-xl border border-primary/40 group-hover:scale-105 transition-transform" 
            />
            <div>
              <span className="text-xl font-black tracking-wider text-white group-hover:text-primary transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                KRIVEXA
              </span>
              <span className="block text-[9px] text-gray-400 font-medium tracking-widest -mt-1 uppercase">
                Smart Agriculture
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-primary py-2 transition-colors cursor-pointer">
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2 text-xs text-gray-300 hover:text-primary hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    "text-sm transition-colors py-2",
                    location.pathname === link.href ? "text-primary font-semibold border-b-2 border-primary" : "text-gray-300 hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Section Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-300 hover:text-primary transition-colors cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span>{LANG_OPTIONS.find(l => l.code === language)?.flag}</span>
                <span>{LANG_OPTIONS.find(l => l.code === language)?.label}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-[#111] border border-white/10 rounded-xl shadow-xl py-1 z-50">
                  {LANG_OPTIONS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-colors ${language === l.code ? "text-primary bg-primary/5 font-semibold" : "text-gray-300 hover:text-primary hover:bg-white/5"}`}
                    >
                      <span>{l.flag}</span>{l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* LOGGED IN VIEW vs GUEST VIEW */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                
                {/* Cart Icon Button (Beside Notifications) */}
                <Link
                  to="/cart"
                  className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                  title="My Personal Cart"
                >
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setShowNotifMenu(!showNotifMenu); setShowUserMenu(false); }}
                    className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifMenu && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/10">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <Bell className="h-4 w-4 text-primary" /> Notifications
                          {unreadCount > 0 && (
                            <span className="bg-primary text-black text-[10px] font-bold px-1.5 rounded-full">{unreadCount}</span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCheck className="h-3 w-3" /> Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notification items */}
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-gray-500 text-xs">No notifications yet.</div>
                        ) : (
                          notifications.slice(0, 6).map((n) => (
                            <div
                              key={n.id}
                              className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5 border-b border-white/5 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}
                              onClick={() => {
                                markNotificationAsRead(n.id);
                                setShowNotifMenu(false);
                                navigate(n.link || "/notifications");
                              }}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-primary" : "bg-gray-600"}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-semibold leading-snug ${n.read ? "text-gray-300" : "text-white"}`}>{n.title}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                                <p className="text-[10px] text-gray-600 mt-1">{n.time}</p>
                                {n.pdfDataUrl && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markNotificationAsRead(n.id);
                                      import("@/lib/pdfGenerator").then(({ downloadPdf }) => {
                                        downloadPdf(n.pdfDataUrl!, n.pdfFileName || "receipt.pdf");
                                      });
                                    }}
                                    className="mt-2 w-full flex items-center justify-center gap-1 bg-primary/10 border border-primary/20 text-primary text-[10px] py-1 px-2 rounded-lg font-bold hover:bg-primary/20 hover:text-white transition-all cursor-pointer"
                                  >
                                    <FileDown className="h-3.5 w-3.5" /> Download PDF Receipt
                                  </button>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 cursor-pointer transition-all p-0.5 rounded shrink-0"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer link */}
                      {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-white/10">
                          <Link
                            to="/notifications"
                            onClick={() => setShowNotifMenu(false)}
                            className="text-xs text-primary hover:underline font-semibold flex items-center justify-center gap-1"
                          >
                            View All Notifications →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifMenu(false); }}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary text-black font-black flex items-center justify-center text-sm shadow-md">
                      {user.name ? user.name.charAt(0).toUpperCase() : (user.role === "farmer" ? "F" : "D")}
                    </div>
                    <div className="text-left text-xs">
                      <div className="font-bold text-white line-clamp-1">{user.name || "User"}</div>
                      <div className="text-[10px] text-primary capitalize font-medium">{user.role}</div>
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* User Header Info */}
                      <div className="pb-3 border-b border-white/10 mb-3">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          {user.role === "farmer" ? <Sprout className="h-4 w-4 text-primary" /> : <Store className="h-4 w-4 text-primary" />}
                          {user.name}
                        </div>
                        <div className="text-xs text-primary font-semibold mt-0.5 capitalize">
                          Verified {user.role} Account
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-gray-500 shrink-0" />
                          <span>{user.village ? `${user.village}, ` : ""}{user.district || "Patna"}, {user.state || "Bihar"}</span>
                        </div>
                      </div>

                      {/* User Links */}
                      <div className="space-y-1.5">
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black bg-primary hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <LayoutDashboard className="h-4 w-4 text-black" /> User Dashboard
                        </Link>
                        {!isKccIssued && (
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              setIsKccAppModalOpen(true);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-black text-black bg-amber-400 hover:bg-amber-300 transition-colors shadow-md cursor-pointer border border-amber-300"
                          >
                            <CreditCard className="h-4 w-4 text-black" /> Apply for KCC Now →
                          </button>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-colors"
                        >
                          <User className="h-4 w-4 text-primary" /> View User Profile
                        </Link>
                        <Link
                          to="/wallet"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Wallet className="h-4 w-4 text-primary" /> My Wallet & Payments
                        </Link>
                        <Link
                          to="/machinery-booking"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <CreditCard className="h-4 w-4 text-primary" /> My Machinery Bookings
                        </Link>
                      </div>

                      <div className="pt-3 border-t border-white/10 mt-3">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* GUEST VIEW */
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-primary">
                    <LogIn className="h-4 w-4 mr-1" /> {t.nav.login}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary text-black font-semibold hover:bg-primary/90">
                    {t.nav.register}
                  </Button>
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Right Controls: Cart + Notification Bell (beside 3 dots) + 3-Dots Menu */}
          <div className="flex lg:hidden items-center gap-2">
            
            {/* Functional Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
              aria-label="My Cart"
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Functional Notification Bell Beside 3 Dots */}
            {user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowNotifMenu(!showNotifMenu); setMenuOpen(false); }}
                  className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 top-full mt-2 w-76 sm:w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/10">
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" /> Notifications
                        {unreadCount > 0 && (
                          <span className="bg-primary text-black text-[10px] font-bold px-1.5 rounded-full">{unreadCount}</span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck className="h-3 w-3" /> Mark read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-gray-500 text-xs">No notifications yet.</div>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n.id}
                            className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5 border-b border-white/5 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              setShowNotifMenu(false);
                              navigate(n.link || "/notifications");
                            }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-primary" : "bg-gray-600"}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold leading-snug ${n.read ? "text-gray-300" : "text-white"}`}>{n.title}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                              <p className="text-[10px] text-gray-600 mt-1">{n.time}</p>
                              {n.pdfDataUrl && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markNotificationAsRead(n.id);
                                    import("@/lib/pdfGenerator").then(({ downloadPdf }) => {
                                      downloadPdf(n.pdfDataUrl!, n.pdfFileName || "receipt.pdf");
                                    });
                                  }}
                                  className="mt-2 w-full flex items-center justify-center gap-1 bg-primary/10 border border-primary/20 text-primary text-[10px] py-1 px-2 rounded-lg font-bold hover:bg-primary/20 hover:text-white transition-all cursor-pointer"
                                >
                                  <FileDown className="h-3.5 w-3.5" /> Download PDF Receipt
                                </button>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 cursor-pointer transition-all p-0.5 rounded shrink-0"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 py-3 border-t border-white/10">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifMenu(false)}
                        className="text-xs text-primary hover:underline font-semibold flex items-center justify-center gap-1"
                      >
                        View All Notifications →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3-Dots Mobile Menu Button */}
            <button
              className="text-gray-300 cursor-pointer p-2 rounded-xl bg-white/5 border border-white/10 hover:text-primary transition-colors"
              onClick={() => { setMenuOpen(!menuOpen); setShowNotifMenu(false); }}
              aria-label="3 Dots Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <MoreVertical className="h-5 w-5 text-primary" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Content (Triggered by 3 dots) */}
        {menuOpen && (
          <div className="lg:hidden bg-[#0e0e0e] border-t border-white/10 px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
            
            {/* Requirement 4: FIRST OPTION IN 3-DOTS MENU IS TO VIEW USER PROFILE */}
            {user ? (
              <div className="mb-3 space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 p-3 bg-linear-to-r from-primary/20 via-primary/10 to-transparent border border-primary/40 rounded-2xl font-bold text-white hover:border-primary transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary text-black font-black flex items-center justify-center text-base shadow-lg shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white flex items-center gap-1">
                      View User Profile <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="text-xs text-primary font-medium truncate">{user.name} ({user.phone || "Verified"})</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 p-3 bg-primary text-black rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-md group"
                >
                  <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-black shrink-0">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-black">User Dashboard</div>
                    <div className="text-xs text-black/70 font-medium">Access full farmer dashboard & services</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-black group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="mb-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/30 rounded-2xl font-bold text-white hover:border-primary transition-all"
                >
                  <User className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">Login / View Profile</div>
                    <div className="text-xs text-gray-400">Access your account & services</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary" />
                </Link>
              </div>
            )}

            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <div className="text-xs font-semibold text-gray-500 py-2 uppercase tracking-wider">{link.label}</div>
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      onClick={() => setMenuOpen(false)}
                      className="block pl-3 py-1.5 text-sm text-gray-300 hover:text-primary border-l border-white/10 hover:border-primary/40 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block py-2 text-sm transition-colors",
                    location.pathname === link.href ? "text-primary font-semibold" : "text-gray-300 hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Mobile Language Picker */}
            <div className="pt-3 border-t border-white/10">
              <div className="text-xs font-semibold text-gray-500 pb-2 uppercase tracking-wider">{t.nav.language}</div>
              <div className="flex gap-2">
                {LANG_OPTIONS.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${language === l.code ? "bg-primary/10 border-primary/40 text-primary" : "bg-white/5 border-white/10 text-gray-300"}`}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Logout Button if Logged In */}
            {user ? (
              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Logout from Session
                </button>
              </div>
            ) : (
              /* Guest Action Links in Mobile */
              <div className="flex gap-2 pt-3 border-t border-white/10">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1">
                  <Button variant="ghost" className="w-full text-gray-300">{t.nav.login}</Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1">
                  <Button className="w-full bg-primary text-black font-semibold">{t.nav.register}</Button>
                </Link>
              </div>
            )}

          </div>
        )}
      </div>
    </header>
    <KccRequiredBanner />
    </>
  );
}

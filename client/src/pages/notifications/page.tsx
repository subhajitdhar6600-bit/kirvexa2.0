import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell, Trash2, CheckCheck, Filter, X, ChevronRight,
  Sprout, Users, BookOpen, Wallet, CreditCard, TrendingUp, UserCheck,
  BellOff, ArrowLeft, FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { useApp } from "@/context/AppContext.tsx";
import type { UserNotification } from "@/context/AppContext.tsx";
import { cn } from "@/lib/utils.ts";
import { toast } from "sonner";

type FilterType = "all" | "unread" | "crops" | "labour" | "expert" | "wallet" | "kcc" | "account" | "mandi";

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  crops:   { label: "Sell Crops",     icon: Sprout,    color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
  labour:  { label: "Labour",         icon: Users,     color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20"  },
  expert:  { label: "Expert Advice",  icon: BookOpen,  color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  wallet:  { label: "Wallet",         icon: Wallet,    color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  kcc:     { label: "KCC",            icon: CreditCard,color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  mandi:   { label: "Mandi",          icon: TrendingUp,color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20"  },
  account: { label: "Account",        icon: UserCheck, color: "text-primary",    bg: "bg-primary/10 border-primary/20"    },
};

const TYPE_DOT: Record<string, string> = {
  success: "bg-green-400",
  warning: "bg-yellow-400",
  info:    "bg-blue-400",
};

const NAV_LINK: Record<string, string> = {
  crops:   "/sell-crops",
  labour:  "/labour-booking",
  expert:  "/expert-advice",
  wallet:  "/wallet",
  kcc:     "/dashboard",
  mandi:   "/mandi-bhav",
  account: "/",
};

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all",     label: "All" },
  { value: "unread",  label: "Unread" },
  { value: "crops",   label: "Crops" },
  { value: "labour",  label: "Labour" },
  { value: "expert",  label: "Expert" },
  { value: "wallet",  label: "Wallet" },
  { value: "kcc",     label: "KCC" },
  { value: "mandi",   label: "Mandi" },
  { value: "account", label: "Account" },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, clearAllNotifications } = useApp();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.category === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClickNotification = (n: UserNotification) => {
    markNotificationAsRead(n.id);
    const dest = n.link || (n.category ? NAV_LINK[n.category] : null) || "/";
    navigate(dest);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
    toast.success("Notification removed.");
  };

  const handleClearAll = () => {
    clearAllNotifications();
    toast.info("All notifications cleared.");
  };

  const getCatConfig = (n: UserNotification) =>
    n.category ? CATEGORY_CONFIG[n.category] : CATEGORY_CONFIG["account"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-36 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a]/95 to-transparent flex items-center px-6">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-primary cursor-pointer mr-1">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Bell className="h-6 w-6 text-primary" />
              <h1 className="text-2xl md:text-3xl font-black" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-primary text-black text-xs font-black px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm pl-10">All activity updates related to your Krivexa account.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Top Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          {/* Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-gray-400 mt-1.5 shrink-0" />
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                  filter === f.value
                    ? "bg-primary text-black border-primary"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={markAllNotificationsAsRead}
                className="text-xs border border-white/10 text-gray-300 hover:text-primary"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearAll}
                className="text-xs border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <BellOff className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold text-lg">No notifications found</p>
            <p className="text-gray-600 text-sm mt-1">
              {filter !== "all"
                ? "No notifications in this category yet."
                : "You're all caught up! New activity will appear here."}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-4 text-primary text-sm underline cursor-pointer hover:no-underline"
              >
                Show all notifications
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => {
              const cat = getCatConfig(n);
              const CatIcon = cat.icon;
              const dest = n.link || (n.category ? NAV_LINK[n.category] : "/");

              return (
                <div
                  key={n.id}
                  onClick={() => handleClickNotification(n)}
                  className={cn(
                    "group relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
                    n.read
                      ? "bg-[#0e0e0e] border-white/8 opacity-80 hover:opacity-100 hover:border-white/15"
                      : "bg-[#111] border-primary/20 hover:border-primary/40 shadow-sm shadow-primary/5"
                  )}
                >
                  {/* Unread dot */}
                  {!n.read && (
                    <span className={cn("absolute top-4 right-12 w-2 h-2 rounded-full animate-pulse", TYPE_DOT[n.type || "info"])} />
                  )}

                  {/* Category Icon */}
                  <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shrink-0", cat.bg)}>
                    <CatIcon className={cn("h-5 w-5", cat.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p className={cn("text-sm font-bold leading-snug", n.read ? "text-gray-300" : "text-white")}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-gray-500 shrink-0 mt-0.5">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{n.message}</p>

                    {/* Category + link badge */}
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      {n.category && (
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", cat.bg, cat.color)}>
                          {cat.label}
                        </span>
                      )}
                      <Link
                        to={dest}
                        onClick={(e) => { e.stopPropagation(); markNotificationAsRead(n.id); }}
                        className="text-[10px] text-primary/70 hover:text-primary flex items-center gap-0.5 font-medium transition-colors mr-2"
                      >
                        View details <ChevronRight className="h-3 w-3" />
                      </Link>

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
                          className="flex items-center gap-1 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-[10px] py-0.5 px-2 rounded-full font-bold transition-all cursor-pointer"
                        >
                          <FileDown className="h-3 w-3" /> Download Receipt (PDF)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, n.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer shrink-0"
                    title="Remove notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

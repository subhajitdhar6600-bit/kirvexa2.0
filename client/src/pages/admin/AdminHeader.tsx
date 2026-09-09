import { useState, useRef, useEffect } from "react";
import { Search, Bell, Sun, Moon, Menu, ExternalLink, Shield, User } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { api } from "@/services/api.ts";

interface AdminHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTabLabel: string;
  adminName?: string;
  adminRole?: string;
  onOpenSidebar?: () => void;
  onNavigateTab?: (tab: string) => void;
  adminTheme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export default function AdminHeader({
  searchQuery,
  setSearchQuery,
  activeTabLabel,
  adminName = "Admin User",
  adminRole = "Super Admin",
  onOpenSidebar,
  onNavigateTab,
  adminTheme = "light",
  onToggleTheme,
}: AdminHeaderProps) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, refreshNotifications } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync notifications on mount
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close notification popover on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (n: any) => {
    if (!n.read) {
      markNotificationAsRead(n.id);
      try {
        await api.markNotificationRead(n.id);
      } catch (err) {
        console.warn("Failed to mark notification as read:", err);
      }
    }
    if (n.link && onNavigateTab) {
      setShowNotifMenu(false);
      const tabName = n.link.replace("/admin/", "").replace(/^\//, "");
      if (tabName) onNavigateTab(tabName);
    }
  };

  const handleMarkAllRead = async () => {
    markAllNotificationsAsRead();
    try {
      await api.markAllNotificationsRead();
    } catch (err) {
      console.warn("Failed to mark all notifications read:", err);
    }
  };

  const isDark = adminTheme === "dark";

  return (
    <header className={`sticky top-0 z-40 border-b px-4 sm:px-6 h-16 flex items-center justify-between gap-4 transition-colors ${
      isDark ? "bg-[#141414] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900 shadow-xs"
    }`}>
      {/* Mobile Sidebar Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            className={`md:hidden p-2 rounded-xl border cursor-pointer ${
              isDark ? "bg-white/5 border-white/10 text-gray-300 hover:text-white" : "bg-gray-100 border-gray-200 text-gray-600 hover:text-black"
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything in admin panel..."
            className={`pl-9.5 pr-4 text-xs h-9.5 rounded-xl transition-all ${
              isDark
                ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-emerald-500"
                : "bg-gray-50/80 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500"
            }`}
          />
        </div>
      </div>

      {/* Admin Controls */}
      <div className="flex items-center gap-3">
        {/* Sun / Moon Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            isDark
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              : "bg-gray-50 border-gray-200 text-gray-600 hover:text-amber-500 hover:bg-amber-50"
          }`}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-gray-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              isDark ? "bg-white/5 border-white/10 text-gray-300 hover:text-white" : "bg-gray-50 border-gray-200 text-gray-600 hover:text-black"
            }`}
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-red-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse shadow-xs">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className={`absolute right-0 mt-2 w-80 sm:w-96 border rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150 ${
              isDark ? "bg-[#1a1a1a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm">System Notifications</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    unreadCount > 0
                      ? isDark ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-red-50 text-red-600 border border-red-200"
                      : isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"
                  }`}>
                    {unreadCount} unread
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-xs">
                    <div className="text-2xl mb-1.5">ð</div>
                    No notifications yet. You're all caught up!
                  </div>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        !n.read
                          ? isDark ? "bg-emerald-500/10 border-emerald-500/20 text-gray-200 hover:bg-emerald-500/15" : "bg-emerald-50/50 border-emerald-200 text-gray-800 hover:bg-emerald-50"
                          : isDark ? "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10" : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                          <span className="line-clamp-1">{n.title}</span>
                        </div>
                        {n.category && (
                          <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60 shrink-0">
                            {n.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] opacity-80 line-clamp-2 mt-1">{n.message}</p>
                      <span className="text-[9px] opacity-60 mt-1 block">
                        {n.time || "Recent"}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2.5 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-center -mx-4 -mb-4 rounded-b-2xl">
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    if (onNavigateTab) onNavigateTab("notifications_mgmt");
                  }}
                  className="w-full text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold py-1 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Go to Notifications Management <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold leading-tight flex items-center gap-1">
              {adminName} <Shield className="h-3 w-3 text-emerald-400" />
            </p>
            <p className="text-[10px] opacity-60">{adminRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}


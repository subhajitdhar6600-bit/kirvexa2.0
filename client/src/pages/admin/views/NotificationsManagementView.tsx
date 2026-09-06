import { useState, useEffect, useMemo } from "react";
import {
  Bell, Mail, Send, Calendar, Trash2, Filter, MoreVertical,
  CheckCircle2, Clock, ShieldCheck, ChevronRight, Headphones,
  Settings, Check, X, Search, Plus, AlertCircle, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext.tsx";
import { api } from "@/services/api.ts";

export default function NotificationsManagementView() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    refreshNotifications,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState("All Notifications");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [marketingNotif, setMarketingNotif] = useState(true);

  // Send Notification Modal State
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newCategory, setNewCategory] = useState<"system" | "orders" | "wallet" | "services" | "crops" | "account">("system");
  const [newType, setNewType] = useState<"info" | "success" | "warning">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refresh notifications on mount
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Compute live metrics
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = totalCount - unreadCount;

  const now = new Date();
  const thisWeekCount = notifications.filter((n) => {
    if (!n.createdAt) return true;
    const d = new Date(n.createdAt);
    return !isNaN(d.getTime()) && now.getTime() - d.getTime() <= 7 * 24 * 3600 * 1000;
  }).length;

  const thisMonthCount = notifications.filter((n) => {
    if (!n.createdAt) return true;
    const d = new Date(n.createdAt);
    return !isNaN(d.getTime()) && now.getTime() - d.getTime() <= 30 * 24 * 3600 * 1000;
  }).length;

  // Category stats for Summary Donut & bars
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
      System: 0,
      Finance: 0,
      Orders: 0,
      Services: 0,
      Promotions: 0,
    };

    notifications.forEach((n) => {
      const cat = (n.category || "").toLowerCase();
      if (cat === "orders") counts.Orders++;
      else if (cat === "wallet" || cat === "finance") counts.Finance++;
      else if (cat === "services" || cat === "machinery" || cat === "labour" || cat === "kcc") counts.Services++;
      else if (cat === "crops" || cat === "mandi" || cat === "promotion") counts.Promotions++;
      else counts.System++;
    });

    return counts;
  }, [notifications]);

  // Filter notifications based on tab and search
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = n.title?.toLowerCase().includes(q);
        const matchesMsg = n.message?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg) return false;
      }

      if (activeFilter === "All Notifications") return true;
      if (activeFilter === "Unread") return !n.read;
      const cat = (n.category || "").toLowerCase();
      if (activeFilter === "System") return cat === "account" || cat === "system" || cat === "soil" || !cat;
      if (activeFilter === "Finance") return cat === "wallet" || cat === "finance";
      if (activeFilter === "Orders") return cat === "orders";
      if (activeFilter === "Services") return cat === "services" || cat === "machinery" || cat === "labour" || cat === "kcc";
      if (activeFilter === "Promotions") return cat === "crops" || cat === "mandi" || cat === "promotion";
      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  // Group notifications into Today, Yesterday, and Older
  const groupedNotifications = useMemo(() => {
    const today: typeof notifications = [];
    const yesterday: typeof notifications = [];
    const older: typeof notifications = [];

    filteredNotifications.forEach((n) => {
      if (!n.createdAt) {
        today.push(n);
        return;
      }
      const d = new Date(n.createdAt);
      if (isNaN(d.getTime())) {
        today.push(n);
        return;
      }
      const isToday = d.toDateString() === now.toDateString();
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      const isYesterday = d.toDateString() === y.toDateString();

      if (isToday) today.push(n);
      else if (isYesterday) yesterday.push(n);
      else older.push(n);
    });

    const groups = [];
    if (today.length > 0) groups.push({ title: "Today", items: today });
    if (yesterday.length > 0) groups.push({ title: "Yesterday", items: yesterday });
    if (older.length > 0) groups.push({ title: "Earlier", items: older });
    return groups;
  }, [filteredNotifications, now]);

  // Notification Icon & Colors Helper
  const getCatStyle = (cat?: string) => {
    const c = (cat || "").toLowerCase();
    if (c === "orders") {
      return { icon: "📦", iconBg: "bg-amber-50 text-amber-600", label: "Orders", badgeColor: "bg-amber-50 text-amber-700 border-amber-200" };
    }
    if (c === "wallet" || c === "finance") {
      return { icon: "💳", iconBg: "bg-blue-50 text-blue-600", label: "Finance", badgeColor: "bg-blue-50 text-blue-700 border-blue-200" };
    }
    if (c === "services" || c === "machinery" || c === "labour" || c === "kcc") {
      return { icon: "🚜", iconBg: "bg-purple-50 text-purple-600", label: "Services", badgeColor: "bg-purple-50 text-purple-700 border-purple-200" };
    }
    if (c === "crops" || c === "mandi" || c === "promotion") {
      return { icon: "🌾", iconBg: "bg-emerald-50 text-emerald-600", label: "Promotions", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }
    return { icon: "🛡️", iconBg: "bg-teal-50 text-teal-600", label: "System", badgeColor: "bg-teal-50 text-teal-700 border-teal-200" };
  };

  // Actions
  const handleMarkAllRead = async () => {
    markAllNotificationsAsRead();
    try {
      await api.markAllNotificationsRead();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark notifications read");
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    clearAllNotifications();
    try {
      await api.clearAllNotifications();
      toast.info("All notifications cleared");
    } catch (err) {
      toast.error("Failed to clear notifications");
    }
  };

  const handleItemClick = async (n: any) => {
    if (!n.read) {
      markNotificationAsRead(n.id);
      try {
        await api.markNotificationRead(n.id);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
    try {
      await api.deleteNotification(id);
      toast.success("Notification removed");
    } catch (err) {
      toast.error("Failed to remove notification");
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) {
      toast.error("Please provide both title and message");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        title: newTitle.trim(),
        message: newMessage.trim(),
        category: newCategory,
        type: newType,
        time: "Just now",
        read: false,
        isRead: false,
        userId: "broadcast",
      };
      await api.addNotification(payload);
      addNotification(newTitle.trim(), newMessage.trim(), newType, "", newCategory);
      toast.success("Notification broadcasted successfully!");
      setNewTitle("");
      setNewMessage("");
      setIsSendModalOpen(false);
      refreshNotifications();
    } catch (err) {
      toast.error("Failed to send notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Notifications Management
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Stay updated with all important alerts, orders, and user activities</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSendModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Broadcast Notification</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
            <span>Dashboard</span>
            <span>›</span>
            <span className="text-emerald-600 font-semibold">Notifications</span>
          </div>
        </div>
      </div>

      {/* 5 Dynamic KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500">Total Notifications</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">{totalCount}</p>
            <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Live platform alerts</p>
          </div>
        </div>

        {/* Unread */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            unreadCount > 0 ? "bg-red-50 text-red-600" : "bg-purple-50 text-purple-600"
          }`}>
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500">Unread</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">{unreadCount}</p>
            <p className={`text-[9px] font-semibold mt-0.5 ${unreadCount > 0 ? "text-red-500" : "text-gray-400"}`}>
              {unreadCount > 0 ? "Requires review" : "All caught up"}
            </p>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500">This Week</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">{thisWeekCount}</p>
            <p className="text-[9px] text-blue-600 font-semibold mt-0.5">Past 7 days activity</p>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500">This Month</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">{thisMonthCount}</p>
            <p className="text-[9px] text-amber-600 font-semibold mt-0.5">Past 30 days total</p>
          </div>
        </div>

        {/* Archived / Read */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500">Read / Archived</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">{readCount}</p>
            <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Processed alerts</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { label: "All Notifications", count: totalCount },
            { label: "Unread", count: unreadCount },
            { label: "System", count: categoryBreakdown.System },
            { label: "Finance", count: categoryBreakdown.Finance },
            { label: "Orders", count: categoryBreakdown.Orders },
            { label: "Services", count: categoryBreakdown.Services },
            { label: "Promotions", count: categoryBreakdown.Promotions },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveFilter(tab.label)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === tab.label
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === tab.label ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full pl-8.5 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Notification Timeline (2 cols) + Right Column (1 col) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Timeline Column */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-5">
            {groupedNotifications.length === 0 ? (
              <div className="py-16 text-center text-gray-400 space-y-2">
                <div className="text-3xl">📭</div>
                <p className="text-sm font-bold text-gray-700">No notifications found</p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  {searchQuery ? `No alerts match "${searchQuery}".` : "There are currently no notifications matching this category."}
                </p>
                {activeFilter !== "All Notifications" && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter("All Notifications")}
                    className="mt-2 text-xs text-emerald-600 font-semibold hover:underline"
                  >
                    View All Notifications
                  </button>
                )}
              </div>
            ) : (
              groupedNotifications.map((grp) => (
                <div key={grp.title} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-800 tracking-wide">{grp.title}</h3>
                    <span className="text-[10px] text-gray-400">{grp.items.length} items</span>
                  </div>

                  <div className="space-y-1 divide-y divide-gray-50">
                    {grp.items.map((item) => {
                      const style = getCatStyle(item.category);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`flex items-start justify-between py-3 px-2.5 rounded-xl transition-all cursor-pointer group ${
                            !item.read
                              ? "bg-emerald-50/40 hover:bg-emerald-50/70 border border-emerald-100/60"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            {/* Unread indicator */}
                            <div className="pt-2">
                              {!item.read ? (
                                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" title="Unread" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-200 shrink-0" title="Read" />
                              )}
                            </div>

                            {/* Category Icon */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${style.iconBg}`}>
                              {style.icon}
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className={`text-xs ${!item.read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                                  {item.title}
                                </p>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{item.message}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.time || "Recent"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Badges & Actions */}
                          <div className="flex items-center gap-2 shrink-0 pl-3">
                            <span className={`hidden sm:inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${style.badgeColor}`}>
                              {style.label}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => handleDeleteItem(e, item.id)}
                              className="p-1.5 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete notification"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

            {/* Total count footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
              <span>Showing {filteredNotifications.length} of {totalCount} total notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Notification Summary */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-800">Notification Categories</h3>

            <div className="space-y-2.5 text-xs">
              {[
                { label: "System", count: categoryBreakdown.System, color: "bg-emerald-500" },
                { label: "Finance", count: categoryBreakdown.Finance, color: "bg-blue-500" },
                { label: "Orders", count: categoryBreakdown.Orders, color: "bg-amber-500" },
                { label: "Services", count: categoryBreakdown.Services, color: "bg-purple-500" },
                { label: "Promotions", count: categoryBreakdown.Promotions, color: "bg-pink-500" },
              ].map((cat) => {
                const pct = totalCount > 0 ? Math.round((cat.count / totalCount) * 100) : 0;
                return (
                  <div key={cat.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-gray-700">{cat.label}</span>
                      <span className="text-gray-400">{cat.count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${cat.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-gray-800 mb-2.5">Quick Actions</h3>

            <button
              type="button"
              onClick={handleMarkAllRead}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Mark all as read</p>
                  <p className="text-[10px] text-gray-400">Clear all unread notification badges</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600" />
            </button>

            <button
              type="button"
              onClick={() => setIsSendModalOpen(true)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Send className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Broadcast Alert</p>
                  <p className="text-[10px] text-gray-400">Send an announcement or alert</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600" />
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-red-50/50 border border-gray-100 transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 text-red-600">Clear all notifications</p>
                  <p className="text-[10px] text-gray-400">Remove all alerts permanently</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-red-600" />
            </button>
          </div>

          {/* Preferences Settings */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-800">Delivery Channels</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-[11px]">Email Notifications</p>
                  <p className="text-[10px] text-gray-400">Instant email digests</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotif(!emailNotif)}
                  className={`w-8 h-4.5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    emailNotif ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${emailNotif ? "translate-x-3.5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-[11px]">In-App Push</p>
                  <p className="text-[10px] text-gray-400">Browser push alerts</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPushNotif(!pushNotif)}
                  className={`w-8 h-4.5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    pushNotif ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${pushNotif ? "translate-x-3.5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-[11px]">SMS Notifications</p>
                  <p className="text-[10px] text-gray-400">Urgent SMS gateways</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsNotif(!smsNotif)}
                  className={`w-8 h-4.5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    smsNotif ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${smsNotif ? "translate-x-3.5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Notification Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Broadcast Notification</h3>
                  <p className="text-[10px] text-gray-400">Send an instant alert to users</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSendModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Notification Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Subsidy Scheme 2026 Announced"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs text-gray-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Message Content *</label>
                <textarea
                  required
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Detailed notification message for farmers and dealers..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs text-gray-800 outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs text-gray-800 outline-none focus:border-emerald-500"
                  >
                    <option value="system">System</option>
                    <option value="orders">Orders</option>
                    <option value="wallet">Finance / Wallet</option>
                    <option value="services">Services / Machinery</option>
                    <option value="crops">Crops / Mandi</option>
                    <option value="account">Account</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Severity / Type</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs text-gray-800 outline-none focus:border-emerald-500"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning / Alert</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? "Sending..." : "Send Alert"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

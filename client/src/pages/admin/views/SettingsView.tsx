import { useState, useEffect, useRef } from "react";
import {
  Settings, User, ShieldCheck, Bell, CreditCard, Mail,
  MessageSquare, Smartphone, FileCheck, Percent, Sliders,
  Wrench, Database, Cookie, Globe, Activity, Save, Upload,
  X, Check, AlertCircle, RefreshCw, Lock, ExternalLink, Download
} from "lucide-react";
import { toast } from "sonner";
import type { AdminSettings } from "../types.ts";
import { formatDate } from "@/lib/dateUtils.ts";

interface SettingsViewProps {
  settings?: AdminSettings;
  setSettings?: (s: AdminSettings) => void;
}

const DEFAULT_SETTINGS_STATE = {
  // General - Site Info
  siteName: "Krivexo",
  tagline: "Kisan ka Smart Saathi",
  siteEmail: "support@krivexo.com",
  sitePhone: "+91 91234 56789",
  defaultCountry: "India",
  timezone: "Asia/Kolkata (GMT +05:30)",
  dateFormat: "DD MMM YYYY (31 May 2025)",
  timeFormat: "12 Hours (02:30 PM)",
  logoUrl: "",
  faviconUrl: "",

  // General - Contact Details
  contactEmail: "contact@krivexo.com",
  helplinePhone: "1800-123-4567",
  emergencyPhone: "+91 98765 43210",
  officeAddress: "Main Road, Near Gandhi Maidan, Patna, Bihar - 800001",
  state: "Bihar",
  pincode: "800001",

  // General - Social Links
  facebookUrl: "https://facebook.com/krivexo",
  twitterUrl: "https://x.com/krivexo",
  instagramUrl: "https://instagram.com/krivexo",
  linkedinUrl: "https://linkedin.com/company/krivexo",
  youtubeUrl: "https://youtube.com/@krivexo",
  whatsappPhone: "+91 91234 56789",

  // General - Other Settings
  currencyCode: "INR (₹)",
  copyrightText: "© 2026 Krivexo Agri Solutions Pvt. Ltd. All rights reserved.",
  footerDescription: "Empowering farmers with smart agriculture tools, mandi rates, and direct market access.",
  itemsPerPage: "25",

  // Profile Settings
  adminName: "Aditya Saha",
  adminEmail: "aditya@krivexo.com",
  adminPhone: "+91 89065 54321",
  adminRole: "Super Admin",
  adminBio: "Lead Administrator managing Krivexo platform operations and user permissions.",
  avatarUrl: "",

  // Security Settings
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  twoFactorAuth: true,
  sessionTimeoutMins: "60",
  whitelistedIps: "192.168.1.1, 103.45.12.89",
  forcePasswordExpiry: false,

  // Notification Settings
  orderNotifs: true,
  kycNotifs: true,
  requestNotifs: true,
  dailyDigest: false,
  loginAlerts: true,

  // Payment Settings
  razorpayKeyId: "rzp_live_9832749823",
  razorpaySecret: "••••••••••••••••",
  upiVpa: "krivexo@upi",
  commissionRatePct: "5",
  minPayoutThreshold: "500",

  // Email Settings (SMTP)
  smtpHost: "smtp.gmail.com",
  smtpPort: "587",
  smtpUser: "notifications@krivexo.com",
  smtpPassword: "••••••••••••",
  smtpEncryption: "TLS",
  smtpFromName: "Krivexo System",

  // SMS Settings
  smsProvider: "Fast2SMS",
  smsApiKey: "f2s_live_897491827491",
  smsSenderId: "KRIVEX",
  otpExpiryMins: "10",

  // App Settings
  appVersion: "2.5.0",
  forceAppUpdate: false,
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.krivexo.app",
  appStoreUrl: "https://apps.apple.com/app/krivexo/id123456789",
  maintenanceBannerMsg: "Scheduled server maintenance will occur tonight from 2 AM to 3 AM.",

  // KYC Settings
  autoApproveFarmers: false,
  autoApproveDealers: false,
  mandatoryAadhaar: true,
  mandatoryGst: true,
  maxFileUploadMb: "5",

  // GST Settings
  defaultGstPct: "5",
  platformGstin: "10AAAAA0000A1Z5",
  gstStateCode: "10 (Bihar)",
  priceDisplayMode: "Tax Inclusive",

  // Feature Settings
  enableMandiBhav: true,
  enableAdvisory: true,
  enableKisanCard: true,
  enableBookings: true,
  enableWallet: true,

  // Maintenance Mode
  maintenanceMode: false,
  maintenanceMessage: "Krivexo platform is under scheduled maintenance. We will be back shortly!",

  // Cookie Settings
  enableCookieBanner: true,
  cookieExpiryDays: "30",
  privacyPolicyUrl: "https://krivexo.com/privacy",

  // Language Settings
  defaultLanguage: "Hindi (हिंदी)",

  // Logs & Activity
  logLevel: "Info",
  logRetentionDays: "60",
};

export default function SettingsView({ settings, setSettings }: SettingsViewProps) {
  const [activeMenu, setActiveMenu] = useState("General Settings");
  const [activeTab, setActiveTab] = useState("Site Information");

  // Main state combining all settings
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("admin_system_settings");
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS_STATE, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse saved admin settings", e);
      }
    }
    return DEFAULT_SETTINGS_STATE;
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const updateField = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("admin_system_settings", JSON.stringify(formData));
    if (setSettings) {
      setSettings({
        platformName: formData.siteName,
        supportEmail: formData.siteEmail,
        phone: formData.sitePhone,
        address: formData.officeAddress,
        timezone: formData.timezone,
        autoApproveFarmers: formData.autoApproveFarmers,
        autoApproveDealers: formData.autoApproveDealers,
        commissionRatePct: Number(formData.commissionRatePct) || 5,
        maintenanceMode: formData.maintenanceMode,
      });
    }
    toast.success("System settings updated & saved successfully!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateField("logoUrl", reader.result as string);
        toast.success("Site logo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateField("faviconUrl", reader.result as string);
        toast.success("Favicon updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateField("avatarUrl", reader.result as string);
        toast.success("Admin avatar updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearCache = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: "Clearing system cache & temporary data...",
        success: () => {
          sessionStorage.clear();
          return "System cache cleared successfully!";
        },
        error: "Failed to clear cache",
      }
    );
  };

  const handleBackup = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
          const downloadAnchor = document.createElement("a");
          downloadAnchor.setAttribute("href", dataStr);
          downloadAnchor.setAttribute("download", `krivexo_settings_backup_${new Date().toISOString().split("T")[0]}.json`);
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          downloadAnchor.remove();
          resolve(true);
        }, 800);
      }),
      {
        loading: "Creating database & settings backup...",
        success: "Backup created and download started!",
        error: "Failed to create backup",
      }
    );
  };

  const MENU_ITEMS = [
    { label: "General Settings", icon: Settings },
    { label: "Profile Settings", icon: User },
    { label: "Security Settings", icon: ShieldCheck },
    { label: "Notification Settings", icon: Bell },
    { label: "Payment Settings", icon: CreditCard },
    { label: "Email Settings", icon: Mail },
    { label: "SMS Settings", icon: MessageSquare },
    { label: "App Settings", icon: Smartphone },
    { label: "KYC Settings", icon: FileCheck },
    { label: "GST Settings", icon: Percent },
    { label: "Feature Settings", icon: Sliders },
    { label: "Maintenance Mode", icon: Wrench },
    { label: "Backup & Restore", icon: Database },
    { label: "Cookie Settings", icon: Cookie },
    { label: "Language Settings", icon: Globe },
    { label: "Logs & Activity", icon: Activity },
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* Hidden File Inputs */}
      <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
      <input type="file" ref={faviconInputRef} onChange={handleFaviconUpload} accept="image/*" className="hidden" />
      <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">System Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all system configurations and preferences</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>Dashboard</span>
          <span>›</span>
          <span className="text-emerald-600 font-semibold">System Settings</span>
        </div>
      </div>

      {/* Top 5 Quick Config Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "General Settings", desc: "Basic site information and configurations", icon: Settings, color: "text-emerald-600 bg-emerald-50", menu: "General Settings" },
          { label: "Profile Settings", desc: "Manage admin profile and preferences", icon: User, color: "text-purple-600 bg-purple-50", menu: "Profile Settings" },
          { label: "Security Settings", desc: "Password, 2FA and security options", icon: ShieldCheck, color: "text-amber-600 bg-amber-50", menu: "Security Settings" },
          { label: "Notification Settings", desc: "Email, SMS and push notifications", icon: Bell, color: "text-blue-600 bg-blue-50", menu: "Notification Settings" },
          { label: "Payment Settings", desc: "Payment gateways and charges", icon: CreditCard, color: "text-rose-600 bg-rose-50", menu: "Payment Settings" },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              setActiveMenu(item.menu);
              if (item.menu === "General Settings") setActiveTab("Site Information");
            }}
            className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer group ${
              activeMenu === item.menu ? "border-emerald-500 shadow-md ring-1 ring-emerald-500/20" : "border-gray-100 shadow-sm hover:border-emerald-300"
            }`}
          >
            <div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-gray-800">{item.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug line-clamp-2">{item.desc}</p>
            </div>
            <span className="text-[10.5px] font-bold text-emerald-700 mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Configure →
            </span>
          </div>
        ))}
      </div>

      {/* Main Container: Settings Menu + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Settings Menu */}
        <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm space-y-1 h-fit">
          <p className="text-xs font-bold text-gray-800 px-2 py-1 mb-1">Settings Menu</p>
          {MENU_ITEMS.map((item) => {
            const isActive = activeMenu === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setActiveMenu(item.label);
                  if (item.label === "General Settings") setActiveTab("Site Information");
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Form Card (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
          {/* Header with Save Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-800">{activeMenu}</h2>
              <p className="text-[11px] text-gray-500">Configure preferences and system options for {activeMenu}</p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer w-fit"
            >
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </button>
          </div>

          {/* Sub Tabs ONLY for General Settings */}
          {activeMenu === "General Settings" && (
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2 overflow-x-auto">
              {["Site Information", "Contact Details", "Social Links", "Other Settings"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Dynamic Content based on Active Menu & Active Tab */}

          {/* 1. GENERAL SETTINGS */}
          {activeMenu === "General Settings" && (
            <>
              {activeTab === "Site Information" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Site Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.siteName}
                        onChange={(e) => updateField("siteName", e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => updateField("tagline", e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Site Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.siteEmail}
                        onChange={(e) => updateField("siteEmail", e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Site Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.sitePhone}
                        onChange={(e) => updateField("sitePhone", e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Default Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.defaultCountry}
                        onChange={(e) => updateField("defaultCountry", e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                      >
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Timezone <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => updateField("timezone", e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                      >
                        <option>Asia/Kolkata (GMT +05:30)</option>
                        <option>UTC (GMT +00:00)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Site Logo */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                        Site Logo
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative p-3 rounded-xl border border-gray-200 bg-white flex items-center justify-center w-40 h-18 overflow-hidden">
                          {formData.logoUrl ? (
                            <>
                              <img src={formData.logoUrl} alt="Logo" className="max-h-14 max-w-full object-contain" />
                              <button
                                type="button"
                                onClick={() => {
                                  updateField("logoUrl", "");
                                  toast.info("Logo removed");
                                }}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 flex items-center justify-center border border-gray-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <div className="text-center">
                              <div className="flex items-center gap-1 text-emerald-700 font-black text-sm">
                                <span className="text-lg">🌿</span> {formData.siteName}
                              </div>
                              <p className="text-[8px] text-gray-400">{formData.tagline}</p>
                            </div>
                          )}
                        </div>

                        <div
                          onClick={() => logoInputRef.current?.click()}
                          className="flex-1 h-18 rounded-xl border border-dashed border-gray-200 hover:border-emerald-400 flex flex-col items-center justify-center p-2 text-center cursor-pointer bg-gray-50/50 hover:bg-emerald-50/20 transition-colors"
                        >
                          <Upload className="h-4 w-4 text-gray-400 mb-1" />
                          <span className="text-[10px] font-bold text-gray-700">Upload New Logo</span>
                          <span className="text-[8.5px] text-gray-400">PNG, JPG (Max. 2MB)</span>
                        </div>
                      </div>
                    </div>

                    {/* Site Favicon */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                        Site Favicon
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative p-2 rounded-xl border border-gray-200 bg-white flex items-center justify-center w-18 h-18 overflow-hidden">
                          {formData.faviconUrl ? (
                            <>
                              <img src={formData.faviconUrl} alt="Favicon" className="w-10 h-10 object-contain" />
                              <button
                                type="button"
                                onClick={() => {
                                  updateField("faviconUrl", "");
                                  toast.info("Favicon removed");
                                }}
                                className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 flex items-center justify-center border border-gray-200"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-2xl">🌱</span>
                          )}
                        </div>

                        <div
                          onClick={() => faviconInputRef.current?.click()}
                          className="flex-1 h-18 rounded-xl border border-dashed border-gray-200 hover:border-emerald-400 flex flex-col items-center justify-center p-2 text-center cursor-pointer bg-gray-50/50 hover:bg-emerald-50/20 transition-colors"
                        >
                          <Upload className="h-4 w-4 text-gray-400 mb-1" />
                          <span className="text-[10px] font-bold text-gray-700">Upload Favicon</span>
                          <span className="text-[8.5px] text-gray-400">ICO, PNG (Max. 1MB)</span>
                        </div>
                      </div>
                    </div>

                    {/* Date Format */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Date Format
                      </label>
                      <select
                        value={formData.dateFormat}
                        onChange={(e) => updateField("dateFormat", e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                      >
                        <option>DD MMM YYYY (31 May 2025)</option>
                        <option>YYYY-MM-DD</option>
                        <option>DD/MM/YYYY</option>
                      </select>
                    </div>

                    {/* Time Format */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Time Format
                      </label>
                      <select
                        value={formData.timeFormat}
                        onChange={(e) => updateField("timeFormat", e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                      >
                        <option>12 Hours (02:30 PM)</option>
                        <option>24 Hours (14:30)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Contact Details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateField("contactEmail", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Toll-Free Helpline</label>
                    <input
                      type="text"
                      value={formData.helplinePhone}
                      onChange={(e) => updateField("helplinePhone", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Emergency Support Phone</label>
                    <input
                      type="text"
                      value={formData.emergencyPhone}
                      onChange={(e) => updateField("emergencyPhone", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">State</label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                    >
                      <option>Bihar</option>
                      <option>Uttar Pradesh</option>
                      <option>Madhya Pradesh</option>
                      <option>Punjab</option>
                      <option>Haryana</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => updateField("pincode", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Physical Office Address</label>
                    <textarea
                      rows={3}
                      value={formData.officeAddress}
                      onChange={(e) => updateField("officeAddress", e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                </div>
              )}

              {activeTab === "Social Links" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Facebook URL</label>
                    <input
                      type="text"
                      value={formData.facebookUrl}
                      onChange={(e) => updateField("facebookUrl", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Twitter / X URL</label>
                    <input
                      type="text"
                      value={formData.twitterUrl}
                      onChange={(e) => updateField("twitterUrl", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={formData.instagramUrl}
                      onChange={(e) => updateField("instagramUrl", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={formData.linkedinUrl}
                      onChange={(e) => updateField("linkedinUrl", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">YouTube Channel URL</label>
                    <input
                      type="text"
                      value={formData.youtubeUrl}
                      onChange={(e) => updateField("youtubeUrl", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">WhatsApp Helpline Number</label>
                    <input
                      type="text"
                      value={formData.whatsappPhone}
                      onChange={(e) => updateField("whatsappPhone", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                </div>
              )}

              {activeTab === "Other Settings" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Currency Code & Symbol</label>
                    <input
                      type="text"
                      value={formData.currencyCode}
                      onChange={(e) => updateField("currencyCode", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Table Items Per Page</label>
                    <select
                      value={formData.itemsPerPage}
                      onChange={(e) => updateField("itemsPerPage", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                    >
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Copyright Notice Text</label>
                    <input
                      type="text"
                      value={formData.copyrightText}
                      onChange={(e) => updateField("copyrightText", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Footer Description</label>
                    <textarea
                      rows={2}
                      value={formData.footerDescription}
                      onChange={(e) => updateField("footerDescription", e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* 2. PROFILE SETTINGS */}
          {activeMenu === "Profile Settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="md:col-span-2 flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="relative w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center overflow-hidden">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-emerald-800">{formData.adminName?.[0] || "A"}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{formData.adminName}</h3>
                  <p className="text-[11px] text-emerald-700 font-semibold">{formData.adminRole}</p>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="mt-1.5 text-[10.5px] font-bold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    Change Profile Photo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => updateField("adminName", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => updateField("adminEmail", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.adminPhone}
                  onChange={(e) => updateField("adminPhone", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Designation / Role</label>
                <input
                  type="text"
                  disabled
                  value={formData.adminRole}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  value={formData.adminBio}
                  onChange={(e) => updateField("adminBio", e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
            </div>
          )}

          {/* 3. SECURITY SETTINGS */}
          {activeMenu === "Security Settings" && (
            <div className="space-y-5 text-xs">
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800">
                  Ensure strong passwords and enable Two-Factor Authentication to keep your admin account protected against unauthorized access.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={(e) => updateField("currentPassword", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) => updateField("newPassword", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">Two-Factor Authentication (2FA)</p>
                    <p className="text-[10px] text-gray-500">Require OTP verification upon admin login</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("twoFactorAuth", !formData.twoFactorAuth)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                      formData.twoFactorAuth ? "bg-emerald-600" : "bg-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.twoFactorAuth ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">Force Password Expiry (Every 90 Days)</p>
                    <p className="text-[10px] text-gray-500">Prompt admins to update password regularly</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("forcePasswordExpiry", !formData.forcePasswordExpiry)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                      formData.forcePasswordExpiry ? "bg-emerald-600" : "bg-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.forcePasswordExpiry ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Session Timeout (Minutes)</label>
                    <input
                      type="number"
                      value={formData.sessionTimeoutMins}
                      onChange={(e) => updateField("sessionTimeoutMins", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Whitelisted Admin IP Addresses</label>
                    <input
                      type="text"
                      value={formData.whitelistedIps}
                      onChange={(e) => updateField("whitelistedIps", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. NOTIFICATION SETTINGS */}
          {activeMenu === "Notification Settings" && (
            <div className="space-y-4 text-xs">
              {[
                { key: "orderNotifs", label: "New Order Alerts", desc: "Receive real-time notifications when a new order is placed." },
                { key: "kycNotifs", label: "KYC & Registration Verification", desc: "Notify admin when a farmer or dealer submits verification documents." },
                { key: "requestNotifs", label: "Service & Advisory Requests", desc: "Alert when a new expert query or machinery booking request arrives." },
                { key: "dailyDigest", label: "Daily Business Summary Digest", desc: "Send automated daily sales & activity email report." },
                { key: "loginAlerts", label: "Admin Login Security Alerts", desc: "Send an email alert whenever an admin logs in from a new IP." },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-emerald-200 bg-gray-50/50">
                  <div>
                    <p className="font-bold text-gray-800">{item.label}</p>
                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField(item.key, !formData[item.key])}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                      formData[item.key] ? "bg-emerald-600" : "bg-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData[item.key] ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 5. PAYMENT SETTINGS */}
          {activeMenu === "Payment Settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Razorpay Key ID</label>
                <input
                  type="text"
                  value={formData.razorpayKeyId}
                  onChange={(e) => updateField("razorpayKeyId", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Razorpay Key Secret</label>
                <input
                  type="password"
                  value={formData.razorpaySecret}
                  onChange={(e) => updateField("razorpaySecret", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Official UPI VPA ID</label>
                <input
                  type="text"
                  value={formData.upiVpa}
                  onChange={(e) => updateField("upiVpa", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Platform Commission Rate (%)</label>
                <input
                  type="number"
                  value={formData.commissionRatePct}
                  onChange={(e) => updateField("commissionRatePct", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Minimum Payout Threshold (₹)</label>
                <input
                  type="number"
                  value={formData.minPayoutThreshold}
                  onChange={(e) => updateField("minPayoutThreshold", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 font-medium"
                />
              </div>
            </div>
          )}

          {/* 6. EMAIL SETTINGS (SMTP) */}
          {activeMenu === "Email Settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">SMTP Host Server</label>
                <input
                  type="text"
                  value={formData.smtpHost}
                  onChange={(e) => updateField("smtpHost", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">SMTP Port</label>
                <input
                  type="text"
                  value={formData.smtpPort}
                  onChange={(e) => updateField("smtpPort", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">SMTP Username</label>
                <input
                  type="text"
                  value={formData.smtpUser}
                  onChange={(e) => updateField("smtpUser", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">SMTP Password</label>
                <input
                  type="password"
                  value={formData.smtpPassword}
                  onChange={(e) => updateField("smtpPassword", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Encryption Method</label>
                <select
                  value={formData.smtpEncryption}
                  onChange={(e) => updateField("smtpEncryption", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                >
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>None</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Sender Display Name</label>
                <input
                  type="text"
                  value={formData.smtpFromName}
                  onChange={(e) => updateField("smtpFromName", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
            </div>
          )}

          {/* 7. SMS SETTINGS */}
          {activeMenu === "SMS Settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">SMS Gateway Provider</label>
                <select
                  value={formData.smsProvider}
                  onChange={(e) => updateField("smsProvider", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                >
                  <option>Fast2SMS</option>
                  <option>Twilio</option>
                  <option>MSG91</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">SMS API Key</label>
                <input
                  type="text"
                  value={formData.smsApiKey}
                  onChange={(e) => updateField("smsApiKey", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Sender ID (6 Chars Header)</label>
                <input
                  type="text"
                  value={formData.smsSenderId}
                  onChange={(e) => updateField("smsSenderId", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">OTP Validity Expiry (Minutes)</label>
                <input
                  type="number"
                  value={formData.otpExpiryMins}
                  onChange={(e) => updateField("otpExpiryMins", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
            </div>
          )}

          {/* 8. APP SETTINGS */}
          {activeMenu === "App Settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Mobile App Version</label>
                <input
                  type="text"
                  value={formData.appVersion}
                  onChange={(e) => updateField("appVersion", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                <div>
                  <p className="font-bold text-gray-800">Force App Update</p>
                  <p className="text-[10px] text-gray-500">Require users to update to latest build</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("forceAppUpdate", !formData.forceAppUpdate)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                    formData.forceAppUpdate ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.forceAppUpdate ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Google Play Store URL</label>
                <input
                  type="text"
                  value={formData.playStoreUrl}
                  onChange={(e) => updateField("playStoreUrl", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Apple App Store URL</label>
                <input
                  type="text"
                  value={formData.appStoreUrl}
                  onChange={(e) => updateField("appStoreUrl", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">App Maintenance Banner Message</label>
                <input
                  type="text"
                  value={formData.maintenanceBannerMsg}
                  onChange={(e) => updateField("maintenanceBannerMsg", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
            </div>
          )}

          {/* 9. KYC SETTINGS */}
          {activeMenu === "KYC Settings" && (
            <div className="space-y-4 text-xs">
              {[
                { key: "autoApproveFarmers", label: "Auto-Approve Farmer Registrations", desc: "Automatically grant active status upon sign up without manual review." },
                { key: "autoApproveDealers", label: "Auto-Approve Dealer Registrations", desc: "Automatically grant dealer access without manual verification." },
                { key: "mandatoryAadhaar", label: "Mandatory Aadhaar Card Upload", desc: "Require Aadhaar verification for farmer accounts." },
                { key: "mandatoryGst", label: "Mandatory GSTIN & License for Dealers", desc: "Enforce valid GSTIN and license submission for dealers." },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-emerald-200 bg-gray-50/50">
                  <div>
                    <p className="font-bold text-gray-800">{item.label}</p>
                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField(item.key, !formData[item.key])}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                      formData[item.key] ? "bg-emerald-600" : "bg-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData[item.key] ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}

              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Max Upload Document Size (MB)</label>
                <input
                  type="number"
                  value={formData.maxFileUploadMb}
                  onChange={(e) => updateField("maxFileUploadMb", e.target.value)}
                  className="w-64 h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
            </div>
          )}

          {/* 10. GST SETTINGS */}
          {activeMenu === "GST Settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Default GST Rate (%)</label>
                <select
                  value={formData.defaultGstPct}
                  onChange={(e) => updateField("defaultGstPct", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                >
                  <option>0 (Exempted)</option>
                  <option>5</option>
                  <option>12</option>
                  <option>18</option>
                  <option>28</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Platform GSTIN Number</label>
                <input
                  type="text"
                  value={formData.platformGstin}
                  onChange={(e) => updateField("platformGstin", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">GST State Code</label>
                <input
                  type="text"
                  value={formData.gstStateCode}
                  onChange={(e) => updateField("gstStateCode", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Product Price Display Mode</label>
                <select
                  value={formData.priceDisplayMode}
                  onChange={(e) => updateField("priceDisplayMode", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                >
                  <option>Tax Inclusive</option>
                  <option>Tax Exclusive (+ GST at checkout)</option>
                </select>
              </div>
            </div>
          )}

          {/* 11. FEATURE SETTINGS */}
          {activeMenu === "Feature Settings" && (
            <div className="space-y-4 text-xs">
              {[
                { key: "enableMandiBhav", label: "Enable Mandi Bhav (Market Rates)", desc: "Show daily crop market prices and trend charts." },
                { key: "enableAdvisory", label: "Enable Crop Advisory & Expert Advice", desc: "Allow farmers to ask questions to agricultural experts." },
                { key: "enableKisanCard", label: "Enable Krivexo Kisan Card", desc: "Enable digital card applications, credit limits & wallets." },
                { key: "enableBookings", label: "Enable Machinery & Labour Bookings", desc: "Allow booking harvesters, tractors & farm workers." },
                { key: "enableWallet", label: "Enable Kisan Wallet & UPI Payouts", desc: "Enable digital wallet balance and direct withdrawal features." },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-emerald-200 bg-gray-50/50">
                  <div>
                    <p className="font-bold text-gray-800">{item.label}</p>
                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField(item.key, !formData[item.key])}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                      formData[item.key] ? "bg-emerald-600" : "bg-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData[item.key] ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 12. MAINTENANCE MODE */}
          {activeMenu === "Maintenance Mode" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-amber-200 bg-amber-50/50">
                <div>
                  <p className="text-sm font-bold text-amber-900">Activate System Maintenance Mode</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">When active, public access will be temporarily disabled with a maintenance screen.</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("maintenanceMode", !formData.maintenanceMode)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    formData.maintenanceMode ? "bg-red-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${formData.maintenanceMode ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Public Maintenance Message</label>
                <textarea
                  rows={3}
                  value={formData.maintenanceMessage}
                  onChange={(e) => updateField("maintenanceMessage", e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
            </div>
          )}

          {/* 13. BACKUP & RESTORE */}
          {activeMenu === "Backup & Restore" && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-blue-900 text-sm">Download Configuration Backup</h3>
                  <p className="text-[11px] text-blue-700 mt-0.5">Export all system settings, configurations and preferences into a JSON file.</p>
                </div>
                <button
                  type="button"
                  onClick={handleBackup}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <Download className="h-4 w-4" /> Download Backup
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-purple-900 text-sm">Clear Cache & Temporary Data</h3>
                  <p className="text-[11px] text-purple-700 mt-0.5">Purge application runtime cache to optimize system performance.</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearCache}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <RefreshCw className="h-4 w-4" /> Clear Cache
                </button>
              </div>
            </div>
          )}

          {/* 14. COOKIE SETTINGS */}
          {activeMenu === "Cookie Settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 md:col-span-2">
                <div>
                  <p className="font-bold text-gray-800">Enable Cookie Consent Banner</p>
                  <p className="text-[10px] text-gray-500">Show GDPR / DPDP cookie banner to first time visitors.</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("enableCookieBanner", !formData.enableCookieBanner)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                    formData.enableCookieBanner ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.enableCookieBanner ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Cookie Expiry (Days)</label>
                <input
                  type="number"
                  value={formData.cookieExpiryDays}
                  onChange={(e) => updateField("cookieExpiryDays", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Privacy Policy URL</label>
                <input
                  type="text"
                  value={formData.privacyPolicyUrl}
                  onChange={(e) => updateField("privacyPolicyUrl", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
            </div>
          )}

          {/* 15. LANGUAGE SETTINGS */}
          {activeMenu === "Language Settings" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Default System Language</label>
                <select
                  value={formData.defaultLanguage}
                  onChange={(e) => updateField("defaultLanguage", e.target.value)}
                  className="w-full max-w-md h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                >
                  <option>Hindi (हिंदी)</option>
                  <option>English (US)</option>
                  <option>Bhojpuri (भोजपुरी)</option>
                  <option>Maithili (मैथिली)</option>
                </select>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-semibold text-gray-700 mb-2">Supported Portal Languages</p>
                <div className="flex flex-wrap gap-2">
                  {["Hindi (हिंदी)", "English", "Bhojpuri (भोजपुरी)", "Maithili (मैथिली)", "Punjabi", "Bengali"].map((lang) => (
                    <span key={lang} className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-600" /> {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 16. LOGS & ACTIVITY */}
          {activeMenu === "Logs & Activity" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">System Log Level</label>
                <select
                  value={formData.logLevel}
                  onChange={(e) => updateField("logLevel", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                >
                  <option>Info</option>
                  <option>Warning</option>
                  <option>Error Only</option>
                  <option>Debug (Verbose)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Log Retention Period (Days)</label>
                <select
                  value={formData.logRetentionDays}
                  onChange={(e) => updateField("logRetentionDays", e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800 bg-white"
                >
                  <option>30</option>
                  <option>60</option>
                  <option>90</option>
                  <option>365</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom 6 Operations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Maintenance Mode */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Wrench className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-bold text-gray-800">Maintenance Mode</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextVal = !formData.maintenanceMode;
                  updateField("maintenanceMode", nextVal);
                  toast.info(`Maintenance mode ${nextVal ? "enabled" : "disabled"}`);
                }}
                className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                  formData.maintenanceMode ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    formData.maintenanceMode ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <p className="text-[10px] text-gray-500">Enable maintenance mode to hide the website from public.</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveMenu("Maintenance Mode")}
            className="mt-3 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            ⚙ Manage
          </button>
        </div>

        {/* Environment */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                <Activity className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-bold text-gray-800">Environment</p>
            </div>
            <p className="text-[10px] text-gray-500 mb-2">Current environment of your application.</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">Environment</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Production
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toast.info("Running in Production mode (v2.5.0)")}
            className="mt-3 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            ⚙ Manage
          </button>
        </div>

        {/* Cache Management */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <RefreshCw className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-bold text-gray-800">Cache Management</p>
            </div>
            <p className="text-[10px] text-gray-500 mb-2">Clear cache to improve system performance.</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">Status</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Enabled
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearCache}
            className="mt-3 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            🗑 Clear Cache
          </button>
        </div>

        {/* Database Backup */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Database className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-bold text-gray-800">Database Backup</p>
            </div>
            <p className="text-[10px] text-gray-500 mb-2">Create and download database backup.</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">Last Backup</span>
              <span className="font-semibold text-gray-800 text-[10.5px]">{formatDate(new Date())}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleBackup}
            className="mt-3 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            ☁ Create Backup
          </button>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileCheck className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-bold text-gray-800">System Logs</p>
            </div>
            <p className="text-[10px] text-gray-500 mb-2">View system logs and activities.</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">Total Logs</span>
              <span className="font-bold text-gray-800 text-[11px]">12,456</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveMenu("Logs & Activity")}
            className="mt-3 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            → View Logs
          </button>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-bold text-gray-800">System Information</p>
            </div>
            <div className="space-y-1 text-[10.5px] pt-1">
              <div className="flex items-center justify-between text-gray-600">
                <span>System Version</span>
                <span className="font-mono font-bold text-gray-800">v2.5.0</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Environment</span>
                <span className="font-mono font-bold text-gray-800">Node.js + React</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Database</span>
                <span className="font-mono font-bold text-gray-800">MongoDB Atlas</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Status</span>
                <span className="font-mono font-bold text-emerald-600">Operational</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toast.info("System is running optimally on MongoDB Atlas & Node.js backend.")}
            className="mt-3 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Bottom Security Footer Banner */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Keep Your System Secure</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Regularly update your system settings and keep your information up to date for better performance and security.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveMenu("Security Settings")}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Security Recommendations
        </button>
      </div>
    </div>
  );
}

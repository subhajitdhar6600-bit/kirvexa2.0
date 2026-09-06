import React, { useState, useEffect } from "react";
import {
  User, Mail, Phone, Lock, Eye, EyeOff, Calendar,
  Upload, Shield, Check, ArrowLeft,
  UserPlus, Loader2, X, MapPin, Save, Building2, FileText, Store
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { api } from "@/services/api.ts";
import { INDIAN_STATES_AND_DISTRICTS, INDIAN_STATES_LIST } from "@/data/indianStatesDistricts.ts";

interface AddNewUserViewProps {
  onBack?: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

const MODULES = [
  { name: "User Management", perms: ["View Users", "Add Users", "Edit Users", "Delete Users", "Roles & Permissions"] },
  { name: "Product Management", perms: ["View Products", "Add Products", "Edit Products", "Delete Products", "Product Categories"] },
  { name: "Order Management", perms: ["View Orders", "Edit Orders", "Cancel Orders", "Refund Orders", "Export Orders"] },
  { name: "Financial", perms: ["View Transactions", "View Reports", "Refunds", "Payouts"] },
  { name: "Settings & Others", perms: ["System Settings", "CMS / Pages", "Notifications", "Support Tickets", "Activity Logs"] },
];

const OCCUPATIONS = ["Farmer", "Agricultural Laborer", "Farm Manager", "Other"];

const DEALER_TYPES = [
  "Seeds & Fertilizer Dealer",
  "Pesticide & Agro-Chemical Dealer",
  "Farm Equipment & Machinery Dealer",
  "Crop Trader & Wholesale Buyer",
  "Organic Inputs Supplier",
  "General Agri-Retailer"
];

const ROLE_OPTIONS = [
  { id: "farmer", label: "Farmer", description: "Buy seeds/fertilizers, sell harvested crops, access KCC loans & book machinery", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "dealer", label: "Dealer / Retailer", description: "Manage agri-inputs, seed & fertilizer inventory, order fulfillment, and earnings", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  { id: "service_provider", label: "Service Provider (CHC)", description: "Custom Hiring Center equipment bookings, tractors, harvesters, and farm labor", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  { id: "admin", label: "Admin", description: "Administrative access to products, orders, support tickets, and platform operations", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "super_admin", label: "Super Admin", description: "Full unrestricted administrative access to all platform modules, database, and settings", badge: "bg-red-50 text-red-700 border-red-200" },
];

export default function AddNewUserView({ onBack, onSuccess, initialData }: AddNewUserViewProps) {
  const isEdit = Boolean(initialData);

  const getNormalizedRole = (role?: string) => {
    const r = (role || "").toLowerCase();
    if (r.includes("dealer") || r.includes("retailer")) return "dealer";
    if (r.includes("service") || r.includes("chc")) return "service_provider";
    if (r.includes("super")) return "super_admin";
    if (r.includes("admin")) return "admin";
    return "farmer";
  };

  const [form, setForm] = useState({
    fullName: initialData?.fullName || initialData?.name || initialData?.owner || "",
    fatherName: initialData?.fatherName || "",
    businessName: initialData?.businessName || "",
    dealerType: initialData?.dealerType || DEALER_TYPES[0],
    occupation: initialData?.occupation || "Farmer",
    gstNumber: initialData?.gstin || initialData?.gstNumber || "",
    licenseNumber: initialData?.licenseNumber || "",
    email: initialData?.email && initialData?.email !== "—" ? initialData.email : "",
    mobile: initialData?.phone || "",
    username: initialData?.username || "",
    password: "",
    confirmPassword: "",
    dob: initialData?.dob || "",
    gender: initialData?.gender || "male",
    role: getNormalizedRole(initialData?.role),
    state: initialData?.state || "Bihar",
    district: initialData?.district || "Patna",
    village: initialData?.village || (initialData?.location && initialData.location.includes(",") ? initialData.location.split(",")[0].trim() : ""),
    address: initialData?.address || "",
  });

  const [profilePhoto, setProfilePhoto] = useState<string | null>(initialData?.avatar || initialData?.profileImage || null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState<Record<string, boolean>>(() => ({
    "View Users": true,
    "View Products": true,
    "View Orders": true,
    "View Transactions": true,
  }));

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || initialData.name || initialData.owner || "",
        fatherName: initialData.fatherName || "",
        businessName: initialData.businessName || "",
        dealerType: initialData.dealerType || DEALER_TYPES[0],
        occupation: initialData.occupation || "Farmer",
        gstNumber: initialData.gstin || initialData.gstNumber || "",
        licenseNumber: initialData.licenseNumber || "",
        email: initialData.email && initialData.email !== "—" ? initialData.email : "",
        mobile: initialData.phone || "",
        username: initialData.username || "",
        password: "",
        confirmPassword: "",
        dob: initialData.dob || "",
        gender: initialData.gender || "male",
        role: getNormalizedRole(initialData.role),
        state: initialData.state || "Bihar",
        district: initialData.district || "Patna",
        village: initialData.village || (initialData.location && initialData.location.includes(",") ? initialData.location.split(",")[0].trim() : ""),
        address: initialData.address || "",
      });
      setProfilePhoto(initialData.avatar || initialData.profileImage || null);
    }
  }, [initialData]);

  const set = (field: string, val: string) => setForm(p => ({ ...p, [field]: val }));
  const togglePerm = (perm: string) => setSelectedPerms(p => ({ ...p, [perm]: !p[perm] }));

  // Districts based on selected state
  const availableDistricts = form.state && INDIAN_STATES_AND_DISTRICTS[form.state]
    ? INDIAN_STATES_AND_DISTRICTS[form.state]
    : [];

  const handleStateChange = (stateName: string) => {
    setForm(p => ({
      ...p,
      state: stateName,
      district: INDIAN_STATES_AND_DISTRICTS[stateName]?.[0] || "",
    }));
  };

  const selectAll = () => {
    const all: Record<string, boolean> = {};
    MODULES.forEach(m => m.perms.forEach(p => { all[p] = true; }));
    setSelectedPerms(all);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePhoto(ev.target?.result as string);
      toast.success("Profile photo uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.mobile.trim()) {
      toast.error("Full Name / Owner Name and Mobile Number are required.");
      return;
    }

    if (form.mobile.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (form.role === "dealer") {
      if (!form.businessName.trim()) {
        toast.error("Business / Shop Name is required for Dealer registration.");
        return;
      }
      if (!form.gstNumber.trim()) {
        toast.error("GSTIN details are mandatory for Dealer registration.");
        return;
      }
      if (!form.licenseNumber.trim()) {
        toast.error("Seed / Fertilizer / Pesticide License details are mandatory for Dealer registration.");
        return;
      }
    }

    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit) {
        const targetId = initialData.rawId || initialData.id || initialData._id;
        const updatePayload: any = {
          name: form.fullName.trim(),
          fullName: form.fullName.trim(),
          owner: form.fullName.trim(),
          phone: form.mobile.trim(),
          email: form.email.trim() || `${form.mobile.trim()}@farma.local`,
          role: form.role,
          state: form.state,
          district: form.district,
          village: form.village.trim() || "Danapur",
          address: form.address.trim(),
          gender: form.gender,
          dob: form.dob,
          avatar: profilePhoto || "",
          permissions: Object.keys(selectedPerms).filter(k => selectedPerms[k]),
        };

        if (form.role === "farmer") {
          updatePayload.fatherName = form.fatherName.trim();
          updatePayload.occupation = form.occupation;
        } else if (form.role === "dealer") {
          updatePayload.businessName = form.businessName.trim();
          updatePayload.dealerType = form.dealerType;
          updatePayload.gstin = form.gstNumber.trim().toUpperCase();
          updatePayload.gstNumber = form.gstNumber.trim().toUpperCase();
          updatePayload.licenseNumber = form.licenseNumber.trim();
        }

        if (form.password) {
          updatePayload.password = form.password;
        }

        await api.updateUser(targetId, updatePayload);
        toast.success(`User ${form.fullName} updated successfully in MongoDB!`);
      } else {
        const generatedId = `usr_${form.role}_${Date.now().toString().slice(-4)}`;
        const newUserPayload: any = {
          id: generatedId,
          name: form.fullName.trim(),
          fullName: form.fullName.trim(),
          owner: form.fullName.trim(),
          phone: form.mobile.trim(),
          email: form.email.trim() || `${form.mobile.trim()}@farma.local`,
          password: form.password || "123456",
          role: form.role,
          state: form.state,
          district: form.district,
          village: form.village.trim() || "Danapur",
          address: form.address.trim(),
          gender: form.gender,
          dob: form.dob,
          avatar: profilePhoto || "",
          status: "active",
          verificationStatus: "Verified",
          createdAt: new Date().toISOString(),
          permissions: Object.keys(selectedPerms).filter(k => selectedPerms[k]),
        };

        if (form.role === "farmer") {
          newUserPayload.fatherName = form.fatherName.trim();
          newUserPayload.occupation = form.occupation;
        } else if (form.role === "dealer") {
          newUserPayload.businessName = form.businessName.trim();
          newUserPayload.dealerType = form.dealerType;
          newUserPayload.gstin = form.gstNumber.trim().toUpperCase();
          newUserPayload.gstNumber = form.gstNumber.trim().toUpperCase();
          newUserPayload.licenseNumber = form.licenseNumber.trim();
        }

        await api.saveUser(newUserPayload);
        toast.success(`User ${form.fullName} created successfully in MongoDB!`);
      }

      if (onSuccess) {
        onSuccess();
      } else if (onBack) {
        onBack();
      }
    } catch (err: any) {
      toast.error(err?.message || `Failed to ${isEdit ? "update" : "create"} user. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRoleObj = ROLE_OPTIONS.find(r => r.id === form.role) || ROLE_OPTIONS[0];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{isEdit ? "Edit User Profile" : "Add New User"}</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEdit
              ? "Update user account details, role specifications, and permissions directly in Farma MongoDB database"
              : "Create a new user account with full role-specific registration details in Farma MongoDB database"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Dashboard</span>
          <span>›</span>
          <span>Users Management</span>
          <span>›</span>
          <span className="text-emerald-600 font-medium">{isEdit ? "Edit User" : "Add New User"}</span>
        </div>
      </div>

      {/* Role Selection Tabs Bar */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-wrap gap-2">
        {ROLE_OPTIONS.map((r) => {
          const isSelected = form.role === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => set("role", r.id)}
              className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {r.id === "farmer" && <User className="h-3.5 w-3.5" />}
              {r.id === "dealer" && <Store className="h-3.5 w-3.5" />}
              {r.id === "service_provider" && <Building2 className="h-3.5 w-3.5" />}
              {(r.id === "admin" || r.id === "super_admin") && <Shield className="h-3.5 w-3.5" />}
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Trap fields to prevent Chrome/Edge browser password manager autofill */}
        <input type="text" name="chrome_prevent_autofill_user" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
        <input type="password" name="chrome_prevent_autofill_pwd" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        <div className="flex gap-4 items-start">
          {/* Left Column */}
          <div className="flex-1 space-y-4">
            
            {/* 1. ROLE SPECIFIC REGISTRATION FORM */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    {form.role === "dealer" ? <Store className="h-4 w-4 text-emerald-600" /> : <User className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">
                      {form.role === "farmer" && "Farmer Registration Details"}
                      {form.role === "dealer" && "Dealer Registration Details (GST & License)"}
                      {form.role === "service_provider" && "Service Provider Registration Details"}
                      {(form.role === "admin" || form.role === "super_admin") && "Admin User Registration Details"}
                    </h2>
                    <p className="text-[10px] text-gray-400">Complete all required registration fields for {activeRoleObj.label}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${activeRoleObj.badge}`}>
                  {activeRoleObj.label}
                </span>
              </div>

              {/* FARMER SPECIFIC FORM FIELDS */}
              {form.role === "farmer" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      Farmer Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        placeholder="Enter full name"
                        value={form.fullName}
                        onChange={e => set("fullName", e.target.value)}
                        className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Father / Husband Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      Father / Husband Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        placeholder="Enter father / husband name"
                        value={form.fatherName}
                        onChange={e => set("fatherName", e.target.value)}
                        className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-1">
                      <span className="h-9 px-2 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center font-medium">
                        +91
                      </span>
                      <Input
                        placeholder="10-digit mobile"
                        value={form.mobile}
                        onChange={e => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="h-9 text-xs border-gray-200 rounded-xl flex-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.gender}
                      onChange={e => set("gender", e.target.value)}
                      className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 font-medium"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={form.dob}
                      onChange={e => set("dob", e.target.value)}
                      className="h-9 text-xs border-gray-200 rounded-xl"
                      required
                    />
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      Occupation <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.occupation}
                      onChange={e => set("occupation", e.target.value)}
                      className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 font-medium"
                    >
                      {OCCUPATIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">Email Address (Optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="farmer@example.com"
                        value={form.email}
                        onChange={e => set("email", e.target.value)}
                        className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.state}
                      onChange={e => handleStateChange(e.target.value)}
                      className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 font-medium"
                    >
                      {INDIAN_STATES_LIST.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.district}
                      onChange={e => set("district", e.target.value)}
                      className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 font-medium"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Village */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      Village <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        placeholder="Enter village name"
                        value={form.village}
                        onChange={e => set("village", e.target.value)}
                        className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      House / Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        placeholder="Enter house no, street, locality"
                        value={form.address}
                        onChange={e => set("address", e.target.value)}
                        className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DEALER SPECIFIC FORM FIELDS */}
              {form.role === "dealer" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Owner / Contact Name */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                        Owner / Contact Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          placeholder="Enter dealer full name"
                          value={form.fullName}
                          onChange={e => set("fullName", e.target.value)}
                          className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    {/* Business / Shop Name */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                        Business / Shop Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          placeholder="e.g. Kisan Agro Center"
                          value={form.businessName}
                          onChange={e => set("businessName", e.target.value)}
                          className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    {/* Dealer Type */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                        Dealer Business Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.dealerType}
                        onChange={e => set("dealerType", e.target.value)}
                        className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 font-medium"
                      >
                        {DEALER_TYPES.map((dt) => (
                          <option key={dt} value={dt}>{dt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-1">
                        <span className="h-9 px-2 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center font-medium">
                          +91
                        </span>
                        <Input
                          placeholder="10-digit mobile"
                          value={form.mobile}
                          onChange={e => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="h-9 text-xs border-gray-200 rounded-xl flex-1"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                        Email Address <span className="text-xs text-gray-400">(For Credentials Mail)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="dealer@example.com"
                          value={form.email}
                          onChange={e => set("email", e.target.value)}
                          className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 1: MANDATORY GST DETAILS */}
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-emerald-600" /> Section 1: Mandatory GST Details <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        placeholder="Enter 15-digit GSTIN Number (e.g. 10ABCDE1234F1Z5)"
                        value={form.gstNumber}
                        onChange={e => set("gstNumber", e.target.value.toUpperCase())}
                        className="pl-9 h-9 text-xs border-emerald-200 bg-white rounded-xl uppercase font-mono font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  {/* SECTION 2: MANDATORY LICENSE DETAILS */}
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-emerald-600" /> Section 2: Mandatory Seed / Fertilizer / Pesticide License Details <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        placeholder="Enter License Number (e.g. LIC/BH/2026/0987)"
                        value={form.licenseNumber}
                        onChange={e => set("licenseNumber", e.target.value)}
                        className="pl-9 h-9 text-xs border-emerald-200 bg-white rounded-xl font-mono font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* State */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.state}
                        onChange={e => handleStateChange(e.target.value)}
                        className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 font-medium"
                      >
                        {INDIAN_STATES_LIST.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* District */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.district}
                        onChange={e => set("district", e.target.value)}
                        className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 font-medium"
                      >
                        {availableDistricts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Village / Locality */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                        Village / Locality / City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          placeholder="Enter village or city"
                          value={form.village}
                          onChange={e => set("village", e.target.value)}
                          className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    {/* Shop Address */}
                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                        Shop / Business Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          placeholder="Enter shop no, market area, road"
                          value={form.address}
                          onChange={e => set("address", e.target.value)}
                          className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* OTHER ROLES (SERVICE PROVIDER / ADMIN) FORM FIELDS */}
              {form.role !== "farmer" && form.role !== "dealer" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        placeholder="Enter full name"
                        value={form.fullName}
                        onChange={e => set("fullName", e.target.value)}
                        className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="user@krivexa.com"
                        value={form.email}
                        onChange={e => set("email", e.target.value)}
                        className="pl-9 h-9 text-xs border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-1">
                      <span className="h-9 px-2 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center font-medium">
                        +91
                      </span>
                      <Input
                        placeholder="10-digit mobile"
                        value={form.mobile}
                        onChange={e => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="h-9 text-xs border-gray-200 rounded-xl flex-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">State</label>
                    <select
                      value={form.state}
                      onChange={e => handleStateChange(e.target.value)}
                      className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 font-medium"
                    >
                      {INDIAN_STATES_LIST.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">District</label>
                    <select
                      value={form.district}
                      onChange={e => set("district", e.target.value)}
                      className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-700 font-medium"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">Village / Address</label>
                    <Input
                      placeholder="Enter village / office address"
                      value={form.village}
                      onChange={e => set("village", e.target.value)}
                      className="h-9 text-xs border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* COMMON CREDENTIALS & MEDIA SECTION */}
              <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Password */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                    {isEdit ? "New Password (optional)" : "Password *"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      name="admin_user_login_pwd"
                      placeholder={isEdit ? "Leave blank to keep current" : "Create password"}
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={e => set("password", e.target.value)}
                      className="pl-9 pr-9 h-9 text-xs border-gray-200 rounded-xl"
                      autoComplete="new-password"
                      required={!isEdit}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
                    {isEdit ? "Confirm New Password" : "Confirm Password *"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      name="admin_user_login_confirm_pwd"
                      placeholder="Confirm password"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={e => set("confirmPassword", e.target.value)}
                      className="pl-9 pr-9 h-9 text-xs border-gray-200 rounded-xl"
                      autoComplete="new-password"
                      required={!isEdit}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Working Profile Photo Upload */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">Profile Photo</label>
                  {profilePhoto ? (
                    <div className="relative h-18 w-full rounded-xl border border-emerald-200 overflow-hidden group bg-gray-50 flex items-center justify-center">
                      <img src={profilePhoto} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="px-2 py-1 rounded-lg bg-white text-gray-800 hover:bg-gray-100 text-[10px] font-semibold cursor-pointer shadow-xs">
                          Change
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setProfilePhoto(null)}
                          className="p-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs shadow-xs cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 h-18 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors text-center px-2">
                      <Upload className="h-4 w-4 text-emerald-600" />
                      <div>
                        <span className="text-[10px] text-gray-700 font-semibold block">Upload Photo</span>
                        <span className="text-[9px] text-gray-400">JPG, PNG (max 2MB)</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Assign Role & Permissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assign Role Description */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                    <User className="h-4 w-4 text-violet-600" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Selected Role Overview</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">Current Role</label>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${activeRoleObj.badge}`}>
                        {activeRoleObj.label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">Role Description & Platform Scope</label>
                    <div className="min-h-16 px-3.5 py-2.5 border border-gray-100 rounded-xl bg-gray-50 text-[11px] text-gray-600 leading-relaxed font-medium">
                      {activeRoleObj.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-900">Permissions Matrix</h2>
                  </div>
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-[11px] text-emerald-600 font-semibold hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                </div>

                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {MODULES.map(mod => (
                    <div key={mod.name}>
                      <p className="text-[11px] font-bold text-gray-700 mb-1.5">{mod.name}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {mod.perms.map(perm => (
                          <label
                            key={perm}
                            className="flex items-center gap-1.5 cursor-pointer select-none"
                            onClick={() => togglePerm(perm)}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                                selectedPerms[perm] ? "bg-emerald-500 border-emerald-500" : "border-gray-300 bg-white"
                              }`}
                            >
                              {selectedPerms[perm] && <Check className="h-2.5 w-2.5 text-white" />}
                            </div>
                            <span className="text-[10px] text-gray-600">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - User Summary */}
          <div className="w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-4 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">User Summary</h2>
              </div>

              <div className="flex flex-col items-center">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="User Avatar"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xl font-bold shadow-sm mb-2">
                    {form.fullName ? form.fullName.charAt(0).toUpperCase() : <User className="h-8 w-8 text-white" />}
                  </div>
                )}
                <p className="font-bold text-gray-800 text-sm text-center line-clamp-1">
                  {form.fullName || (form.role === "dealer" ? "New Dealer" : "New Farmer")}
                </p>
                {form.role === "dealer" && form.businessName && (
                  <p className="text-[11px] text-emerald-700 font-semibold text-center mt-0.5">{form.businessName}</p>
                )}
                <span className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${activeRoleObj.badge}`}>
                  {activeRoleObj.label}
                </span>
              </div>

              <div className="space-y-2 text-[11px] border-t border-gray-100 pt-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-gray-400 shrink-0">Role</span>
                  <span className="font-semibold text-gray-800 text-right">{activeRoleObj.label}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-gray-400 shrink-0">Status</span>
                  <span className="font-semibold text-emerald-600 text-right">Active</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-gray-400 shrink-0">Mobile</span>
                  <span className="font-semibold text-gray-800 text-right">{form.mobile ? `+91 ${form.mobile}` : "—"}</span>
                </div>
                {form.email && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-gray-400 shrink-0">Email</span>
                    <span className="font-semibold text-gray-800 text-right truncate max-w-[140px]">{form.email}</span>
                  </div>
                )}

                {/* Role Specific Summary Lines */}
                {form.role === "farmer" && (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 shrink-0">Father/Husband</span>
                      <span className="font-semibold text-gray-800 text-right">{form.fatherName || "—"}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 shrink-0">Occupation</span>
                      <span className="font-semibold text-gray-800 text-right">{form.occupation}</span>
                    </div>
                  </>
                )}

                {form.role === "dealer" && (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 shrink-0">GSTIN</span>
                      <span className="font-mono font-bold text-emerald-700 text-right">{form.gstNumber || "—"}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 shrink-0">License</span>
                      <span className="font-mono font-semibold text-gray-800 text-right truncate max-w-[130px]">{form.licenseNumber || "—"}</span>
                    </div>
                  </>
                )}

                <div className="flex items-start justify-between gap-2">
                  <span className="text-gray-400 shrink-0">Location</span>
                  <span className="font-semibold text-gray-800 text-right truncate max-w-[140px]">
                    {`${form.village ? form.village + ", " : ""}${form.district}, ${form.state}`}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-gray-400 shrink-0">Permissions</span>
                  <span className="font-semibold text-blue-600 text-right">
                    {Object.values(selectedPerms).filter(Boolean).length} Granted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-3.5">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Users
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setForm({
                  fullName: "",
                  fatherName: "",
                  businessName: "",
                  dealerType: DEALER_TYPES[0],
                  occupation: "Farmer",
                  gstNumber: "",
                  licenseNumber: "",
                  email: "",
                  mobile: "",
                  username: "",
                  password: "",
                  confirmPassword: "",
                  dob: "",
                  gender: "male",
                  role: "farmer",
                  state: "Bihar",
                  district: "Patna",
                  village: "",
                  address: "",
                });
                setProfilePhoto(null);
              }}
              className="h-9 px-4 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Reset
            </button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 rounded-xl font-semibold gap-1.5 cursor-pointer shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> {isEdit ? "Updating User..." : "Saving to Database..."}
                </>
              ) : isEdit ? (
                <>
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" /> Create User Account
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

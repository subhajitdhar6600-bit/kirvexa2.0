import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Phone, MapPin, Edit3, ShieldAlert, CheckCircle2, Wallet, CreditCard,
  Calendar, TrendingUp, BookOpen, HelpCircle, FileText, LogOut, ArrowLeft,
  Bell, Upload, Building2, CreditCard as BankIcon, ChevronRight, X, Lock, KeyRound, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { api } from "@/services/api.ts";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUserProfile, logoutUser, setIsKccAppModalOpen, notifications, hasAppliedKcc, isKccIssued, kccDetails, kccApplicationStatus } = useApp();
  const isKccApproved = Boolean(isKccIssued || kccApplicationStatus === "approved" || user?.isKccIssued || user?.kccCardNumber);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  // Edit Modals State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAadhaarOpen, setIsEditAadhaarOpen] = useState(false);
  const [isEditBankOpen, setIsEditBankOpen] = useState(false);
  const [isTcOpen, setIsTcOpen] = useState(false);

  // Change Password State
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [isSubmittingPass, setIsSubmittingPass] = useState(false);

  // Profile Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [village, setVillage] = useState(user?.village || "");
  const [district, setDistrict] = useState(user?.district || "");
  const [state, setState] = useState(user?.state || "");
  const [pincode, setPincode] = useState(user?.pincode || "");

  // Aadhaar Form State
  const [aadhaarNum, setAadhaarNum] = useState(user?.aadhaarNumber === "Not set" ? "" : user?.aadhaarNumber || "");
  const [frontCardName, setFrontCardName] = useState(user?.aadhaarFront || "No file uploaded yet");
  const [backCardName, setBackCardName] = useState(user?.aadhaarBack || "No file uploaded yet");

  // Bank Form State
  const [bankHolder, setBankHolder] = useState(user?.bankHolder === "Not set" ? "" : user?.bankHolder || "");
  const [bankName, setBankName] = useState(user?.bankName === "Not set" ? "" : user?.bankName || "");
  const [bankAccount, setBankAccount] = useState(user?.bankAccount === "Not set" ? "" : user?.bankAccount || "");
  const [bankIfsc, setBankIfsc] = useState(user?.bankIfsc === "Not set" ? "" : user?.bankIfsc || "");
  const [bankAddress, setBankAddress] = useState(user?.bankAddress === "Not set" ? "" : user?.bankAddress || "");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, village, district, state, pincode });
    setIsEditProfileOpen(false);
    toast.success("Profile basic details updated successfully!");
  };

  const handleSaveAadhaar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhaarNum.trim()) {
      toast.error("Please enter a valid Aadhaar number");
      return;
    }
    updateUserProfile({
      aadhaarNumber: aadhaarNum,
      aadhaarFront: frontCardName !== "No file uploaded yet" ? frontCardName : "Aadhaar_Front_Uploaded.jpg",
      aadhaarBack: backCardName !== "No file uploaded yet" ? backCardName : "Aadhaar_Back_Uploaded.jpg",
      verificationStatus: "Pending",
    });
    setIsEditAadhaarOpen(false);
    toast.success("Aadhaar details submitted securely for verification!");
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankHolder.trim() || !bankAccount.trim() || !bankIfsc.trim()) {
      toast.error("Please fill in required bank fields (Holder, Account, IFSC)");
      return;
    }
    updateUserProfile({
      bankHolder,
      bankName,
      bankAccount,
      bankIfsc,
      bankAddress,
    });
    setIsEditBankOpen(false);
    toast.success("Bank account details saved securely for payouts!");
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 4) {
      toast.error("New password must be at least 4 characters long");
      return;
    }
    if (newPass !== confirmNewPass) {
      toast.error("New passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmittingPass(true);
    try {
      const token = localStorage.getItem("auth_token") || "";
      await api.changePassword({ currentPassword: currentPass, newPassword: newPass }, token);
      
      // Sync local storage registered accounts
      if (user?.phone) {
        const savedAccounts = localStorage.getItem("krivexa_registered_accounts");
        if (savedAccounts) {
          const parsed = JSON.parse(savedAccounts);
          const updated = parsed.map((acc: any) =>
            acc.phone === user.phone ? { ...acc, password: newPass } : acc
          );
          localStorage.setItem("krivexa_registered_accounts", JSON.stringify(updated));
        }
      }

      toast.success("Password updated successfully from profile!");
      setIsChangePassOpen(false);
      setCurrentPass("");
      setNewPass("");
      setConfirmNewPass("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setIsSubmittingPass(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    toast.info("Logged out of profile session.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Page Top Header Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-xl font-black tracking-wide" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            USER <span className="text-primary">PROFILE</span>
          </h1>
          <Link to="/notifications" className="relative p-2 bg-white/5 border border-white/10 rounded-xl hover:border-primary/40 transition-colors">
            <Bell className="h-4 w-4 text-gray-300" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </Link>
        </div>

        {/* Profile Card - Omit user image as instructed: "please don't add the user image section" */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">{user?.name || "User Profile"}</h2>
                <Badge className={isKccApproved ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5" : hasAppliedKcc ? "bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] font-semibold px-2.5 py-0.5" : "bg-amber-500/10 text-amber-400 border-amber-500/30 text-[11px] font-semibold px-2.5 py-0.5"}>
                  {isKccApproved ? (
                    <><CheckCircle2 className="h-3 w-3 mr-1 text-emerald-400" /> KCC Verified & Active</>
                  ) : hasAppliedKcc ? (
                    <><Clock className="h-3 w-3 mr-1 text-amber-400" /> KCC Under Review</>
                  ) : (
                    <><ShieldAlert className="h-3 w-3 mr-1 text-amber-400" /> Verification Pending</>
                  )}
                </Badge>
              </div>

              {user?.phone && (
                <p className="text-sm font-semibold text-gray-300 flex items-center gap-2 mt-1">
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>+91 {user.phone}</span>
                </p>
              )}

              {(user?.village || user?.district || user?.state) && (
                <p className="text-xs text-gray-400 flex items-start gap-1.5 mt-2 leading-relaxed">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>
                    {[user?.village, user?.district, user?.state].filter(Boolean).join(", ")} {user?.pincode ? `- ${user.pincode}` : ""}
                  </span>
                </p>
              )}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditProfileOpen(true)}
              className="border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-primary/40 text-xs rounded-xl"
            >
              <Edit3 className="h-3.5 w-3.5 mr-1 text-primary" /> Edit
            </Button>
          </div>
        </div>

        {/* KCC Digital Card on Profile (Visible when approved) */}
        {isKccApproved && (
          <div className="bg-linear-to-br from-[#1a1508] via-[#120f02] to-[#0a0a0a] border-2 border-amber-500/60 rounded-2xl p-5 mb-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-amber-400 font-black uppercase tracking-wider">Krivexa Kisan Credit Card</div>
                  <div className="text-xs text-white font-bold">Allotted & Verified by Admin</div>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-black">
                ACTIVE 💳
              </Badge>
            </div>
            <div className="my-3 bg-black/60 rounded-xl p-3 border border-white/10">
              <div className="text-[10px] text-gray-400 font-medium">Allotted KCC Card Number</div>
              <div className="text-xl font-mono font-black text-amber-300 tracking-wider">
                {user?.kccCardNumber || kccDetails?.cardNumber || "KCC-BH-2026-ACTIVE"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
              <div>
                <span className="text-gray-400 text-[11px]">Cardholder: </span>
                <span className="font-bold text-white uppercase">{user?.name || "Verified Indian Farmer"}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-[11px]">Credit Limit: </span>
                <span className="font-bold text-emerald-400">₹{(kccDetails?.creditLimit || kccDetails?.paymentAmount || user?.kccCreditLimit || 50000).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> All 100% Platform Features Unlocked
              </span>
              <Link to="/wallet" className="text-primary hover:underline font-bold">
                View in Wallet →
              </Link>
            </div>
          </div>
        )}

        {/* Section 1: Aadhaar Details */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 mb-5 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Aadhaar Details
              </h3>
              <p className="text-[11px] text-gray-400">Securely stored only for identity verification</p>
            </div>
            <button
              onClick={() => setIsEditAadhaarOpen(true)}
              className="text-gray-400 hover:text-primary transition-colors cursor-pointer p-1"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
              <span className="text-gray-400 font-medium">Aadhaar Number</span>
              <span className="text-white font-bold tracking-wider">{user?.aadhaarNumber || "Not set"}</span>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
              <span className="text-gray-400 font-medium">Aadhaar Card - Front Side</span>
              <span className="text-gray-400 italic">{user?.aadhaarFront || "No file uploaded yet"}</span>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
              <span className="text-gray-400 font-medium">Aadhaar Card - Back Side</span>
              <span className="text-gray-400 italic">{user?.aadhaarBack || "No file uploaded yet"}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Bank Details */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 mb-6 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Bank Details
              </h3>
              <p className="text-[11px] text-gray-400">Securely saved for crop sales & payouts</p>
            </div>
            <button
              onClick={() => setIsEditBankOpen(true)}
              className="text-gray-400 hover:text-primary transition-colors cursor-pointer p-1"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
              <span className="text-gray-400 font-medium">Holder Name</span>
              <span className="text-white font-semibold">{user?.bankHolder || "Not set"}</span>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
              <span className="text-gray-400 font-medium">Bank Name</span>
              <span className="text-white font-semibold">{user?.bankName || "Not set"}</span>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
              <span className="text-gray-400 font-medium">Account Number</span>
              <span className="text-white font-semibold font-mono">{user?.bankAccount || "Not set"}</span>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
              <span className="text-gray-400 font-medium">IFSC Code</span>
              <span className="text-white font-semibold font-mono uppercase">{user?.bankIfsc || "Not set"}</span>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
              <span className="text-gray-400 font-medium">Bank Branch Address</span>
              <span className="text-white font-semibold">{user?.bankAddress || "Not set"}</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation Options (Matching Image 5) */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-2 space-y-1 mb-8">
          
          <Link
            to="/wallet"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-gray-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Wallet className="h-4 w-4" />
              </div>
              <span>Wallet</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* KCC Card Item */}
          <Link
            to="/wallet"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-gray-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-semibold">
                  {isKccApproved
                    ? `KCC Card (${user?.kccCardNumber || kccDetails?.cardNumber || "Active"})`
                    : hasAppliedKcc
                    ? "KCC Credit Card (Applied)"
                    : "Apply for Kisan Credit Card (KCC)"}
                </span>
                {isKccApproved && (
                  <span className="text-[10px] text-emerald-400">All features unlocked · 100% active</span>
                )}
              </div>
            </div>
            {isKccApproved ? (
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">Active 💳</Badge>
            ) : hasAppliedKcc ? (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">Under Review ⏳</Badge>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsKccAppModalOpen(true);
                }}
                className="text-xs text-amber-400 hover:underline font-bold"
              >
                Apply Now →
              </button>
            )}
          </Link>

          <Link
            to="/machinery-booking"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-gray-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <span>My Booking</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Application for Loan Item */}
          <Link
            to="/wallet"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-gray-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-semibold">
                  {isKccApproved
                    ? `KCC Credit Facility (₹${(kccDetails?.paymentAmount || 150000).toLocaleString("en-IN")})`
                    : hasAppliedKcc
                    ? "Application for Loan (Submitted)"
                    : "Application for Loan"}
                </span>
                {isKccApproved && (
                  <span className="text-[10px] text-gray-400">Subsidised 4% p.a. credit limit</span>
                )}
              </div>
            </div>
            {isKccApproved ? (
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">Approved ✅</Badge>
            ) : hasAppliedKcc ? (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">Under Review</Badge>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsKccAppModalOpen(true);
                }}
                className="text-xs text-primary hover:underline font-bold"
              >
                Apply Now →
              </button>
            )}
          </Link>

          <Link
            to="/kisan-pathshala"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-gray-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <span>Kisan Pathshala</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/help-center"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-gray-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <HelpCircle className="h-4 w-4" />
              </div>
              <span>Help & Support</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => setIsChangePassOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-gray-200 group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <span>Change Password</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setIsTcOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-gray-200 group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <span>Terms & Conditions</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 transition-colors text-sm font-bold text-red-400 group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <LogOut className="h-4 w-4" />
              </div>
              <span>Logout</span>
            </div>
            <ChevronRight className="h-4 w-4 text-red-500/50 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

      </div>

      {/* CHANGE PASSWORD MODAL */}
      {isChangePassOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-400" /> Change Account Password
              </h3>
              <button onClick={() => setIsChangePassOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Current Password</Label>
                <Input
                  type="password"
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  placeholder="Enter your current password"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-300 mb-1 block">New Password <span className="text-red-400">*</span></Label>
                <Input
                  type="password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="Create a new strong password"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Confirm New Password <span className="text-red-400">*</span></Label>
                <Input
                  type="password"
                  value={confirmNewPass}
                  onChange={e => setConfirmNewPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmittingPass} className="w-full bg-primary text-black font-bold py-2.5 rounded-xl cursor-pointer">
                {isSubmittingPass ? "Updating Password..." : "Update Password →"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-lg text-white">Edit Profile Info</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Full Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="bg-white/5 border-white/10 text-white" required />
              </div>
              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Phone Number</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-white/5 border-white/10 text-white" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-300 mb-1 block">Village</Label>
                  <Input value={village} onChange={e => setVillage(e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label className="text-xs text-gray-300 mb-1 block">District</Label>
                  <Input value={district} onChange={e => setDistrict(e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-300 mb-1 block">State</Label>
                  <Input value={state} onChange={e => setState(e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label className="text-xs text-gray-300 mb-1 block">Pincode</Label>
                  <Input value={pincode} onChange={e => setPincode(e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary text-black font-bold py-2.5">Save Basic Details</Button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT AADHAAR MODAL */}
      {isEditAadhaarOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-lg text-white">Update Aadhaar Details</h3>
              <button onClick={() => setIsEditAadhaarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAadhaar} className="space-y-4">
              <div>
                <Label className="text-xs text-gray-300 mb-1 block">12-Digit Aadhaar Number</Label>
                <Input
                  value={aadhaarNum}
                  onChange={e => setAadhaarNum(e.target.value)}
                  placeholder="e.g. 5432 8901 2345"
                  className="bg-white/5 border-white/10 text-white font-mono"
                  required
                />
              </div>

              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Upload Aadhaar Front Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setFrontCardName(e.target.files[0].name);
                    }}
                    className="bg-white/5 border-white/10 text-xs text-gray-300"
                  />
                </div>
                <span className="text-[11px] text-primary mt-1 block">{frontCardName}</span>
              </div>

              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Upload Aadhaar Back Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setBackCardName(e.target.files[0].name);
                    }}
                    className="bg-white/5 border-white/10 text-xs text-gray-300"
                  />
                </div>
                <span className="text-[11px] text-primary mt-1 block">{backCardName}</span>
              </div>

              <Button type="submit" className="w-full bg-primary text-black font-bold py-2.5">Save & Verify Aadhaar</Button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BANK MODAL */}
      {isEditBankOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-lg text-white">Update Bank Details</h3>
              <button onClick={() => setIsEditBankOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveBank} className="space-y-3">
              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Account Holder Name</Label>
                <Input value={bankHolder} onChange={e => setBankHolder(e.target.value)} placeholder="Full name as in bank" className="bg-white/5 border-white/10 text-white" required />
              </div>
              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Bank Name</Label>
                <Input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. State Bank of India" className="bg-white/5 border-white/10 text-white" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-300 mb-1 block">Account Number</Label>
                  <Input value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="Account no." className="bg-white/5 border-white/10 text-white font-mono" required />
                </div>
                <div>
                  <Label className="text-xs text-gray-300 mb-1 block">IFSC Code</Label>
                  <Input value={bankIfsc} onChange={e => setBankIfsc(e.target.value)} placeholder="e.g. SBIN0001234" className="bg-white/5 border-white/10 text-white font-mono uppercase" required />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Bank Branch Address</Label>
                <Input value={bankAddress} onChange={e => setBankAddress(e.target.value)} placeholder="Branch name & district" className="bg-white/5 border-white/10 text-white" />
              </div>
              <Button type="submit" className="w-full bg-primary text-black font-bold py-2.5 mt-2">Save Bank Account</Button>
            </form>
          </div>
        </div>
      )}

      {/* TERMS & CONDITIONS MODAL */}
      {isTcOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-lg text-white">Terms & Conditions</h3>
              <button onClick={() => setIsTcOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-gray-300 max-h-72 overflow-y-auto pr-2 leading-relaxed">
              <p className="font-semibold text-white">1. Service Usage & Eligibility</p>
              <p>KRIVEXA platform provides smart agriculture services including Mandi Bhav tracking, machinery booking, labour dispatch, and KCC loan assistance for farmers and agricultural partners across Bihar and surrounding states.</p>
              <p className="font-semibold text-white">2. User Verification & Privacy</p>
              <p>Aadhaar and Bank details submitted under User Profile are stored securely using encryption and used solely for direct payment transfers, identity verification, and government scheme processing.</p>
              <p className="font-semibold text-white">3. Machinery & Labour Booking</p>
              <p>All machine allotments are processed by verified administrators. Cancellation or modification must be requested prior to dispatch.</p>
            </div>
            <Button onClick={() => setIsTcOpen(false)} className="w-full bg-primary text-black font-bold py-2.5 mt-4">Close Terms</Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

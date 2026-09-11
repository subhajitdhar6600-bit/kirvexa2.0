import React, { createContext, useContext, useState, useEffect } from "react";
import { type Language, TRANSLATIONS, type Translations } from "@/lib/translations.ts";
import { toast } from "sonner";
import { api } from "@/services/api";

// ?? One-time migration: rename krivexa_* localStorage keys to krivexo_* ??????
(function migrateLocalStorageKeys() {
  const keyMap: Record<string, string> = {
    "krivexa_user_profile": "krivexo_user_profile",
    "krivexa_registered_accounts": "krivexo_registered_accounts",
    "krivexa_wallet_txns": "krivexo_wallet_txns",
    "krivexa_notifications": "krivexo_notifications",
    "krivexa_user_notifications": "krivexo_user_notifications",
    "krivexa_dealer_listings": "krivexo_dealer_listings",
    "krivexa_kcc_apps": "krivexo_kcc_apps",
    "krivexa_kcc_status": "krivexo_kcc_status",
    "krivexa_farmer_cards": "krivexo_farmer_cards",
    "krivexa_crop_listings": "krivexo_crop_listings",
    "krivexa_labour_bookings": "krivexo_labour_bookings",
    "krivexa_machinery_bookings": "krivexo_machinery_bookings",
    "krivexa_expert_queries": "krivexo_expert_queries",
    "krivexa_cart": "krivexo_cart",
    "krivexa_orders": "krivexo_orders",
  };
  if (localStorage.getItem("krivexo_migrated_v1")) return;
  Object.entries(keyMap).forEach(([oldKey, newKey]) => {
    const val = localStorage.getItem(oldKey);
    if (val !== null && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, val);
    }
    if (val !== null) localStorage.removeItem(oldKey);
  });
  localStorage.setItem("krivexo_migrated_v1", "1");
})();
// ?????????????????????????????????????????????????????????????????????????????


export interface CropListing {
  id: string;
  sellerName: string;
  district: string;
  city: string;
  address: string;
  pincode: string;
  phone: string;
  cropName: string;
  weight: string;
  price: number;
  image: string;
  images?: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface LabourBookingRequest {
  id: string;
  userId?: string;
  userName: string;
  phone: string;
  labourType: string;
  count: number;
  days: number;
  startDate: string;
  endDate: string;
  location: string;
  status: "pending" | "pending_rate" | "rate_quoted" | "rate_accepted" | "cancelled" | "assigned" | "allotted" | "completed";
  rateQuote?: string;
  rateQuoteAmount?: number;
  rateNotes?: string;
  userResponse?: "" | "accepted" | "cancelled";
  userResponseAt?: string;
  assignedLabours?: Array<{ name: string; phone: string; charges?: string }>;
  adminNotes?: string;
  createdAt: string;
}

export interface ExpertAdviceQuery {
  id: string;
  farmerName: string;
  phone: string;
  address: string;
  cropName: string;
  problemDetails: string;
  status: "pending" | "resolved" | "contacted";
  adminReply?: string;
  createdAt: string;
}

export interface MandiRate {
  id: string;
  name: string;
  hindi: string;
  min: number;
  max: number;
  modal: number;
  unit: string;
  change: number;
  img: string;
  mandi: string;
}

export interface KccApplication {
  id: string;
  fullName: string;
  phone: string;
  aadhaar?: string;
  address?: string;
  district?: string;
  landSize?: string;
  status: "pending" | "approved" | "rejected";
  cardNumber?: string;
  issueDate?: string;
  cardTier?: "standard" | "nex" | "prime";
  paymentStatus?: "pending" | "paid";
  paymentAmount?: number;
  creditLimit?: number;
  creditBalance?: number;
  appliedByDealer?: string;
  dealerName?: string;
  createdAt: string;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "farmer" | "dealer";
  state: string;
  district: string;
  village: string;
  businessName?: string;
  dealerType?: string;
  dealerId?: string;
  dealerPassword?: string;
  dealerStatus?: "pending" | "approved" | "rejected";
  gstNumber?: string;
  licenseNumber?: string;
  occupation?: string;
  pincode?: string;
  landSize?: string;
  aadhaarNumber?: string;
  aadhaarFront?: string;
  aadhaarBack?: string;
  bankHolder?: string;
  bankName?: string;
  bankAccount?: string;
  bankIfsc?: string;
  bankAddress?: string;
  verificationStatus?: "Pending" | "Verified";
  isKccIssued?: boolean;
  isVerified?: boolean;
  kccCardNumber?: string;
  kccCreditLimit?: number;
  userId?: string;
  gender?: string;
  dob?: string;
  address?: string;
  createdAt: string;
}

export interface RegisteredAccount {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  email?: string;
  password?: string;
  role: "farmer" | "dealer";
  gender?: string;
  dob?: string;
  address?: string;
  state: string;
  district: string;
  village: string;
  businessName?: string;
  dealerType?: string;
  dealerId?: string;
  dealerPassword?: string;
  dealerStatus?: "pending" | "approved" | "rejected";
  gstNumber?: string;
  licenseNumber?: string;
  occupation?: string;
  isKccIssued?: boolean;
  isVerified?: boolean;
  kccCardNumber?: string;
  kccCreditLimit?: number;
  pincode?: string;
  aadhaarNumber?: string;
  bankHolder?: string;
  bankName?: string;
  bankAccount?: string;
  bankIfsc?: string;
  bankAddress?: string;
  createdAt: string;
  [key: string]: any;
}

export interface MachineryBookingRequest {
  id: string;
  userId?: string;
  userName: string;
  phone: string;
  machineryType: string;
  bookingDate: string;
  durationHours: string | number;
  location: string;
  status: "pending" | "pending_rate" | "rate_quoted" | "rate_accepted" | "cancelled" | "allotted" | "rejected" | "completed";
  rateQuote?: string;
  rateQuoteAmount?: number;
  rateNotes?: string;
  userResponse?: "" | "accepted" | "cancelled";
  userResponseAt?: string;
  allottedMachine?: {
    machineName?: string;
    numberPlate?: string;
    operatorName?: string;
    operatorPhone?: string;
    detailsText?: string;
  };
  allottedMachineDetails?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface ActiveReviewBooking {
  id: string;
  serviceType: string;
  bookingType: "machinery" | "labour";
  userName: string;
  phone: string;
  date: string;
  duration: string;
  location: string;
  rateQuote: string;
  rateQuoteAmount?: number;
  rateNotes?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  category?: string;
  price: number;
  unit?: string;
  image?: string;
  quantity: number;
  sellerName?: string;
}

export interface DealerListing {
  id: string;
  dealerId: string;
  dealerName: string;
  type: "product" | "machinery" | "labour";
  title: string;
  category?: string;
  price: number | string;
  unit?: string;
  description?: string;
  image?: string;
  images?: string[];
  specifications?: string;
  location?: string;
  workerCount?: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface PathshalaVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  category: string;
  description?: string;
  createdAt: string;
}

export interface RegisteredFarmer {
  id: string;
  name: string;
  phone: string;
  aadhaar: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  landSize: string;
  registeredByDealer: string;
  createdAt: string;
}

export interface CartOrder {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: "kcc" | "upi" | "cod" | "wallet";
  deliveryAddress: string;
  status: "Confirmed" | "Packed" | "Dispatched" | "Delivered" | "Processing";
  assignedDealerName?: string;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: "info" | "success" | "warning";
  link?: string;
  category?: "crops" | "labour" | "expert" | "wallet" | "kcc" | "account" | "mandi" | "machinery" | "orders" | "soil" | "services" | "system" | "finance" | "promotion";
  pdfDataUrl?: string;
  pdfFileName?: string;
  data?: any;
  createdAt?: string;
}

export interface WalletTransaction {
  id: string;
  title: string;
  type: "credit" | "debit";
  amount: number;
  date: string;
  category: string;
  source?: "wallet" | "kcc";
}

interface AppContextType {
  // MongoDB Database Integration Status
  mongoConnected: boolean;
  mongoDatabase: string;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;

  // KCC Gatekeeper
  isKccIssued: boolean;
  hasAppliedKcc: boolean;
  kccApplicationStatus: "none" | "pending" | "approved" | "rejected";
  kccDetails: (KccApplication & { creditBalance?: number }) | null;
  kccAvailableBalance: number;
  isKccAlertOpen: boolean;
  setIsKccAlertOpen: (open: boolean) => void;
  isKccAppModalOpen: boolean;
  setIsKccAppModalOpen: (open: boolean) => void;
  checkKccPermission: (actionName?: string) => boolean;
  submitKccApplication: (appData: Omit<KccApplication, "id" | "status" | "createdAt">) => void;
  toggleKccDemoStatus: () => void;

  // Cart & Orders System
  cart: CartItem[];
  addToCart: (item: { id: string; name: string; category?: string; price: number; unit?: string; image?: string; sellerName?: string }) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkoutCart: (paymentMethod: "kcc" | "upi" | "cod" | "wallet", deliveryAddress: string) => { success: boolean; message: string; orderId?: string };
  orders: CartOrder[];

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminName: string;
  adminLogin: (id: string, pass: string) => boolean;
  adminLogout: () => void;

  // Crop Listings (Sell Crops -> Buy Inputs)
  cropListings: CropListing[];
  addCropListing: (listing: Omit<CropListing, "id" | "status" | "createdAt">) => void;
  approveCropListing: (id: string) => void;
  rejectCropListing: (id: string) => void;

  // Machinery Booking
  machineryBookings: MachineryBookingRequest[];
  addMachineryBooking: (booking: Omit<MachineryBookingRequest, "id" | "status" | "createdAt">) => void;
  quoteMachineryRate: (id: string, rateQuote: string, rateQuoteAmount?: number, notes?: string) => Promise<void>;
  respondMachineryBooking: (id: string, response: "accepted" | "cancelled") => Promise<void>;
  allotMachineryBookingWithResources: (id: string, data: { machineName?: string; numberPlate?: string; operatorName?: string; operatorPhone?: string; detailsText?: string; adminNotes?: string }) => Promise<void>;
  allotMachineryBooking: (id: string, machineDetails: string, notes?: string) => void;
  rejectMachineryBooking: (id: string) => void;

  // Labour Booking & Admin Labour Types
  labourTypes: string[];
  addLabourType: (type: string) => void;
  removeLabourType: (type: string) => void;
  labourBookings: LabourBookingRequest[];
  addLabourBooking: (booking: Omit<LabourBookingRequest, "id" | "status" | "createdAt">) => void;
  quoteLabourRate: (id: string, rateQuote: string, rateQuoteAmount?: number, notes?: string) => Promise<void>;
  respondLabourBooking: (id: string, response: "accepted" | "cancelled") => Promise<void>;
  allotLabourBookingWithResources: (id: string, data: { assignedLabours?: any[]; workerNames?: string; leadPhone?: string; adminNotes?: string }) => Promise<void>;
  assignLaboursToBooking: (id: string, assigned: Array<{ name: string; phone: string; charges?: string }>, notes?: string) => void;

  // Rate Review Modal
  activeReviewBooking: ActiveReviewBooking | null;
  openRateReviewModal: (booking: ActiveReviewBooking) => void;
  closeRateReviewModal: () => void;
  refreshBookings: () => Promise<void>;
  // Expert Advice
  expertAdviceQueries: ExpertAdviceQuery[];
  addExpertQuery: (query: Omit<ExpertAdviceQuery, "id" | "status" | "createdAt">) => void;
  updateExpertQueryStatus: (id: string, status: "pending" | "resolved" | "contacted", reply?: string) => void;

  // Mandi Bhav
  mandiRates: MandiRate[];
  addMandiRate: (rate: Omit<MandiRate, "id">) => void;
  updateMandiRate: (id: string, updated: Partial<MandiRate>) => void;
  deleteMandiRate: (id: string) => void;

  // User Profile & Auth Session
  user: UserProfile | null;
  registeredAccounts: RegisteredAccount[];
  registerNewAccount: (accountData: Omit<RegisteredAccount, "id" | "createdAt">) => RegisteredAccount;
  loginUser: (profileData: Omit<UserProfile, "id" | "createdAt">) => void;
  logoutUser: () => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;

  // User Wallet & Transactions
  walletTransactions: WalletTransaction[];
  walletBalance: number;
  addWalletTransaction: (txn: Omit<WalletTransaction, "id" | "date">) => void;

  // User Notifications
  notifications: UserNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  refreshNotifications: () => Promise<void>;
  addNotification: (
    title: string,
    message: string,
    type?: "info" | "success" | "warning",
    link?: string,
    category?: UserNotification["category"],
    pdfDataUrl?: string,
    pdfFileName?: string
  ) => void;

  // KCC Applications for Admin & Dealer KCC Apply
  kccApplications: KccApplication[];
  approveKccApplication: (id: string, customCardNumber?: string, customLimit?: number) => void;
  rejectKccApplication: (id: string) => void;
  loadAllKccApplications: () => Promise<void>;
  updateKccLimit: (cardNumber: string, newLimit: number, phone?: string) => Promise<void>;

  // Dealer KCC & POS Features
  dealerApplyFarmerKcc: (appData: Partial<KccApplication> & { fullName: string; phone: string; appliedByDealer?: string }) => void;
  checkFarmerCardBalance: (cardNumber: string) => { exists: boolean; cardHolder?: string; balance?: number; status?: string } | null;
  chargeFarmerCard: (cardNumber: string, amount: number, itemDesc: string) => { success: boolean; message: string; remainingBalance?: number; txId?: string };
  allotDealerCredentials: (dealerIdentifier: { id?: string; phone?: string; email?: string }, dealerId: string, password: string) => Promise<void>;

  // Dealer Product / Service Listings (Point 4)
  dealerListings: DealerListing[];
  addDealerListing: (item: Omit<DealerListing, "id" | "status" | "createdAt">) => void;
  approveDealerListing: (id: string) => void;
  rejectDealerListing: (id: string) => void;
  updateDealerListing: (id: string, updated: Partial<DealerListing>) => void;

  // Kisan Pathshala Videos
  pathshalaVideos: PathshalaVideo[];
  addPathshalaVideo: (video: Omit<PathshalaVideo, "id" | "createdAt">) => void;
  deletePathshalaVideo: (id: string) => void;

  // New Farmer Registration by Dealer (Point 1.iii)
  registeredFarmers: RegisteredFarmer[];
  registerFarmerByDealer: (farmerData: Omit<RegisteredFarmer, "id" | "createdAt">) => RegisteredFarmer;

  // Checking KCC status by Phone/Aadhaar/Card Number & full profile lookup (Point 1.i & 1.iv)
  checkKccStatusByPhoneAadhaar: (phone?: string, aadhaar?: string, cardNumber?: string) => KccApplication | null;
  getFarmerProfileByDetails: (query: { kccNum?: string; aadhaar?: string; phone?: string }) => { exists: boolean; profile?: any; kccApp?: KccApplication; cardInfo?: any };
  lookupFarmerProfileAsync: (query: { kccNum?: string; aadhaar?: string; phone?: string }) => Promise<{ exists: boolean; profile?: any; kccApp?: KccApplication; cardInfo?: any }>;

  // Order Status Updates by Dealer (Point 4)
  updateOrderStatus: (orderId: string, newStatus: "Confirmed" | "Packed" | "Dispatched" | "Delivered") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// All data hydrated dynamically from API
const INITIAL_MANDI_RATES: MandiRate[] = [];
const INITIAL_CROPS: CropListing[] = [];
const INITIAL_LABOUR_TYPES: string[] = [];

export function safeJsonParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null") return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`[safeJsonParse] Corrupted localStorage key "${key}", resetting to fallback:`, e);
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // MongoDB Connection State
  const [mongoConnected, setMongoConnected] = useState<boolean>(false);
  const [mongoDatabase, setMongoDatabase] = useState<string>("Farma");

  // Language State
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("krivexo_lang") as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("krivexo_lang", lang);
  };

  const t = TRANSLATIONS[language];

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("krivexo_admin_session") === "true";
  });
  const [adminName, setAdminName] = useState<string>(() => {
    return localStorage.getItem("krivexo_admin_name") || "Aditya Saha";
  });

  const adminLogin = (id: string, _pass: string): boolean => {
    const nameToUse = id.trim() || "Aditya Saha";
    setIsAdminLoggedIn(true);
    setAdminName(nameToUse);
    localStorage.setItem("krivexo_admin_session", "true");
    localStorage.setItem("krivexo_admin_name", nameToUse);
    return true;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("krivexo_admin_session");
    localStorage.removeItem("krivexo_admin_name");
  };

  // KCC State — hydrate from localStorage / DB
  const [isKccIssuedState, setIsKccIssuedState] = useState<boolean>(false);
  const [kccApplications, setKccApplications] = useState<KccApplication[]>(() => {
    return safeJsonParse("krivexo_kcc_apps", []);
  });
  const [isKccAlertOpen, setIsKccAlertOpen] = useState<boolean>(false);
  const [isKccAppModalOpen, setIsKccAppModalOpen] = useState<boolean>(false);

  // MongoDB Synchronization & State Hydration from Database "Farma"
  useEffect(() => {
    const syncMongoData = async () => {
      try {
        const health = await api.checkHealth();
        if (health && health.isConnected) {
          setMongoConnected(true);
          setMongoDatabase(health.database || "Farma");
          await api.seedDatabase();

          const [
            remoteCrops,
            remoteLabourReqs,
            remoteLabourTypes,
            remoteMachinery,
            remoteExpert,
            remoteMandi,
            remoteDealers,
            remoteVideos,
            remoteFarmers,
            remoteOrders,
            remoteNotifs,
            remoteUsers,
            remoteKcc
          ] = await Promise.all([
            api.getCrops(),
            api.getLabourBookings(),
            api.getLabourTypes(),
            api.getMachineryBookings(),
            api.getExpertQueries(),
            api.getMandiRates(),
            api.getDealerListings(),
            api.getPathshalaVideos(),
            api.getRegisteredFarmers(),
            api.getOrders(),
            api.getNotifications(),
            api.getUsers(),
            api.getKccApplications()
          ]);

          // Hydrate KCC applications from DB
          if (Array.isArray(remoteKcc) && remoteKcc.length > 0) {
            setKccApplications((prev) => {
              const map = new Map<string, KccApplication>();
              prev.forEach((item) => map.set(item.id, item));
              remoteKcc.forEach((item: any) => map.set(item.id, item));
              const merged = Array.from(map.values());
              localStorage.setItem("krivexo_kcc_apps", JSON.stringify(merged));
              return merged;
            });
          }

          // Hydrate registered user accounts from DB
          if (remoteUsers && remoteUsers.length > 0) {
            const mappedAccounts: RegisteredAccount[] = remoteUsers.map((u: any) => ({
              id: u.id || `acc-${Math.random()}`,
              fullName: u.fullName || u.name || "Registered User",
              phone: u.phone || "",
              password: u.password || "",
              role: u.role || "farmer",
              state: u.state || "Bihar",
              district: u.district || "Patna",
              village: u.village || "",
              businessName: u.businessName,
              dealerType: u.dealerType,
              occupation: u.occupation,
              isKccIssued: u.isKccIssued,
              isVerified: u.isVerified,
              kccCardNumber: u.kccCardNumber,
              createdAt: u.createdAt || new Date().toISOString(),
            }));
            setRegisteredAccounts((prev) => {
              const combined = [...mappedAccounts];
              prev.forEach((localAcc) => {
                if (!combined.some((a) => a.phone === localAcc.phone)) {
                  combined.push(localAcc);
                }
              });
              return combined;
            });
          }

          if (Array.isArray(remoteCrops)) setCropListings(remoteCrops);
          if (Array.isArray(remoteLabourReqs)) setLabourBookings(remoteLabourReqs);
          if (Array.isArray(remoteLabourTypes)) setLabourTypes(remoteLabourTypes);
          if (Array.isArray(remoteMachinery)) setMachineryBookings(remoteMachinery);
          if (Array.isArray(remoteExpert)) setExpertAdviceQueries(remoteExpert);
          if (Array.isArray(remoteMandi)) setMandiRates(remoteMandi);
          if (Array.isArray(remoteDealers)) setDealerListings(remoteDealers);
          if (Array.isArray(remoteVideos)) setPathshalaVideos(remoteVideos);
          if (Array.isArray(remoteFarmers)) setRegisteredFarmers(remoteFarmers);
          if (Array.isArray(remoteOrders)) setOrders(remoteOrders);
          if (Array.isArray(remoteNotifs)) setNotifications(remoteNotifs);
        } else {
          setMongoConnected(false);
        }
      } catch (err) {
        console.warn("[MongoDB] Sync warning:", err);
      }
    };

    syncMongoData();
  }, []);

  useEffect(() => {
    localStorage.setItem("krivexo_kcc_apps", JSON.stringify(kccApplications));
  }, [kccApplications]);

  const submitKccApplication = (appData: Partial<KccApplication>) => {
    const newApp: KccApplication = {
      aadhaar: "",
      address: "",
      district: "Patna",
      landSize: "3 Acres",
      ...appData,
      fullName: appData.fullName || user?.name || "Farmer",
      phone: appData.phone || user?.phone || "",
      id: `kcc-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setKccApplications((prev) => [newApp, ...prev.filter((a) => a.phone !== newApp.phone)]);
    api.submitKccApplication(newApp);
    addNotification(
      "KCC Application Submitted 💳",
      `Your Kisan Credit Card application has been submitted. We will review it shortly.`,
      "info",
      "/dashboard",
      "kcc"
    );
  };

  const toggleKccDemoStatus = () => {
    const nextState = !isKccIssuedState;
    setIsKccIssuedState(nextState);
    localStorage.setItem("krivexo_kcc_issued", nextState ? "true" : "false");
  };

  const approveKccApplication = (id: string, customCardNumber?: string, customLimit?: number) => {
    const targetApp = kccApplications.find((a) => a.id === id);
    const cleanT = (targetApp?.phone || "").replace(/\D/g, "").slice(-10);
    const matchesApplicant = (p?: string, n?: string) => {
      if (!targetApp) return false;
      const cleanP = (p || "").replace(/\D/g, "").slice(-10);
      if (cleanT && cleanP && cleanT === cleanP) return true;
      if (n && targetApp.fullName && n.trim().toLowerCase() === targetApp.fullName.trim().toLowerCase()) return true;
      return false;
    };

    const existingNum = targetApp?.cardNumber || (user && matchesApplicant(user.phone, user.name) ? user.kccCardNumber : undefined);
    const cleanPhoneDigits = (targetApp?.phone || "").replace(/\D/g, "").slice(-4);
    const cardNumber = customCardNumber?.trim() || existingNum || `KCC-BH-2026-${cleanPhoneDigits || Math.floor(1000 + Math.random() * 9000)}`;
    const limit = customLimit || targetApp?.creditLimit || targetApp?.paymentAmount || 50000;

    const updatedApps = kccApplications.map((app) => {
      if (app.id === id) {
        return {
          ...app,
          status: "approved" as const,
          cardNumber,
          creditLimit: limit,
          paymentAmount: limit,
          issueDate: new Date().toISOString().split("T")[0],
        };
      }
      return app;
    });
    setKccApplications(updatedApps);
    localStorage.setItem("krivexo_kcc_apps", JSON.stringify(updatedApps));

    api.approveKccApplication(id, cardNumber, limit);

    // If matches currently logged-in user, unlock KCC immediately
    if (user && matchesApplicant(user.phone, user.name)) {
      setIsKccIssuedState(true);
      localStorage.setItem("krivexo_kcc_issued", "true");
      const updatedUser: UserProfile = {
        ...user,
        isKccIssued: true,
        isVerified: true,
        kccCardNumber: cardNumber,
        kccCreditLimit: limit,
      };
      setUser(updatedUser);
      localStorage.setItem("krivexo_user_profile", JSON.stringify(updatedUser));
    }

    // Also update registered account if found
    setRegisteredAccounts((prev) => {
      const updated = prev.map((acc) => {
        if (matchesApplicant(acc.phone, acc.fullName)) {
          return { ...acc, isKccIssued: true, isVerified: true, kccCardNumber: cardNumber, kccCreditLimit: limit };
        }
        return acc;
      });
      localStorage.setItem("krivexo_registered_accounts", JSON.stringify(updated));
      return updated;
    });

    // Also update registeredFarmers if found
    setRegisteredFarmers((prev) =>
      prev.map((f) => {
        if (matchesApplicant(f.phone, f.name)) {
          return { ...f, isKccIssued: true, cardNumber, creditLimit: limit };
        }
        return f;
      })
    );

    addNotification(
      "Kisan Credit Card (KCC) Approved & Allotted 💳",
      `Congratulations ${targetApp?.fullName || "User"}! Your KCC card application has been approved by the Admin. Allotted Card Number: ${cardNumber} with Credit Limit of ₹${limit.toLocaleString("en-IN")}. All platform features (buying, selling, bookings & trading) are now 100% unlocked!`,
      "success",
      "/wallet",
      "kcc"
    );
  };

  const rejectKccApplication = (id: string) => {
    setKccApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "rejected" } : app))
    );
    api.rejectKccApplication(id);
  };

  // Admin: load ALL KCC applications from DB (called by admin panel on mount)
  const loadAllKccApplications = async () => {
    try {
      const allApps = await api.getKccApplications();
      if (allApps && allApps.length > 0) {
        setKccApplications(allApps);
      }
    } catch (e) {
      console.warn("Failed to load KCC applications:", e);
    }
  };

  // Update KCC Credit Limit across applications, user profile, accounts, POS store & backend API
  const updateKccLimit = async (cardNumber: string, newLimit: number, phone?: string) => {
    const cleanCard = cardNumber.trim();
    const cleanP = (phone || "").replace(/\D/g, "").slice(-10);

    // 1. Update kccApplications state & localStorage
    setKccApplications((prev) => {
      const updated = prev.map((app) => {
        const appP = (app.phone || "").replace(/\D/g, "").slice(-10);
        const matchCard = app.cardNumber && app.cardNumber.trim().toLowerCase() === cleanCard.toLowerCase();
        const matchPhone = cleanP && appP && cleanP === appP;
        if (matchCard || matchPhone) {
          return {
            ...app,
            creditLimit: newLimit,
            paymentAmount: newLimit,
          };
        }
        return app;
      });
      localStorage.setItem("krivexo_kcc_apps", JSON.stringify(updated));
      return updated;
    });

    // 2. Update currently logged in user if this card belongs to them
    if (user) {
      const uPhone = (user.phone || "").replace(/\D/g, "").slice(-10);
      const matchCard = user.kccCardNumber && user.kccCardNumber.trim().toLowerCase() === cleanCard.toLowerCase();
      const matchPhone = cleanP && uPhone && cleanP === uPhone;
      if (matchCard || matchPhone) {
        const updatedUser: UserProfile = {
          ...user,
          kccCreditLimit: newLimit,
        };
        setUser(updatedUser);
        localStorage.setItem("krivexo_user_profile", JSON.stringify(updatedUser));
        api.saveUser(updatedUser).catch(() => {});
      }
    }

    // 3. Update registeredAccounts state & localStorage
    setRegisteredAccounts((prev) => {
      const updated = prev.map((acc) => {
        const accP = (acc.phone || "").replace(/\D/g, "").slice(-10);
        const matchCard = acc.kccCardNumber && acc.kccCardNumber.trim().toLowerCase() === cleanCard.toLowerCase();
        const matchPhone = cleanP && accP && cleanP === accP;
        if (matchCard || matchPhone) {
          return {
            ...acc,
            kccCreditLimit: newLimit,
          };
        }
        return acc;
      });
      localStorage.setItem("krivexo_registered_accounts", JSON.stringify(updated));
      return updated;
    });

    // 4. Update farmerCardStore for POS transactions
    setFarmerCardStore((prev) => ({
      ...prev,
      [cleanCard]: {
        ...(prev[cleanCard] || {}),
        balance: newLimit,
        status: "active",
      },
    }));

    // 5. Call API backend to update database
    try {
      await api.updateKccLimit({ cardNumber: cleanCard, phone: cleanP, creditLimit: newLimit });
    } catch (e) {
      console.warn("Failed to update limit in backend API:", e);
    }

    // 6. Dispatch notification
    addNotification(
      "KCC Credit Limit Updated 💳",
      `KCC Card limit for #${cleanCard} has been updated to ₹${newLimit.toLocaleString("en-IN")}.`,
      "info",
      "/wallet",
      "kcc"
    );
  };

  // Allot Dealer ID and Password upon Admin Review
  const allotDealerCredentials = async (
    dealerIdentifier: { id?: string; phone?: string; email?: string },
    dealerId: string,
    password: string
  ) => {
    const cleanId = (dealerIdentifier.id || "").trim();
    const cleanP = (dealerIdentifier.phone || "").replace(/\D/g, "").slice(-10);
    const cleanE = (dealerIdentifier.email || "").trim().toLowerCase();

    // 1. Update registeredAccounts state & localStorage
    setRegisteredAccounts((prev) => {
      const updated = prev.map((acc) => {
        const accP = (acc.phone || "").replace(/\D/g, "").slice(-10);
        const accE = (acc.email || "").trim().toLowerCase();
        const matchId = cleanId && acc.id === cleanId;
        const matchP = cleanP && accP && cleanP === accP;
        const matchE = cleanE && accE && cleanE === accE;
        if (matchId || matchP || matchE || (acc.dealerId && acc.dealerId === dealerId)) {
          return {
            ...acc,
            dealerId,
            dealerPassword: password,
            password,
            dealerStatus: "approved" as const,
            status: "active" as const,
            isVerified: true,
          };
        }
        return acc;
      });
      localStorage.setItem("krivexo_registered_accounts", JSON.stringify(updated));
      return updated;
    });

    // 2. Call backend API to persist dealer credentials
    try {
      await api.allotDealerCredentials({
        id: cleanId,
        phone: cleanP,
        email: cleanE,
        dealerId,
        password,
      });
    } catch (e) {
      console.warn("Backend dealer credential allotment error:", e);
    }
  };

  // Crop Listings State
  const [cropListings, setCropListings] = useState<CropListing[]>(() => {
    return safeJsonParse("krivexo_crop_listings", INITIAL_CROPS);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_crop_listings", JSON.stringify(cropListings));
  }, [cropListings]);

  const addCropListing = (listing: Omit<CropListing, "id" | "status" | "createdAt">) => {
    const newListing: CropListing = {
      ...listing,
      id: `crop-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setCropListings((prev) => [newListing, ...prev]);
    api.addCrop(newListing);
    addNotification(
      "Crop Listing Submitted 🌾",
      `Your listing for "${listing.cropName}" (${listing.weight}) has been submitted and is pending review.`,
      "info",
      "/sell-crops",
      "crops"
    );
  };

  const approveCropListing = (id: string) => {
    const listing = cropListings.find(c => c.id === id);
    setCropListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item))
    );
    api.approveCrop(id);
    if (listing) {
      addNotification(
        "Crop Listing Approved ✅",
        `Your crop listing "${listing.cropName}" has been approved and is now live on the marketplace.`,
        "success",
        "/agri-market",
        "crops"
      );
    }
  };

  const rejectCropListing = (id: string) => {
    setCropListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "rejected" } : item))
    );
    api.rejectCrop(id);
  };

  // Active Rate Review Modal State
  const [activeReviewBooking, setActiveReviewBooking] = useState<ActiveReviewBooking | null>(null);

  const openRateReviewModal = (booking: ActiveReviewBooking) => {
    setActiveReviewBooking(booking);
  };

  const closeRateReviewModal = () => {
    setActiveReviewBooking(null);
  };

  // Machinery Booking State
  const [machineryBookings, setMachineryBookings] = useState<MachineryBookingRequest[]>(() => {
    return safeJsonParse("krivexo_machinery_bookings", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_machinery_bookings", JSON.stringify(machineryBookings));
  }, [machineryBookings]);

  // Labour Booking State
  const [labourBookings, setLabourBookings] = useState<LabourBookingRequest[]>(() => {
    return safeJsonParse("krivexo_labour_bookings", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_labour_bookings", JSON.stringify(labourBookings));
  }, [labourBookings]);

  // Live Refresh Bookings from MongoDB
  const refreshBookings = async () => {
    try {
      const [machRes, labRes] = await Promise.allSettled([
        api.getMachineryBookings(),
        api.getLabourBookings(),
      ]);

      if (machRes.status === "fulfilled" && Array.isArray(machRes.value)) {
        setMachineryBookings(machRes.value);
      }
      if (labRes.status === "fulfilled" && Array.isArray(labRes.value)) {
        setLabourBookings(labRes.value);
      }
    } catch (err) {
      console.warn("[AppContext] Failed to refresh bookings from API:", err);
    }
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  const addMachineryBooking = (booking: Omit<MachineryBookingRequest, "id" | "status" | "createdAt">) => {
    const newBooking: MachineryBookingRequest = {
      ...booking,
      id: `mach-${Date.now()}`,
      status: "pending_rate",
      createdAt: new Date().toISOString(),
    };
    setMachineryBookings((prev) => [newBooking, ...prev]);
    api.addMachineryBooking(newBooking).catch(() => {});
    addNotification(
      "Machinery Booking Request Sent 🚜",
      `Your booking request for ${booking.machineryType} on ${booking.bookingDate} has been sent to admin for rate quote.`,
      "info",
      "/machinery-booking",
      "machinery"
    );
  };

  // Step 1: Admin quotes rate for Machinery
  const quoteMachineryRate = async (id: string, rateQuote: string, rateQuoteAmount?: number, notes?: string) => {
    setMachineryBookings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "rate_quoted", rateQuote, rateQuoteAmount: Number(rateQuoteAmount) || 0, rateNotes: notes || "" }
          : item
      )
    );
    await api.quoteMachineryRate(id, rateQuote, rateQuoteAmount, notes).catch(() => {});
    refreshBookings();
    refreshNotifications();
  };

  // Step 2: User responds (Accept or Cancel) for Machinery
  const respondMachineryBooking = async (id: string, response: "accepted" | "cancelled") => {
    const newStatus = response === "accepted" ? "rate_accepted" : "cancelled";
    setMachineryBookings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus, userResponse: response, userResponseAt: new Date().toISOString() }
          : item
      )
    );
    await api.respondMachineryRate(id, response).catch(() => {});
    if (response === "accepted") {
      toast.success("Rate accepted! Admin will now allot machinery resources.");
    } else {
      toast.info("Booking cancelled.");
    }
    refreshBookings();
  };

  // Step 3: Admin allots resources for Machinery
  const allotMachineryBookingWithResources = async (
    id: string,
    data: { machineName?: string; numberPlate?: string; operatorName?: string; operatorPhone?: string; detailsText?: string; adminNotes?: string }
  ) => {
    const detailsSummary = data.detailsText ||
      `Machine: ${data.machineName || ""}${data.numberPlate ? ` (${data.numberPlate})` : ""} | Operator: ${data.operatorName || ""} (${data.operatorPhone || ""})`;

    setMachineryBookings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "allotted",
              allottedMachine: data,
              allottedMachineDetails: detailsSummary,
              adminNotes: data.adminNotes || "",
            }
          : item
      )
    );
    await api.allotMachineryResources(id, data).catch(() => {});
    refreshBookings();
    refreshNotifications();
  };

  const allotMachineryBooking = (id: string, machineDetails: string, notes?: string) => {
    allotMachineryBookingWithResources(id, { detailsText: machineDetails, adminNotes: notes });
  };

  const rejectMachineryBooking = (id: string) => {
    const target = machineryBookings.find(m => m.id === id);
    setMachineryBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "rejected" } : item))
    );
    api.rejectMachinery(id).catch(() => {});
    addNotification(
      "Machinery Request Declined ❌",
      `Your booking request for ${target?.machineryType || "Machinery"} could not be fulfilled at this time.`,
      "warning",
      "/machinery-booking",
      "machinery"
    );
  };

  // Labour Booking & Types State
  const [labourTypes, setLabourTypes] = useState<string[]>(() => {
    return safeJsonParse("krivexo_labour_types", INITIAL_LABOUR_TYPES);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_labour_types", JSON.stringify(labourTypes));
  }, [labourTypes]);

  const addLabourType = (type: string) => {
    if (!type.trim() || labourTypes.includes(type)) return;
    setLabourTypes((prev) => [...prev, type.trim()]);
    api.addLabourType(type.trim()).catch(() => {});
  };

  const removeLabourType = (type: string) => {
    setLabourTypes((prev) => prev.filter((t) => t !== type));
    api.removeLabourType(type).catch(() => {});
  };

  const addLabourBooking = (booking: Omit<LabourBookingRequest, "id" | "status" | "createdAt">) => {
    const newBooking: LabourBookingRequest = {
      ...booking,
      id: `labour-req-${Date.now()}`,
      status: "pending_rate",
      createdAt: new Date().toISOString(),
    };
    setLabourBookings((prev) => [newBooking, ...prev]);
    api.addLabourBooking(newBooking).catch(() => {});
    addNotification(
      "Labour Booking Request Sent 👷",
      `Your request for ${booking.count} ${booking.labourType}(s) starting ${booking.startDate} has been submitted for rate quote.`,
      "info",
      "/labour-booking",
      "labour"
    );
  };

  // Step 1: Admin quotes rate for Labour
  const quoteLabourRate = async (id: string, rateQuote: string, rateQuoteAmount?: number, notes?: string) => {
    setLabourBookings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "rate_quoted", rateQuote, rateQuoteAmount: Number(rateQuoteAmount) || 0, rateNotes: notes || "" }
          : item
      )
    );
    await api.quoteLabourRate(id, rateQuote, rateQuoteAmount, notes).catch(() => {});
    refreshBookings();
    refreshNotifications();
  };

  // Step 2: User responds (Accept or Cancel) for Labour
  const respondLabourBooking = async (id: string, response: "accepted" | "cancelled") => {
    const newStatus = response === "accepted" ? "rate_accepted" : "cancelled";
    setLabourBookings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus, userResponse: response, userResponseAt: new Date().toISOString() }
          : item
      )
    );
    await api.respondLabourRate(id, response).catch(() => {});
    if (response === "accepted") {
      toast.success("Rate accepted! Admin will now allot labour resources.");
    } else {
      toast.info("Booking cancelled.");
    }
    refreshBookings();
  };

  // Step 3: Admin allots resources for Labour
  const allotLabourBookingWithResources = async (
    id: string,
    data: { assignedLabours?: any[]; workerNames?: string; leadPhone?: string; adminNotes?: string }
  ) => {
    let assigned = data.assignedLabours || [];
    if (!assigned.length && data.workerNames) {
      assigned = data.workerNames.split(",").map((name) => ({
        name: name.trim(),
        phone: data.leadPhone || "",
        charges: "",
      }));
    }

    setLabourBookings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "allotted",
              assignedLabours: assigned,
              adminNotes: data.adminNotes || "",
            }
          : item
      )
    );
    await api.allotLabourResources(id, data).catch(() => {});
    refreshBookings();
    refreshNotifications();
  };

  const assignLaboursToBooking = (
    id: string,
    assigned: Array<{ name: string; phone: string; charges?: string }>,
    notes?: string
  ) => {
    allotLabourBookingWithResources(id, { assignedLabours: assigned, adminNotes: notes });
  };

  // Expert Advice State
  const [expertAdviceQueries, setExpertAdviceQueries] = useState<ExpertAdviceQuery[]>(() => {
    return safeJsonParse("krivexo_expert_queries", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_expert_queries", JSON.stringify(expertAdviceQueries));
  }, [expertAdviceQueries]);

  const addExpertQuery = (query: Omit<ExpertAdviceQuery, "id" | "status" | "createdAt">) => {
    const newQuery: ExpertAdviceQuery = {
      ...query,
      id: `exp-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setExpertAdviceQueries((prev) => [newQuery, ...prev]);
    api.addExpertQuery(newQuery);
    addNotification(
      "Expert Advice Query Submitted 🌿",
      `Your query about "${query.cropName}" has been received. An expert will contact you soon.`,
      "info",
      "/expert-advice",
      "expert"
    );
  };

  const updateExpertQueryStatus = (
    id: string,
    status: "pending" | "resolved" | "contacted",
    reply?: string
  ) => {
    setExpertAdviceQueries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status, adminReply: reply } : item))
    );
    api.updateExpertQuery(id, status, reply);
    if (status === "resolved" && reply) {
      addNotification(
        "Expert Advice Received! 🎓",
        `Your crop query has been resolved by our expert. Tap to view the reply.`,
        "success",
        "/expert-advice",
        "expert"
      );
    } else if (status === "contacted") {
      addNotification(
        "Expert Will Contact You 📞",
        `An agricultural expert will call you shortly regarding your crop query.`,
        "info",
        "/expert-advice",
        "expert"
      );
    }
  };

  // Mandi Rates State
  const [mandiRates, setMandiRates] = useState<MandiRate[]>(() => {
    return safeJsonParse("krivexo_mandi_rates", INITIAL_MANDI_RATES);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_mandi_rates", JSON.stringify(mandiRates));
  }, [mandiRates]);

  const addMandiRate = (rate: Omit<MandiRate, "id">) => {
    const newRate: MandiRate = {
      ...rate,
      id: `mandi-${Date.now()}`,
    };
    setMandiRates((prev) => [newRate, ...prev]);
    api.addMandiRate(newRate);
  };

  const updateMandiRate = (id: string, updated: Partial<MandiRate>) => {
    setMandiRates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    api.updateMandiRate(id, updated);
  };

  const deleteMandiRate = (id: string) => {
    setMandiRates((prev) => prev.filter((item) => item.id !== id));
    api.deleteMandiRate(id);
  };

  // User Profile Session State
  const [user, setUser] = useState<UserProfile | null>(() => {
    return safeJsonParse<UserProfile | null>("krivexo_user_profile", null);
  });

  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    return safeJsonParse<UserNotification[]>("krivexo_user_notifications", []);
  });

  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    return safeJsonParse<RegisteredAccount[]>("krivexo_registered_accounts", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_registered_accounts", JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("krivexo_user_profile", JSON.stringify(user));
    } else {
      localStorage.removeItem("krivexo_user_profile");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("krivexo_user_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    return safeJsonParse<WalletTransaction[]>("krivexo_wallet_txns", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_wallet_txns", JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  const addWalletTransaction = (txn: Omit<WalletTransaction, "id" | "date">) => {
    const newTxn: WalletTransaction = {
      ...txn,
      id: `#TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    };
    setWalletTransactions((prev) => [newTxn, ...prev]);
  };

  // Deposit Wallet balance excludes KCC card debits (which are drawn from KCC credit line, not cash deposits)
  const walletBalance = walletTransactions
    .filter((t) => t.source !== "kcc" && t.category !== "KCC Order Payment" && !t.title.toLowerCase().startsWith("kcc"))
    .reduce((acc, t) => {
      return t.type === "credit" ? acc + t.amount : acc - t.amount;
    }, 0);

  const registerNewAccount = (accountData: Omit<RegisteredAccount, "id" | "createdAt">): RegisteredAccount => {
    const accountName = accountData.fullName || (accountData as any).name || "User";
    const newAccount: RegisteredAccount = {
      phone: accountData.phone || "",
      role: accountData.role || "farmer",
      state: accountData.state || "",
      district: accountData.district || "",
      village: accountData.village || "",
      ...accountData,
      fullName: accountName,
      id: `acc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRegisteredAccounts((prev) => [newAccount, ...prev.filter(a => a.phone !== newAccount.phone)]);

    // Send complete payload to API
    const apiPayload = {
      ...newAccount,
      name: accountName,
      status: (accountData as any).status || (accountData.role === "dealer" ? "pending" : "active"),
      role: accountData.role?.toLowerCase() || "farmer",
    };
    api.saveUser(apiPayload);
    return newAccount;
  };

  const loginUser = (profileData: Omit<UserProfile, "id" | "createdAt">) => {
    const cleanP = (profileData.phone || "").replace(/\D/g, "").slice(-10);
    const existingAcc = registeredAccounts.find(
      (a) => (profileData.userId && a.userId && a.userId.trim().toLowerCase() === profileData.userId.trim().toLowerCase()) ||
        (cleanP && (a.phone || "").replace(/\D/g, "").slice(-10) === cleanP) ||
        (profileData.name && a.fullName && a.fullName.trim().toLowerCase() === profileData.name.trim().toLowerCase())
    );

    const isApprovedFromAcc = Boolean(existingAcc?.isKccIssued && existingAcc?.kccCardNumber);
    const kccCardNumFromAcc = isApprovedFromAcc ? existingAcc?.kccCardNumber : undefined;
    const kccLimitFromAcc = isApprovedFromAcc ? existingAcc?.kccCreditLimit : undefined;

    const newUser: UserProfile = {
      ...profileData,
      id: `usr-${Date.now()}`,
      isKccIssued: isApprovedFromAcc,
      kccCardNumber: kccCardNumFromAcc,
      kccCreditLimit: kccLimitFromAcc || 50000,
      createdAt: new Date().toISOString(),
    };

    setIsKccIssuedState(isApprovedFromAcc);

    setUser(newUser);
    api.saveUser(newUser);

    // Hydrate KCC applications from DB and update this user's profile if approved
    api.getKccApplications().then((allApps) => {
      if (allApps && allApps.length > 0) {
        setKccApplications((prev) => {
          const map = new Map<string, KccApplication>();
          prev.forEach((item) => map.set(item.id, item));
          allApps.forEach((item: any) => map.set(item.id, item));
          const merged = Array.from(map.values());
          localStorage.setItem("krivexo_kcc_apps", JSON.stringify(merged));
          return merged;
        });

        const userApps = allApps.filter((app: KccApplication) => {
          const appPhone = (app.phone || "").replace(/\D/g, "").slice(-10);
          return (cleanP && appPhone && cleanP === appPhone) ||
            (app.fullName?.trim().toLowerCase() === newUser.name?.trim().toLowerCase());
        });
        const approvedApp = userApps.find((a) => a.status === "approved" && a.cardNumber);
        if (approvedApp) {
          setIsKccIssuedState(true);
          localStorage.setItem("krivexo_kcc_issued", "true");
          setUser((u) => {
            if (!u) return null;
            const updated = {
              ...u,
              isKccIssued: true,
              isVerified: true,
              kccCardNumber: approvedApp.cardNumber,
              kccCreditLimit: approvedApp.creditLimit || approvedApp.paymentAmount || u.kccCreditLimit || 50000,
            };
            localStorage.setItem("krivexo_user_profile", JSON.stringify(updated));
            return updated;
          });
        }
      }
    }).catch(() => {});

    addNotification(
      "Login Successful 👋",
      `Welcome back, ${newUser.name}! You are logged in as ${newUser.role === "farmer" ? "Farmer" : "Dealer"}.`,
      "success",
      "/",
      "account"
    );
  };

  const logoutUser = () => {
    setUser(null);
    // Clear user-specific session state from localStorage on logout
    localStorage.removeItem("krivexo_user_profile");
    localStorage.removeItem("krivexo_kcc_issued");
    localStorage.removeItem("krivexo_user_notifications");
    localStorage.removeItem("krivexo_wallet_txns");
    // Reset user session states
    setIsKccIssuedState(false);
    setWalletTransactions([]);
    setNotifications([]);
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const nextUser = { ...prev, ...updated };
      localStorage.setItem("krivexo_user_profile", JSON.stringify(nextUser));
      return nextUser;
    });

    setRegisteredAccounts((prev) => {
      const next = prev.map((acc) => {
        const matches =
          (user?.id && acc.id === user.id) ||
          (user?.phone && acc.phone === user.phone) ||
          (user?.userId && acc.userId === user.userId) ||
          (updated.phone && acc.phone === updated.phone) ||
          (updated.userId && acc.userId === updated.userId);
        if (matches) {
          return {
            ...acc,
            fullName: updated.name || acc.fullName,
            phone: updated.phone || acc.phone,
            email: updated.email || acc.email,
            village: updated.village || acc.village,
            district: updated.district || acc.district,
            state: updated.state || acc.state,
            pincode: updated.pincode || acc.pincode,
            gender: updated.gender || acc.gender,
            dob: updated.dob || acc.dob,
            address: updated.address || acc.address,
            aadhaarNumber: updated.aadhaarNumber || acc.aadhaarNumber,
            bankHolder: updated.bankHolder || acc.bankHolder,
            bankName: updated.bankName || acc.bankName,
            bankAccount: updated.bankAccount || acc.bankAccount,
            bankIfsc: updated.bankIfsc || acc.bankIfsc,
            bankAddress: updated.bankAddress || acc.bankAddress,
          };
        }
        return acc;
      });
      localStorage.setItem("krivexo_registered_accounts", JSON.stringify(next));
      return next;
    });

    const identifier = user?.id || user?.phone || user?.userId || updated.phone;
    if (identifier) {
      api.updateUser(identifier, updated).catch(err => console.warn("Backend update user error:", err));
      api.saveUser({
        ...user,
        ...updated,
        name: updated.name || user?.name,
        phone: updated.phone || user?.phone,
        id: user?.id
      }).catch(err => console.warn("Backend save user error:", err));
    }
  };

  const addNotification = (
    title: string,
    message: string,
    type: "info" | "success" | "warning" = "info",
    link?: string,
    category?: UserNotification["category"],
    pdfDataUrl?: string,
    pdfFileName?: string
  ) => {
    const newNotif: UserNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      read: false,
      type,
      link,
      category,
      pdfDataUrl,
      pdfFileName,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    api.addNotification(newNotif);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    api.markNotificationRead(id);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    api.markAllNotificationsRead();
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    api.deleteNotification(id);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    api.clearAllNotifications();
  };

  const refreshNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (Array.isArray(res)) {
        setNotifications(res);
      }
    } catch (err) {
      console.warn("[AppContext] Failed to refresh notifications:", err);
    }
  };

  // Farmer Card Store for KCC Live Balances & POS Transactions (Persisted in localStorage)
  const [farmerCardStore, setFarmerCardStore] = useState<Record<string, { cardHolder: string; balance: number; status: string }>>(() => {
    try {
      const saved = localStorage.getItem("krivexo_farmer_cards");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("krivexo_farmer_cards", JSON.stringify(farmerCardStore));
  }, [farmerCardStore]);

  // User-specific KCC Application Lookup
  const cleanPhone = (p?: string) => (p || "").replace(/\D/g, "").slice(-10);

  const currentUserKccApp = user
    ? kccApplications.find((app) => {
        const uPhone = cleanPhone(user.phone);
        const aPhone = cleanPhone(app.phone);
        const matchPhone = Boolean(uPhone && aPhone && uPhone === aPhone);
        const matchName = Boolean(user.name && app.fullName && user.name.trim().toLowerCase() === app.fullName.trim().toLowerCase());
        const matchCard = Boolean(user.kccCardNumber && app.cardNumber && user.kccCardNumber.trim().toLowerCase() === app.cardNumber.trim().toLowerCase());
        return matchPhone || matchName || matchCard;
      }) || null
    : null;

  // Track KCC Credit Limits and Live Available Balance
  const userCardNumber = user?.kccCardNumber || currentUserKccApp?.cardNumber || "";
  const totalKccCreditLimit = currentUserKccApp?.creditLimit || currentUserKccApp?.paymentAmount || user?.kccCreditLimit || 50000;
  
  // Total KCC debits made by this user:
  const userKccSpent = walletTransactions
    .filter((t) => t.source === "kcc" || t.category === "KCC Order Payment" || t.title.toLowerCase().startsWith("kcc"))
    .reduce((sum, t) => sum + t.amount, 0);

  const cleanUserCard = userCardNumber.replace(/\s+/g, "").toUpperCase();
  const cardStoreEntry = Object.entries(farmerCardStore).find(
    ([k]) => k.replace(/\s+/g, "").toUpperCase() === cleanUserCard
  )?.[1];

  const kccAvailableBalance = cardStoreEntry?.balance !== undefined
    ? cardStoreEntry.balance
    : Math.max(0, totalKccCreditLimit - userKccSpent);

  // isKccIssued: true if admin OR if logged-in user has KCC approved with an actual allotted card number
  const isKccIssued = Boolean(
    isAdminLoggedIn ||
    (user !== null && (
      Boolean(user.kccCardNumber) ||
      (Boolean(user.isKccIssued) && Boolean(user.kccCardNumber)) ||
      (currentUserKccApp?.status === "approved" && Boolean(currentUserKccApp?.cardNumber))
    ))
  );

  const hasAppliedKcc = Boolean(
    user !== null && (
      isKccIssued ||
      currentUserKccApp !== null ||
      Boolean(user.isKccIssued) ||
      Boolean(user.kccCardNumber)
    )
  );

  const kccApplicationStatus: "none" | "pending" | "approved" | "rejected" =
    isKccIssued
      ? "approved"
      : currentUserKccApp
      ? (currentUserKccApp.status as any)
      : "none";

  const kccDetails: (KccApplication & { creditBalance?: number }) | null = currentUserKccApp
    ? {
        ...currentUserKccApp,
        cardNumber: currentUserKccApp.cardNumber || user?.kccCardNumber,
        creditLimit: totalKccCreditLimit,
        paymentAmount: totalKccCreditLimit,
        creditBalance: kccAvailableBalance,
        status: (isKccIssued || currentUserKccApp.status === "approved") ? "approved" : currentUserKccApp.status,
      }
    : (user && user.kccCardNumber)
    ? {
        id: `kcc-${user.id || Date.now()}`,
        fullName: user.name,
        phone: user.phone || "",
        aadhaar: user.aadhaarNumber || "XXXX-XXXX-XXXX",
        address: [user.village, user.district, user.state].filter(Boolean).join(", ") || (user.district || "Bihar"),
        district: user.district || "Patna",
        landSize: user.landSize || "2.5 Acres",
        status: "approved",
        cardNumber: user.kccCardNumber,
        creditLimit: totalKccCreditLimit,
        paymentAmount: totalKccCreditLimit,
        creditBalance: kccAvailableBalance,
        issueDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      }
    : null;

  const checkKccPermission = (actionName?: string): boolean => {
    // 1. Admin always has full access
    if (isAdminLoggedIn) return true;

    // 2. Dealer role has FULL access to ALL platform services without requiring KCC
    // Dealers are authorized commercial entities with verified business profiles
    if (user?.role === "dealer") {
      return true;
    }

    // 3. User must be logged in to use features
    if (!user) {
      toast.error("Please login or register first to apply for KCC and use this feature.");
      setIsKccAlertOpen(true);
      return false;
    }

    // 4. KCC must be approved with an assigned card number — unlocks 100% of website features!
    if (isKccIssued) {
      return true;
    }

    // 5. If application is currently pending admin review
    if (hasAppliedKcc && kccApplicationStatus === "pending") {
      toast.info("Your KCC Application is under Admin review. All features will be unlocked once your card is allotted!");
      setIsKccAlertOpen(true);
      return false;
    }

    // 6. If not approved, trigger the KCC alert modal
    setIsKccAlertOpen(true);
    return false;
  };

  // Dealer Features Implementation
  const dealerApplyFarmerKcc = (appData: Partial<KccApplication> & { fullName: string; phone: string; appliedByDealer?: string }) => {
    const dealerName = appData.appliedByDealer || user?.name || "Verified Dealer";
    const newApp: KccApplication = {
      aadhaar: "",
      address: "",
      district: "Patna",
      landSize: "3 Acres",
      ...appData,
      id: `kcc-dealer-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      appliedByDealer: dealerName,
    };
    setKccApplications((prev) => {
      const next = [newApp, ...prev.filter((a) => a.id !== newApp.id)];
      localStorage.setItem("krivexo_kcc_apps", JSON.stringify(next));
      return next;
    });
    api.submitKccApplication(newApp).catch((err) => console.warn("Submit KCC Application error:", err));
    addNotification(
      "Farmer KCC Submitted 💳",
      `KCC Application for ${appData.fullName} submitted successfully by Dealer ${dealerName}. Pending Admin approval.`,
      "success",
      "/admin",
      "kcc"
    );
  };

  const checkFarmerCardBalance = (cardNumber: string) => {
    const cleaned = (cardNumber || "").trim();
    const cleanNorm = cleaned.replace(/\s+/g, "").toUpperCase();
    if (!cleanNorm) return { exists: false };

    // 1. Check in farmerCardStore
    for (const [key, val] of Object.entries(farmerCardStore)) {
      if (key.replace(/\s+/g, "").toUpperCase() === cleanNorm) {
        return { exists: true, ...val };
      }
    }

    // 2. Check if it matches the current user's card
    if (userCardNumber && cleanUserCard === cleanNorm) {
      return {
        exists: true,
        cardHolder: user?.name || "Farmer",
        balance: kccAvailableBalance,
        status: "active",
      };
    }

    // 3. Check in kccApplications list if verified
    const matchedApp = kccApplications.find(
      (a) => a.cardNumber && a.cardNumber.replace(/\s+/g, "").toUpperCase() === cleanNorm && a.status === "approved"
    );
    if (matchedApp) {
      const appLimit = matchedApp.creditLimit || matchedApp.paymentAmount || 50000;
      return {
        exists: true,
        cardHolder: matchedApp.fullName,
        balance: matchedApp.creditBalance !== undefined ? matchedApp.creditBalance : appLimit,
        status: "active",
      };
    }
    return { exists: false };
  };

  const chargeFarmerCard = (cardNumber: string, amount: number, itemDesc: string) => {
    const cleaned = (cardNumber || "").trim();
    const cleanNorm = cleaned.replace(/\s+/g, "").toUpperCase();
    const info = checkFarmerCardBalance(cleaned);
    if (!info || !info.exists || !("balance" in info)) {
      return { success: false, message: "Kishan Credit Card not found or not active." };
    }
    const currentBalance = info.balance ?? 0;
    const holderName = info.cardHolder ?? (user?.name || "Farmer");

    if (currentBalance < amount) {
      return {
        success: false,
        message: `Insufficient balance on KCC. Current available limit: ₹${currentBalance.toLocaleString("en-IN")}, Required: ₹${amount.toLocaleString("en-IN")}`,
      };
    }

    const newBalance = currentBalance - amount;
    setFarmerCardStore((prev) => {
      const next = {
        ...prev,
        [cleaned]: {
          cardHolder: holderName,
          balance: newBalance,
          status: "active",
        },
      };
      localStorage.setItem("krivexo_farmer_cards", JSON.stringify(next));
      return next;
    });

    if (user && user.kccCardNumber && user.kccCardNumber.replace(/\s+/g, "").toUpperCase() === cleanNorm) {
      setUser((prev) => {
        if (!prev) return null;
        const next = { ...prev, kccCreditBalance: newBalance };
        localStorage.setItem("krivexo_user_profile", JSON.stringify(next));
        return next;
      });
    }

    api.chargeFarmerCard(cleaned, amount).catch((err) => console.warn("Backend charge card error:", err));

    // Record POS transaction in Admin Payments / Financial Ledger
    const txId = `POS-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const paymentRecord = {
      id: txId,
      orderId: txId,
      transactionId: txId,
      amount: Number(amount),
      rawAmount: Number(amount),
      method: "KCC POS",
      customer: holderName,
      farmerName: holderName,
      dealerName: user?.name || "Verified Dealer",
      status: "Completed",
      date: new Date().toISOString(),
      description: itemDesc || "KCC POS Store Purchase",
    };
    api.createPayment(paymentRecord).catch((err) => console.warn("POS Payment Record error:", err));

    // Also record in wallet transactions
    setWalletTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        title: `KCC POS Debit: ${itemDesc || "Store Purchase"}`,
        amount: Number(amount),
        type: "debit",
        date: new Date().toISOString(),
        status: "success",
        category: "KCC POS Debit",
        source: "kcc",
      },
      ...prev,
    ]);

    addNotification(
      "KCC Payment Debited 💳",
      `₹${amount.toLocaleString("en-IN")} debited from KCC limit for "${itemDesc}". Available KCC limit: ₹${newBalance.toLocaleString("en-IN")}.`,
      "success",
      "/admin",
      "wallet"
    );

    return {
      success: true,
      message: `Payment of ₹${amount.toLocaleString("en-IN")} debited from KCC successfully!`,
      remainingBalance: newBalance,
      txId,
    };
  };

  // Dealer Product / Service Listings State (Point 4)
  const [dealerListings, setDealerListings] = useState<DealerListing[]>(() => {
    return safeJsonParse<DealerListing[]>("krivexo_dealer_listings", [
      {
        id: "dl-101",
        dealerId: "usr-dealer-1",
        dealerName: "Patna Krishi Kendra",
        type: "product",
        title: "Bio-Fertilizer Organic Booster (50kg)",
        category: "Fertilizers",
        price: 1350,
        unit: "50 kg bag",
        description: "High quality bio-organic soil nutrient booster.",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
        status: "approved",
        createdAt: new Date().toISOString(),
      }
    ]);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_dealer_listings", JSON.stringify(dealerListings));
  }, [dealerListings]);

  const addDealerListing = (item: Omit<DealerListing, "id" | "status" | "createdAt">) => {
    const newListing: DealerListing = {
      ...item,
      id: `dl-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setDealerListings((prev) => [newListing, ...prev]);
    api.addDealerListing(newListing);
    addNotification(
      "New Listing Request Sent 📦",
      `Your request to list "${item.title}" (${item.type}) has been sent to Admin for approval.`,
      "info",
      "/dashboard",
      "orders"
    );
  };

  const approveDealerListing = (id: string) => {
    const target = dealerListings.find(d => d.id === id);
    setDealerListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item))
    );
    api.approveDealerListing(id);
    if (target) {
      addNotification(
        "Listing Approved by Admin ✅",
        `Your ${target.type} listing "${target.title}" is now active and live across all panels!`,
        "success",
        "/agri-market",
        "orders"
      );
    }
  };

  const rejectDealerListing = (id: string) => {
    setDealerListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "rejected" } : item))
    );
    api.rejectDealerListing(id);
  };

  const updateDealerListing = (id: string, updated: Partial<DealerListing>) => {
    setDealerListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updated,
            status: updated.status || "pending"
          };
        }
        return item;
      })
    );
    api.updateDealerListing(id, updated);
  };

  // Kisan Pathshala Videos State & Actions
  const [pathshalaVideos, setPathshalaVideos] = useState<PathshalaVideo[]>(() => {
    return safeJsonParse<PathshalaVideo[]>("krivexo_pathshala_videos", [
      {
        id: "vid-1",
        title: "वैज्ञानिक विधि से गेहूं की खेती | Scientific Wheat Farming Techniques",
        youtubeUrl: "https://www.youtube.com/watch?v=co3_pS74L-Q",
        category: "soil",
        description: "इस वीडियो में देखें गेहूं की बुवाई से लेकर कटाई तक की पूरी जानकारी और वैज्ञानिक तरीके।",
        createdAt: new Date().toISOString()
      },
      {
        id: "vid-2",
        title: "ड्रिप सिंचाई प्रणाली कैसे काम करती है? | Working of Drip Irrigation System",
        youtubeUrl: "https://www.youtube.com/watch?v=FmYj08m52_I",
        category: "water",
        description: "खेतों में ड्रिप सिंचाई (टपक सिंचाई) लगाने के फायदे और उसकी पूरी कार्यप्रणाली।",
        createdAt: new Date().toISOString()
      },
      {
        id: "vid-3",
        title: "जैविक खाद बनाने की सबसे आसान विधि | How to make Organic Compost at home",
        youtubeUrl: "https://www.youtube.com/watch?v=P84nI0TpxmU",
        category: "soil",
        description: "केंचुआ खाद (Vermicompost) और अन्य जैविक खाद बनाने की विधि तथा खेतों में इसके उपयोग।",
        createdAt: new Date().toISOString()
      }
    ]);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_pathshala_videos", JSON.stringify(pathshalaVideos));
  }, [pathshalaVideos]);

  const addPathshalaVideo = (video: Omit<PathshalaVideo, "id" | "createdAt">) => {
    const newVideo: PathshalaVideo = {
      ...video,
      id: `vid-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPathshalaVideos((prev) => [newVideo, ...prev]);
    api.addPathshalaVideo(newVideo);
    toast.success("New Pathshala Video uploaded successfully!");
  };

  const deletePathshalaVideo = (id: string) => {
    setPathshalaVideos((prev) => prev.filter((v) => v.id !== id));
    api.deletePathshalaVideo(id);
    toast.success("Pathshala Video removed successfully.");
  };

  // Dealer Registered Farmers State (Point 1.iii)
  const [registeredFarmers, setRegisteredFarmers] = useState<RegisteredFarmer[]>(() => {
    return safeJsonParse<RegisteredFarmer[]>("krivexo_registered_farmers", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexo_registered_farmers", JSON.stringify(registeredFarmers));
  }, [registeredFarmers]);

  const registerFarmerByDealer = (farmerData: Omit<RegisteredFarmer, "id" | "createdAt">): RegisteredFarmer => {
    const newFarmer: RegisteredFarmer = {
      ...farmerData,
      id: `rf-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRegisteredFarmers((prev) => [newFarmer, ...prev]);
    api.registerFarmer(newFarmer).catch((err) => console.warn("API registerFarmer error:", err));

    // Also register as active User account so farmer appears in Admin Farmers and All Users
    const cleanP = (farmerData.phone || "").replace(/\D/g, "").slice(-10);
    const farmerUserAccount = {
      id: newFarmer.id,
      userId: `FRM-${cleanP.slice(-4) || "0000"}-${Math.floor(100 + Math.random() * 900)}`,
      name: farmerData.name,
      fullName: farmerData.name,
      phone: farmerData.phone,
      role: "farmer" as const,
      village: farmerData.village || "",
      district: farmerData.district || "Patna",
      state: farmerData.state || "Bihar",
      pincode: farmerData.pincode || "800001",
      address: [farmerData.village, farmerData.district, farmerData.state].filter(Boolean).join(", "),
      landSize: farmerData.landSize || "3 Acres",
      aadhaar: farmerData.aadhaar,
      registeredByDealer: farmerData.registeredByDealer || user?.name || "Verified Dealer",
      status: "active",
      verificationStatus: "Verified",
      isVerified: true,
      createdAt: newFarmer.createdAt,
    };
    setRegisteredAccounts((prev) => [farmerUserAccount, ...prev.filter((a) => (a.phone || "").replace(/\D/g, "").slice(-10) !== cleanP)]);
    api.saveUser(farmerUserAccount).catch((err) => console.warn("API saveUser error:", err));

    addNotification(
      "New Farmer Registered 👤",
      `Farmer ${farmerData.name} (+91 ${farmerData.phone}) registered successfully by ${farmerData.registeredByDealer}.`,
      "success",
      "/admin",
      "account"
    );
    return newFarmer;
  };

  // Checking KCC Status by Phone, Aadhaar, or Card Number (Point 1.i)
  const checkKccStatusByPhoneAadhaar = (phone?: string, aadhaar?: string, cardNumber?: string): KccApplication | null => {
    const cleanPhone = (phone || "").replace(/\D/g, "").slice(-10);
    const cleanAadhaar = (aadhaar || "").trim().replace(/\s+/g, "");
    const cleanCard = (cardNumber || "").trim().toLowerCase();

    if (!cleanPhone && !cleanAadhaar && !cleanCard) return null;

    const matched = kccApplications.find((a) => {
      const aPhone = (a.phone || "").replace(/\D/g, "").slice(-10);
      const aAadhaar = (a.aadhaar || "").replace(/\s+/g, "");
      const aCard = (a.cardNumber || "").trim().toLowerCase();
      const matchPhone = Boolean(cleanPhone && aPhone && (aPhone === cleanPhone || aPhone.includes(cleanPhone)));
      const matchAadhaar = Boolean(cleanAadhaar && aAadhaar && (aAadhaar === cleanAadhaar || aAadhaar.includes(cleanAadhaar)));
      const matchCard = Boolean(cleanCard && aCard && (aCard === cleanCard || aCard.includes(cleanCard)));
      return matchPhone || matchAadhaar || matchCard;
    });

    if (matched) return matched;
    return null;
  };

  // Get Farmer Profile & Balance Details by KCC / Aadhaar / Phone (Point 1.iv)
  const getFarmerProfileByDetails = (query: { kccNum?: string; aadhaar?: string; phone?: string }) => {
    const cleanKcc = (query.kccNum || "").trim();
    const cleanAadhaar = (query.aadhaar || "").trim().replace(/\s+/g, "");
    const cleanPhone = (query.phone || "").replace(/\D/g, "").slice(-10);

    if (!cleanKcc && !cleanAadhaar && !cleanPhone) {
      return { exists: false };
    }

    // 1. Search in kccApplications
    const matchedApp = kccApplications.find((a) => {
      const aCard = (a.cardNumber || "").trim();
      const aAadhaar = (a.aadhaar || "").replace(/\s+/g, "");
      const aPhone = (a.phone || "").replace(/\D/g, "").slice(-10);
      return (
        (cleanKcc && (aCard === cleanKcc || aCard.includes(cleanKcc))) ||
        (cleanAadhaar && (aAadhaar === cleanAadhaar || aAadhaar.includes(cleanAadhaar))) ||
        (cleanPhone && aPhone && (aPhone === cleanPhone || aPhone.includes(cleanPhone)))
      );
    });

    // 2. Search in registeredFarmers
    const matchedRegistered = registeredFarmers.find((r) => {
      const rAadhaar = (r.aadhaar || "").replace(/\s+/g, "");
      const rPhone = (r.phone || "").replace(/\D/g, "").slice(-10);
      return (
        (cleanAadhaar && (rAadhaar === cleanAadhaar || rAadhaar.includes(cleanAadhaar))) ||
        (cleanPhone && rPhone && (rPhone === cleanPhone || rPhone.includes(cleanPhone)))
      );
    });

    // 3. Search in registeredAccounts
    const matchedAccount = registeredAccounts.find((u) => {
      const uPhone = (u.phone || "").replace(/\D/g, "").slice(-10);
      const uCard = (u.kccCardNumber || "").trim();
      return (
        (cleanPhone && uPhone && uPhone === cleanPhone) ||
        (cleanKcc && uCard && (uCard === cleanKcc || uCard.includes(cleanKcc)))
      );
    });

    // 4. Search card balance
    const cardLookupKey = cleanKcc || matchedApp?.cardNumber || matchedAccount?.kccCardNumber || "";
    const cardInfo = checkFarmerCardBalance(cardLookupKey);

    if (matchedApp || matchedRegistered || matchedAccount || cardInfo?.exists) {
      const activeLimit = matchedApp?.creditLimit || matchedApp?.paymentAmount || matchedAccount?.kccCreditLimit || 50000;
      return {
        exists: true,
        kccApp: matchedApp,
        cardInfo: cardInfo?.exists ? cardInfo : { exists: true, cardHolder: matchedApp?.fullName || matchedRegistered?.name || matchedAccount?.fullName || "Farmer Account", balance: activeLimit, status: "active" },
        profile: {
          name: matchedApp?.fullName || matchedRegistered?.name || matchedAccount?.fullName || matchedAccount?.name || user?.name || "Kishan Farmer",
          phone: matchedApp?.phone || matchedRegistered?.phone || matchedAccount?.phone || user?.phone || cleanPhone || "9876543210",
          aadhaar: matchedApp?.aadhaar || matchedRegistered?.aadhaar || matchedAccount?.aadhaar || cleanAadhaar || "1234-5678-9012",
          district: matchedApp?.district || matchedRegistered?.district || matchedAccount?.district || "Patna",
          village: matchedRegistered?.village || matchedApp?.address || matchedAccount?.village || "Bihar Village",
          landSize: matchedApp?.landSize || matchedRegistered?.landSize || matchedAccount?.landSize || "3.5 Acres",
          cardNumber: matchedApp?.cardNumber || matchedAccount?.kccCardNumber || cardLookupKey || "KCC-BH-2026-9041",
          kccStatus: matchedApp?.status || (matchedAccount?.isKccIssued ? "approved" : "pending"),
        },
      };
    }

    return { exists: false };
  };

  // Async lookup: searches local state, and if not found, refreshes from DB to ensure nothing is missed
  const lookupFarmerProfileAsync = async (query: { kccNum?: string; aadhaar?: string; phone?: string }) => {
    const local = getFarmerProfileByDetails(query);
    if (local && local.exists) return local;

    try {
      const [remoteKcc, remoteFarmers, remoteUsers] = await Promise.allSettled([
        api.getKccApplications(),
        api.getRegisteredFarmers(),
        api.getUsers(),
      ]);

      if (remoteKcc.status === "fulfilled" && Array.isArray(remoteKcc.value)) {
        const kccVal = remoteKcc.value as any[];
        setKccApplications((prev) => {
          const map = new Map<string, KccApplication>();
          prev.forEach((item) => map.set(item.id, item));
          kccVal.forEach((item: any) => map.set(item.id, item));
          const merged = Array.from(map.values());
          localStorage.setItem("krivexo_kcc_apps", JSON.stringify(merged));
          return merged;
        });
      }

      if (remoteFarmers.status === "fulfilled" && Array.isArray(remoteFarmers.value)) {
        const farmersVal = remoteFarmers.value as any[];
        setRegisteredFarmers((prev) => {
          const map = new Map<string, RegisteredFarmer>();
          prev.forEach((item) => map.set(item.id, item));
          farmersVal.forEach((item: any) => map.set(item.id, item));
          const merged = Array.from(map.values());
          localStorage.setItem("krivexo_registered_farmers", JSON.stringify(merged));
          return merged;
        });
      }

      const cleanK = (query.kccNum || "").trim();
      const cleanA = (query.aadhaar || "").trim().replace(/\s+/g, "");
      const cleanP = (query.phone || "").replace(/\D/g, "").slice(-10);

      const allK = remoteKcc.status === "fulfilled" && Array.isArray(remoteKcc.value) ? remoteKcc.value : kccApplications;
      const allF = remoteFarmers.status === "fulfilled" && Array.isArray(remoteFarmers.value) ? remoteFarmers.value : registeredFarmers;
      const allU = remoteUsers.status === "fulfilled" && Array.isArray(remoteUsers.value) ? remoteUsers.value : registeredAccounts;

      const matchedApp = allK.find((a: any) => {
        const aCard = (a.cardNumber || "").trim();
        const aAadhaar = (a.aadhaar || "").replace(/\s+/g, "");
        const aPhone = (a.phone || "").replace(/\D/g, "").slice(-10);
        return (
          (cleanK && (aCard === cleanK || aCard.includes(cleanK))) ||
          (cleanA && (aAadhaar === cleanA || aAadhaar.includes(cleanA))) ||
          (cleanP && aPhone && (aPhone === cleanP || aPhone.includes(cleanP)))
        );
      });

      const matchedF = allF.find((r: any) => {
        const rAadhaar = (r.aadhaar || "").replace(/\s+/g, "");
        const rPhone = (r.phone || "").replace(/\D/g, "").slice(-10);
        return (
          (cleanA && (rAadhaar === cleanA || rAadhaar.includes(cleanA))) ||
          (cleanP && rPhone && (rPhone === cleanP || rPhone.includes(cleanP)))
        );
      });

      const matchedU = allU.find((u: any) => {
        const uPhone = (u.phone || "").replace(/\D/g, "").slice(-10);
        const uCard = (u.kccCardNumber || "").trim();
        return (
          (cleanP && uPhone && uPhone === cleanP) ||
          (cleanK && uCard && (uCard === cleanK || uCard.includes(cleanK)))
        );
      });

      if (matchedApp || matchedF || matchedU) {
        const activeLimit = matchedApp?.creditLimit || matchedApp?.paymentAmount || matchedU?.kccCreditLimit || 50000;
        return {
          exists: true,
          kccApp: matchedApp,
          cardInfo: {
            exists: true,
            cardHolder: matchedApp?.fullName || matchedF?.name || matchedU?.name || "Farmer Account",
            balance: activeLimit,
            status: "active",
          },
          profile: {
            name: matchedApp?.fullName || matchedF?.name || matchedU?.name || matchedU?.fullName || "Kishan Farmer",
            phone: matchedApp?.phone || matchedF?.phone || matchedU?.phone || cleanP || "9876543210",
            aadhaar: matchedApp?.aadhaar || matchedF?.aadhaar || matchedU?.aadhaar || cleanA || "1234-5678-9012",
            district: matchedApp?.district || matchedF?.district || matchedU?.district || "Patna",
            village: matchedF?.village || matchedApp?.address || matchedU?.village || "Bihar Village",
            landSize: matchedApp?.landSize || matchedF?.landSize || matchedU?.landSize || "3.5 Acres",
            cardNumber: matchedApp?.cardNumber || matchedU?.kccCardNumber || cleanK || "KCC-BH-2026-9041",
            kccStatus: matchedApp?.status || (matchedU?.isKccIssued ? "approved" : "pending"),
          },
        };
      }
    } catch (err) {
      console.warn("lookupFarmerProfileAsync error:", err);
    }
    return { exists: false };
  };

  // Cart & Order State Management (Personal per user)
  const cartStorageKey = user ? `krivexo_cart_${user.phone || user.id}` : "krivexo_cart_guest";
  const [cart, setCart] = useState<CartItem[]>(() => {
    return safeJsonParse<CartItem[]>(cartStorageKey, []);
  });

  const [orders, setOrders] = useState<CartOrder[]>(() => {
    return safeJsonParse<CartOrder[]>("krivexo_cart_orders", []);
  });

  useEffect(() => {
    setCart(safeJsonParse<CartItem[]>(cartStorageKey, []));
  }, [cartStorageKey]);

  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey]);

  useEffect(() => {
    localStorage.setItem("krivexo_cart_orders", JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: { id: string; name: string; category?: string; price: number; unit?: string; image?: string; sellerName?: string }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.id);
      if (existing) {
        return prev.map((i) => (i.productId === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: 1,
          sellerName: item.sellerName,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkoutCart = (paymentMethod: "kcc" | "upi" | "cod" | "wallet", deliveryAddress: string) => {
    if (cart.length === 0) {
      return { success: false, message: "Your cart is empty!" };
    }
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemNames = cart.map(i => i.name).join(", ");

    // ── Wallet payment: check balance first ──
    if (paymentMethod === "wallet") {
      if (walletBalance < totalAmount) {
        return {
          success: false,
          message: `Insufficient wallet balance! Available: ₹${walletBalance.toLocaleString("en-IN")}, Required: ₹${totalAmount.toLocaleString("en-IN")}. Please add money to your wallet.`,
        };
      }
    }

    // ── KCC payment: check credit limit & debit from KCC only ──
    if (paymentMethod === "kcc") {
      const kccCard = kccDetails?.cardNumber || user?.kccCardNumber || "";
      if (!kccCard) {
        return { success: false, message: "No active KCC card found on your account." };
      }
      const chargeRes = chargeFarmerCard(kccCard, totalAmount, `Order of ${cart.length} item(s)`);
      if (!chargeRes.success) {
        return chargeRes;
      }
      // Record transaction with source: "kcc" so it shows in Transaction History without deducting from Deposit Wallet!
      addWalletTransaction({
        title: `KCC Payment – ${cart.length} item(s)`,
        type: "debit",
        amount: totalAmount,
        category: "KCC Order Payment",
        source: "kcc",
      });
    }

    // ── Wallet: check deposit wallet balance and record debit ──
    if (paymentMethod === "wallet") {
      if (walletBalance < totalAmount) {
        return {
          success: false,
          message: `Insufficient wallet balance! Available: ₹${walletBalance.toLocaleString("en-IN")}, Required: ₹${totalAmount.toLocaleString("en-IN")}. Please add money to your wallet.`,
        };
      }
      addWalletTransaction({
        title: `Wallet Payment – ${cart.length} item(s)`,
        type: "debit",
        amount: totalAmount,
        category: "Wallet Order Payment",
        source: "wallet",
      });
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: CartOrder = {
      id: orderId,
      userId: user?.id || user?.userId || "guest",
      userName: user?.name || "Customer",
      items: [...cart],
      totalAmount,
      paymentMethod,
      deliveryAddress,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    api.createOrder(newOrder);
    clearCart();

    addNotification(
      "Order Placed Successfully! 🛒",
      `Order ${orderId} for ₹${totalAmount.toLocaleString("en-IN")} has been placed via ${paymentMethod.toUpperCase()}. Items: ${itemNames}.`,
      "success",
      "/cart",
      "orders"
    );

    // Notify seller(s) of the purchased crops / dealer products
    cart.forEach((item) => {
      if (item.sellerName) {
        addNotification(
          "Your Listed Item Was Purchased! 🌾",
          `Customer ${user?.name || "Verified Farmer"} placed an order for "${item.name}" (${item.quantity} ${item.unit || "unit"}). Total: ₹${(item.price * item.quantity).toLocaleString("en-IN")}. Payment via: ${paymentMethod.toUpperCase()}.`,
          "success",
          "/sell-crops",
          "crops"
        );
      }
    });

    return {
      success: true,
      message: `Order ${orderId} placed successfully!`,
      orderId,
    };
  };

  const updateOrderStatus = (orderId: string, newStatus: "Confirmed" | "Packed" | "Dispatched" | "Delivered") => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    api.updateOrderStatus(orderId, newStatus);
    addNotification(
      `Order #${orderId} Updated 📦`,
      `Your product order status has been updated to "${newStatus}" by the dealer.`,
      "info",
      "/profile",
      "orders"
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,

        isKccIssued,
        hasAppliedKcc,
        kccApplicationStatus,
        kccDetails,
        kccAvailableBalance,
        isKccAlertOpen,
        setIsKccAlertOpen,
        isKccAppModalOpen,
        setIsKccAppModalOpen,
        checkKccPermission,
        submitKccApplication,
        toggleKccDemoStatus,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkoutCart,
        orders,

        isAdminLoggedIn,
        adminName,
        adminLogin,
        adminLogout,

        cropListings,
        addCropListing,
        approveCropListing,
        rejectCropListing,

        machineryBookings,
        addMachineryBooking,
        quoteMachineryRate,
        respondMachineryBooking,
        allotMachineryBookingWithResources,
        allotMachineryBooking,
        rejectMachineryBooking,

        labourTypes,
        addLabourType,
        removeLabourType,
        labourBookings,
        addLabourBooking,
        quoteLabourRate,
        respondLabourBooking,
        allotLabourBookingWithResources,
        assignLaboursToBooking,

        activeReviewBooking,
        openRateReviewModal,
        closeRateReviewModal,
        refreshBookings,

        expertAdviceQueries,
        addExpertQuery,
        updateExpertQueryStatus,

        mandiRates,
        addMandiRate,
        updateMandiRate,
        deleteMandiRate,

        user,
        registeredAccounts,
        registerNewAccount,
        loginUser,
        logoutUser,
        updateUserProfile,

        walletTransactions,
        walletBalance,
        addWalletTransaction,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        refreshNotifications,
        addNotification,

        kccApplications,
        approveKccApplication,
        rejectKccApplication,
        loadAllKccApplications,
        updateKccLimit,

        dealerApplyFarmerKcc,
        checkFarmerCardBalance,
        chargeFarmerCard,
        allotDealerCredentials,

        dealerListings,
        addDealerListing,
        approveDealerListing,
        rejectDealerListing,
        updateDealerListing,

        registeredFarmers,
        registerFarmerByDealer,

        checkKccStatusByPhoneAadhaar,
        getFarmerProfileByDetails,
        lookupFarmerProfileAsync,

        updateOrderStatus,

        pathshalaVideos,
        addPathshalaVideo,
        deletePathshalaVideo,

        mongoConnected,
        mongoDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

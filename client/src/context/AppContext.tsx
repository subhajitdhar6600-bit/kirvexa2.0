import React, { createContext, useContext, useState, useEffect } from "react";
import { type Language, TRANSLATIONS, type Translations } from "@/lib/translations.ts";
import { toast } from "sonner";
import { api } from "@/services/api";

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
  userName: string;
  phone: string;
  labourType: string;
  count: number;
  days: number;
  startDate: string;
  endDate: string;
  location: string;
  status: "pending" | "assigned" | "completed";
  assignedLabours?: Array<{ name: string; phone: string; charges: string }>;
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
  aadhaar: string;
  address: string;
  district: string;
  landSize: string;
  status: "pending" | "approved" | "rejected";
  cardNumber?: string;
  issueDate?: string;
  cardTier?: "nex" | "prime";
  paymentStatus?: "pending" | "paid";
  paymentAmount?: number;
  creditLimit?: number;
  createdAt: string;
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
  createdAt: string;
}

export interface RegisteredAccount {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  password?: string;
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
  isKccIssued?: boolean;
  isVerified?: boolean;
  kccCardNumber?: string;
  kccCreditLimit?: number;
  createdAt: string;
}

export interface MachineryBookingRequest {
  id: string;
  userName: string;
  phone: string;
  machineryType: string;
  bookingDate: string;
  durationHours: string | number;
  location: string;
  status: "pending" | "allotted" | "rejected";
  allottedMachineDetails?: string;
  adminNotes?: string;
  createdAt: string;
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
  createdAt?: string;
}

export interface WalletTransaction {
  id: string;
  title: string;
  type: "credit" | "debit";
  amount: number;
  date: string;
  category: string;
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
  kccDetails: KccApplication | null;
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
  allotMachineryBooking: (id: string, machineDetails: string, notes?: string) => void;
  rejectMachineryBooking: (id: string) => void;

  // Labour Booking & Admin Labour Types
  labourTypes: string[];
  addLabourType: (type: string) => void;
  removeLabourType: (type: string) => void;
  labourBookings: LabourBookingRequest[];
  addLabourBooking: (booking: Omit<LabourBookingRequest, "id" | "status" | "createdAt">) => void;
  assignLaboursToBooking: (id: string, assigned: Array<{ name: string; phone: string; charges: string }>, notes?: string) => void;
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
  dealerApplyFarmerKcc: (appData: Omit<KccApplication, "id" | "status" | "createdAt">) => void;
  checkFarmerCardBalance: (cardNumber: string) => { exists: boolean; cardHolder?: string; balance?: number; status?: string } | null;
  chargeFarmerCard: (cardNumber: string, amount: number, itemDesc: string) => { success: boolean; message: string; remainingBalance?: number };
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
    return (localStorage.getItem("krivexa_lang") as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("krivexa_lang", lang);
  };

  const t = TRANSLATIONS[language];

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("krivexa_admin_session") === "true";
  });
  const [adminName, setAdminName] = useState<string>(() => {
    return localStorage.getItem("krivexa_admin_name") || "Aditya Saha";
  });

  const adminLogin = (id: string, _pass: string): boolean => {
    const nameToUse = id.trim() || "Aditya Saha";
    setIsAdminLoggedIn(true);
    setAdminName(nameToUse);
    localStorage.setItem("krivexa_admin_session", "true");
    localStorage.setItem("krivexa_admin_name", nameToUse);
    return true;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("krivexa_admin_session");
    localStorage.removeItem("krivexa_admin_name");
  };

  // KCC State — hydrate from localStorage / DB
  const [isKccIssuedState, setIsKccIssuedState] = useState<boolean>(() => {
    return localStorage.getItem("krivexa_kcc_issued") === "true";
  });
  const [kccApplications, setKccApplications] = useState<KccApplication[]>(() => {
    return safeJsonParse("krivexa_kcc_apps", []);
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
              localStorage.setItem("krivexa_kcc_apps", JSON.stringify(merged));
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
    localStorage.setItem("krivexa_kcc_apps", JSON.stringify(kccApplications));
  }, [kccApplications]);

  const submitKccApplication = (appData: Omit<KccApplication, "id" | "status" | "createdAt">) => {
    const newApp: KccApplication = {
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
    localStorage.setItem("krivexa_kcc_issued", nextState ? "true" : "false");
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
    localStorage.setItem("krivexa_kcc_apps", JSON.stringify(updatedApps));

    api.approveKccApplication(id, cardNumber, limit);

    // If matches currently logged-in user, unlock KCC immediately
    if (user && matchesApplicant(user.phone, user.name)) {
      setIsKccIssuedState(true);
      localStorage.setItem("krivexa_kcc_issued", "true");
      const updatedUser: UserProfile = {
        ...user,
        isKccIssued: true,
        isVerified: true,
        kccCardNumber: cardNumber,
        kccCreditLimit: limit,
      };
      setUser(updatedUser);
      localStorage.setItem("krivexa_user_profile", JSON.stringify(updatedUser));
    }

    // Also update registered account if found
    setRegisteredAccounts((prev) => {
      const updated = prev.map((acc) => {
        if (matchesApplicant(acc.phone, acc.fullName)) {
          return { ...acc, isKccIssued: true, isVerified: true, kccCardNumber: cardNumber, kccCreditLimit: limit };
        }
        return acc;
      });
      localStorage.setItem("krivexa_registered_accounts", JSON.stringify(updated));
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
      localStorage.setItem("krivexa_kcc_apps", JSON.stringify(updated));
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
        localStorage.setItem("krivexa_user_profile", JSON.stringify(updatedUser));
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
      localStorage.setItem("krivexa_registered_accounts", JSON.stringify(updated));
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
      localStorage.setItem("krivexa_registered_accounts", JSON.stringify(updated));
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
    return safeJsonParse("krivexa_crop_listings", INITIAL_CROPS);
  });

  useEffect(() => {
    localStorage.setItem("krivexa_crop_listings", JSON.stringify(cropListings));
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

  // Machinery Booking State
  const [machineryBookings, setMachineryBookings] = useState<MachineryBookingRequest[]>(() => {
    return safeJsonParse("krivexa_machinery_bookings", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexa_machinery_bookings", JSON.stringify(machineryBookings));
  }, [machineryBookings]);

  const addMachineryBooking = (booking: Omit<MachineryBookingRequest, "id" | "status" | "createdAt">) => {
    const newBooking: MachineryBookingRequest = {
      ...booking,
      id: `mach-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setMachineryBookings((prev) => [newBooking, ...prev]);
    api.addMachineryBooking(newBooking);
    addNotification(
      "Machinery Booking Request Sent 🚜",
      `Your booking request for ${booking.machineryType} on ${booking.bookingDate} has been sent to admin for allotment.`,
      "info",
      "/machinery-booking",
      "machinery"
    );
  };

  const allotMachineryBooking = (id: string, machineDetails: string, notes?: string) => {
    const target = machineryBookings.find(m => m.id === id);
    setMachineryBookings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "allotted", allottedMachineDetails: machineDetails, adminNotes: notes }
          : item
      )
    );
    api.allotMachinery(id, machineDetails, notes);
    addNotification(
      "Machinery Allotted! 🚜",
      `Your requested machine (${target?.machineryType || "Machinery"}) has been allotted by Admin: ${machineDetails}.`,
      "success",
      "/machinery-booking",
      "machinery"
    );
  };

  const rejectMachineryBooking = (id: string) => {
    const target = machineryBookings.find(m => m.id === id);
    setMachineryBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "rejected" } : item))
    );
    api.rejectMachinery(id);
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
    return safeJsonParse("krivexa_labour_types", INITIAL_LABOUR_TYPES);
  });

  useEffect(() => {
    localStorage.setItem("krivexa_labour_types", JSON.stringify(labourTypes));
  }, [labourTypes]);

  const addLabourType = (type: string) => {
    if (!type.trim() || labourTypes.includes(type)) return;
    setLabourTypes((prev) => [...prev, type.trim()]);
    api.addLabourType(type.trim());
  };

  const removeLabourType = (type: string) => {
    setLabourTypes((prev) => prev.filter((t) => t !== type));
    api.removeLabourType(type);
  };

  const [labourBookings, setLabourBookings] = useState<LabourBookingRequest[]>(() => {
    return safeJsonParse("krivexa_labour_bookings", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexa_labour_bookings", JSON.stringify(labourBookings));
  }, [labourBookings]);

  const addLabourBooking = (booking: Omit<LabourBookingRequest, "id" | "status" | "createdAt">) => {
    const newBooking: LabourBookingRequest = {
      ...booking,
      id: `labour-req-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setLabourBookings((prev) => [newBooking, ...prev]);
    api.addLabourBooking(newBooking);
    addNotification(
      "Labour Booking Request Sent 👷",
      `Your request for ${booking.count} ${booking.labourType}(s) starting ${booking.startDate} has been submitted.`,
      "info",
      "/labour-booking",
      "labour"
    );
  };

  const assignLaboursToBooking = (
    id: string,
    assigned: Array<{ name: string; phone: string; charges: string }>,
    notes?: string
  ) => {
    setLabourBookings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "assigned", assignedLabours: assigned, adminNotes: notes }
          : item
      )
    );
    api.assignLabours(id, assigned, notes);
    addNotification(
      "Labour Assigned to You! ✅",
      `${assigned.length} labourer(s) have been assigned to your booking. Check your booking page for details.`,
      "success",
      "/labour-booking",
      "labour"
    );
  };

  // Expert Advice State
  const [expertAdviceQueries, setExpertAdviceQueries] = useState<ExpertAdviceQuery[]>(() => {
    return safeJsonParse("krivexa_expert_queries", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexa_expert_queries", JSON.stringify(expertAdviceQueries));
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
    return safeJsonParse("krivexa_mandi_rates", INITIAL_MANDI_RATES);
  });

  useEffect(() => {
    localStorage.setItem("krivexa_mandi_rates", JSON.stringify(mandiRates));
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
    return safeJsonParse<UserProfile | null>("krivexa_user_profile", null);
  });

  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    return safeJsonParse<UserNotification[]>("krivexa_user_notifications", []);
  });

  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    return safeJsonParse<RegisteredAccount[]>("krivexa_registered_accounts", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexa_registered_accounts", JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("krivexa_user_profile", JSON.stringify(user));
    } else {
      localStorage.removeItem("krivexa_user_profile");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("krivexa_user_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    return safeJsonParse<WalletTransaction[]>("krivexa_wallet_txns", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexa_wallet_txns", JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  const addWalletTransaction = (txn: Omit<WalletTransaction, "id" | "date">) => {
    const newTxn: WalletTransaction = {
      ...txn,
      id: `#TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    };
    setWalletTransactions((prev) => [newTxn, ...prev]);
  };

  const walletBalance = walletTransactions.reduce((acc, t) => {
    return t.type === "credit" ? acc + t.amount : acc - t.amount;
  }, 0);

  const registerNewAccount = (accountData: Omit<RegisteredAccount, "id" | "createdAt">): RegisteredAccount => {
    const accountName = accountData.fullName || (accountData as any).name || "User";
    const newAccount: RegisteredAccount = {
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
      (a) => (a.phone || "").replace(/\D/g, "").slice(-10) === cleanP ||
        (profileData.name && a.fullName && a.fullName.trim().toLowerCase() === profileData.name.trim().toLowerCase())
    );

    const isApprovedFromAcc = Boolean(existingAcc?.isKccIssued || existingAcc?.kccCardNumber);
    const kccCardNumFromAcc = existingAcc?.kccCardNumber;
    const kccLimitFromAcc = existingAcc?.kccCreditLimit;

    const newUser: UserProfile = {
      ...profileData,
      id: `usr-${Date.now()}`,
      isKccIssued: isApprovedFromAcc || profileData.isKccIssued || false,
      kccCardNumber: kccCardNumFromAcc || profileData.kccCardNumber,
      kccCreditLimit: kccLimitFromAcc || profileData.kccCreditLimit || 50000,
      createdAt: new Date().toISOString(),
    };

    if (newUser.isKccIssued && newUser.kccCardNumber) {
      setIsKccIssuedState(true);
      localStorage.setItem("krivexa_kcc_issued", "true");
    } else {
      setIsKccIssuedState(false);
      localStorage.removeItem("krivexa_kcc_issued");
    }

    setUser(newUser);
    api.saveUser(newUser);

    // Fetch this user's KCC applications from DB after login
    api.getKccApplications().then((allApps) => {
      if (allApps && allApps.length > 0) {
        const userApps = allApps.filter((app: KccApplication) => {
          const appPhone = (app.phone || "").replace(/\D/g, "").slice(-10);
          return (cleanP && appPhone && cleanP === appPhone) ||
            (app.fullName?.trim().toLowerCase() === newUser.name?.trim().toLowerCase());
        });
        if (userApps.length > 0) {
          setKccApplications(userApps);
          localStorage.setItem("krivexa_kcc_apps", JSON.stringify(userApps));
          const approvedApp = userApps.find((a) => a.status === "approved" && a.cardNumber);
          if (approvedApp) {
            setIsKccIssuedState(true);
            localStorage.setItem("krivexa_kcc_issued", "true");
            setUser((u) => {
              if (!u) return null;
              const updated = {
                ...u,
                isKccIssued: true,
                isVerified: true,
                kccCardNumber: approvedApp.cardNumber,
                kccCreditLimit: approvedApp.creditLimit || approvedApp.paymentAmount || u.kccCreditLimit || 50000,
              };
              localStorage.setItem("krivexa_user_profile", JSON.stringify(updated));
              return updated;
            });
          }
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
    // Clear all user-specific state from localStorage on logout
    localStorage.removeItem("krivexa_user_profile");
    localStorage.removeItem("krivexa_kcc_issued");
    localStorage.removeItem("krivexa_kcc_apps");
    localStorage.removeItem("krivexa_user_notifications");
    localStorage.removeItem("krivexa_wallet_txns");
    // Reset KCC & Wallet state in memory so next user starts fresh
    setIsKccIssuedState(false);
    setKccApplications([]);
    setWalletTransactions([]);
    setNotifications([]);
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
    if (user?.id) {
      api.updateUser(user.id, updated);
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

  // isKccIssued: true if admin OR if logged-in user has KCC approved / card assigned
  const isKccIssued = Boolean(
    isAdminLoggedIn ||
    (user !== null && (
      Boolean(user.isKccIssued) ||
      Boolean(user.kccCardNumber) ||
      isKccIssuedState ||
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

  const kccDetails: KccApplication | null = currentUserKccApp
    ? {
        ...currentUserKccApp,
        cardNumber: currentUserKccApp.cardNumber || user?.kccCardNumber || (isKccIssued ? "KCC-BH-2026-ACTIVE" : undefined),
        creditLimit: currentUserKccApp.creditLimit || currentUserKccApp.paymentAmount || user?.kccCreditLimit || 50000,
        paymentAmount: currentUserKccApp.creditLimit || currentUserKccApp.paymentAmount || user?.kccCreditLimit || 50000,
        status: isKccIssued ? "approved" : currentUserKccApp.status,
      }
    : (user && (user.kccCardNumber || isKccIssued))
    ? {
        id: `kcc-${user.id || Date.now()}`,
        fullName: user.name,
        phone: user.phone || "",
        aadhaar: user.aadhaarNumber || "XXXX-XXXX-XXXX",
        address: [user.village, user.district, user.state].filter(Boolean).join(", ") || (user.district || "Bihar"),
        district: user.district || "Patna",
        landSize: user.landSize || "2.5 Acres",
        status: "approved",
        cardNumber: user.kccCardNumber || "KCC-BH-2026-ACTIVE",
        creditLimit: user.kccCreditLimit || 50000,
        paymentAmount: user.kccCreditLimit || 50000,
        issueDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      }
    : null;

  const checkKccPermission = (actionName?: string): boolean => {
    // 1. Admin always has full access
    if (isAdminLoggedIn) return true;

    // 2. Dealer role can access Customer Services & Add New Product/Service for FREE without KCC
    if (user?.role === "dealer" && (
      actionName === "dealer-tools" || 
      actionName === "customer-services" || 
      actionName === "add-listing"
    )) {
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
      toast.info("Your KCC Application is under Admin review. All features will be unlocked once approved!");
      setIsKccAlertOpen(true);
      return false;
    }

    // 6. If not approved, trigger the KCC alert modal
    setIsKccAlertOpen(true);
    return false;
  };

  // Dealer Features Implementation
  const [farmerCardStore, setFarmerCardStore] = useState<Record<string, { cardHolder: string; balance: number; status: string }>>({});

  const dealerApplyFarmerKcc = (appData: Omit<KccApplication, "id" | "status" | "createdAt">) => {
    const newApp: KccApplication = {
      ...appData,
      id: `kcc-dealer-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setKccApplications((prev) => [newApp, ...prev]);
    api.submitKccApplication(newApp);
    addNotification(
      "Farmer KCC Submitted",
      `KCC Application for ${appData.fullName} submitted successfully by Dealer.`,
      "success",
      "/admin",
      "kcc"
    );
  };

  const checkFarmerCardBalance = (cardNumber: string) => {
    const cleaned = cardNumber.trim();
    if (farmerCardStore[cleaned]) {
      return { exists: true, ...farmerCardStore[cleaned] };
    }
    // Check in kccApplications list if verified
    const matchedApp = kccApplications.find(a => a.cardNumber === cleaned && a.status === "approved");
    if (matchedApp) {
      return { exists: true, cardHolder: matchedApp.fullName, balance: matchedApp.creditLimit || matchedApp.paymentAmount || 50000, status: "active" };
    }
    return { exists: false };
  };

  const chargeFarmerCard = (cardNumber: string, amount: number, itemDesc: string) => {
    const cleaned = cardNumber.trim();
    const info = checkFarmerCardBalance(cleaned);
    if (!info || !info.exists || !("balance" in info)) {
      return { success: false, message: "Kishan Credit Card not found or not active." };
    }
    const currentBalance = info.balance ?? 0;
    const holderName = info.cardHolder ?? "Farmer";

    if (currentBalance < amount) {
      return { success: false, message: `Insufficient balance on KCC. Current available limit: ₹${currentBalance}` };
    }

    const newBalance = currentBalance - amount;
    setFarmerCardStore(prev => ({
      ...prev,
      [cleaned]: {
        cardHolder: holderName,
        balance: newBalance,
        status: "active"
      }
    }));
    api.chargeFarmerCard(cleaned, amount);

    addNotification(
      "KCC Payment Debited",
      `₹${amount} debited for "${itemDesc}" from Card ${cleaned} (${holderName}).`,
      "success",
      "/wallet",
      "wallet"
    );

    return {
      success: true,
      message: `Payment of ₹${amount} debited successfully!`,
      remainingBalance: newBalance
    };
  };

  // Dealer Product / Service Listings State (Point 4)
  const [dealerListings, setDealerListings] = useState<DealerListing[]>(() => {
    return safeJsonParse<DealerListing[]>("krivexa_dealer_listings", [
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
    localStorage.setItem("krivexa_dealer_listings", JSON.stringify(dealerListings));
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
    return safeJsonParse<PathshalaVideo[]>("krivexa_pathshala_videos", [
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
    localStorage.setItem("krivexa_pathshala_videos", JSON.stringify(pathshalaVideos));
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
    return safeJsonParse<RegisteredFarmer[]>("krivexa_registered_farmers", []);
  });

  useEffect(() => {
    localStorage.setItem("krivexa_registered_farmers", JSON.stringify(registeredFarmers));
  }, [registeredFarmers]);

  const registerFarmerByDealer = (farmerData: Omit<RegisteredFarmer, "id" | "createdAt">): RegisteredFarmer => {
    const newFarmer: RegisteredFarmer = {
      ...farmerData,
      id: `rf-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRegisteredFarmers((prev) => [newFarmer, ...prev]);
    api.registerFarmer(newFarmer);
    addNotification(
      "New Farmer Registered 👤",
      `Farmer ${farmerData.name} (+91 ${farmerData.phone}) registered successfully by ${farmerData.registeredByDealer}.`,
      "success",
      "/dashboard",
      "account"
    );
    return newFarmer;
  };

  // Checking KCC Status by Phone, Aadhaar, or Card Number (Point 1.i)
  const checkKccStatusByPhoneAadhaar = (phone?: string, aadhaar?: string, cardNumber?: string): KccApplication | null => {
    const cleanPhone = (phone || "").trim();
    const cleanAadhaar = (aadhaar || "").trim().replace(/\s+/g, "");
    const cleanCard = (cardNumber || "").trim();

    if (!cleanPhone && !cleanAadhaar && !cleanCard) return null;

    const matched = kccApplications.find(a => {
      const matchPhone = cleanPhone && (a.phone.trim() === cleanPhone || a.phone.includes(cleanPhone));
      const matchAadhaar = cleanAadhaar && (a.aadhaar.replace(/\s+/g, "") === cleanAadhaar || a.aadhaar.includes(cleanAadhaar));
      const matchCard = cleanCard && (a.cardNumber?.toLowerCase() === cleanCard.toLowerCase() || a.cardNumber?.includes(cleanCard));
      return matchPhone || matchAadhaar || matchCard;
    });

    if (matched) return matched;
    return null;
  };

  // Get Farmer Profile & Balance Details by KCC / Aadhaar / Phone (Point 1.iv)
  const getFarmerProfileByDetails = (query: { kccNum?: string; aadhaar?: string; phone?: string }) => {
    const cleanKcc = (query.kccNum || "").trim();
    const cleanAadhaar = (query.aadhaar || "").trim().replace(/\s+/g, "");
    const cleanPhone = (query.phone || "").trim();

    if (!cleanKcc && !cleanAadhaar && !cleanPhone) {
      return { exists: false };
    }

    // 1. Search in kccApplications
    const matchedApp = kccApplications.find(a => 
      (cleanKcc && (a.cardNumber === cleanKcc || a.cardNumber?.includes(cleanKcc))) ||
      (cleanAadhaar && (a.aadhaar.replace(/\s+/g, "") === cleanAadhaar || a.aadhaar.includes(cleanAadhaar))) ||
      (cleanPhone && (a.phone === cleanPhone || a.phone.includes(cleanPhone)))
    );

    // 2. Search in registeredFarmers
    const matchedRegistered = registeredFarmers.find(r =>
      (cleanAadhaar && (r.aadhaar.replace(/\s+/g, "") === cleanAadhaar || r.aadhaar.includes(cleanAadhaar))) ||
      (cleanPhone && (r.phone === cleanPhone || r.phone.includes(cleanPhone)))
    );

    // 3. Search card balance
    const cardLookupKey = cleanKcc || (matchedApp?.cardNumber || "");
    const cardInfo = checkFarmerCardBalance(cardLookupKey);

    if (matchedApp || matchedRegistered || cardInfo?.exists) {
      const activeLimit = matchedApp?.creditLimit || matchedApp?.paymentAmount || 50000;
      return {
        exists: true,
        kccApp: matchedApp,
        cardInfo: cardInfo?.exists ? cardInfo : { exists: true, cardHolder: matchedApp?.fullName || matchedRegistered?.name || "Farmer Account", balance: activeLimit, status: "active" },
        profile: {
          name: matchedApp?.fullName || matchedRegistered?.name || user?.name || "Kishan Farmer",
          phone: matchedApp?.phone || matchedRegistered?.phone || user?.phone || cleanPhone || "9876543210",
          aadhaar: matchedApp?.aadhaar || matchedRegistered?.aadhaar || cleanAadhaar || "1234-5678-9012",
          district: matchedApp?.district || matchedRegistered?.district || "Patna",
          village: matchedRegistered?.village || matchedApp?.address || "Bihar Village",
          landSize: matchedApp?.landSize || matchedRegistered?.landSize || "3.5 Acres",
          cardNumber: matchedApp?.cardNumber || cardLookupKey || "KCC-BH-2026-9041",
          kccStatus: matchedApp?.status || "approved",
        }
      };
    }

    return { exists: false };
  };

  // Cart & Order State Management (Personal per user)
  const cartStorageKey = user ? `krivexa_cart_${user.phone || user.id}` : "krivexa_cart_guest";
  const [cart, setCart] = useState<CartItem[]>(() => {
    return safeJsonParse<CartItem[]>(cartStorageKey, []);
  });

  const [orders, setOrders] = useState<CartOrder[]>(() => {
    return safeJsonParse<CartOrder[]>("krivexa_cart_orders", []);
  });

  useEffect(() => {
    setCart(safeJsonParse<CartItem[]>(cartStorageKey, []));
  }, [cartStorageKey]);

  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey]);

  useEffect(() => {
    localStorage.setItem("krivexa_cart_orders", JSON.stringify(orders));
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

    if (paymentMethod === "kcc") {
      const kccCard = kccDetails?.cardNumber || "KCC-BH-2026-9041";
      const chargeRes = chargeFarmerCard(kccCard, totalAmount, `Order of ${cart.length} items`);
      if (!chargeRes.success) {
        return chargeRes;
      }
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: CartOrder = {
      id: orderId,
      userId: user?.id || "guest",
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
      `Order ${orderId} for ₹${totalAmount} has been placed. Items will be delivered to ${deliveryAddress || "your registered address"}.`,
      "success",
      "/cart",
      "orders"
    );

    // Dual notification: notify seller(s) of the purchased crops / dealer products
    cart.forEach((item) => {
      if (item.sellerName) {
        addNotification(
          "Your Listed Item Was Purchased! 🌾",
          `Customer ${user?.name || "Verified Farmer"} placed an order for "${item.name}" (${item.quantity} ${item.unit || "unit"}). Total: ₹${(item.price * item.quantity).toLocaleString("en-IN")}.`,
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
        allotMachineryBooking,
        rejectMachineryBooking,

        labourTypes,
        addLabourType,
        removeLabourType,
        labourBookings,
        addLabourBooking,
        assignLaboursToBooking,

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

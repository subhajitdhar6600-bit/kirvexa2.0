export type Language = "en" | "hi" | "bn";

export interface Translations {
  nav: {
    home: string;
    services: string;
    resources: string;
    mandiBhav: string;
    buyInputs: string;
    sellCrops: string;
    labourBooking: string;
    expertAdvice: string;
    weather: string;
    wallet: string;
    applyKcc: string;
    aboutUs: string;
    contactUs: string;
    login: string;
    register: string;
    adminPanel: string;
    blog: string;
    cropCalendar: string;
    govSchemes: string;
    farmingTips: string;
    helpCenter: string;
    language: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    title3: string;
    title4: string;
    desc: string;
    getStarted: string;
    applyKcc: string;
    farmersCount: string;
    mandisCount: string;
    expertsCount: string;
    supportCount: string;
  };
  services: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    mandiBhavTitle: string;
    mandiBhavDesc: string;
    buyInputsTitle: string;
    buyInputsDesc: string;
    sellCropsTitle: string;
    sellCropsDesc: string;
    labourBookingTitle: string;
    labourBookingDesc: string;
    expertAdviceTitle: string;
    expertAdviceDesc: string;
    weatherTitle: string;
    weatherDesc: string;
    walletTitle: string;
    walletDesc: string;
  };
  farmerNeeds: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    explore: string;
    f1Title: string; f1Desc: string; f1Badge: string;
    f2Title: string; f2Desc: string; f2Badge: string;
    f3Title: string; f3Desc: string; f3Badge: string;
    f4Title: string; f4Desc: string; f4Badge: string;
    f5Title: string; f5Desc: string; f5Badge: string;
    f6Title: string; f6Desc: string; f6Badge: string;
  };
  home: {
    kccPromoTitle: string;
    kccPromoDesc: string;
    applyNow: string;
    trustedBy: string;
    trustedHighlight: string;
    trustSecure: string; trustSecureDesc: string;
    trustPlatform: string; trustPlatformDesc: string;
    trustPrice: string; trustPriceDesc: string;
    trustSupport: string; trustSupportDesc: string;
    joinTitle: string;
    joinHighlight: string;
    joinDesc: string;
    registerNow: string;
  };
  kccModal: {
    title: string;
    subtitle: string;
    alertTitle: string;
    alertDesc: string;
    applyNow: string;
    fullName: string;
    phone: string;
    aadhaar: string;
    address: string;
    district: string;
    landSize: string;
    submit: string;
    success: string;
    statusActive: string;
    statusPending: string;
    cancel: string;
    submittedTitle: string;
    close: string;
    restrictedBadge: string;
  };
  buyInputs: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    searchPlaceholder: string;
    filter: string;
    all: string;
    seeds: string;
    fertilizers: string;
    pesticides: string;
    farmTools: string;
    organic: string;
    userCrops: string;
    farmerCropsTitle: string;
    agriInputsTitle: string;
    available: string;
    farmerListedBadge: string;
    by: string;
    viewDetails: string;
    sellerDetails: string;
    callSeller: string;
    whatsappSeller: string;
    addToCart: string;
    noProducts: string;
    weight: string;
    askingPrice: string;
  };
  sellCrops: {
    title: string;
    subtitle: string;
    formHeader: string;
    formSubheader: string;
    sellerName: string;
    district: string;
    city: string;
    address: string;
    pincode: string;
    phone: string;
    cropName: string;
    weight: string;
    price: string;
    imageUpload: string;
    gallery: string;
    camera: string;
    submit: string;
    submittedTitle: string;
    submittedMsg: string;
    pendingNote: string;
    submitAnother: string;
  };
  labourBooking: {
    title: string;
    subtitle: string;
    formHeader: string;
    formSubheader: string;
    labourType: string;
    numLabours: string;
    numDays: string;
    startDate: string;
    endDate: string;
    location: string;
    name: string;
    phone: string;
    submit: string;
    submittedTitle: string;
    submittedMsg: string;
    pendingBadge: string;
    assignedTitle: string;
    noAssigned: string;
    submitAnother: string;
  };
  expertAdvice: {
    title: string;
    subtitle: string;
    formHeader: string;
    formSubheader: string;
    farmerName: string;
    phone: string;
    address: string;
    cropName: string;
    problemDetails: string;
    submit: string;
    submittedTitle: string;
    submittedMsg: string;
    callAdmin: string;
    whatsappAdmin: string;
    submitAnother: string;
  };
  mandiBhav: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    todaysPrices: string;
    refresh: string;
    crop: string;
    minPrice: string;
    maxPrice: string;
    modalPrice: string;
    unit: string;
    change: string;
    noCrops: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    services: string;
    contactUs: string;
    helpline: string;
    address: string;
    downloadApp: string;
    privacyPolicy: string;
    termsConditions: string;
    rights: string;
  };
  weather: {
    title: string;
    subtitle: string;
    hourlyForecast: string;
    weeklyForecast: string;
    advisoryTitle: string;
  };
  wallet: {
    title: string;
    subtitle: string;
    secured: string;
    totalIn: string;
    totalOut: string;
    addMoney: string;
    enterAmount: string;
    add: string;
    txHistory: string;
    viewAll: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      resources: "Resources",
      mandiBhav: "Mandi Bhav",
      buyInputs: "Buy Inputs",
      sellCrops: "Sell Crops",
      labourBooking: "Labour Booking",
      expertAdvice: "Expert Advice",
      weather: "Weather Update",
      wallet: "Krivexo Wallet",
      applyKcc: "Apply for Kisan Credit Card",
      aboutUs: "About Us",
      contactUs: "Contact Us",
      login: "Login",
      register: "Register",
      adminPanel: "Admin Panel",
      blog: "Blog",
      cropCalendar: "Crop Calendar",
      govSchemes: "Government Schemes",
      farmingTips: "Farming Tips",
      helpCenter: "Help Center",
      language: "Language",
    },
    hero: {
      badge: "Smart Farming Platform for India",
      title1: "SMART",
      title2: "FARMING.",
      title3: "SMARTER",
      title4: "FUTURE.",
      desc: "Krivexo brings every farming solution to your fingertips â live mandi rates, buy inputs, sell crops, labour booking, and expert advice.",
      getStarted: "Get Started Free",
      applyKcc: "Apply for Kisan Credit Card",
      farmersCount: "Farmers Registered",
      mandisCount: "Mandis Covered",
      expertsCount: "Agri Experts",
      supportCount: "Active Support",
    },
    services: {
      title: "Our",
      titleHighlight: "Services",
      subtitle: "All farming solutions in one simple platform",
      mandiBhavTitle: "Mandi Bhav", mandiBhavDesc: "Live Market Rates",
      buyInputsTitle: "Buy Inputs", buyInputsDesc: "Seeds, Fertilizer",
      sellCropsTitle: "Sell Crops", sellCropsDesc: "Best Price Market",
      labourBookingTitle: "Labour Booking", labourBookingDesc: "Skilled Labour",
      expertAdviceTitle: "Expert Advice", expertAdviceDesc: "Talk to Experts",
      weatherTitle: "Weather Update", weatherDesc: "Live Forecast",
      walletTitle: "Kisan Wallet", walletDesc: "Secure Payments",
    },
    farmerNeeds: {
      badge: "FARMING SERVICES",
      title: "Everything a Farmer",
      titleHighlight: "Needs",
      subtitle: "Innovative & empowering tools built specifically for modern farmers",
      explore: "Explore",
      f1Title: "Live Mandi Bhav", f1Desc: "Real-time crop market prices updated daily by admin.", f1Badge: "Live Rates",
      f2Title: "Buy Inputs", f2Desc: "Quality seeds, fertilizers, pesticides & farming tools.", f2Badge: "Verified",
      f3Title: "Sell Crops", f3Desc: "List your harvest & connect directly with buyers.", f3Badge: "Direct Market",
      f4Title: "Labour Booking", f4Desc: "Book skilled workers assigned by admin for your field.", f4Badge: "On-Demand",
      f5Title: "Expert Advice", f5Desc: "Direct agricultural consultation, calls & WhatsApp.", f5Badge: "24/7 Support",
      f6Title: "Weather Update", f6Desc: "Accurate daily forecasts to plan farming activities.", f6Badge: "Live Forecast",
    },
    home: {
      kccPromoTitle: "Unlock Everything with Kisan Credit Card",
      kccPromoDesc: "Apply for your free KCC to access all platform features â buying, selling, labour booking and expert advice.",
      applyNow: "Apply Now",
      trustedBy: "Trusted by",
      trustedHighlight: "Farmers",
      trustSecure: "100% Secure", trustSecureDesc: "Your data is always protected",
      trustPlatform: "Trusted Platform", trustPlatformDesc: "Join thousands of farmers",
      trustPrice: "Best Price Guarantee", trustPriceDesc: "Get the best market price",
      trustSupport: "24Ã7 Support", trustSupportDesc: "We are always here to help you",
      joinTitle: "Join",
      joinHighlight: "Krivexo Today",
      joinDesc: "Register for free and start your smart farming journey.",
      registerNow: "Register Now",
    },
    kccModal: {
      title: "Kisan Credit Card Application",
      subtitle: "Fill out the details below to apply for your official Kisan Credit Card",
      alertTitle: "Kisan Credit Card Required",
      alertDesc: "You have not created or been issued a Kisan Credit Card yet. Without an active Kisan Credit Card, you cannot buy/sell crops, book labour, or contact sellers. Please apply now to unlock all features!",
      applyNow: "Apply for Kisan Credit Card Now",
      fullName: "Full Name of Farmer",
      phone: "Mobile Number",
      aadhaar: "Aadhaar Card Number",
      address: "Full Village / Address",
      district: "District",
      landSize: "Total Land Owned (in Acres)",
      submit: "Submit KCC Application",
      success: "Your Kisan Credit Card application has been submitted successfully! Admin will review and issue your card shortly.",
      statusActive: "KCC Active & Issued",
      statusPending: "KCC Application Under Review",
      cancel: "Cancel",
      submittedTitle: "Application Submitted!",
      close: "Close",
      restrictedBadge: "Action Restricted",
    },
    buyInputs: {
      title: "Buy",
      titleHighlight: "Inputs & Crops",
      subtitle: "Browse quality seeds, fertilizers, farm tools and verified farmer crop listings",
      searchPlaceholder: "Search products or crops...",
      filter: "Filter",
      all: "All",
      seeds: "Seeds",
      fertilizers: "Fertilizers",
      pesticides: "Pesticides",
      farmTools: "Farm Tools",
      organic: "Organic",
      userCrops: "Farmer Crops",
      farmerCropsTitle: "Farmer-Listed Crops",
      agriInputsTitle: "Agricultural Inputs",
      available: "available",
      farmerListedBadge: "Farmer Listed",
      by: "By",
      viewDetails: "View",
      sellerDetails: "Seller Details",
      callSeller: "Call Seller",
      whatsappSeller: "WhatsApp",
      addToCart: "Buy",
      noProducts: "No products found matching your search.",
      weight: "Weight",
      askingPrice: "Asking Price",
    },
    sellCrops: {
      title: "Sell Crops",
      subtitle: "Submit your harvest listing to reach buyers across the state at top market prices",
      formHeader: "Sell Your Crops",
      formSubheader: "Fill in crop & seller details to create your listing",
      sellerName: "Name of Seller",
      district: "District",
      city: "City / Town",
      address: "Proper Village Address",
      pincode: "PIN Code",
      phone: "Phone Number",
      cropName: "Selling Crop Name",
      weight: "Weight (kg / Quintal)",
      price: "Asking Price (â¹)",
      imageUpload: "Crop Image Upload",
      gallery: "Choose from Gallery",
      camera: "Take Photo with Camera",
      submit: "Submit Listing Request",
      submittedTitle: "Listing Request Submitted!",
      submittedMsg: "Your crop listing request has been submitted to the Admin Panel for approval!",
      pendingNote: "Admin will review and approve your listing. It will appear in Buy Inputs after approval.",
      submitAnother: "Submit Another Listing",
    },
    labourBooking: {
      title: "Labour Booking",
      subtitle: "Request skilled agricultural workers for harvesting, sowing, and farm work",
      formHeader: "Book Labour",
      formSubheader: "Fill in the details to send a request to the admin",
      labourType: "Type of Labour",
      numLabours: "Number of Labours Needed",
      numDays: "Number of Days",
      startDate: "Starting Date",
      endDate: "Ending Date",
      location: "Location of Work",
      name: "Your Full Name",
      phone: "Contact Mobile Number",
      submit: "Submit Labour Booking Request",
      submittedTitle: "Labour Booking Request Sent!",
      submittedMsg: "Your request has been forwarded to the admin. Once labours are assigned, you will receive a notification here with all their details.",
      pendingBadge: "Pending Admin Approval",
      assignedTitle: "Your Assigned Labour Notifications",
      noAssigned: "No assigned labours yet. Once admin approves your request, assigned labour details will appear here.",
      submitAnother: "Submit Another Request",
    },
    expertAdvice: {
      title: "Expert Advice",
      subtitle: "Get expert solutions for crop diseases and farming problems directly from agricultural experts",
      formHeader: "Submit a Query",
      formSubheader: "Admin will contact you with expert advice",
      farmerName: "Name of the Farmer",
      phone: "Phone Number",
      address: "Full Address",
      cropName: "Problem Regarding Which Crop?",
      problemDetails: "Describe What is the Problem in Detail",
      submit: "Submit Query to Admin",
      submittedTitle: "Query Submitted!",
      submittedMsg: "Your farming problem has been sent to the admin. Our expert team will review and contact you shortly.",
      callAdmin: "Call Admin Directly",
      whatsappAdmin: "WhatsApp Chat with Admin",
      submitAnother: "Submit Another Query",
    },
    mandiBhav: {
      title: "Live Mandi Bhav",
      subtitle: "Updated commodity market rates from major mandis",
      searchPlaceholder: "Search crop name...",
      todaysPrices: "Today's Prices",
      refresh: "Refresh",
      crop: "Crop Name",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      modalPrice: "Modal Price",
      unit: "Unit",
      change: "Change",
      noCrops: "No crops found matching your search.",
    },
    footer: {
      tagline: "Empowering farmers with smart technology, instant market access, and reliable farm services.",
      quickLinks: "Quick Navigation",
      services: "Farming Services",
      contactUs: "Contact Us",
      helpline: "Farmer Helpline 24/7",
      address: "Bihar Agriculture Technology Hub, India",
      downloadApp: "Download App",
      privacyPolicy: "Privacy Policy",
      termsConditions: "Terms & Conditions",
      rights: "All rights reserved. KRIVEXO Smart Farming.",
    },
    weather: {
      title: "Weather Update",
      subtitle: "Real-time weather forecast for smarter farming decisions",
      hourlyForecast: "Today's Hourly Forecast",
      weeklyForecast: "7-Day Forecast",
      advisoryTitle: "Farm Weather Advisory",
    },
    wallet: {
      title: "Krivexo Wallet",
      subtitle: "Secure digital payments for all farming transactions",
      secured: "Protected & Secured",
      totalIn: "Total In",
      totalOut: "Total Out",
      addMoney: "Add Money",
      enterAmount: "Enter amount",
      add: "Add",
      txHistory: "Transaction History",
      viewAll: "View All",
    },
  },
  hi: {
    nav: {
      home: "à¤¹à¥à¤®",
      services: "à¤¸à¥à¤µà¤¾à¤à¤",
      resources: "à¤¸à¤à¤¸à¤¾à¤§à¤¨",
      mandiBhav: "à¤®à¤à¤¡à¥ à¤­à¤¾à¤µ",
      buyInputs: "à¤à¤¾à¤¦-à¤¬à¥à¤ à¤à¤°à¥à¤¦à¥à¤",
      sellCrops: "à¤«à¤¸à¤² à¤¬à¥à¤à¥à¤",
      labourBooking: "à¤®à¤à¤¦à¥à¤° à¤¬à¥à¤à¤¿à¤à¤",
      expertAdvice: "à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤ à¤¸à¤²à¤¾à¤¹",
      weather: "à¤®à¥à¤¸à¤® à¤à¤ªà¤¡à¥à¤",
      wallet: "à¤à¤¿à¤¸à¤¾à¤¨ à¤µà¥à¤²à¥à¤",
      applyKcc: "à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥à¤°à¥à¤¡à¤¿à¤ à¤à¤¾à¤°à¥à¤¡ à¤à¤µà¥à¤¦à¤¨ à¤à¤°à¥à¤",
      aboutUs: "à¤¹à¤®à¤¾à¤°à¥ à¤¬à¤¾à¤°à¥ à¤®à¥à¤",
      contactUs: "à¤¸à¤à¤ªà¤°à¥à¤ à¤à¤°à¥à¤",
      login: "à¤²à¥à¤à¤¿à¤¨",
      register: "à¤ªà¤à¤à¥à¤à¤°à¤£",
      adminPanel: "à¤à¤¡à¤®à¤¿à¤¨ à¤ªà¥à¤¨à¤²",
      blog: "à¤¬à¥à¤²à¥à¤",
      cropCalendar: "à¤«à¤¸à¤² à¤à¥à¤²à¥à¤à¤¡à¤°",
      govSchemes: "à¤¸à¤°à¤à¤¾à¤°à¥ à¤¯à¥à¤à¤¨à¤¾à¤à¤",
      farmingTips: "à¤à¥à¤·à¤¿ à¤à¤¿à¤ªà¥à¤¸",
      helpCenter: "à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾ à¤à¥à¤à¤¦à¥à¤°",
      language: "à¤­à¤¾à¤·à¤¾",
    },
    hero: {
      badge: "à¤­à¤¾à¤°à¤¤ à¤à¤¾ à¤¸à¥à¤®à¤¾à¤°à¥à¤ à¤à¥à¤·à¤¿ à¤®à¤à¤",
      title1: "à¤¸à¥à¤®à¤¾à¤°à¥à¤",
      title2: "à¤à¥à¤¤à¥à¥¤",
      title3: "à¤¬à¥à¤¹à¤¤à¤°",
      title4: "à¤­à¤µà¤¿à¤·à¥à¤¯à¥¤",
      desc: "à¤à¥à¤°à¤¿à¤µà¥à¤à¥à¤¸à¤¾ à¤¹à¤° à¤à¥à¤·à¤¿ à¤¸à¤®à¤¾à¤§à¤¾à¤¨ à¤à¤ªà¤à¥ à¤à¤à¤à¤²à¤¿à¤¯à¥à¤ à¤ªà¤° à¤²à¤¾à¤¤à¤¾ à¤¹à¥ â à¤²à¤¾à¤à¤µ à¤®à¤à¤¡à¥ à¤­à¤¾à¤µ, à¤à¤¾à¤¦-à¤¬à¥à¤, à¤«à¤¸à¤² à¤¬à¤¿à¤à¥à¤°à¥, à¤®à¤à¤¦à¥à¤° à¤¬à¥à¤à¤¿à¤à¤ à¤à¤° à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤ à¤¸à¤²à¤¾à¤¹à¥¤",
      getStarted: "à¤®à¥à¤«à¥à¤¤ à¤®à¥à¤ à¤¶à¥à¤°à¥ à¤à¤°à¥à¤",
      applyKcc: "à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥à¤°à¥à¤¡à¤¿à¤ à¤à¤¾à¤°à¥à¤¡ à¤à¤µà¥à¤¦à¤¨ à¤à¤°à¥à¤",
      farmersCount: "à¤ªà¤à¤à¥à¤à¥à¤¤ à¤à¤¿à¤¸à¤¾à¤¨",
      mandisCount: "à¤¶à¤¾à¤®à¤¿à¤² à¤®à¤à¤¡à¤¿à¤¯à¤¾à¤",
      expertsCount: "à¤à¥à¤·à¤¿ à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤",
      supportCount: "24/7 à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾",
    },
    services: {
      title: "à¤¹à¤®à¤¾à¤°à¥",
      titleHighlight: "à¤¸à¥à¤µà¤¾à¤à¤",
      subtitle: "à¤à¤ à¤¹à¥ à¤¸à¤°à¤² à¤®à¤à¤ à¤ªà¤° à¤¸à¤­à¥ à¤à¥à¤·à¤¿ à¤¸à¤®à¤¾à¤§à¤¾à¤¨",
      mandiBhavTitle: "à¤®à¤à¤¡à¥ à¤­à¤¾à¤µ", mandiBhavDesc: "à¤²à¤¾à¤à¤µ à¤¬à¤¾à¤à¤¾à¤° à¤­à¤¾à¤µ",
      buyInputsTitle: "à¤à¤¾à¤¦-à¤¬à¥à¤ à¤à¤°à¥à¤¦à¥à¤", buyInputsDesc: "à¤à¤¤à¥à¤à¥à¤·à¥à¤ à¤¬à¥à¤ à¤µ à¤à¤¾à¤¦",
      sellCropsTitle: "à¤«à¤¸à¤² à¤¬à¥à¤à¥à¤", sellCropsDesc: "à¤à¤¤à¥à¤¤à¤® à¤¬à¤¾à¤à¤¾à¤° à¤®à¥à¤²à¥à¤¯",
      labourBookingTitle: "à¤®à¤à¤¦à¥à¤° à¤¬à¥à¤à¤¿à¤à¤", labourBookingDesc: "à¤à¥à¤¶à¤² à¤à¥à¤·à¤¿ à¤®à¤à¤¦à¥à¤°",
      expertAdviceTitle: "à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤ à¤¸à¤²à¤¾à¤¹", expertAdviceDesc: "à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤à¥à¤ à¤¸à¥ à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶",
      weatherTitle: "à¤®à¥à¤¸à¤® à¤à¤ªà¤¡à¥à¤", weatherDesc: "à¤²à¤¾à¤à¤µ à¤ªà¥à¤°à¥à¤µà¤¾à¤¨à¥à¤®à¤¾à¤¨",
      walletTitle: "à¤à¤¿à¤¸à¤¾à¤¨ à¤µà¥à¤²à¥à¤", walletDesc: "à¤¸à¥à¤°à¤à¥à¤·à¤¿à¤¤ à¤­à¥à¤à¤¤à¤¾à¤¨",
    },
    farmerNeeds: {
      badge: "à¤à¥à¤·à¤¿ à¤¸à¥à¤µà¤¾à¤à¤",
      title: "à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥ à¤¹à¤°",
      titleHighlight: "à¤à¤¼à¤°à¥à¤°à¤¤",
      subtitle: "à¤µà¤¿à¤¶à¥à¤· à¤°à¥à¤ª à¤¸à¥ à¤à¤§à¥à¤¨à¤¿à¤ à¤à¤¿à¤¸à¤¾à¤¨à¥à¤ à¤à¥ à¤²à¤¿à¤ à¤¨à¤¿à¤°à¥à¤®à¤¿à¤¤ à¤à¤­à¤¿à¤¨à¤µ à¤à¤ªà¤à¤°à¤£",
      explore: "à¤¦à¥à¤à¥à¤",
      f1Title: "à¤²à¤¾à¤à¤µ à¤®à¤à¤¡à¥ à¤­à¤¾à¤µ", f1Desc: "à¤à¤¡à¤®à¤¿à¤¨ à¤¦à¥à¤µà¤¾à¤°à¤¾ à¤¦à¥à¤¨à¤¿à¤ à¤à¤¦à¥à¤¯à¤¤à¤¨ à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤ à¤®à¤à¤¡à¥ à¤­à¤¾à¤µà¥¤", f1Badge: "à¤²à¤¾à¤à¤µ à¤¦à¤°à¥à¤",
      f2Title: "à¤à¤¾à¤¦-à¤¬à¥à¤ à¤à¤°à¥à¤¦à¥à¤", f2Desc: "à¤à¥à¤£à¤µà¤¤à¥à¤¤à¤¾à¤ªà¥à¤°à¥à¤£ à¤¬à¥à¤, à¤à¤°à¥à¤µà¤°à¤, à¤à¥à¤à¤¨à¤¾à¤¶à¤ à¤µ à¤à¤ªà¤à¤°à¤£à¥¤", f2Badge: "à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¿à¤¤",
      f3Title: "à¤«à¤¸à¤² à¤¬à¥à¤à¥à¤", f3Desc: "à¤à¤ªà¤¨à¥ à¤à¤ªà¤ à¤¦à¤°à¥à¤ à¤à¤°à¥à¤ à¤à¤° à¤à¤°à¥à¤¦à¤¾à¤°à¥à¤ à¤¸à¥ à¤¸à¥à¤§à¥ à¤à¥à¤¡à¤¼à¥à¤à¥¤", f3Badge: "à¤¸à¥à¤§à¤¾ à¤¬à¤¾à¤à¤¾à¤°",
      f4Title: "à¤®à¤à¤¦à¥à¤° à¤¬à¥à¤à¤¿à¤à¤", f4Desc: "à¤à¥à¤¤ à¤à¥ à¤²à¤¿à¤ à¤à¤¡à¤®à¤¿à¤¨ à¤¦à¥à¤µà¤¾à¤°à¤¾ à¤à¤µà¤à¤à¤¿à¤¤ à¤à¥à¤¶à¤² à¤®à¤à¤¦à¥à¤°à¥¤", f4Badge: "à¤à¤¨-à¤¡à¤¿à¤®à¤¾à¤à¤¡",
      f5Title: "à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤ à¤¸à¤²à¤¾à¤¹", f5Desc: "à¤¸à¥à¤§à¤¾ à¤à¥à¤·à¤¿ à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶, à¤à¥à¤² à¤à¤µà¤ à¤µà¥à¤¹à¤¾à¤à¥à¤¸à¤à¤ª à¤¸à¥à¤µà¤¿à¤§à¤¾à¥¤", f5Badge: "24/7 à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾",
      f6Title: "à¤®à¥à¤¸à¤® à¤à¤ªà¤¡à¥à¤", f6Desc: "à¤à¥à¤¤à¥ à¤à¥ à¤¯à¥à¤à¤¨à¤¾ à¤¬à¤¨à¤¾à¤¨à¥ à¤à¥ à¤²à¤¿à¤ à¤¸à¤à¥à¤ à¤¦à¥à¤¨à¤¿à¤ à¤ªà¥à¤°à¥à¤µà¤¾à¤¨à¥à¤®à¤¾à¤¨à¥¤", f6Badge: "à¤²à¤¾à¤à¤µ à¤à¤ªà¤¡à¥à¤",
    },
    home: {
      kccPromoTitle: "à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥à¤°à¥à¤¡à¤¿à¤ à¤à¤¾à¤°à¥à¤¡ à¤¸à¥ à¤¸à¤­à¥ à¤¸à¥à¤µà¤¿à¤§à¤¾à¤à¤ à¤à¤¨à¤²à¥à¤ à¤à¤°à¥à¤",
      kccPromoDesc: "à¤à¤°à¥à¤¦, à¤¬à¤¿à¤à¥à¤°à¥, à¤®à¤à¤¦à¥à¤° à¤¬à¥à¤à¤¿à¤à¤ à¤à¤° à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤ à¤¸à¤²à¤¾à¤¹ à¤à¥ à¤²à¤¿à¤ à¤à¤ªà¤¨à¤¾ à¤®à¥à¤«à¥à¤¤ à¤à¥à¤¸à¥à¤¸à¥ à¤à¤µà¥à¤¦à¤¨ à¤à¤°à¥à¤à¥¤",
      applyNow: "à¤à¤­à¥ à¤à¤µà¥à¤¦à¤¨ à¤à¤°à¥à¤",
      trustedBy: "à¤à¤¿à¤¸à¤¾à¤¨",
      trustedHighlight: "à¤à¤¾ à¤­à¤°à¥à¤¸à¤¾",
      trustSecure: "100% à¤¸à¥à¤°à¤à¥à¤·à¤¿à¤¤", trustSecureDesc: "à¤à¤ªà¤à¥ à¤à¤¾à¤¨à¤à¤¾à¤°à¥ à¤¹à¤®à¥à¤¶à¤¾ à¤¸à¥à¤°à¤à¥à¤·à¤¿à¤¤ à¤¹à¥",
      trustPlatform: "à¤µà¤¿à¤¶à¥à¤µà¤¸à¤¨à¥à¤¯ à¤®à¤à¤", trustPlatformDesc: "à¤¹à¤à¤¾à¤°à¥à¤ à¤à¤¿à¤¸à¤¾à¤¨à¥à¤ à¤¸à¥ à¤à¥à¤¡à¤¼à¥à¤",
      trustPrice: "à¤¸à¤°à¥à¤µà¥à¤¤à¥à¤¤à¤® à¤®à¥à¤²à¥à¤¯", trustPriceDesc: "à¤ªà¤¾à¤à¤ à¤¬à¤¾à¤à¤¾à¤° à¤à¤¾ à¤¸à¤¬à¤¸à¥ à¤à¤à¥à¤à¤¾ à¤­à¤¾à¤µ",
      trustSupport: "24Ã7 à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾", trustSupportDesc: "à¤¹à¤® à¤¹à¤®à¥à¤¶à¤¾ à¤à¤ªà¤à¥ à¤®à¤¦à¤¦ à¤à¥ à¤²à¤¿à¤ à¤à¤ªà¤²à¤¬à¥à¤§ à¤¹à¥à¤",
      joinTitle: "à¤à¤ à¤¹à¥",
      joinHighlight: "à¤à¥à¤°à¤¿à¤µà¥à¤à¥à¤¸à¤¾ à¤¸à¥ à¤à¥à¤¡à¤¼à¥à¤",
      joinDesc: "à¤®à¥à¤«à¥à¤¤ à¤ªà¤à¤à¥à¤à¤°à¤£ à¤à¤°à¥à¤ à¤à¤° à¤à¤ªà¤¨à¥ à¤¸à¥à¤®à¤¾à¤°à¥à¤ à¤à¥à¤¤à¥ à¤à¥ à¤¯à¤¾à¤¤à¥à¤°à¤¾ à¤¶à¥à¤°à¥ à¤à¤°à¥à¤à¥¤",
      registerNow: "à¤à¤­à¥ à¤ªà¤à¤à¥à¤à¤°à¤£ à¤à¤°à¥à¤",
    },
    kccModal: {
      title: "à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥à¤°à¥à¤¡à¤¿à¤ à¤à¤¾à¤°à¥à¤¡ à¤à¤µà¥à¤¦à¤¨",
      subtitle: "à¤à¤ªà¤¨à¥ à¤à¤§à¤¿à¤à¤¾à¤°à¤¿à¤ à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥à¤°à¥à¤¡à¤¿à¤ à¤à¤¾à¤°à¥à¤¡ à¤à¥ à¤²à¤¿à¤ à¤¨à¥à¤à¥ à¤µà¤¿à¤µà¤°à¤£ à¤­à¤°à¥à¤",
      alertTitle: "à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥à¤°à¥à¤¡à¤¿à¤ à¤à¤¾à¤°à¥à¤¡ à¤à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯ à¤¹à¥",
      alertDesc: "à¤à¤ªà¤à¥ à¤ªà¤¾à¤¸ à¤à¤­à¥ à¤¤à¤ à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥à¤°à¥à¤¡à¤¿à¤ à¤à¤¾à¤°à¥à¤¡ à¤à¤¾à¤°à¥ à¤¨à¤¹à¥à¤ à¤¹à¥à¤ à¤¹à¥à¥¤ à¤¸à¤à¥à¤°à¤¿à¤¯ à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥à¤°à¥à¤¡à¤¿à¤ à¤à¤¾à¤°à¥à¤¡ à¤à¥ à¤¬à¤¿à¤¨à¤¾ à¤à¤ª à¤«à¤¸à¤² à¤à¤°à¥à¤¦/à¤¬à¤¿à¤à¥à¤°à¥, à¤®à¤à¤¦à¥à¤° à¤¬à¥à¤à¤¿à¤à¤ à¤¯à¤¾ à¤¸à¤à¤ªà¤°à¥à¤ à¤¨à¤¹à¥à¤ à¤à¤° à¤¸à¤à¤¤à¥à¥¤ à¤à¥à¤ªà¤¯à¤¾ à¤¸à¤­à¥ à¤¸à¥à¤µà¤¿à¤§à¤¾à¤à¤ à¤à¥ à¤à¤¨à¤²à¥à¤ à¤à¤°à¤¨à¥ à¤à¥ à¤²à¤¿à¤ à¤à¤µà¥à¤¦à¤¨ à¤à¤°à¥à¤!",
      applyNow: "à¤à¤­à¥ à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥à¤°à¥à¤¡à¤¿à¤ à¤à¤¾à¤°à¥à¤¡ à¤à¤µà¥à¤¦à¤¨ à¤à¤°à¥à¤",
      fullName: "à¤à¤¿à¤¸à¤¾à¤¨ à¤à¤¾ à¤ªà¥à¤°à¤¾ à¤¨à¤¾à¤®",
      phone: "à¤®à¥à¤¬à¤¾à¤à¤² à¤¨à¤à¤¬à¤°",
      aadhaar: "à¤à¤§à¤¾à¤° à¤à¤¾à¤°à¥à¤¡ à¤¨à¤à¤¬à¤°",
      address: "à¤ªà¥à¤°à¤¾ à¤à¤¾à¤à¤µ / à¤ªà¤¤à¤¾",
      district: "à¤à¤¿à¤²à¤¾",
      landSize: "à¤à¥à¤² à¤à¤®à¥à¤¨ (à¤à¤à¤¡à¤¼ à¤®à¥à¤)",
      submit: "à¤à¥à¤¸à¥à¤¸à¥ à¤à¤µà¥à¤¦à¤¨ à¤à¤®à¤¾ à¤à¤°à¥à¤",
      success: "à¤à¤ªà¤à¤¾ à¤à¤¿à¤¸à¤¾à¤¨ à¤à¥à¤°à¥à¤¡à¤¿à¤ à¤à¤¾à¤°à¥à¤¡ à¤à¤µà¥à¤¦à¤¨ à¤¸à¤«à¤²à¤¤à¤¾à¤ªà¥à¤°à¥à¤µà¤ à¤à¤®à¤¾ à¤¹à¥ à¤à¤¯à¤¾ à¤¹à¥! à¤à¤¡à¤®à¤¿à¤¨ à¤à¤²à¥à¤¦ à¤¸à¤®à¥à¤à¥à¤·à¤¾ à¤à¤°à¤à¥ à¤à¤¾à¤°à¥à¤¡ à¤à¤¾à¤°à¥ à¤à¤°à¥à¤à¤¾à¥¤",
      statusActive: "à¤à¥à¤¸à¥à¤¸à¥ à¤¸à¤à¥à¤°à¤¿à¤¯ à¤à¤µà¤ à¤à¤¾à¤°à¥",
      statusPending: "à¤à¥à¤¸à¥à¤¸à¥ à¤à¤µà¥à¤¦à¤¨ à¤¸à¤®à¥à¤à¥à¤·à¤¾à¤§à¥à¤¨ à¤¹à¥",
      cancel: "à¤°à¤¦à¥à¤¦ à¤à¤°à¥à¤",
      submittedTitle: "à¤à¤µà¥à¤¦à¤¨ à¤à¤®à¤¾ à¤¹à¥ à¤à¤¯à¤¾!",
      close: "à¤¬à¤à¤¦ à¤à¤°à¥à¤",
      restrictedBadge: "à¤à¤¾à¤°à¥à¤°à¤µà¤¾à¤ à¤¸à¥à¤®à¤¿à¤¤",
    },
    buyInputs: {
      title: "à¤à¤°à¥à¤¦à¥à¤",
      titleHighlight: "à¤à¤¤à¥à¤ªà¤¾à¤¦ à¤à¤µà¤ à¤«à¤¸à¤²à¥à¤",
      subtitle: "à¤à¤¤à¥à¤à¥à¤·à¥à¤ à¤à¥à¤£à¤µà¤¤à¥à¤¤à¤¾ à¤à¥ à¤¬à¥à¤, à¤à¤°à¥à¤µà¤°à¤, à¤à¥à¤·à¤¿ à¤à¤ªà¤à¤°à¤£ à¤à¤° à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¿à¤¤ à¤à¤¿à¤¸à¤¾à¤¨à¥à¤ à¤à¥ à¤«à¤¸à¤² à¤²à¤¿à¤¸à¥à¤à¤¿à¤à¤ à¤¦à¥à¤à¥à¤",
      searchPlaceholder: "à¤à¤¤à¥à¤ªà¤¾à¤¦ à¤¯à¤¾ à¤«à¤¸à¤² à¤à¥à¤à¥à¤...",
      filter: "à¤«à¤¿à¤²à¥à¤à¤°",
      all: "à¤¸à¤­à¥",
      seeds: "à¤¬à¥à¤",
      fertilizers: "à¤à¤°à¥à¤µà¤°à¤",
      pesticides: "à¤à¥à¤à¤¨à¤¾à¤¶à¤",
      farmTools: "à¤à¥à¤·à¤¿ à¤à¤ªà¤à¤°à¤£",
      organic: "à¤à¥à¤µà¤¿à¤",
      userCrops: "à¤à¤¿à¤¸à¤¾à¤¨à¥à¤ à¤à¥ à¤«à¤¸à¤²à¥à¤",
      farmerCropsTitle: "à¤à¤¿à¤¸à¤¾à¤¨à¥à¤ à¤¦à¥à¤µà¤¾à¤°à¤¾ à¤¸à¥à¤à¥à¤¬à¤¦à¥à¤§ à¤«à¤¸à¤²à¥à¤",
      agriInputsTitle: "à¤à¥à¤·à¤¿ à¤à¤¤à¥à¤ªà¤¾à¤¦ à¤à¤µà¤ à¤à¤¾à¤¦-à¤¬à¥à¤",
      available: "à¤à¤ªà¤²à¤¬à¥à¤§",
      farmerListedBadge: "à¤à¤¿à¤¸à¤¾à¤¨ à¤¦à¥à¤µà¤¾à¤°à¤¾ à¤¦à¤°à¥à¤",
      by: "à¤µà¤¿à¤à¥à¤°à¥à¤¤à¤¾",
      viewDetails: "à¤µà¤¿à¤µà¤°à¤£ à¤¦à¥à¤à¥à¤",
      sellerDetails: "à¤µà¤¿à¤à¥à¤°à¥à¤¤à¤¾ à¤µà¤¿à¤µà¤°à¤£",
      callSeller: "à¤à¥à¤² à¤à¤°à¥à¤",
      whatsappSeller: "à¤µà¥à¤¹à¤¾à¤à¥à¤¸à¤à¤ª",
      addToCart: "à¤à¤°à¥à¤¦à¥à¤",
      noProducts: "à¤à¤ªà¤à¥ à¤à¥à¤ à¤¸à¥ à¤®à¥à¤² à¤à¤¾à¤¤à¤¾ à¤à¥à¤ à¤à¤¤à¥à¤ªà¤¾à¤¦ à¤¨à¤¹à¥à¤ à¤®à¤¿à¤²à¤¾à¥¤",
      weight: "à¤µà¤à¤¨",
      askingPrice: "à¤®à¤¾à¤à¤à¥ à¤à¤ à¤à¥à¤®à¤¤",
    },
    sellCrops: {
      title: "à¤«à¤¸à¤² à¤¬à¥à¤à¥à¤",
      subtitle: "à¤à¤¤à¥à¤¤à¤® à¤¬à¤¾à¤à¤¾à¤° à¤®à¥à¤²à¥à¤¯ à¤ªà¤° à¤à¤°à¥à¤¦à¤¾à¤°à¥à¤ à¤¤à¤ à¤ªà¤¹à¥à¤à¤à¤¨à¥ à¤à¥ à¤²à¤¿à¤ à¤à¤ªà¤¨à¥ à¤«à¤¸à¤² à¤à¥ à¤à¤¾à¤¨à¤à¤¾à¤°à¥ à¤¦à¤°à¥à¤ à¤à¤°à¥à¤",
      formHeader: "à¤à¤ªà¤¨à¥ à¤«à¤¸à¤² à¤¬à¥à¤à¥à¤",
      formSubheader: "à¤²à¤¿à¤¸à¥à¤à¤¿à¤à¤ à¤¬à¤¨à¤¾à¤¨à¥ à¤à¥ à¤²à¤¿à¤ à¤«à¤¸à¤² à¤à¤° à¤µà¤¿à¤à¥à¤°à¥à¤¤à¤¾ à¤à¤¾ à¤µà¤¿à¤µà¤°à¤£ à¤­à¤°à¥à¤",
      sellerName: "à¤µà¤¿à¤à¥à¤°à¥à¤¤à¤¾ à¤à¤¾ à¤¨à¤¾à¤®",
      district: "à¤à¤¿à¤²à¤¾",
      city: "à¤¶à¤¹à¤° / à¤à¤¸à¥à¤¬à¤¾",
      address: "à¤à¤¾à¤à¤µ à¤à¤¾ à¤ªà¥à¤°à¤¾ à¤ªà¤¤à¤¾",
      pincode: "à¤ªà¤¿à¤¨ à¤à¥à¤¡",
      phone: "à¤«à¥à¤¨ à¤¨à¤à¤¬à¤°",
      cropName: "à¤¬à¥à¤à¥ à¤à¤¾à¤¨à¥ à¤µà¤¾à¤²à¥ à¤«à¤¸à¤² à¤à¤¾ à¤¨à¤¾à¤®",
      weight: "à¤µà¤à¤¨ (à¤à¤¿à¤²à¥ / à¤à¥à¤µà¤¿à¤à¤à¤²)",
      price: "à¤®à¤¾à¤à¤à¥ à¤à¤ à¤à¥à¤®à¤¤ (â¹)",
      imageUpload: "à¤«à¤¸à¤² à¤à¥ à¤¤à¤¸à¥à¤µà¥à¤° à¤à¤ªà¤²à¥à¤¡ à¤à¤°à¥à¤",
      gallery: "à¤à¥à¤²à¤°à¥ à¤¸à¥ à¤à¥à¤¨à¥à¤",
      camera: "à¤à¥à¤®à¤°à¥ à¤¸à¥ à¤«à¥à¤à¥ à¤à¥à¤à¤à¥à¤",
      submit: "à¤²à¤¿à¤¸à¥à¤à¤¿à¤à¤ à¤à¤¨à¥à¤°à¥à¤§ à¤à¤®à¤¾ à¤à¤°à¥à¤",
      submittedTitle: "à¤²à¤¿à¤¸à¥à¤à¤¿à¤à¤ à¤à¤¨à¥à¤°à¥à¤§ à¤à¤®à¤¾ à¤¹à¥ à¤à¤¯à¤¾!",
      submittedMsg: "à¤à¤ªà¤à¥ à¤«à¤¸à¤² à¤²à¤¿à¤¸à¥à¤à¤¿à¤à¤ à¤à¤¾ à¤à¤¨à¥à¤°à¥à¤§ à¤¸à¥à¤µà¥à¤à¥à¤¤à¤¿ à¤à¥ à¤²à¤¿à¤ à¤à¤¡à¤®à¤¿à¤¨ à¤ªà¥à¤¨à¤² à¤à¥ à¤­à¥à¤ à¤¦à¤¿à¤¯à¤¾ à¤à¤¯à¤¾ à¤¹à¥!",
      pendingNote: "à¤à¤¡à¤®à¤¿à¤¨ à¤¸à¤®à¥à¤à¥à¤·à¤¾ à¤à¤°à¤à¥ à¤à¤ªà¤à¥ à¤«à¤¸à¤² à¤¸à¥à¤µà¥à¤à¥à¤¤ à¤à¤°à¥à¤à¤¾à¥¤ à¤¸à¥à¤µà¥à¤à¥à¤¤à¤¿ à¤à¥ à¤¬à¤¾à¤¦ à¤¯à¤¹ à¤à¤°à¥à¤¦ à¤à¤¨à¥à¤­à¤¾à¤ à¤®à¥à¤ à¤¦à¤¿à¤à¤¾à¤ à¤¦à¥à¤à¥à¥¤",
      submitAnother: "à¤à¤ à¤à¤° à¤²à¤¿à¤¸à¥à¤à¤¿à¤à¤ à¤¦à¤°à¥à¤ à¤à¤°à¥à¤",
    },
    labourBooking: {
      title: "à¤®à¤à¤¦à¥à¤° à¤¬à¥à¤à¤¿à¤à¤",
      subtitle: "à¤à¤à¤¾à¤, à¤¬à¥à¤à¤ à¤à¤° à¤à¥à¤¤ à¤à¥ à¤à¤¾à¤® à¤à¥ à¤²à¤¿à¤ à¤à¥à¤¶à¤² à¤à¥à¤·à¤¿ à¤®à¤à¤¦à¥à¤°à¥à¤ à¤à¥ à¤¬à¥à¤à¤¿à¤à¤ à¤à¤°à¥à¤",
      formHeader: "à¤®à¤à¤¦à¥à¤° à¤¬à¥à¤ à¤à¤°à¥à¤",
      formSubheader: "à¤à¤¡à¤®à¤¿à¤¨ à¤à¥ à¤à¤¨à¥à¤°à¥à¤§ à¤­à¥à¤à¤¨à¥ à¤à¥ à¤²à¤¿à¤ à¤µà¤¿à¤µà¤°à¤£ à¤­à¤°à¥à¤",
      labourType: "à¤®à¤à¤¦à¥à¤° à¤à¤¾ à¤ªà¥à¤°à¤à¤¾à¤°",
      numLabours: "à¤®à¤à¤¦à¥à¤°à¥à¤ à¤à¥ à¤¸à¤à¤à¥à¤¯à¤¾",
      numDays: "à¤¦à¤¿à¤¨à¥à¤ à¤à¥ à¤¸à¤à¤à¥à¤¯à¤¾",
      startDate: "à¤¶à¥à¤°à¥à¤à¤¤à¥ à¤¤à¤¾à¤°à¥à¤",
      endDate: "à¤à¤à¤¤à¤¿à¤® à¤¤à¤¾à¤°à¥à¤",
      location: "à¤à¤¾à¤® à¤à¤¾ à¤¸à¥à¤¥à¤¾à¤¨",
      name: "à¤à¤ªà¤à¤¾ à¤ªà¥à¤°à¤¾ à¤¨à¤¾à¤®",
      phone: "à¤¸à¤à¤ªà¤°à¥à¤ à¤®à¥à¤¬à¤¾à¤à¤² à¤¨à¤à¤¬à¤°",
      submit: "à¤®à¤à¤¦à¥à¤° à¤¬à¥à¤à¤¿à¤à¤ à¤à¤¨à¥à¤°à¥à¤§ à¤­à¥à¤à¥à¤",
      submittedTitle: "à¤¬à¥à¤à¤¿à¤à¤ à¤à¤¨à¥à¤°à¥à¤§ à¤­à¥à¤à¤¾ à¤à¤¯à¤¾!",
      submittedMsg: "à¤à¤ªà¤à¤¾ à¤à¤¨à¥à¤°à¥à¤§ à¤à¤¡à¤®à¤¿à¤¨ à¤à¥ à¤­à¥à¤ à¤¦à¤¿à¤¯à¤¾ à¤à¤¯à¤¾ à¤¹à¥à¥¤ à¤®à¤à¤¦à¥à¤° à¤à¤µà¤à¤à¤¿à¤¤ à¤¹à¥à¤¨à¥ à¤ªà¤° à¤à¤ªà¤à¥ à¤à¤¨à¤à¤¾ à¤µà¤¿à¤µà¤°à¤£ (à¤¨à¤¾à¤®, à¤«à¥à¤¨, à¤®à¤à¤¦à¥à¤°à¥) à¤¯à¤¹à¤¾à¤ à¤®à¤¿à¤²à¥à¤à¤¾à¥¤",
      pendingBadge: "à¤à¤¡à¤®à¤¿à¤¨ à¤¸à¥à¤µà¥à¤à¥à¤¤à¤¿ à¤à¤¾ à¤à¤à¤¤à¤à¤¾à¤°",
      assignedTitle: "à¤à¤ªà¤à¥ à¤à¤µà¤à¤à¤¿à¤¤ à¤®à¤à¤¦à¥à¤° à¤µà¤¿à¤µà¤°à¤£",
      noAssigned: "à¤à¤­à¥ à¤à¥à¤ à¤®à¤à¤¦à¥à¤° à¤à¤µà¤à¤à¤¿à¤¤ à¤¨à¤¹à¥à¤ à¤¹à¥à¤ à¤¹à¥à¥¤ à¤à¤¡à¤®à¤¿à¤¨ à¤¦à¥à¤µà¤¾à¤°à¤¾ à¤à¤¨à¥à¤°à¥à¤§ à¤¸à¥à¤µà¥à¤à¥à¤¤ à¤¹à¥à¤¨à¥ à¤ªà¤° à¤µà¤¿à¤µà¤°à¤£ à¤¯à¤¹à¤¾à¤ à¤¦à¤¿à¤à¤¾à¤ à¤¦à¥à¤à¤¾à¥¤",
      submitAnother: "à¤à¤ à¤à¤° à¤à¤¨à¥à¤°à¥à¤§ à¤à¤®à¤¾ à¤à¤°à¥à¤",
    },
    expertAdvice: {
      title: "à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤ à¤¸à¤²à¤¾à¤¹",
      subtitle: "à¤«à¤¸à¤² à¤à¥ à¤¬à¥à¤®à¤¾à¤°à¤¿à¤¯à¥à¤ à¤à¤° à¤à¥à¤·à¤¿ à¤¸à¤®à¤¸à¥à¤¯à¤¾à¤à¤ à¤à¥ à¤²à¤¿à¤ à¤à¥à¤·à¤¿ à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤à¥à¤ à¤¸à¥ à¤¸à¥à¤§à¤¾ à¤¸à¤®à¤¾à¤§à¤¾à¤¨ à¤ªà¤¾à¤à¤",
      formHeader: "à¤¸à¤µà¤¾à¤² à¤ªà¥à¤à¥à¤",
      formSubheader: "à¤à¤¡à¤®à¤¿à¤¨ à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤ à¤¸à¤²à¤¾à¤¹ à¤à¥ à¤¸à¤¾à¤¥ à¤à¤ªà¤¸à¥ à¤¸à¤à¤ªà¤°à¥à¤ à¤à¤°à¥à¤à¤¾",
      farmerName: "à¤à¤¿à¤¸à¤¾à¤¨ à¤à¤¾ à¤¨à¤¾à¤®",
      phone: "à¤«à¥à¤¨ à¤¨à¤à¤¬à¤°",
      address: "à¤ªà¥à¤°à¤¾ à¤ªà¤¤à¤¾",
      cropName: "à¤à¤¿à¤¸ à¤«à¤¸à¤² à¤¸à¥ à¤¸à¤à¤¬à¤à¤§à¤¿à¤¤ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¹à¥?",
      problemDetails: "à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤à¤¾ à¤µà¤¿à¤¸à¥à¤¤à¥à¤¤ à¤µà¤¿à¤µà¤°à¤£ à¤¦à¥à¤",
      submit: "à¤à¤¡à¤®à¤¿à¤¨ à¤à¥ à¤¸à¤µà¤¾à¤² à¤­à¥à¤à¥à¤",
      submittedTitle: "à¤¸à¤µà¤¾à¤² à¤¦à¤°à¥à¤ à¤¹à¥ à¤à¤¯à¤¾!",
      submittedMsg: "à¤à¤ªà¤à¥ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤à¤¡à¤®à¤¿à¤¨ à¤à¥ à¤­à¥à¤ à¤¦à¥ à¤à¤ à¤¹à¥à¥¤ à¤¹à¤®à¤¾à¤°à¥ à¤µà¤¿à¤¶à¥à¤·à¤à¥à¤ à¤à¥à¤® à¤à¤²à¥à¤¦ à¤à¤ªà¤¸à¥ à¤¸à¤à¤ªà¤°à¥à¤ à¤à¤°à¥à¤à¥à¥¤",
      callAdmin: "à¤à¤¡à¤®à¤¿à¤¨ à¤à¥ à¤¸à¥à¤§à¤¾ à¤à¥à¤² à¤à¤°à¥à¤",
      whatsappAdmin: "à¤à¤¡à¤®à¤¿à¤¨ à¤¸à¥ à¤µà¥à¤¹à¤¾à¤à¥à¤¸à¤à¤ª à¤à¥à¤ à¤à¤°à¥à¤",
      submitAnother: "à¤à¤ à¤à¤° à¤¸à¤µà¤¾à¤² à¤ªà¥à¤à¥à¤",
    },
    mandiBhav: {
      title: "à¤²à¤¾à¤à¤µ à¤®à¤à¤¡à¥ à¤­à¤¾à¤µ",
      subtitle: "à¤ªà¥à¤°à¤®à¥à¤ à¤®à¤à¤¡à¤¿à¤¯à¥à¤ à¤¸à¥ à¤à¤¦à¥à¤¯à¤¤à¤¨ à¤à¥à¤·à¤¿ à¤à¤ªà¤ à¤­à¤¾à¤µ",
      searchPlaceholder: "à¤«à¤¸à¤² à¤à¤¾ à¤¨à¤¾à¤® à¤à¥à¤à¥à¤...",
      todaysPrices: "à¤à¤ à¤à¥ à¤®à¤à¤¡à¥ à¤­à¤¾à¤µ",
      refresh: "à¤°à¤¿à¤«à¥à¤°à¥à¤¶",
      crop: "à¤«à¤¸à¤² à¤à¤¾ à¤¨à¤¾à¤®",
      minPrice: "à¤¨à¥à¤¯à¥à¤¨à¤¤à¤® à¤®à¥à¤²à¥à¤¯",
      maxPrice: "à¤à¤§à¤¿à¤à¤¤à¤® à¤®à¥à¤²à¥à¤¯",
      modalPrice: "à¤à¤¸à¤¤ à¤®à¥à¤²à¥à¤¯",
      unit: "à¤à¤à¤¾à¤",
      change: "à¤¬à¤¦à¤²à¤¾à¤µ",
      noCrops: "à¤à¤ªà¤à¥ à¤à¥à¤ à¤¸à¥ à¤®à¥à¤² à¤à¤¾à¤¤à¥ à¤à¥à¤ à¤«à¤¸à¤² à¤¨à¤¹à¥à¤ à¤®à¤¿à¤²à¥à¥¤",
    },
    footer: {
      tagline: "à¤¸à¥à¤®à¤¾à¤°à¥à¤ à¤¤à¤à¤¨à¥à¤, à¤¤à¥à¤µà¤°à¤¿à¤¤ à¤¬à¤¾à¤à¤¾à¤° à¤ªà¤¹à¥à¤à¤ à¤à¤° à¤µà¤¿à¤¶à¥à¤µà¤¸à¤¨à¥à¤¯ à¤à¥à¤·à¤¿ à¤¸à¥à¤µà¤¾à¤à¤ à¤à¥ à¤¸à¤¾à¤¥ à¤à¤¿à¤¸à¤¾à¤¨à¥à¤ à¤à¥ à¤¸à¤¶à¤à¥à¤¤ à¤¬à¤¨à¤¾à¤¨à¤¾à¥¤",
      quickLinks: "à¤¤à¥à¤µà¤°à¤¿à¤¤ à¤¨à¥à¤µà¤¿à¤à¥à¤¶à¤¨",
      services: "à¤à¥à¤·à¤¿ à¤¸à¥à¤µà¤¾à¤à¤",
      contactUs: "à¤¸à¤à¤ªà¤°à¥à¤ à¤à¤°à¥à¤",
      helpline: "à¤à¤¿à¤¸à¤¾à¤¨ à¤¹à¥à¤²à¥à¤ªà¤²à¤¾à¤à¤¨ 24/7",
      address: "à¤¬à¤¿à¤¹à¤¾à¤° à¤à¥à¤·à¤¿ à¤ªà¥à¤°à¥à¤¦à¥à¤¯à¥à¤à¤¿à¤à¥ à¤à¥à¤à¤¦à¥à¤°, à¤­à¤¾à¤°à¤¤",
      downloadApp: "à¤à¤ª à¤¡à¤¾à¤à¤¨à¤²à¥à¤¡ à¤à¤°à¥à¤",
      privacyPolicy: "à¤à¥à¤ªà¤¨à¥à¤¯à¤¤à¤¾ à¤¨à¥à¤¤à¤¿",
      termsConditions: "à¤¨à¤¿à¤¯à¤® à¤à¤µà¤ à¤¶à¤°à¥à¤¤à¥à¤",
      rights: "à¤¸à¤°à¥à¤µà¤¾à¤§à¤¿à¤à¤¾à¤° à¤¸à¥à¤°à¤à¥à¤·à¤¿à¤¤à¥¤ à¤à¥à¤°à¤¿à¤µà¥à¤à¥à¤¸à¤¾ à¤¸à¥à¤®à¤¾à¤°à¥à¤ à¤«à¤¾à¤°à¥à¤®à¤¿à¤à¤à¥¤",
    },
    weather: {
      title: "à¤®à¥à¤¸à¤® à¤à¤ªà¤¡à¥à¤",
      subtitle: "à¤¸à¥à¤®à¤¾à¤°à¥à¤ à¤à¥à¤¤à¥ à¤à¥ à¤«à¥à¤¸à¤²à¥à¤ à¤à¥ à¤²à¤¿à¤ à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤ à¤¸à¤®à¤¯ à¤à¤¾ à¤®à¥à¤¸à¤® à¤ªà¥à¤°à¥à¤µà¤¾à¤¨à¥à¤®à¤¾à¤¨",
      hourlyForecast: "à¤à¤ à¤à¤¾ à¤ªà¥à¤°à¤¤à¤¿ à¤à¤à¤à¤¾ à¤ªà¥à¤°à¥à¤µà¤¾à¤¨à¥à¤®à¤¾à¤¨",
      weeklyForecast: "7-à¤¦à¤¿à¤µà¤¸à¥à¤¯ à¤ªà¥à¤°à¥à¤µà¤¾à¤¨à¥à¤®à¤¾à¤¨",
      advisoryTitle: "à¤à¥à¤·à¤¿ à¤®à¥à¤¸à¤® à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶",
    },
    wallet: {
      title: "à¤à¥à¤°à¤¿à¤µà¥à¤à¥à¤¸à¤¾ à¤µà¥à¤²à¥à¤",
      subtitle: "à¤¸à¤­à¥ à¤à¥à¤·à¤¿ à¤²à¥à¤¨à¤¦à¥à¤¨ à¤à¥ à¤²à¤¿à¤ à¤¸à¥à¤°à¤à¥à¤·à¤¿à¤¤ à¤¡à¤¿à¤à¤¿à¤à¤² à¤­à¥à¤à¤¤à¤¾à¤¨",
      secured: "à¤¸à¥à¤°à¤à¥à¤·à¤¿à¤¤ à¤à¤µà¤ à¤¸à¤à¤°à¤à¥à¤·à¤¿à¤¤",
      totalIn: "à¤à¥à¤² à¤à¤¯",
      totalOut: "à¤à¥à¤² à¤µà¥à¤¯à¤¯",
      addMoney: "à¤ªà¥à¤¸à¥ à¤à¥à¤¡à¤¼à¥à¤",
      enterAmount: "à¤°à¤¾à¤¶à¤¿ à¤¦à¤°à¥à¤ à¤à¤°à¥à¤",
      add: "à¤à¥à¤¡à¤¼à¥à¤",
      txHistory: "à¤²à¥à¤¨à¤¦à¥à¤¨ à¤à¤¾ à¤à¤¤à¤¿à¤¹à¤¾à¤¸",
      viewAll: "à¤¸à¤­à¥ à¤¦à¥à¤à¥à¤",
    },
  },
  bn: {
    nav: {
      home: "à¦¹à§à¦®",
      services: "à¦ªà¦°à¦¿à¦·à§à¦¬à¦¾",
      resources: "à¦¸à¦®à§à¦ªà¦¦",
      mandiBhav: "à¦®à¦¾à¦¨à§à¦¡à¦¿ à¦¦à¦°",
      buyInputs: "à¦à¦ªà¦à¦°à¦£ à¦à¦¿à¦¨à§à¦¨",
      sellCrops: "à¦«à¦¸à¦² à¦¬à¦¿à¦à§à¦°à¦¿ à¦à¦°à§à¦¨",
      labourBooking: "à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦à¦¿à¦",
      expertAdvice: "à¦¬à¦¿à¦¶à§à¦·à¦à§à¦à§à¦° à¦ªà¦°à¦¾à¦®à¦°à§à¦¶",
      weather: "à¦à¦¬à¦¹à¦¾à¦à¦¯à¦¼à¦¾ à¦à¦ªà¦¡à§à¦",
      wallet: "à¦à¦¿à¦·à¦¾à¦£ à¦à¦¯à¦¼à¦¾à¦²à§à¦",
      applyKcc: "à¦à¦¿à¦·à¦¾à¦£ à¦à§à¦°à§à¦¡à¦¿à¦ à¦à¦¾à¦°à§à¦¡à§à¦° à¦à¦¬à§à¦¦à¦¨ à¦à¦°à§à¦¨",
      aboutUs: "à¦à¦®à¦¾à¦¦à§à¦° à¦¸à¦®à§à¦ªà¦°à§à¦à§",
      contactUs: "à¦¯à§à¦à¦¾à¦¯à§à¦",
      login: "à¦²à¦à¦à¦¨",
      register: "à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¨",
      adminPanel: "à¦à¦¡à¦®à¦¿à¦¨ à¦ªà§à¦¯à¦¾à¦¨à§à¦²",
      blog: "à¦¬à§à¦²à¦",
      cropCalendar: "à¦«à¦¸à¦² à¦à§à¦¯à¦¾à¦²à§à¦¨à§à¦¡à¦¾à¦°",
      govSchemes: "à¦¸à¦°à¦à¦¾à¦°à§ à¦ªà§à¦°à¦à¦²à§à¦ª",
      farmingTips: "à¦à§à¦·à¦¿ à¦ªà¦°à¦¾à¦®à¦°à§à¦¶",
      helpCenter: "à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾ à¦à§à¦¨à§à¦¦à§à¦°",
      language: "à¦­à¦¾à¦·à¦¾",
    },
    hero: {
      badge: "à¦­à¦¾à¦°à¦¤à§à¦° à¦¸à§à¦®à¦¾à¦°à§à¦ à¦à§à¦·à¦¿ à¦ªà§à¦²à§à¦¯à¦¾à¦à¦«à¦°à§à¦®",
      title1: "à¦¸à§à¦®à¦¾à¦°à§à¦",
      title2: "à¦à§à¦·à¦¿à¥¤",
      title3: "à¦à¦¨à§à¦¨à¦¤",
      title4: "à¦­à¦¬à¦¿à¦·à§à¦¯à¦¤à¥¤",
      desc: "à¦à§à¦¬à§à¦à§à¦¸à¦¾ à¦à¦ªà¦¨à¦¾à¦° à¦à¦à§à¦²à§à¦° à¦¡à¦à¦¾à¦¯à¦¼ à¦¸à¦®à¦¸à§à¦¤ à¦à§à¦·à¦¿ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦¨à¦¿à¦¯à¦¼à§ à¦à¦¸à§à¦à§ â à¦²à¦¾à¦à¦­ à¦®à¦¾à¦¨à§à¦¡à¦¿ à¦¦à¦°, à¦¬à§à¦ à¦ à¦¸à¦¾à¦° à¦à§à¦°à¦¯à¦¼, à¦«à¦¸à¦² à¦¬à¦¿à¦à§à¦°à¦¿, à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦à¦¿à¦ à¦à¦¬à¦ à¦¬à¦¿à¦¶à§à¦·à¦à§à¦à§à¦° à¦ªà¦°à¦¾à¦®à¦°à§à¦¶à¥¤",
      getStarted: "à¦¬à¦¿à¦¨à¦¾à¦®à§à¦²à§à¦¯à§ à¦¶à§à¦°à§ à¦à¦°à§à¦¨",
      applyKcc: "à¦à¦¿à¦·à¦¾à¦£ à¦à§à¦°à§à¦¡à¦¿à¦ à¦à¦¾à¦°à§à¦¡à§à¦° à¦à¦¬à§à¦¦à¦¨ à¦à¦°à§à¦¨",
      farmersCount: "à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¿à¦¤ à¦à§à¦·à¦",
      mandisCount: "à¦à¦¨à§à¦¤à¦°à§à¦­à§à¦à§à¦¤ à¦®à¦¾à¦¨à§à¦¡à¦¿",
      expertsCount: "à¦à§à¦·à¦¿ à¦¬à¦¿à¦¶à§à¦·à¦à§à¦",
      supportCount: "à§¨à§ª/à§­ à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾",
    },
    services: {
      title: "à¦à¦®à¦¾à¦¦à§à¦°",
      titleHighlight: "à¦ªà¦°à¦¿à¦·à§à¦¬à¦¾à¦¸à¦®à§à¦¹",
      subtitle: "à¦à¦à¦à¦¿ à¦¸à¦¹à¦ à¦ªà§à¦²à§à¦¯à¦¾à¦à¦«à¦°à§à¦®à§ à¦¸à¦®à¦¸à§à¦¤ à¦à§à¦·à¦¿ à¦¸à¦®à¦¾à¦§à¦¾à¦¨",
      mandiBhavTitle: "à¦®à¦¾à¦¨à§à¦¡à¦¿ à¦¦à¦°", mandiBhavDesc: "à¦²à¦¾à¦à¦­ à¦¬à¦¾à¦à¦¾à¦° à¦¦à¦°",
      buyInputsTitle: "à¦à¦ªà¦à¦°à¦£ à¦à¦¿à¦¨à§à¦¨", buyInputsDesc: "à¦à¦¨à§à¦¨à¦¤ à¦¬à§à¦ à¦ à¦¸à¦¾à¦°",
      sellCropsTitle: "à¦«à¦¸à¦² à¦¬à¦¿à¦à§à¦°à¦¿ à¦à¦°à§à¦¨", sellCropsDesc: "à¦¸à§à¦°à¦¾ à¦¬à¦¾à¦à¦¾à¦° à¦®à§à¦²à§à¦¯",
      labourBookingTitle: "à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦à¦¿à¦", labourBookingDesc: "à¦¦à¦à§à¦· à¦à§à¦·à¦¿ à¦¶à§à¦°à¦®à¦¿à¦",
      expertAdviceTitle: "à¦¬à¦¿à¦¶à§à¦·à¦à§à¦à§à¦° à¦ªà¦°à¦¾à¦®à¦°à§à¦¶", expertAdviceDesc: "à¦¬à¦¿à¦¶à§à¦·à¦à§à¦à¦¦à§à¦° à¦¸à¦¾à¦¥à§ à¦à¦¥à¦¾ à¦¬à¦²à§à¦¨",
      weatherTitle: "à¦à¦¬à¦¹à¦¾à¦à¦¯à¦¼à¦¾ à¦à¦ªà¦¡à§à¦", weatherDesc: "à¦²à¦¾à¦à¦­ à¦ªà§à¦°à§à¦¬à¦¾à¦­à¦¾à¦¸",
      walletTitle: "à¦à¦¿à¦·à¦¾à¦£ à¦à¦¯à¦¼à¦¾à¦²à§à¦", walletDesc: "à¦¸à§à¦°à¦à§à¦·à¦¿à¦¤ à¦ªà§à¦®à§à¦¨à§à¦",
    },
    farmerNeeds: {
      badge: "à¦à§à¦·à¦¿ à¦ªà¦°à¦¿à¦·à§à¦¬à¦¾à¦¸à¦®à§à¦¹",
      title: "à¦à§à¦·à¦à§à¦° à¦ªà§à¦°à¦¤à¦¿à¦à¦¿",
      titleHighlight: "à¦ªà§à¦°à¦¯à¦¼à§à¦à¦¨",
      subtitle: "à¦à¦§à§à¦¨à¦¿à¦ à¦à§à¦·à¦à¦¦à§à¦° à¦à¦¨à§à¦¯ à¦¬à¦¿à¦¶à§à¦·à¦­à¦¾à¦¬à§ à¦¨à¦¿à¦°à§à¦®à¦¿à¦¤ à¦à¦¦à§à¦­à¦¾à¦¬à¦¨à§ à¦¸à¦®à¦¾à¦§à¦¾à¦¨",
      explore: "à¦¦à§à¦à§à¦¨",
      f1Title: "à¦²à¦¾à¦à¦­ à¦®à¦¾à¦¨à§à¦¡à¦¿ à¦¦à¦°", f1Desc: "à¦à¦¡à¦®à¦¿à¦¨ à¦¦à§à¦¬à¦¾à¦°à¦¾ à¦¦à§à¦¨à¦¿à¦ à¦à¦ªà¦¡à§à¦ à¦¹à¦à¦¯à¦¼à¦¾ à¦«à¦¸à¦²à§à¦° à¦¦à¦°à¥¤", f1Badge: "à¦²à¦¾à¦à¦­ à¦¦à¦°",
      f2Title: "à¦à¦ªà¦à¦°à¦£ à¦à¦¿à¦¨à§à¦¨", f2Desc: "à¦à¦¨à§à¦¨à¦¤ à¦®à¦¾à¦¨à§à¦° à¦¬à§à¦, à¦¸à¦¾à¦°, à¦à§à¦à¦¨à¦¾à¦¶à¦ à¦ à¦¸à¦°à¦à§à¦à¦¾à¦®à¥¤", f2Badge: "à¦¯à¦¾à¦à¦¾à¦à¦à§à¦¤",
      f3Title: "à¦«à¦¸à¦² à¦¬à¦¿à¦à§à¦°à¦¿ à¦à¦°à§à¦¨", f3Desc: "à¦à¦ªà¦¨à¦¾à¦° à¦«à¦¸à¦²à§à¦° à¦¬à¦¿à¦¬à¦°à¦£ à¦²à¦¿à¦à§à¦¨ à¦à¦¬à¦ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦à§à¦°à§à¦¤à¦¾à¦° à¦¸à¦¾à¦¥à§ à¦¯à§à¦à§à¦¤ à¦¹à¦¨à¥¤", f3Badge: "à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦¬à¦¾à¦à¦¾à¦°",
      f4Title: "à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦à¦¿à¦", f4Desc: "à¦à¦¡à¦®à¦¿à¦¨ à¦¦à§à¦¬à¦¾à¦°à¦¾ à¦¬à¦°à¦¾à¦¦à§à¦¦à¦à§à¦¤ à¦¦à¦à§à¦· à¦à§à¦·à¦¿ à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦ à¦à¦°à§à¦¨à¥¤", f4Badge: "à¦à¦¨-à¦¡à¦¿à¦®à¦¾à¦¨à§à¦¡",
      f5Title: "à¦¬à¦¿à¦¶à§à¦·à¦à§à¦à§à¦° à¦ªà¦°à¦¾à¦®à¦°à§à¦¶", f5Desc: "à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦à§à¦·à¦¿ à¦ªà¦°à¦¾à¦®à¦°à§à¦¶, à¦à¦² à¦à¦¬à¦ à¦¹à§à¦¯à¦¼à¦¾à¦à¦¸à¦à§à¦¯à¦¾à¦ª à¦ªà¦°à¦¿à¦·à§à¦¬à¦¾à¥¤", f5Badge: "à§¨à§ª/à§­ à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾",
      f6Title: "à¦à¦¬à¦¹à¦¾à¦à¦¯à¦¼à¦¾ à¦à¦ªà¦¡à§à¦", f6Desc: "à¦à§à¦·à¦¿ à¦à¦¾à¦ à¦ªà¦°à¦¿à¦à¦¾à¦²à¦¨à¦¾à¦° à¦à¦¨à§à¦¯ à¦¸à¦ à¦¿à¦ à¦¦à§à¦¨à¦¿à¦ à¦ªà§à¦°à§à¦¬à¦¾à¦­à¦¾à¦¸à¥¤", f6Badge: "à¦²à¦¾à¦à¦­ à¦à¦ªà¦¡à§à¦",
    },
    home: {
      kccPromoTitle: "à¦à¦¿à¦·à¦¾à¦£ à¦à§à¦°à§à¦¡à¦¿à¦ à¦à¦¾à¦°à§à¦¡ à¦¦à¦¿à¦¯à¦¼à§ à¦¸à¦®à¦¸à§à¦¤ à¦¬à§à¦¶à¦¿à¦·à§à¦à§à¦¯ à¦à¦¨à¦²à¦ à¦à¦°à§à¦¨",
      kccPromoDesc: "à¦à§à¦°à¦¯à¦¼, à¦¬à¦¿à¦à§à¦°à¦¯à¦¼, à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦à¦¿à¦ à¦à¦¬à¦ à¦¬à¦¿à¦¶à§à¦·à¦à§à¦ à¦ªà¦°à¦¾à¦®à¦°à§à¦¶à§à¦° à¦à¦¨à§à¦¯ à¦¬à¦¿à¦¨à¦¾à¦®à§à¦²à§à¦¯à§ à¦à§à¦¸à¦¿à¦¸à¦¿ à¦à¦¬à§à¦¦à¦¨ à¦à¦°à§à¦¨à¥¤",
      applyNow: "à¦à¦à¦¨à¦ à¦à¦¬à§à¦¦à¦¨ à¦à¦°à§à¦¨",
      trustedBy: "à¦à§à¦·à¦à¦¦à§à¦°",
      trustedHighlight: "à¦¬à¦¿à¦¶à§à¦¬à¦¾à¦¸",
      trustSecure: "à§§à§¦à§¦% à¦¨à¦¿à¦°à¦¾à¦ªà¦¦", trustSecureDesc: "à¦à¦ªà¦¨à¦¾à¦° à¦¤à¦¥à§à¦¯ à¦¸à¦°à§à¦¬à¦¦à¦¾ à¦¸à§à¦°à¦à§à¦·à¦¿à¦¤",
      trustPlatform: "à¦¬à¦¿à¦¶à§à¦¬à¦¸à§à¦¤ à¦ªà§à¦²à§à¦¯à¦¾à¦à¦«à¦°à§à¦®", trustPlatformDesc: "à¦¹à¦¾à¦à¦¾à¦° à¦¹à¦¾à¦à¦¾à¦° à¦à§à¦·à¦à§à¦° à¦¸à¦¾à¦¥à§ à¦¯à§à¦à§à¦¤ à¦¹à¦¨",
      trustPrice: "à¦¸à§à¦°à¦¾ à¦¦à¦° à¦¨à¦¿à¦¶à§à¦à§à¦¤à¦¾", trustPriceDesc: "à¦ªà¦¾à¦¨ à¦¬à¦¾à¦à¦¾à¦°à§à¦° à¦¸à§à¦°à¦¾ à¦¦à¦°",
      trustSupport: "à§¨à§ªÃà§­ à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾", trustSupportDesc: "à¦à¦®à¦°à¦¾ à¦¸à¦°à§à¦¬à¦¦à¦¾ à¦à¦ªà¦¨à¦¾à¦à§ à¦¸à¦¾à¦¹à¦¾à¦¯à§à¦¯ à¦à¦°à¦¤à§ à¦ªà§à¦°à¦¸à§à¦¤à§à¦¤",
      joinTitle: "à¦à¦à¦",
      joinHighlight: "à¦à§à¦¬à§à¦à§à¦¸à¦¾à¦¯à¦¼ à¦¯à§à¦ à¦¦à¦¿à¦¨",
      joinDesc: "à¦¬à¦¿à¦¨à¦¾à¦®à§à¦²à§à¦¯à§ à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¨ à¦à¦°à§à¦¨ à¦à¦¬à¦ à¦à¦ªà¦¨à¦¾à¦° à¦¸à§à¦®à¦¾à¦°à§à¦ à¦à§à¦·à¦¿ à¦¯à¦¾à¦¤à§à¦°à¦¾ à¦¶à§à¦°à§ à¦à¦°à§à¦¨à¥¤",
      registerNow: "à¦à¦à¦¨à¦ à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¨ à¦à¦°à§à¦¨",
    },
    kccModal: {
      title: "à¦à¦¿à¦·à¦¾à¦£ à¦à§à¦°à§à¦¡à¦¿à¦ à¦à¦¾à¦°à§à¦¡ à¦à¦¬à§à¦¦à¦¨",
      subtitle: "à¦à¦ªà¦¨à¦¾à¦° à¦à¦«à¦¿à¦¶à¦¿à¦¯à¦¼à¦¾à¦² à¦à¦¿à¦·à¦¾à¦£ à¦à§à¦°à§à¦¡à¦¿à¦ à¦à¦¾à¦°à§à¦¡ à¦ªà§à¦¤à§ à¦¨à¦¿à¦à§à¦° à¦¤à¦¥à§à¦¯à¦à§à¦²à¦¿ à¦ªà§à¦°à¦£ à¦à¦°à§à¦¨",
      alertTitle: "à¦à¦¿à¦·à¦¾à¦£ à¦à§à¦°à§à¦¡à¦¿à¦ à¦à¦¾à¦°à§à¦¡ à¦à¦¬à¦¶à§à¦¯à¦",
      alertDesc: "à¦à¦ªà¦¨à¦¾à¦° à¦à¦¾à¦à§ à¦à¦à¦¨à¦ à¦à§à¦¨à§ à¦¸à¦à§à¦°à¦¿à¦¯à¦¼ à¦à¦¿à¦·à¦¾à¦£ à¦à§à¦°à§à¦¡à¦¿à¦ à¦à¦¾à¦°à§à¦¡ à¦¨à§à¦à¥¤ à¦à¦¿à¦·à¦¾à¦£ à¦à§à¦°à§à¦¡à¦¿à¦ à¦à¦¾à¦°à§à¦¡ à¦¬à§à¦¯à¦¤à§à¦¤ à¦à¦ªà¦¨à¦¿ à¦«à¦¸à¦² à¦à§à¦¨à¦¾à¦¬à§à¦à¦¾, à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦à¦¿à¦ à¦¬à¦¾ à¦¯à§à¦à¦¾à¦¯à§à¦ à¦à¦°à¦¤à§ à¦ªà¦¾à¦°à¦¬à§à¦¨ à¦¨à¦¾à¥¤ à¦¸à¦®à¦¸à§à¦¤ à¦¬à§à¦¶à¦¿à¦·à§à¦à§à¦¯ à¦à¦¨à¦²à¦ à¦à¦°à¦¤à§ à¦à¦à¦¨à¦ à¦à¦¬à§à¦¦à¦¨ à¦à¦°à§à¦¨!",
      applyNow: "à¦à¦à¦¨à¦ à¦à¦¿à¦·à¦¾à¦£ à¦à§à¦°à§à¦¡à¦¿à¦ à¦à¦¾à¦°à§à¦¡à§à¦° à¦à¦¬à§à¦¦à¦¨ à¦à¦°à§à¦¨",
      fullName: "à¦à§à¦·à¦à§à¦° à¦ªà§à¦°à§ à¦¨à¦¾à¦®",
      phone: "à¦®à§à¦¬à¦¾à¦à¦² à¦¨à¦®à§à¦¬à¦°",
      aadhaar: "à¦à¦§à¦¾à¦° à¦à¦¾à¦°à§à¦¡ à¦¨à¦®à§à¦¬à¦°",
      address: "à¦¸à¦®à§à¦ªà§à¦°à§à¦£ à¦ à¦¿à¦à¦¾à¦¨à¦¾ / à¦à§à¦°à¦¾à¦®",
      district: "à¦à§à¦²à¦¾",
      landSize: "à¦®à§à¦ à¦à¦®à¦¿à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£ (à¦à¦à¦°)",
      submit: "à¦à§à¦¸à¦¿à¦¸à¦¿ à¦à¦¬à§à¦¦à¦¨ à¦à¦®à¦¾ à¦¦à¦¿à¦¨",
      success: "à¦à¦ªà¦¨à¦¾à¦° à¦à¦¿à¦·à¦¾à¦£ à¦à§à¦°à§à¦¡à¦¿à¦ à¦à¦¾à¦°à§à¦¡ à¦à¦¬à§à¦¦à¦¨ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§ à¦à¦®à¦¾ à¦¹à¦¯à¦¼à§à¦à§! à¦à¦¡à¦®à¦¿à¦¨ à¦¶à§à¦à§à¦°à¦ à¦ªà¦°à§à¦¯à¦¾à¦²à§à¦à¦¨à¦¾ à¦à¦°à§ à¦à¦¾à¦°à§à¦¡ à¦à¦¸à§à¦¯à§ à¦à¦°à¦¬à§à¥¤",
      statusActive: "à¦à§à¦¸à¦¿à¦¸à¦¿ à¦¸à¦à§à¦°à¦¿à¦¯à¦¼ à¦à¦¬à¦ à¦à¦¸à§à¦¯à§ à¦à¦°à¦¾ à¦¹à¦¯à¦¼à§à¦à§",
      statusPending: "à¦à§à¦¸à¦¿à¦¸à¦¿ à¦à¦¬à§à¦¦à¦¨ à¦ªà¦°à§à¦¯à¦¾à¦²à§à¦à¦¨à¦¾à¦§à§à¦¨",
      cancel: "à¦¬à¦¾à¦¤à¦¿à¦² à¦à¦°à§à¦¨",
      submittedTitle: "à¦à¦¬à§à¦¦à¦¨ à¦à¦®à¦¾ à¦¹à¦¯à¦¼à§à¦à§!",
      close: "à¦¬à¦¨à§à¦§ à¦à¦°à§à¦¨",
      restrictedBadge: "à¦à¦¾à¦°à§à¦¯à¦à§à¦°à¦® à¦¸à§à¦®à¦¾à¦¬à¦¦à§à¦§",
    },
    buyInputs: {
      title: "à¦à¦¿à¦¨à§à¦¨",
      titleHighlight: "à¦à¦ªà¦à¦°à¦£ à¦ à¦«à¦¸à¦²",
      subtitle: "à¦à¦¨à§à¦¨à¦¤ à¦®à¦¾à¦¨à§à¦° à¦¬à§à¦, à¦¸à¦¾à¦°, à¦à§à¦·à¦¿ à¦¸à¦°à¦à§à¦à¦¾à¦® à¦à¦¬à¦ à¦¯à¦¾à¦à¦¾à¦à¦à§à¦¤ à¦à§à¦·à¦à¦¦à§à¦° à¦«à¦¸à¦²à§à¦° à¦¤à¦¾à¦²à¦¿à¦à¦¾ à¦¦à§à¦à§à¦¨",
      searchPlaceholder: "à¦ªà¦£à§à¦¯ à¦¬à¦¾ à¦«à¦¸à¦² à¦à§à¦à¦à§à¦¨...",
      filter: "à¦«à¦¿à¦²à§à¦à¦¾à¦°",
      all: "à¦¸à¦¬",
      seeds: "à¦¬à§à¦",
      fertilizers: "à¦¸à¦¾à¦°",
      pesticides: "à¦à§à¦à¦¨à¦¾à¦¶à¦",
      farmTools: "à¦à§à¦·à¦¿ à¦¯à¦¨à§à¦¤à§à¦°à¦¾à¦à¦¶",
      organic: "à¦à§à¦¬",
      userCrops: "à¦à§à¦·à¦à¦¦à§à¦° à¦«à¦¸à¦²",
      farmerCropsTitle: "à¦à§à¦·à¦à¦¦à§à¦° à¦¤à¦¾à¦²à¦¿à¦à¦¾à¦­à§à¦à§à¦¤ à¦«à¦¸à¦²",
      agriInputsTitle: "à¦à§à¦·à¦¿ à¦à¦ªà¦à¦°à¦£ à¦ à¦¸à¦¾à¦°-à¦¬à§à¦",
      available: "à¦à¦ªà¦²à¦¬à§à¦§",
      farmerListedBadge: "à¦à§à¦·à¦à§à¦° à¦¤à¦¾à¦²à¦¿à¦à¦¾à¦­à§à¦à§à¦¤",
      by: "à¦¬à¦¿à¦à§à¦°à§à¦¤à¦¾",
      viewDetails: "à¦¬à¦¿à¦¬à¦°à¦£ à¦¦à§à¦à§à¦¨",
      sellerDetails: "à¦¬à¦¿à¦à§à¦°à§à¦¤à¦¾à¦° à¦¬à¦¿à¦¬à¦°à¦£",
      callSeller: "à¦à¦² à¦à¦°à§à¦¨",
      whatsappSeller: "à¦¹à§à¦¯à¦¼à¦¾à¦à¦¸à¦à§à¦¯à¦¾à¦ª",
      addToCart: "à¦à¦¿à¦¨à§à¦¨",
      noProducts: "à¦à¦ªà¦¨à¦¾à¦° à¦à¦¨à§à¦¸à¦¨à§à¦§à¦¾à¦¨à§à¦° à¦¸à¦¾à¦¥à§ à¦®à§à¦²à§ à¦à¦®à¦¨ à¦à§à¦¨à§ à¦ªà¦£à§à¦¯ à¦ªà¦¾à¦à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿à¥¤",
      weight: "à¦à¦à¦¨",
      askingPrice: "à¦à¦¾à¦à§à¦à§à¦·à¦¿à¦¤ à¦®à§à¦²à§à¦¯",
    },
    sellCrops: {
      title: "à¦«à¦¸à¦² à¦¬à¦¿à¦à§à¦°à¦¿ à¦à¦°à§à¦¨",
      subtitle: "à¦¸à§à¦°à¦¾ à¦¬à¦¾à¦à¦¾à¦° à¦®à§à¦²à§à¦¯à§ à¦à§à¦°à§à¦¤à¦¾à¦¦à§à¦° à¦à¦¾à¦à§ à¦ªà§à¦à¦à¦¾à¦¤à§ à¦à¦ªà¦¨à¦¾à¦° à¦«à¦¸à¦²à§à¦° à¦¬à¦¿à¦¬à¦°à¦£ à¦à¦®à¦¾ à¦¦à¦¿à¦¨",
      formHeader: "à¦à¦ªà¦¨à¦¾à¦° à¦«à¦¸à¦² à¦¬à¦¿à¦à§à¦°à¦¿ à¦à¦°à§à¦¨",
      formSubheader: "à¦¤à¦¾à¦²à¦¿à¦à¦¾ à¦¤à§à¦°à¦¿à¦° à¦à¦¨à§à¦¯ à¦«à¦¸à¦² à¦ à¦¬à¦¿à¦à§à¦°à§à¦¤à¦¾à¦° à¦¬à¦¿à¦¬à¦°à¦£ à¦ªà§à¦°à¦£ à¦à¦°à§à¦¨",
      sellerName: "à¦¬à¦¿à¦à§à¦°à§à¦¤à¦¾à¦° à¦¨à¦¾à¦®",
      district: "à¦à§à¦²à¦¾",
      city: "à¦¶à¦¹à¦° / à¦¨à¦à¦°",
      address: "à¦à§à¦°à¦¾à¦®à§à¦° à¦ à¦¿à¦à¦¾à¦¨à¦¾",
      pincode: "à¦ªà¦¿à¦¨ à¦à§à¦¡",
      phone: "à¦«à§à¦¨ à¦¨à¦®à§à¦¬à¦°",
      cropName: "à¦¬à¦¿à¦à§à¦°à¦¿à¦¯à§à¦à§à¦¯ à¦«à¦¸à¦²à§à¦° à¦¨à¦¾à¦®",
      weight: "à¦à¦à¦¨ (à¦à§à¦à¦¿ / à¦à§à¦à¦¨à§à¦à¦¾à¦²)",
      price: "à¦à¦¾à¦à§à¦à§à¦·à¦¿à¦¤ à¦®à§à¦²à§à¦¯ (â¹)",
      imageUpload: "à¦«à¦¸à¦²à§à¦° à¦à¦¬à¦¿ à¦à¦ªà¦²à§à¦¡",
      gallery: "à¦à§à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¥à§à¦à§ à¦¬à§à¦à§ à¦¨à¦¿à¦¨",
      camera: "à¦à§à¦¯à¦¾à¦®à§à¦°à¦¾ à¦¦à¦¿à¦¯à¦¼à§ à¦à¦¬à¦¿ à¦¤à§à¦²à§à¦¨",
      submit: "à¦¤à¦¾à¦²à¦¿à¦à¦¾à¦­à§à¦à§à¦¤à¦¿à¦° à¦à¦¬à§à¦¦à¦¨ à¦à¦®à¦¾ à¦¦à¦¿à¦¨",
      submittedTitle: "à¦à¦¬à§à¦¦à¦¨ à¦à¦®à¦¾ à¦¹à¦¯à¦¼à§à¦à§!",
      submittedMsg: "à¦à¦ªà¦¨à¦¾à¦° à¦«à¦¸à¦²à§à¦° à¦¤à¦¾à¦²à¦¿à¦à¦¾à¦­à§à¦à§à¦¤à¦¿à¦° à¦à¦¬à§à¦¦à¦¨à¦à¦¿ à¦à¦¨à§à¦®à§à¦¦à¦¨à§à¦° à¦à¦¨à§à¦¯ à¦à¦¡à¦®à¦¿à¦¨ à¦ªà§à¦¯à¦¾à¦¨à§à¦²à§ à¦ªà¦¾à¦ à¦¾à¦¨à§ à¦¹à¦¯à¦¼à§à¦à§!",
      pendingNote: "à¦à¦¡à¦®à¦¿à¦¨ à¦ªà¦°à§à¦¯à¦¾à¦²à§à¦à¦¨à¦¾ à¦à¦°à§ à¦à¦ªà¦¨à¦¾à¦° à¦«à¦¸à¦² à¦à¦¨à§à¦®à§à¦¦à¦¨ à¦à¦°à¦¬à§à¥¤ à¦à¦¨à§à¦®à§à¦¦à¦¨à§à¦° à¦ªà¦° à¦à¦à¦¿ à¦à§à¦°à¦¯à¦¼ à¦¬à¦¿à¦­à¦¾à¦à§ à¦¦à§à¦à¦¾ à¦¯à¦¾à¦¬à§à¥¤",
      submitAnother: "à¦à¦°à§à¦à¦à¦¿ à¦à¦¬à§à¦¦à¦¨ à¦à¦®à¦¾ à¦¦à¦¿à¦¨",
    },
    labourBooking: {
      title: "à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦à¦¿à¦",
      subtitle: "à¦«à¦¸à¦² à¦à¦¾à¦à¦¾, à¦¬à¦ªà¦¨ à¦à¦¬à¦ à¦à¦¾à¦®à¦¾à¦°à§à¦° à¦à¦¾à¦à§à¦° à¦à¦¨à§à¦¯ à¦¦à¦à§à¦· à¦à§à¦·à¦¿ à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦ à¦à¦°à§à¦¨",
      formHeader: "à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦ à¦à¦°à§à¦¨",
      formSubheader: "à¦à¦¡à¦®à¦¿à¦¨à¦à§ à¦à¦¬à§à¦¦à¦¨ à¦ªà¦¾à¦ à¦¾à¦¤à§ à¦¬à¦¿à¦¬à¦°à¦£ à¦ªà§à¦°à¦£ à¦à¦°à§à¦¨",
      labourType: "à¦¶à§à¦°à¦®à¦¿à¦à§à¦° à¦§à¦°à¦¨",
      numLabours: "à¦¶à§à¦°à¦®à¦¿à¦à§à¦° à¦¸à¦à¦à§à¦¯à¦¾",
      numDays: "à¦¦à¦¿à¦¨à§à¦° à¦¸à¦à¦à§à¦¯à¦¾",
      startDate: "à¦¶à§à¦°à§à¦° à¦¤à¦¾à¦°à¦¿à¦",
      endDate: "à¦¶à§à¦·à§à¦° à¦¤à¦¾à¦°à¦¿à¦",
      location: "à¦à¦¾à¦à§à¦° à¦¸à§à¦¥à¦¾à¦¨",
      name: "à¦à¦ªà¦¨à¦¾à¦° à¦¨à¦¾à¦®",
      phone: "à¦¯à§à¦à¦¾à¦¯à§à¦à§à¦° à¦«à§à¦¨ à¦¨à¦®à§à¦¬à¦°",
      submit: "à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à§à¦à¦¿à¦ à¦à¦¬à§à¦¦à¦¨ à¦à¦®à¦¾ à¦¦à¦¿à¦¨",
      submittedTitle: "à¦à¦¬à§à¦¦à¦¨ à¦à¦®à¦¾ à¦¹à¦¯à¦¼à§à¦à§!",
      submittedMsg: "à¦à¦ªà¦¨à¦¾à¦° à¦à¦¬à§à¦¦à¦¨ à¦à¦¡à¦®à¦¿à¦¨à§à¦° à¦à¦¾à¦à§ à¦ªà¦¾à¦ à¦¾à¦¨à§ à¦¹à¦¯à¦¼à§à¦à§à¥¤ à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à¦°à¦¾à¦¦à§à¦¦ à¦à¦°à¦¾ à¦¹à¦²à§ à¦¬à¦¿à¦¬à¦°à¦£ à¦à¦à¦¾à¦¨à§ à¦¦à§à¦à¦¾ à¦¯à¦¾à¦¬à§à¥¤",
      pendingBadge: "à¦à¦¡à¦®à¦¿à¦¨ à¦à¦¨à§à¦®à§à¦¦à¦¨à§à¦° à¦à¦ªà§à¦à§à¦·à¦¾à¦¯à¦¼",
      assignedTitle: "à¦à¦ªà¦¨à¦¾à¦° à¦à¦¨à§à¦¯ à¦¬à¦°à¦¾à¦¦à§à¦¦à¦à§à¦¤ à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à¦¿à¦¬à¦°à¦£",
      noAssigned: "à¦à¦à¦¨à¦ à¦à§à¦¨à§ à¦¶à§à¦°à¦®à¦¿à¦ à¦¬à¦°à¦¾à¦¦à§à¦¦ à¦à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤ à¦à¦¡à¦®à¦¿à¦¨ à¦à¦¨à§à¦®à§à¦¦à¦¨ à¦¦à¦¿à¦²à§ à¦¬à¦¿à¦¬à¦°à¦£ à¦à¦à¦¾à¦¨à§ à¦¦à§à¦à¦¾ à¦¯à¦¾à¦¬à§à¥¤",
      submitAnother: "à¦à¦°à§à¦à¦à¦¿ à¦à¦¬à§à¦¦à¦¨ à¦à¦®à¦¾ à¦¦à¦¿à¦¨",
    },
    expertAdvice: {
      title: "à¦¬à¦¿à¦¶à§à¦·à¦à§à¦à§à¦° à¦ªà¦°à¦¾à¦®à¦°à§à¦¶",
      subtitle: "à¦«à¦¸à¦²à§à¦° à¦°à§à¦ à¦ à¦à§à¦·à¦¿ à¦¸à¦®à¦¸à§à¦¯à¦¾à¦° à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦ªà¦¾à¦¨ à¦à§à¦·à¦¿ à¦¬à¦¿à¦¶à§à¦·à¦à§à¦à¦¦à§à¦° à¦à¦¾à¦ à¦¥à§à¦à§",
      formHeader: "à¦ªà§à¦°à¦¶à§à¦¨ à¦à¦®à¦¾ à¦¦à¦¿à¦¨",
      formSubheader: "à¦à¦¡à¦®à¦¿à¦¨ à¦¬à¦¿à¦¶à§à¦·à¦à§à¦ à¦ªà¦°à¦¾à¦®à¦°à§à¦¶ à¦¸à¦¹ à¦à¦ªà¦¨à¦¾à¦° à¦¸à¦¾à¦¥à§ à¦¯à§à¦à¦¾à¦¯à§à¦ à¦à¦°à¦¬à§",
      farmerName: "à¦à§à¦·à¦à§à¦° à¦¨à¦¾à¦®",
      phone: "à¦«à§à¦¨ à¦¨à¦®à§à¦¬à¦°",
      address: "à¦¸à¦®à§à¦ªà§à¦°à§à¦£ à¦ à¦¿à¦à¦¾à¦¨à¦¾",
      cropName: "à¦à§à¦¨ à¦«à¦¸à¦² à¦¸à¦®à§à¦ªà¦°à§à¦à¦¿à¦¤ à¦¸à¦®à¦¸à§à¦¯à¦¾?",
      problemDetails: "à¦¸à¦®à¦¸à§à¦¯à¦¾à¦° à¦¬à¦¿à¦¸à§à¦¤à¦¾à¦°à¦¿à¦¤ à¦¬à¦¿à¦¬à¦°à¦£ à¦¦à¦¿à¦¨",
      submit: "à¦à¦¡à¦®à¦¿à¦¨à§à¦° à¦à¦¾à¦à§ à¦ªà§à¦°à¦¶à§à¦¨ à¦à¦®à¦¾ à¦¦à¦¿à¦¨",
      submittedTitle: "à¦ªà§à¦°à¦¶à§à¦¨ à¦à¦®à¦¾ à¦¹à¦¯à¦¼à§à¦à§!",
      submittedMsg: "à¦à¦ªà¦¨à¦¾à¦° à¦¸à¦®à¦¸à§à¦¯à¦¾ à¦à¦¡à¦®à¦¿à¦¨à§à¦° à¦à¦¾à¦à§ à¦ªà¦¾à¦ à¦¾à¦¨à§ à¦¹à¦¯à¦¼à§à¦à§à¥¤ à¦à¦®à¦¾à¦¦à§à¦° à¦¬à¦¿à¦¶à§à¦·à¦à§à¦ à¦¦à¦² à¦¶à§à¦à§à¦°à¦ à¦à¦ªà¦¨à¦¾à¦° à¦¸à¦¾à¦¥à§ à¦¯à§à¦à¦¾à¦¯à§à¦ à¦à¦°à¦¬à§à¥¤",
      callAdmin: "à¦à¦¡à¦®à¦¿à¦¨à¦à§ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦à¦² à¦à¦°à§à¦¨",
      whatsappAdmin: "à¦à¦¡à¦®à¦¿à¦¨à§à¦° à¦¸à¦¾à¦¥à§ à¦¹à§à¦¯à¦¼à¦¾à¦à¦¸à¦à§à¦¯à¦¾à¦ª à¦à§à¦¯à¦¾à¦ à¦à¦°à§à¦¨",
      submitAnother: "à¦à¦°à§à¦à¦à¦¿ à¦ªà§à¦°à¦¶à§à¦¨ à¦à¦®à¦¾ à¦¦à¦¿à¦¨",
    },
    mandiBhav: {
      title: "à¦²à¦¾à¦à¦­ à¦®à¦¾à¦¨à§à¦¡à¦¿ à¦¦à¦°",
      subtitle: "à¦ªà§à¦°à¦§à¦¾à¦¨ à¦®à¦¾à¦¨à§à¦¡à¦¿ à¦¥à§à¦à§ à¦à¦ªà¦¡à§à¦ à¦¹à¦à¦¯à¦¼à¦¾ à¦«à¦¸à¦²à§à¦° à¦¬à¦¾à¦à¦¾à¦° à¦¦à¦°",
      searchPlaceholder: "à¦«à¦¸à¦²à§à¦° à¦¨à¦¾à¦® à¦à§à¦à¦à§à¦¨...",
      todaysPrices: "à¦à¦à¦à§à¦° à¦®à¦¾à¦¨à§à¦¡à¦¿ à¦¦à¦°",
      refresh: "à¦°à¦¿à¦«à§à¦°à§à¦¶",
      crop: "à¦«à¦¸à¦²à§à¦° à¦¨à¦¾à¦®",
      minPrice: "à¦¸à¦°à§à¦¬à¦¨à¦¿à¦®à§à¦¨ à¦¦à¦°",
      maxPrice: "à¦¸à¦°à§à¦¬à§à¦à§à¦ à¦¦à¦°",
      modalPrice: "à¦à¦¡à¦¼ à¦¦à¦°",
      unit: "à¦à¦à¦",
      change: "à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨",
      noCrops: "à¦à¦ªà¦¨à¦¾à¦° à¦à¦¨à§à¦¸à¦¨à§à¦§à¦¾à¦¨à§à¦° à¦¸à¦¾à¦¥à§ à¦®à§à¦²à§ à¦à¦®à¦¨ à¦à§à¦¨à§ à¦«à¦¸à¦² à¦ªà¦¾à¦à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿à¥¤",
    },
    footer: {
      tagline: "à¦¸à§à¦®à¦¾à¦°à§à¦ à¦ªà§à¦°à¦¯à§à¦à§à¦¤à¦¿, à¦¦à§à¦°à§à¦¤ à¦¬à¦¾à¦à¦¾à¦° à¦¸à¦à¦¯à§à¦ à¦à¦¬à¦ à¦¨à¦¿à¦°à§à¦­à¦°à¦¯à§à¦à§à¦¯ à¦à§à¦·à¦¿ à¦ªà¦°à¦¿à¦·à§à¦¬à¦¾à¦° à¦®à¦¾à¦§à§à¦¯à¦®à§ à¦à§à¦·à¦à¦¦à§à¦° à¦à§à¦·à¦®à¦¤à¦¾à¦¯à¦¼à¦¨à¥¤",
      quickLinks: "à¦¦à§à¦°à§à¦¤ à¦¨à§à¦­à¦¿à¦à§à¦¶à¦¨",
      services: "à¦à§à¦·à¦¿ à¦ªà¦°à¦¿à¦·à§à¦¬à¦¾",
      contactUs: "à¦¯à§à¦à¦¾à¦¯à§à¦ à¦à¦°à§à¦¨",
      helpline: "à¦à§à¦·à¦ à¦¹à§à¦²à§à¦ªà¦²à¦¾à¦à¦¨ à§¨à§ª/à§­",
      address: "à¦¬à¦¿à¦¹à¦¾à¦° à¦à§à¦·à¦¿ à¦ªà§à¦°à¦¯à§à¦à§à¦¤à¦¿ à¦à§à¦¨à§à¦¦à§à¦°, à¦­à¦¾à¦°à¦¤",
      downloadApp: "à¦à§à¦¯à¦¾à¦ª à¦¡à¦¾à¦à¦¨à¦²à§à¦¡ à¦à¦°à§à¦¨",
      privacyPolicy: "à¦à§à¦ªà¦¨à§à¦¯à¦¼à¦¤à¦¾ à¦¨à§à¦¤à¦¿",
      termsConditions: "à¦¶à¦°à§à¦¤à¦¾à¦¬à¦²à§",
      rights: "à¦¸à¦°à§à¦¬à¦¸à§à¦¬à¦¤à§à¦¬ à¦¸à¦à¦°à¦à§à¦·à¦¿à¦¤à¥¤ à¦à§à¦¬à§à¦à§à¦¸à¦¾ à¦¸à§à¦®à¦¾à¦°à§à¦ à¦«à¦¾à¦°à§à¦®à¦¿à¦à¥¤",
    },
    weather: {
      title: "à¦à¦¬à¦¹à¦¾à¦à¦¯à¦¼à¦¾ à¦à¦ªà¦¡à§à¦",
      subtitle: "à¦¸à§à¦®à¦¾à¦°à§à¦ à¦à§à¦·à¦¿ à¦¸à¦¿à¦¦à§à¦§à¦¾à¦¨à§à¦¤à§à¦° à¦à¦¨à§à¦¯ à¦°à¦¿à¦¯à¦¼à§à¦²-à¦à¦¾à¦à¦® à¦ªà§à¦°à§à¦¬à¦¾à¦­à¦¾à¦¸",
      hourlyForecast: "à¦à¦à¦à§à¦° à¦ªà§à¦°à¦¤à¦¿ à¦à¦£à§à¦à¦¾à¦° à¦ªà§à¦°à§à¦¬à¦¾à¦­à¦¾à¦¸",
      weeklyForecast: "à§­ à¦¦à¦¿à¦¨à§à¦° à¦ªà§à¦°à§à¦¬à¦¾à¦­à¦¾à¦¸",
      advisoryTitle: "à¦à§à¦·à¦¿ à¦à¦¬à¦¹à¦¾à¦à¦¯à¦¼à¦¾ à¦ªà¦°à¦¾à¦®à¦°à§à¦¶",
    },
    wallet: {
      title: "à¦à§à¦¬à§à¦à§à¦¸à¦¾ à¦à¦¯à¦¼à¦¾à¦²à§à¦",
      subtitle: "à¦¸à¦®à¦¸à§à¦¤ à¦à§à¦·à¦¿ à¦²à§à¦¨à¦¦à§à¦¨à§à¦° à¦à¦¨à§à¦¯ à¦¸à§à¦°à¦à§à¦·à¦¿à¦¤ à¦¡à¦¿à¦à¦¿à¦à¦¾à¦² à¦ªà§à¦®à§à¦¨à§à¦",
      secured: "à¦¸à§à¦°à¦à§à¦·à¦¿à¦¤ à¦à¦¬à¦ à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¿à¦¤",
      totalIn: "à¦®à§à¦ à¦à§",
      totalOut: "à¦®à§à¦ à¦¬à§à¦¯à§",
      addMoney: "à¦à¦¾à¦à¦¾ à¦¯à§à¦ à¦à¦°à§à¦¨",
      enterAmount: "à¦ªà¦°à¦¿à¦®à¦¾à¦£ à¦²à¦¿à¦à§à¦¨",
      add: "à¦¯à§à¦ à¦à¦°à§à¦¨",
      txHistory: "à¦²à§à¦¨à¦¦à§à¦¨à§à¦° à¦à¦¤à¦¿à¦¹à¦¾à¦¸",
      viewAll: "à¦¸à¦¬ à¦¦à§à¦à§à¦¨",
    },
  },
};

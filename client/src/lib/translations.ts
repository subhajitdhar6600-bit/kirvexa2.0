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
      wallet: "Krivexa Wallet",
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
      desc: "Krivexa brings every farming solution to your fingertips — live mandi rates, buy inputs, sell crops, labour booking, and expert advice.",
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
      kccPromoDesc: "Apply for your free KCC to access all platform features — buying, selling, labour booking and expert advice.",
      applyNow: "Apply Now",
      trustedBy: "Trusted by",
      trustedHighlight: "Farmers",
      trustSecure: "100% Secure", trustSecureDesc: "Your data is always protected",
      trustPlatform: "Trusted Platform", trustPlatformDesc: "Join thousands of farmers",
      trustPrice: "Best Price Guarantee", trustPriceDesc: "Get the best market price",
      trustSupport: "24×7 Support", trustSupportDesc: "We are always here to help you",
      joinTitle: "Join",
      joinHighlight: "Krivexa Today",
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
      price: "Asking Price (₹)",
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
      rights: "All rights reserved. KRIVEXA Smart Farming.",
    },
    weather: {
      title: "Weather Update",
      subtitle: "Real-time weather forecast for smarter farming decisions",
      hourlyForecast: "Today's Hourly Forecast",
      weeklyForecast: "7-Day Forecast",
      advisoryTitle: "Farm Weather Advisory",
    },
    wallet: {
      title: "Krivexa Wallet",
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
      home: "होम",
      services: "सेवाएं",
      resources: "संसाधन",
      mandiBhav: "मंडी भाव",
      buyInputs: "खाद-बीज खरीदें",
      sellCrops: "फसल बेचें",
      labourBooking: "मजदूर बुकिंग",
      expertAdvice: "विशेषज्ञ सलाह",
      weather: "मौसम अपडेट",
      wallet: "किसान वॉलेट",
      applyKcc: "किसान क्रेडिट कार्ड आवेदन करें",
      aboutUs: "हमारे बारे में",
      contactUs: "संपर्क करें",
      login: "लॉगिन",
      register: "पंजीकरण",
      adminPanel: "एडमिन पैनल",
      blog: "ब्लॉग",
      cropCalendar: "फसल कैलेंडर",
      govSchemes: "सरकारी योजनाएं",
      farmingTips: "कृषि टिप्स",
      helpCenter: "सहायता केंद्र",
      language: "भाषा",
    },
    hero: {
      badge: "भारत का स्मार्ट कृषि मंच",
      title1: "स्मार्ट",
      title2: "खेती।",
      title3: "बेहतर",
      title4: "भविष्य।",
      desc: "क्रिवेक्सा हर कृषि समाधान आपकी उंगलियों पर लाता है — लाइव मंडी भाव, खाद-बीज, फसल बिक्री, मजदूर बुकिंग और विशेषज्ञ सलाह।",
      getStarted: "मुफ्त में शुरू करें",
      applyKcc: "किसान क्रेडिट कार्ड आवेदन करें",
      farmersCount: "पंजीकृत किसान",
      mandisCount: "शामिल मंडियां",
      expertsCount: "कृषि विशेषज्ञ",
      supportCount: "24/7 सहायता",
    },
    services: {
      title: "हमारी",
      titleHighlight: "सेवाएं",
      subtitle: "एक ही सरल मंच पर सभी कृषि समाधान",
      mandiBhavTitle: "मंडी भाव", mandiBhavDesc: "लाइव बाजार भाव",
      buyInputsTitle: "खाद-बीज खरीदें", buyInputsDesc: "उत्कृष्ट बीज व खाद",
      sellCropsTitle: "फसल बेचें", sellCropsDesc: "उत्तम बाजार मूल्य",
      labourBookingTitle: "मजदूर बुकिंग", labourBookingDesc: "कुशल कृषि मजदूर",
      expertAdviceTitle: "विशेषज्ञ सलाह", expertAdviceDesc: "विशेषज्ञों से परामर्श",
      weatherTitle: "मौसम अपडेट", weatherDesc: "लाइव पूर्वानुमान",
      walletTitle: "किसान वॉलेट", walletDesc: "सुरक्षित भुगतान",
    },
    farmerNeeds: {
      badge: "कृषि सेवाएं",
      title: "किसान की हर",
      titleHighlight: "ज़रूरत",
      subtitle: "विशेष रूप से आधुनिक किसानों के लिए निर्मित अभिनव उपकरण",
      explore: "देखें",
      f1Title: "लाइव मंडी भाव", f1Desc: "एडमिन द्वारा दैनिक अद्यतन वास्तविक मंडी भाव।", f1Badge: "लाइव दरें",
      f2Title: "खाद-बीज खरीदें", f2Desc: "गुणवत्तापूर्ण बीज, उर्वरक, कीटनाशक व उपकरण।", f2Badge: "सत्यापित",
      f3Title: "फसल बेचें", f3Desc: "अपनी उपज दर्ज करें और खरीदारों से सीधे जुड़ें।", f3Badge: "सीधा बाजार",
      f4Title: "मजदूर बुकिंग", f4Desc: "खेत के लिए एडमिन द्वारा आवंटित कुशल मजदूर।", f4Badge: "ऑन-डिमांड",
      f5Title: "विशेषज्ञ सलाह", f5Desc: "सीधा कृषि परामर्श, कॉल एवं व्हाट्सएप सुविधा।", f5Badge: "24/7 सहायता",
      f6Title: "मौसम अपडेट", f6Desc: "खेती की योजना बनाने के लिए सटीक दैनिक पूर्वानुमान।", f6Badge: "लाइव अपडेट",
    },
    home: {
      kccPromoTitle: "किसान क्रेडिट कार्ड से सभी सुविधाएं अनलॉक करें",
      kccPromoDesc: "खरीद, बिक्री, मजदूर बुकिंग और विशेषज्ञ सलाह के लिए अपना मुफ्त केसीसी आवेदन करें।",
      applyNow: "अभी आवेदन करें",
      trustedBy: "किसान",
      trustedHighlight: "का भरोसा",
      trustSecure: "100% सुरक्षित", trustSecureDesc: "आपकी जानकारी हमेशा सुरक्षित है",
      trustPlatform: "विश्वसनीय मंच", trustPlatformDesc: "हजारों किसानों से जुड़ें",
      trustPrice: "सर्वोत्तम मूल्य", trustPriceDesc: "पाएं बाजार का सबसे अच्छा भाव",
      trustSupport: "24×7 सहायता", trustSupportDesc: "हम हमेशा आपकी मदद के लिए उपलब्ध हैं",
      joinTitle: "आज ही",
      joinHighlight: "क्रिवेक्सा से जुड़ें",
      joinDesc: "मुफ्त पंजीकरण करें और अपनी स्मार्ट खेती की यात्रा शुरू करें।",
      registerNow: "अभी पंजीकरण करें",
    },
    kccModal: {
      title: "किसान क्रेडिट कार्ड आवेदन",
      subtitle: "अपने आधिकारिक किसान क्रेडिट कार्ड के लिए नीचे विवरण भरें",
      alertTitle: "किसान क्रेडिट कार्ड अनिवार्य है",
      alertDesc: "आपके पास अभी तक किसान क्रेडिट कार्ड जारी नहीं हुआ है। सक्रिय किसान क्रेडिट कार्ड के बिना आप फसल खरीद/बिक्री, मजदूर बुकिंग या संपर्क नहीं कर सकते। कृपया सभी सुविधाओं को अनलॉक करने के लिए आवेदन करें!",
      applyNow: "अभी किसान क्रेडिट कार्ड आवेदन करें",
      fullName: "किसान का पूरा नाम",
      phone: "मोबाइल नंबर",
      aadhaar: "आधार कार्ड नंबर",
      address: "पूरा गांव / पता",
      district: "जिला",
      landSize: "कुल जमीन (एकड़ में)",
      submit: "केसीसी आवेदन जमा करें",
      success: "आपका किसान क्रेडिट कार्ड आवेदन सफलतापूर्वक जमा हो गया है! एडमिन जल्द समीक्षा करके कार्ड जारी करेगा।",
      statusActive: "केसीसी सक्रिय एवं जारी",
      statusPending: "केसीसी आवेदन समीक्षाधीन है",
      cancel: "रद्द करें",
      submittedTitle: "आवेदन जमा हो गया!",
      close: "बंद करें",
      restrictedBadge: "कार्रवाई सीमित",
    },
    buyInputs: {
      title: "खरीदें",
      titleHighlight: "उत्पाद एवं फसलें",
      subtitle: "उत्कृष्ट गुणवत्ता के बीज, उर्वरक, कृषि उपकरण और सत्यापित किसानों की फसल लिस्टिंग देखें",
      searchPlaceholder: "उत्पाद या फसल खोजें...",
      filter: "फिल्टर",
      all: "सभी",
      seeds: "बीज",
      fertilizers: "उर्वरक",
      pesticides: "कीटनाशक",
      farmTools: "कृषि उपकरण",
      organic: "जैविक",
      userCrops: "किसानों की फसलें",
      farmerCropsTitle: "किसानों द्वारा सूचीबद्ध फसलें",
      agriInputsTitle: "कृषि उत्पाद एवं खाद-बीज",
      available: "उपलब्ध",
      farmerListedBadge: "किसान द्वारा दर्ज",
      by: "विक्रेता",
      viewDetails: "विवरण देखें",
      sellerDetails: "विक्रेता विवरण",
      callSeller: "कॉल करें",
      whatsappSeller: "व्हाट्सएप",
      addToCart: "खरीदें",
      noProducts: "आपकी खोज से मेल खाता कोई उत्पाद नहीं मिला।",
      weight: "वजन",
      askingPrice: "मांगी गई कीमत",
    },
    sellCrops: {
      title: "फसल बेचें",
      subtitle: "उत्तम बाजार मूल्य पर खरीदारों तक पहुंचने के लिए अपनी फसल की जानकारी दर्ज करें",
      formHeader: "अपनी फसल बेचें",
      formSubheader: "लिस्टिंग बनाने के लिए फसल और विक्रेता का विवरण भरें",
      sellerName: "विक्रेता का नाम",
      district: "जिला",
      city: "शहर / कस्बा",
      address: "गांव का पूरा पता",
      pincode: "पिन कोड",
      phone: "फोन नंबर",
      cropName: "बेची जाने वाली फसल का नाम",
      weight: "वजन (किलो / क्विंटल)",
      price: "मांगी गई कीमत (₹)",
      imageUpload: "फसल की तस्वीर अपलोड करें",
      gallery: "गैलरी से चुनें",
      camera: "कैमरे से फोटो खींचें",
      submit: "लिस्टिंग अनुरोध जमा करें",
      submittedTitle: "लिस्टिंग अनुरोध जमा हो गया!",
      submittedMsg: "आपकी फसल लिस्टिंग का अनुरोध स्वीकृति के लिए एडमिन पैनल को भेज दिया गया है!",
      pendingNote: "एडमिन समीक्षा करके आपकी फसल स्वीकृत करेगा। स्वीकृति के बाद यह खरीद अनुभाग में दिखाई देगी।",
      submitAnother: "एक और लिस्टिंग दर्ज करें",
    },
    labourBooking: {
      title: "मजदूर बुकिंग",
      subtitle: "कटाई, बुआई और खेत के काम के लिए कुशल कृषि मजदूरों की बुकिंग करें",
      formHeader: "मजदूर बुक करें",
      formSubheader: "एडमिन को अनुरोध भेजने के लिए विवरण भरें",
      labourType: "मजदूर का प्रकार",
      numLabours: "मजदूरों की संख्या",
      numDays: "दिनों की संख्या",
      startDate: "शुरुआती तारीख",
      endDate: "अंतिम तारीख",
      location: "काम का स्थान",
      name: "आपका पूरा नाम",
      phone: "संपर्क मोबाइल नंबर",
      submit: "मजदूर बुकिंग अनुरोध भेजें",
      submittedTitle: "बुकिंग अनुरोध भेजा गया!",
      submittedMsg: "आपका अनुरोध एडमिन को भेज दिया गया है। मजदूर आवंटित होने पर आपको उनका विवरण (नाम, फोन, मजदूरी) यहाँ मिलेगा।",
      pendingBadge: "एडमिन स्वीकृति का इंतजार",
      assignedTitle: "आपको आवंटित मजदूर विवरण",
      noAssigned: "अभी कोई मजदूर आवंटित नहीं हुआ है। एडमिन द्वारा अनुरोध स्वीकृत होने पर विवरण यहाँ दिखाई देगा।",
      submitAnother: "एक और अनुरोध जमा करें",
    },
    expertAdvice: {
      title: "विशेषज्ञ सलाह",
      subtitle: "फसल की बीमारियों और कृषि समस्याओं के लिए कृषि विशेषज्ञों से सीधा समाधान पाएं",
      formHeader: "सवाल पूछें",
      formSubheader: "एडमिन विशेषज्ञ सलाह के साथ आपसे संपर्क करेगा",
      farmerName: "किसान का नाम",
      phone: "फोन नंबर",
      address: "पूरा पता",
      cropName: "किस फसल से संबंधित समस्या है?",
      problemDetails: "समस्या का विस्तृत विवरण दें",
      submit: "एडमिन को सवाल भेजें",
      submittedTitle: "सवाल दर्ज हो गया!",
      submittedMsg: "आपकी समस्या एडमिन को भेज दी गई है। हमारी विशेषज्ञ टीम जल्द आपसे संपर्क करेगी।",
      callAdmin: "एडमिन को सीधा कॉल करें",
      whatsappAdmin: "एडमिन से व्हाट्सएप चैट करें",
      submitAnother: "एक और सवाल पूछें",
    },
    mandiBhav: {
      title: "लाइव मंडी भाव",
      subtitle: "प्रमुख मंडियों से अद्यतन कृषि उपज भाव",
      searchPlaceholder: "फसल का नाम खोजें...",
      todaysPrices: "आज के मंडी भाव",
      refresh: "रिफ्रेश",
      crop: "फसल का नाम",
      minPrice: "न्यूनतम मूल्य",
      maxPrice: "अधिकतम मूल्य",
      modalPrice: "औसत मूल्य",
      unit: "इकाई",
      change: "बदलाव",
      noCrops: "आपकी खोज से मेल खाती कोई फसल नहीं मिली।",
    },
    footer: {
      tagline: "स्मार्ट तकनीक, त्वरित बाजार पहुंच और विश्वसनीय कृषि सेवाओं के साथ किसानों को सशक्त बनाना।",
      quickLinks: "त्वरित नेविगेशन",
      services: "कृषि सेवाएं",
      contactUs: "संपर्क करें",
      helpline: "किसान हेल्पलाइन 24/7",
      address: "बिहार कृषि प्रौद्योगिकी केंद्र, भारत",
      downloadApp: "ऐप डाउनलोड करें",
      privacyPolicy: "गोपनीयता नीति",
      termsConditions: "नियम एवं शर्तें",
      rights: "सर्वाधिकार सुरक्षित। क्रिवेक्सा स्मार्ट फार्मिंग।",
    },
    weather: {
      title: "मौसम अपडेट",
      subtitle: "स्मार्ट खेती के फैसलों के लिए वास्तविक समय का मौसम पूर्वानुमान",
      hourlyForecast: "आज का प्रति घंटा पूर्वानुमान",
      weeklyForecast: "7-दिवसीय पूर्वानुमान",
      advisoryTitle: "कृषि मौसम परामर्श",
    },
    wallet: {
      title: "क्रिवेक्सा वॉलेट",
      subtitle: "सभी कृषि लेनदेन के लिए सुरक्षित डिजिटल भुगतान",
      secured: "सुरक्षित एवं संरक्षित",
      totalIn: "कुल आय",
      totalOut: "कुल व्यय",
      addMoney: "पैसे जोड़ें",
      enterAmount: "राशि दर्ज करें",
      add: "जोड़ें",
      txHistory: "लेनदेन का इतिहास",
      viewAll: "सभी देखें",
    },
  },
  bn: {
    nav: {
      home: "হোম",
      services: "পরিষেবা",
      resources: "সম্পদ",
      mandiBhav: "মান্ডি দর",
      buyInputs: "উপকরণ কিনুন",
      sellCrops: "ফসল বিক্রি করুন",
      labourBooking: "শ্রমিক বুকিং",
      expertAdvice: "বিশেষজ্ঞের পরামর্শ",
      weather: "আবহাওয়া আপডেট",
      wallet: "কিষাণ ওয়ালেট",
      applyKcc: "কিষাণ ক্রেডিট কার্ডের আবেদন করুন",
      aboutUs: "আমাদের সম্পর্কে",
      contactUs: "যোগাযোগ",
      login: "লগইন",
      register: "নিবন্ধন",
      adminPanel: "এডমিন প্যানেল",
      blog: "ব্লগ",
      cropCalendar: "ফসল ক্যালেন্ডার",
      govSchemes: "সরকারী প্রকল্প",
      farmingTips: "কৃষি পরামর্শ",
      helpCenter: "সহায়তা কেন্দ্র",
      language: "ভাষা",
    },
    hero: {
      badge: "ভারতের স্মার্ট কৃষি প্ল্যাটফর্ম",
      title1: "স্মার্ট",
      title2: "কৃষি।",
      title3: "উন্নত",
      title4: "ভবিষ্যত।",
      desc: "কৃবেক্সা আপনার আঙুলের ডগায় সমস্ত কৃষি সমাধান নিয়ে এসেছে — লাইভ মান্ডি দর, বীজ ও সার ক্রয়, ফসল বিক্রি, শ্রমিক বুকিং এবং বিশেষজ্ঞের পরামর্শ।",
      getStarted: "বিনামূল্যে শুরু করুন",
      applyKcc: "কিষাণ ক্রেডিট কার্ডের আবেদন করুন",
      farmersCount: "নিবন্ধিত কৃষক",
      mandisCount: "অন্তর্ভুক্ত মান্ডি",
      expertsCount: "কৃষি বিশেষজ্ঞ",
      supportCount: "২৪/৭ সহায়তা",
    },
    services: {
      title: "আমাদের",
      titleHighlight: "পরিষেবাসমূহ",
      subtitle: "একটি সহজ প্ল্যাটফর্মে সমস্ত কৃষি সমাধান",
      mandiBhavTitle: "মান্ডি দর", mandiBhavDesc: "লাইভ বাজার দর",
      buyInputsTitle: "উপকরণ কিনুন", buyInputsDesc: "উন্নত বীজ ও সার",
      sellCropsTitle: "ফসল বিক্রি করুন", sellCropsDesc: "সেরা বাজার মূল্য",
      labourBookingTitle: "শ্রমিক বুকিং", labourBookingDesc: "দক্ষ কৃষি শ্রমিক",
      expertAdviceTitle: "বিশেষজ্ঞের পরামর্শ", expertAdviceDesc: "বিশেষজ্ঞদের সাথে কথা বলুন",
      weatherTitle: "আবহাওয়া আপডেট", weatherDesc: "লাইভ পূর্বাভাস",
      walletTitle: "কিষাণ ওয়ালেট", walletDesc: "সুরক্ষিত পেমেন্ট",
    },
    farmerNeeds: {
      badge: "কৃষি পরিষেবাসমূহ",
      title: "কৃষকের প্রতিটি",
      titleHighlight: "প্রয়োজন",
      subtitle: "আধুনিক কৃষকদের জন্য বিশেষভাবে নির্মিত উদ্ভাবনী সমাধান",
      explore: "দেখুন",
      f1Title: "লাইভ মান্ডি দর", f1Desc: "এডমিন দ্বারা দৈনিক আপডেট হওয়া ফসলের দর।", f1Badge: "লাইভ দর",
      f2Title: "উপকরণ কিনুন", f2Desc: "উন্নত মানের বীজ, সার, কীটনাশক ও সরঞ্জাম।", f2Badge: "যাচাইকৃত",
      f3Title: "ফসল বিক্রি করুন", f3Desc: "আপনার ফসলের বিবরণ লিখুন এবং সরাসরি ক্রেতার সাথে যুক্ত হন।", f3Badge: "সরাসরি বাজার",
      f4Title: "শ্রমিক বুকিং", f4Desc: "এডমিন দ্বারা বরাদ্দকৃত দক্ষ কৃষি শ্রমিক বুক করুন।", f4Badge: "অন-ডিমান্ড",
      f5Title: "বিশেষজ্ঞের পরামর্শ", f5Desc: "সরাসরি কৃষি পরামর্শ, কল এবং হোয়াটসঅ্যাপ পরিষেবা।", f5Badge: "২৪/৭ সহায়তা",
      f6Title: "আবহাওয়া আপডেট", f6Desc: "কৃষি কাজ পরিচালনার জন্য সঠিক দৈনিক পূর্বাভাস।", f6Badge: "লাইভ আপডেট",
    },
    home: {
      kccPromoTitle: "কিষাণ ক্রেডিট কার্ড দিয়ে সমস্ত বৈশিষ্ট্য আনলক করুন",
      kccPromoDesc: "ক্রয়, বিক্রয়, শ্রমিক বুকিং এবং বিশেষজ্ঞ পরামর্শের জন্য বিনামূল্যে কেসিসি আবেদন করুন।",
      applyNow: "এখনই আবেদন করুন",
      trustedBy: "কৃষকদের",
      trustedHighlight: "বিশ্বাস",
      trustSecure: "১০০% নিরাপদ", trustSecureDesc: "আপনার তথ্য সর্বদা সুরক্ষিত",
      trustPlatform: "বিশ্বস্ত প্ল্যাটফর্ম", trustPlatformDesc: "হাজার হাজার কৃষকের সাথে যুক্ত হন",
      trustPrice: "সেরা দর নিশ্চয়তা", trustPriceDesc: "পান বাজারের সেরা দর",
      trustSupport: "২৪×৭ সহায়তা", trustSupportDesc: "আমরা সর্বদা আপনাকে সাহায্য করতে প্রস্তুত",
      joinTitle: "আজই",
      joinHighlight: "কৃবেক্সায় যোগ দিন",
      joinDesc: "বিনামূল্যে নিবন্ধন করুন এবং আপনার স্মার্ট কৃষি যাত্রা শুরু করুন।",
      registerNow: "এখনই নিবন্ধন করুন",
    },
    kccModal: {
      title: "কিষাণ ক্রেডিট কার্ড আবেদন",
      subtitle: "আপনার অফিশিয়াল কিষাণ ক্রেডিট কার্ড পেতে নিচের তথ্যগুলি পূরণ করুন",
      alertTitle: "কিষাণ ক্রেডিট কার্ড আবশ্যক",
      alertDesc: "আপনার কাছে এখনও কোনো সক্রিয় কিষাণ ক্রেডিট কার্ড নেই। কিষাণ ক্রেডিট কার্ড ব্যতীত আপনি ফসল কেনাবেচা, শ্রমিক বুকিং বা যোগাযোগ করতে পারবেন না। সমস্ত বৈশিষ্ট্য আনলক করতে এখনই আবেদন করুন!",
      applyNow: "এখনই কিষাণ ক্রেডিট কার্ডের আবেদন করুন",
      fullName: "কৃষকের পুরো নাম",
      phone: "মোবাইল নম্বর",
      aadhaar: "আধার কার্ড নম্বর",
      address: "সম্পূর্ণ ঠিকানা / গ্রাম",
      district: "জেলা",
      landSize: "মোট জমির পরিমাণ (একর)",
      submit: "কেসিসি আবেদন জমা দিন",
      success: "আপনার কিষাণ ক্রেডিট কার্ড আবেদন সফলভাবে জমা হয়েছে! এডমিন শীঘ্রই পর্যালোচনা করে কার্ড ইস্যু করবে।",
      statusActive: "কেসিসি সক্রিয় এবং ইস্যু করা হয়েছে",
      statusPending: "কেসিসি আবেদন পর্যালোচনাধীন",
      cancel: "বাতিল করুন",
      submittedTitle: "আবেদন জমা হয়েছে!",
      close: "বন্ধ করুন",
      restrictedBadge: "কার্যক্রম সীমাবদ্ধ",
    },
    buyInputs: {
      title: "কিনুন",
      titleHighlight: "উপকরণ ও ফসল",
      subtitle: "উন্নত মানের বীজ, সার, কৃষি সরঞ্জাম এবং যাচাইকৃত কৃষকদের ফসলের তালিকা দেখুন",
      searchPlaceholder: "পণ্য বা ফসল খুঁজুন...",
      filter: "ফিল্টার",
      all: "সব",
      seeds: "বীজ",
      fertilizers: "সার",
      pesticides: "কীটনাশক",
      farmTools: "কৃষি যন্ত্রাংশ",
      organic: "জৈব",
      userCrops: "কৃষকদের ফসল",
      farmerCropsTitle: "কৃষকদের তালিকাভুক্ত ফসল",
      agriInputsTitle: "কৃষি উপকরণ ও সার-বীজ",
      available: "উপলব্ধ",
      farmerListedBadge: "কৃষকের তালিকাভুক্ত",
      by: "বিক্রেতা",
      viewDetails: "বিবরণ দেখুন",
      sellerDetails: "বিক্রেতার বিবরণ",
      callSeller: "কল করুন",
      whatsappSeller: "হোয়াটসঅ্যাপ",
      addToCart: "কিনুন",
      noProducts: "আপনার অনুসন্ধানের সাথে মেলে এমন কোনো পণ্য পাওয়া যায়নি।",
      weight: "ওজন",
      askingPrice: "কাঙ্ক্ষিত মূল্য",
    },
    sellCrops: {
      title: "ফসল বিক্রি করুন",
      subtitle: "সেরা বাজার মূল্যে ক্রেতাদের কাছে পৌঁছাতে আপনার ফসলের বিবরণ জমা দিন",
      formHeader: "আপনার ফসল বিক্রি করুন",
      formSubheader: "তালিকা তৈরির জন্য ফসল ও বিক্রেতার বিবরণ পূরণ করুন",
      sellerName: "বিক্রেতার নাম",
      district: "জেলা",
      city: "শহর / নগর",
      address: "গ্রামের ঠিকানা",
      pincode: "পিন কোড",
      phone: "ফোন নম্বর",
      cropName: "বিক্রিযোগ্য ফসলের নাম",
      weight: "ওজন (কেজি / কুইন্টাল)",
      price: "কাঙ্ক্ষিত মূল্য (₹)",
      imageUpload: "ফসলের ছবি আপলোড",
      gallery: "গ্যালারি থেকে বেছে নিন",
      camera: "ক্যামেরা দিয়ে ছবি তুলুন",
      submit: "তালিকাভুক্তির আবেদন জমা দিন",
      submittedTitle: "আবেদন জমা হয়েছে!",
      submittedMsg: "আপনার ফসলের তালিকাভুক্তির আবেদনটি অনুমোদনের জন্য এডমিন প্যানেলে পাঠানো হয়েছে!",
      pendingNote: "এডমিন পর্যালোচনা করে আপনার ফসল অনুমোদন করবে। অনুমোদনের পর এটি ক্রয় বিভাগে দেখা যাবে।",
      submitAnother: "আরেকটি আবেদন জমা দিন",
    },
    labourBooking: {
      title: "শ্রমিক বুকিং",
      subtitle: "ফসল কাটা, বপন এবং খামারের কাজের জন্য দক্ষ কৃষি শ্রমিক বুক করুন",
      formHeader: "শ্রমিক বুক করুন",
      formSubheader: "এডমিনকে আবেদন পাঠাতে বিবরণ পূরণ করুন",
      labourType: "শ্রমিকের ধরন",
      numLabours: "শ্রমিকের সংখ্যা",
      numDays: "দিনের সংখ্যা",
      startDate: "শুরুর তারিখ",
      endDate: "শেষের তারিখ",
      location: "কাজের স্থান",
      name: "আপনার নাম",
      phone: "যোগাযোগের ফোন নম্বর",
      submit: "শ্রমিক বুকিং আবেদন জমা দিন",
      submittedTitle: "আবেদন জমা হয়েছে!",
      submittedMsg: "আপনার আবেদন এডমিনের কাছে পাঠানো হয়েছে। শ্রমিক বরাদ্দ করা হলে বিবরণ এখানে দেখা যাবে।",
      pendingBadge: "এডমিন অনুমোদনের অপেক্ষায়",
      assignedTitle: "আপনার জন্য বরাদ্দকৃত শ্রমিক বিবরণ",
      noAssigned: "এখনও কোনো শ্রমিক বরাদ্দ করা হয়নি। এডমিন অনুমোদন দিলে বিবরণ এখানে দেখা যাবে।",
      submitAnother: "আরেকটি আবেদন জমা দিন",
    },
    expertAdvice: {
      title: "বিশেষজ্ঞের পরামর্শ",
      subtitle: "ফসলের রোগ ও কৃষি সমস্যার সরাসরি সমাধান পান কৃষি বিশেষজ্ঞদের কাছ থেকে",
      formHeader: "প্রশ্ন জমা দিন",
      formSubheader: "এডমিন বিশেষজ্ঞ পরামর্শ সহ আপনার সাথে যোগাযোগ করবে",
      farmerName: "কৃষকের নাম",
      phone: "ফোন নম্বর",
      address: "সম্পূর্ণ ঠিকানা",
      cropName: "কোন ফসল সম্পর্কিত সমস্যা?",
      problemDetails: "সমস্যার বিস্তারিত বিবরণ দিন",
      submit: "এডমিনের কাছে প্রশ্ন জমা দিন",
      submittedTitle: "প্রশ্ন জমা হয়েছে!",
      submittedMsg: "আপনার সমস্যা এডমিনের কাছে পাঠানো হয়েছে। আমাদের বিশেষজ্ঞ দল শীঘ্রই আপনার সাথে যোগাযোগ করবে।",
      callAdmin: "এডমিনকে সরাসরি কল করুন",
      whatsappAdmin: "এডমিনের সাথে হোয়াটসঅ্যাপ চ্যাট করুন",
      submitAnother: "আরেকটি প্রশ্ন জমা দিন",
    },
    mandiBhav: {
      title: "লাইভ মান্ডি দর",
      subtitle: "প্রধান মান্ডি থেকে আপডেট হওয়া ফসলের বাজার দর",
      searchPlaceholder: "ফসলের নাম খুঁজুন...",
      todaysPrices: "আজকের মান্ডি দর",
      refresh: "রিফ্রেশ",
      crop: "ফসলের নাম",
      minPrice: "সর্বনিম্ন দর",
      maxPrice: "সর্বোচ্চ দর",
      modalPrice: "গড় দর",
      unit: "একক",
      change: "পরিবর্তন",
      noCrops: "আপনার অনুসন্ধানের সাথে মেলে এমন কোনো ফসল পাওয়া যায়নি।",
    },
    footer: {
      tagline: "স্মার্ট প্রযুক্তি, দ্রুত বাজার সংযোগ এবং নির্ভরযোগ্য কৃষি পরিষেবার মাধ্যমে কৃষকদের ক্ষমতায়ন।",
      quickLinks: "দ্রুত নেভিগেশন",
      services: "কৃষি পরিষেবা",
      contactUs: "যোগাযোগ করুন",
      helpline: "কৃষক হেল্পলাইন ২৪/৭",
      address: "বিহার কৃষি প্রযুক্তি কেন্দ্র, ভারত",
      downloadApp: "অ্যাপ ডাউনলোড করুন",
      privacyPolicy: "গোপনীয়তা নীতি",
      termsConditions: "শর্তাবলী",
      rights: "সর্বস্বত্ব সংরক্ষিত। কৃবেক্সা স্মার্ট ফার্মিং।",
    },
    weather: {
      title: "আবহাওয়া আপডেট",
      subtitle: "স্মার্ট কৃষি সিদ্ধান্তের জন্য রিয়েল-টাইম পূর্বাভাস",
      hourlyForecast: "আজকের প্রতি ঘণ্টার পূর্বাভাস",
      weeklyForecast: "৭ দিনের পূর্বাভাস",
      advisoryTitle: "কৃষি আবহাওয়া পরামর্শ",
    },
    wallet: {
      title: "কৃবেক্সা ওয়ালেট",
      subtitle: "সমস্ত কৃষি লেনদেনের জন্য সুরক্ষিত ডিজিটাল পেমেন্ট",
      secured: "সুরক্ষিত এবং নিবন্ধিত",
      totalIn: "মোট আয়",
      totalOut: "মোট ব্যয়",
      addMoney: "টাকা যোগ করুন",
      enterAmount: "পরিমাণ লিখুন",
      add: "যোগ করুন",
      txHistory: "লেনদেনের ইতিহাস",
      viewAll: "সব দেখুন",
    },
  },
};

import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import KccApplication from '../models/KccApplication.js';
import CropListing from '../models/CropListing.js';
import LabourBooking from '../models/LabourBooking.js';
import LabourType from '../models/LabourType.js';
import MachineryBooking from '../models/MachineryBooking.js';
import ExpertQuery from '../models/ExpertQuery.js';
import MandiRate from '../models/MandiRate.js';
import DealerListing from '../models/DealerListing.js';
import RegisteredFarmer from '../models/RegisteredFarmer.js';
import Order from '../models/Order.js';
import PathshalaVideo from '../models/PathshalaVideo.js';
import Notification from '../models/Notification.js';
import FarmerCard from '../models/FarmerCard.js';
import Product from '../models/Product.js';
import Complaint from '../models/Complaint.js';
import PlatformSettings from '../models/PlatformSettings.js';

const router = express.Router();

// Seed initial data into MongoDB database "Farma"
router.post('/', async (req, res) => {
  try {
    // 1. Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
      const hashedFarmerPassword = await bcrypt.hash('Farmer@123', 10);
      const hashedDealerPassword = await bcrypt.hash('Dealer@123', 10);

      await User.insertMany([
        {
          id: 'usr_admin_01',
          name: 'Super Admin',
          fullName: 'Super Admin',
          phone: '9999999999',
          email: 'admin@farma.com',
          passwordHash: hashedAdminPassword,
          password: hashedAdminPassword,
          role: 'admin',
          district: 'Patna',
          state: 'Bihar',
          kccStatus: 'APPROVED',
          verificationStatus: 'Verified',
        },
        {
          id: 'usr_dealer_01',
          name: 'Ramesh Agro Store',
          fullName: 'Ramesh Agro Store',
          businessName: 'Ramesh Agro Traders',
          dealerType: 'Fertilizers & Seeds',
          phone: '9888888888',
          email: 'dealer@farma.com',
          passwordHash: hashedDealerPassword,
          password: hashedDealerPassword,
          role: 'dealer',
          district: 'Patna',
          state: 'Bihar',
          kccStatus: 'APPROVED',
          verificationStatus: 'Verified',
        },
        {
          id: 'usr_farmer_01',
          name: 'Rajesh Kumar Sharma',
          fullName: 'Rajesh Kumar Sharma',
          phone: '9777777777',
          email: 'farmer@farma.com',
          passwordHash: hashedFarmerPassword,
          password: hashedFarmerPassword,
          role: 'farmer',
          district: 'Patna',
          state: 'Bihar',
          kccStatus: 'APPROVED',
          verificationStatus: 'Verified',
        },
      ]);
    }

    // 2. Mandi Rates
    const mandiCount = await MandiRate.countDocuments();
    if (mandiCount === 0) {
      await MandiRate.insertMany([
        { id: "m1", name: "Wheat", hindi: "गेहूं", min: 2150, max: 2400, modal: 2275, unit: "Quintal", change: 2.35, img: "🌾", mandi: "Kanpur Mandi" },
        { id: "m2", name: "Paddy (Common)", hindi: "धान", min: 1750, max: 1950, modal: 1860, unit: "Quintal", change: 1.78, img: "🌾", mandi: "Kanpur Mandi" },
        { id: "m3", name: "Soyabean", hindi: "सोयाबीन", min: 4800, max: 5050, modal: 4920, unit: "Quintal", change: 3.12, img: "🟡", mandi: "Kanpur Mandi" },
        { id: "m4", name: "Maize", hindi: "मक्का", min: 1850, max: 2000, modal: 1920, unit: "Quintal", change: 0.91, img: "🌽", mandi: "Kanpur Mandi" },
        { id: "m5", name: "Mustard", hindi: "सरसों", min: 5100, max: 5400, modal: 5250, unit: "Quintal", change: -0.5, img: "🌼", mandi: "Kanpur Mandi" },
        { id: "m6", name: "Gram", hindi: "चना", min: 4600, max: 4900, modal: 4750, unit: "Quintal", change: 1.2, img: "🟤", mandi: "Kanpur Mandi" },
        { id: "m7", name: "Onion", hindi: "प्याज", min: 800, max: 1200, modal: 1050, unit: "Quintal", change: -2.1, img: "🧅", mandi: "Kanpur Mandi" },
        { id: "m8", name: "Tomato", hindi: "टमाटर", min: 600, max: 1000, modal: 800, unit: "Quintal", change: 4.5, img: "🍅", mandi: "Kanpur Mandi" },
      ]);
    }

    // 3. Crop Listings
    const cropCount = await CropListing.countDocuments();
    if (cropCount === 0) {
      await CropListing.insertMany([
        {
          id: "crop-101",
          sellerName: "Rajesh Kumar Sharma",
          district: "Patna",
          city: "Danapur",
          address: "Village Rampur, PO Danapur",
          pincode: "801503",
          phone: "9777777777",
          cropName: "Organic Sharbati Wheat",
          weight: "50 Quintal",
          price: 2450,
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80",
          status: "approved",
          createdAt: new Date().toISOString(),
        },
        {
          id: "crop-102",
          sellerName: "Mahesh Singh",
          district: "Nalanda",
          city: "Bihar Sharif",
          address: "Gram Panchayat Chandi",
          pincode: "803108",
          phone: "9123456789",
          cropName: "Premium Basmati Paddy",
          weight: "30 Quintal",
          price: 3200,
          image: "https://images.unsplash.com/photo-1536054993300-0b00f01ee72a?w=500&q=80",
          status: "approved",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    // 4. Dealer Listings
    const dealerCount = await DealerListing.countDocuments();
    if (dealerCount === 0) {
      await DealerListing.insertMany([
        {
          id: "dl-101",
          dealerId: "usr_dealer_01",
          dealerName: "Ramesh Agro Store",
          type: "product",
          title: "IFFCO NPK Fertilizer 12:32:16 (50kg)",
          category: "Fertilizers",
          price: 1470,
          unit: "50kg Bag",
          description: "High quality primary nutrient fertilizer for all major crops.",
          image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=500&q=80",
          status: "approved",
        },
        {
          id: "dl-102",
          dealerId: "usr_dealer_01",
          dealerName: "Ramesh Agro Store",
          type: "product",
          title: "Certified Hybrid Mustard Seeds",
          category: "Seeds",
          price: 680,
          unit: "1kg Packet",
          description: "High oil content, disease resistant hybrid mustard seeds.",
          image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=500&q=80",
          status: "approved",
        },
      ]);
    }

    // 5. Orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.insertMany([
        {
          id: "ORD-920145",
          userId: "usr_farmer_01",
          userName: "Rajesh Kumar Sharma",
          items: [
            {
              id: "item-1",
              name: "IFFCO NPK Fertilizer (50kg)",
              category: "Fertilizers",
              price: 1470,
              quantity: 2,
              sellerName: "Ramesh Agro Store",
            },
          ],
          totalAmount: 2940,
          paymentMethod: "cod",
          deliveryAddress: "Village Rampur, PO Danapur, Patna - 801503",
          status: "Delivered",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    // 6. KCC Applications
    const kccCount = await KccApplication.countDocuments();
    if (kccCount === 0) {
      await KccApplication.insertMany([
        {
          id: "kcc-801294",
          userId: "usr_farmer_01",
          fullName: "Rajesh Kumar Sharma",
          phone: "9777777777",
          aadhaar: "892014829104",
          address: "Village Rampur, Danapur",
          district: "Patna",
          landSize: "4.5 Acres",
          status: "approved",
          cardNumber: "KCC-BH-2026-1001",
          issueDate: new Date().toISOString().split('T')[0],
          cardTier: "prime",
          paymentStatus: "paid",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    // 7. Labour Types
    const labourTypeCount = await LabourType.countDocuments();
    if (labourTypeCount === 0) {
      await LabourType.insertMany([
        { name: "Harvesting Labour" },
        { name: "Sowing Labour" },
        { name: "Irrigation Labour" },
        { name: "Weeding Labour" },
        { name: "Crop Loading Labour" },
        { name: "Orchard Labour" },
      ]);
    }

    // 8. Pathshala Videos
    const videoCount = await PathshalaVideo.countDocuments();
    if (videoCount === 0) {
      await PathshalaVideo.insertMany([
        {
          id: "vid-1",
          title: "वैज्ञानिक विधि से गेहूं की खेती | Scientific Wheat Farming Techniques",
          youtubeUrl: "https://www.youtube.com/watch?v=co3_pS74L-Q",
          category: "soil",
          description: "इस वीडियो में देखें गेहूं की बुवाई से लेकर कटाई तक की पूरी जानकारी और वैज्ञानिक तरीके।",
          createdAt: new Date().toISOString(),
        },
        {
          id: "vid-2",
          title: "ड्रिप सिंचाई प्रणाली कैसे काम करती है? | Working of Drip Irrigation System",
          youtubeUrl: "https://www.youtube.com/watch?v=FmYj08m52_I",
          category: "water",
          description: "खेतों में ड्रिप सिंचाई (टपक सिंचाई) लगाने के फायदे और उसकी पूरी कार्यप्रणाली।",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    // 9. Labour Bookings
    const labourBookingCount = await LabourBooking.countDocuments();
    if (labourBookingCount === 0) {
      await LabourBooking.insertMany([
        {
          id: "lab-001",
          userName: "Rajesh Kumar Sharma",
          phone: "9777777777",
          labourType: "Harvesting Labour",
          count: 5,
          days: 3,
          startDate: "2026-09-05",
          location: "Danapur, Patna",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    // 10. Machinery Bookings
    const machineryBookingCount = await MachineryBooking.countDocuments();
    if (machineryBookingCount === 0) {
      await MachineryBooking.insertMany([
        {
          id: "mac-001",
          userName: "Rajesh Kumar Sharma",
          phone: "9777777777",
          machineryType: "Mahindra 575 DI Tractor",
          bookingDate: "2026-09-06",
          durationHours: 8,
          location: "Danapur, Patna",
          status: "allotted",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    // 11. Expert Queries
    const expertQueryCount = await ExpertQuery.countDocuments();
    if (expertQueryCount === 0) {
      await ExpertQuery.insertMany([
        {
          id: "exp-001",
          farmerName: "Rajesh Kumar Sharma",
          phone: "9777777777",
          address: "Rampur, Danapur, Patna",
          cropName: "Sharbati Wheat",
          problemDetails: "Need expert guidance on yellow rust disease treatment and recommended bio-pesticides.",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    // 12. Notifications
    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      await Notification.insertMany([
        {
          id: `notif-${Date.now()}-1`,
          userId: 'broadcast',
          title: 'New Order Received 📦',
          message: 'Order #ORD-920145 of ₹2,940 has been placed by Rajesh Kumar Sharma.',
          time: 'Just now',
          read: false,
          isRead: false,
          type: 'success',
          link: '/admin/orders',
          category: 'orders',
          createdAt: new Date().toISOString(),
        },
        {
          id: `notif-${Date.now()}-2`,
          userId: 'broadcast',
          title: 'New Farmer Registered 🌾',
          message: 'Ramesh Kumar (Patna, Bihar) has joined Krivexa platform.',
          time: '15 mins ago',
          read: false,
          isRead: false,
          type: 'info',
          link: '/admin/farmers',
          category: 'account',
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          id: `notif-${Date.now()}-3`,
          userId: 'broadcast',
          title: 'KCC Application Pending Review 💳',
          message: 'Kisan Credit Card application KCC-801294 is awaiting admin verification.',
          time: '1 hour ago',
          read: false,
          isRead: false,
          type: 'warning',
          link: '/admin/card-requests',
          category: 'kcc',
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
      ]);
    }

    // 13. Products Catalog (PRD Market & Admin Catalog)
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany([
        {
          id: 'prd_npk_123216',
          dealerId: 'usr_dealer_01',
          categoryId: 'cat_fertilizers',
          name: 'IFFCO NPK 12:32:16 Fertilizer',
          slug: 'iffco-npk-12-32-16-fertilizer',
          description: 'High-grade primary nutrient complex fertilizer containing Nitrogen, Phosphorus, and Potassium for robust root development and grain filling.',
          brand: 'IFFCO',
          images: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&q=80'],
          unit: '50kg Bag',
          price: 1470,
          discount: 5,
          tax: 5,
          stockQuantity: 180,
          minimumOrderQuantity: 1,
          maximumOrderQuantity: 50,
          status: 'ACTIVE',
          adminApprovalStatus: 'APPROVED',
        },
        {
          id: 'prd_dap_50kg',
          dealerId: 'usr_dealer_01',
          categoryId: 'cat_fertilizers',
          name: 'IFFCO DAP (Di-Ammonium Phosphate) 18:46:0',
          slug: 'iffco-dap-50kg',
          description: 'Essential phosphatic fertilizer for root growth, crop establishment, and early vegetative vigor in rabi and kharif crops.',
          brand: 'IFFCO',
          images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80'],
          unit: '50kg Bag',
          price: 1350,
          discount: 0,
          tax: 5,
          stockQuantity: 240,
          minimumOrderQuantity: 1,
          maximumOrderQuantity: 40,
          status: 'ACTIVE',
          adminApprovalStatus: 'APPROVED',
        },
        {
          id: 'prd_wheat_seeds',
          dealerId: 'usr_dealer_01',
          categoryId: 'cat_seeds',
          name: 'Certified Hybrid Sharbati Wheat Seeds (PBW 550)',
          slug: 'certified-hybrid-sharbati-wheat-seeds',
          description: 'High-yielding, rust-tolerant certified wheat seeds with excellent chapati quality and bold golden grains.',
          brand: 'National Seeds Corp',
          images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80'],
          unit: '40kg Bag',
          price: 1850,
          discount: 8,
          tax: 0,
          stockQuantity: 120,
          minimumOrderQuantity: 1,
          maximumOrderQuantity: 30,
          status: 'ACTIVE',
          adminApprovalStatus: 'APPROVED',
        },
        {
          id: 'prd_mustard_pusa',
          dealerId: 'usr_dealer_01',
          categoryId: 'cat_seeds',
          name: 'Hybrid Mustard Seeds Pusa Bold (High Oil)',
          slug: 'hybrid-mustard-seeds-pusa-bold',
          description: 'High oil percentage (42%) certified hybrid mustard seeds, highly resistant to white rust and aphids.',
          brand: 'Mahyco',
          images: ['https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&q=80'],
          unit: '1kg Packet',
          price: 680,
          discount: 10,
          tax: 0,
          stockQuantity: 350,
          minimumOrderQuantity: 1,
          maximumOrderQuantity: 50,
          status: 'ACTIVE',
          adminApprovalStatus: 'APPROVED',
        },
        {
          id: 'prd_neem_oil',
          dealerId: 'usr_dealer_01',
          categoryId: 'cat_pesticides',
          name: 'Organic Neem Oil Bio-Pesticide 10000 PPM',
          slug: 'organic-neem-oil-bio-pesticide',
          description: '100% natural cold-pressed bio-pesticide for effective control of sucking pests, caterpillars, and fungal pathogens.',
          brand: 'Krivexa Bio',
          images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80'],
          unit: '1L Bottle',
          price: 499,
          discount: 15,
          tax: 5,
          stockQuantity: 95,
          minimumOrderQuantity: 1,
          maximumOrderQuantity: 20,
          status: 'ACTIVE',
          adminApprovalStatus: 'APPROVED',
        },
        {
          id: 'prd_battery_sprayer',
          dealerId: 'usr_dealer_01',
          categoryId: 'cat_machinery',
          name: '16L Dual Battery Knapsack Agriculture Sprayer',
          slug: '16l-dual-battery-knapsack-agriculture-sprayer',
          description: 'Heavy duty rechargeable 12V 12Ah dual motor knapsack sprayer with multiple brass nozzles and adjustable pressure.',
          brand: 'AgriPro',
          images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&q=80'],
          unit: 'Piece',
          price: 2850,
          discount: 12,
          tax: 12,
          stockQuantity: 45,
          minimumOrderQuantity: 1,
          maximumOrderQuantity: 5,
          status: 'ACTIVE',
          adminApprovalStatus: 'APPROVED',
        },
      ]);
    }

    // 14. Support Complaints
    const complaintCount = await Complaint.countDocuments();
    if (complaintCount === 0) {
      await Complaint.insertMany([
        {
          id: 'cmp_101',
          userId: 'usr_farmer_01',
          orderId: 'ORD-920145',
          subject: 'Delivery timing update for Fertilizer order',
          description: 'Kindly inform the expected delivery slot for the IFFCO fertilizer dispatch to Danapur farm address.',
          category: 'delivery',
          status: 'OPEN',
          adminResponse: 'Order is packed and scheduled for delivery tomorrow.',
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    // 15. Platform Settings
    const settingsCount = await PlatformSettings.countDocuments();
    if (settingsCount === 0) {
      await PlatformSettings.create({
        platformName: 'Krivexa Agritech',
        supportEmail: 'support@krivexa.in',
        phone: '+91 9876543210',
        address: 'Patna, Bihar - 800001',
        timezone: 'Asia/Kolkata',
        autoApproveFarmers: false,
        autoApproveDealers: false,
        commissionRatePct: 5,
        maintenanceMode: false,
      });
    }

    res.json({ success: true, message: 'Database Farma successfully seeded with authentic initial records!' });
  } catch (error) {
    console.error('Error seeding DB Farma:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

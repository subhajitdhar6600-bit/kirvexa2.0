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

    res.json({ success: true, message: 'Database Farma successfully seeded with authentic initial records!' });
  } catch (error) {
    console.error('Error seeding DB Farma:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

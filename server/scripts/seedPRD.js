import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import FarmerProfile from '../models/FarmerProfile.js';
import DealerProfile from '../models/DealerProfile.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import CropListing from '../models/CropListing.js';
import PlatformSettings from '../models/PlatformSettings.js';
import { hashPassword } from '../services/authService.js';
import { ROLES, USER_STATUS, KCC_STATUS, PRODUCT_STATUS, CROP_STATUS } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

export const seedPRDData = async () => {
  console.log('[Seed] Initializing PRD Database Seed...');
  await connectDB();

  // 1. Platform Settings
  let settings = await PlatformSettings.findOne();
  if (!settings) {
    settings = await PlatformSettings.create({
      requireKccForFarmerCrops: true,
      requireKccForDealerProducts: true,
      requireProductApproval: false,
      requireCropApproval: false,
      deliveryChargeFlat: 50,
      taxPercentage: 5,
    });
    console.log('[Seed] Platform Settings initialized.');
  }

  // 2. Categories
  const categoriesData = [
    { id: 'cat_seeds', name: 'Seeds', slug: 'seeds', type: 'product', description: 'Certified high yield agricultural seeds' },
    { id: 'cat_fertilizers', name: 'Fertilizers', slug: 'fertilizers', type: 'product', description: 'Bio & chemical fertilizers' },
    { id: 'cat_pesticides', name: 'Pesticides', slug: 'pesticides', type: 'product', description: 'Crop protection & insect control' },
    { id: 'cat_machinery', name: 'Farm Machinery', slug: 'machinery', type: 'product', description: 'Tractors, tillers, sprayers' },
    { id: 'cat_crops_grains', name: 'Grains & Cereals', slug: 'grains', type: 'crop', description: 'Wheat, Paddy, Maize, Barley' },
    { id: 'cat_crops_pulses', name: 'Pulses & Legumes', slug: 'pulses', type: 'crop', description: 'Chana, Moong, Arhar, Masoor' },
  ];

  for (const cat of categoriesData) {
    await Category.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
  }
  console.log('[Seed] Categories seeded.');

  // 3. Admin Account
  const adminPasswordHash = await hashPassword('Admin@123');
  const admin = await User.findOneAndUpdate(
    { phone: '9999999999' },
    {
      id: 'usr_admin_master',
      name: 'Farma Master Admin',
      email: 'admin@farma.com',
      phone: '9999999999',
      passwordHash: adminPasswordHash,
      role: ROLES.ADMIN,
      status: USER_STATUS.ACTIVE,
      kccStatus: KCC_STATUS.APPROVED,
      isVerified: true,
    },
    { upsert: true, new: true }
  );
  console.log('[Seed] Admin user created: admin@farma.com / Admin@123');

  // 4. Approved Dealer Account
  const dealerPasswordHash = await hashPassword('Dealer@123');
  const dealer = await User.findOneAndUpdate(
    { phone: '9888888888' },
    {
      id: 'usr_dealer_01',
      name: 'Ramesh Kumar (Kisan Agro)',
      email: 'dealer@farma.com',
      phone: '9888888888',
      passwordHash: dealerPasswordHash,
      role: ROLES.DEALER,
      status: USER_STATUS.ACTIVE,
      kccStatus: KCC_STATUS.APPROVED,
      businessName: 'Kisan Agro Kendra',
      dealerType: 'all',
      district: 'Patna',
      state: 'Bihar',
      isVerified: true,
    },
    { upsert: true, new: true }
  );

  await DealerProfile.findOneAndUpdate(
    { userId: dealer.id },
    {
      userId: dealer.id,
      businessName: 'Kisan Agro Kendra',
      dealerType: 'all',
      gstNumber: '10AAAAA0000A1Z5',
      shopAddress: {
        addressLine: 'Main Market Road, Bihta',
        district: 'Patna',
        state: 'Bihar',
        pincode: '801103',
      },
      isVerifiedByAdmin: true,
    },
    { upsert: true }
  );

  // 5. Dealer Products
  const sampleProducts = [
    {
      id: 'prd_wheat_hd3086',
      dealerId: dealer.id,
      categoryId: 'cat_seeds',
      name: 'Certified Wheat Seeds (HD-3086)',
      slug: 'certified-wheat-seeds-hd-3086',
      brand: 'ICAR Certified',
      description: 'High yielding rust resistant wheat seeds suitable for Bihar agro-climatic conditions.',
      images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600'],
      unit: 'bag',
      price: 950,
      discount: 10, // 10% discount
      tax: 5,
      stockQuantity: 150,
      minimumOrderQuantity: 1,
      status: PRODUCT_STATUS.ACTIVE,
      adminApprovalStatus: 'APPROVED',
    },
    {
      id: 'prd_bio_npk',
      dealerId: dealer.id,
      categoryId: 'cat_fertilizers',
      name: 'Organic Bio-NPK Growth Enhancer',
      slug: 'organic-bio-npk-growth-enhancer',
      brand: 'BioAgro Solutions',
      description: 'Enriched organic fertilizer improving soil fertility, root development, and yield.',
      images: ['https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600'],
      unit: 'packet',
      price: 450,
      discount: 5,
      tax: 5,
      stockQuantity: 200,
      minimumOrderQuantity: 2,
      status: PRODUCT_STATUS.ACTIVE,
      adminApprovalStatus: 'APPROVED',
    },
    {
      id: 'prd_power_sprayer',
      dealerId: dealer.id,
      categoryId: 'cat_machinery',
      name: '16L Battery Operated Crop Sprayer',
      slug: '16l-battery-operated-crop-sprayer',
      brand: 'Kisan Shakti',
      description: 'Heavy duty rechargeable 12V 12Ah battery sprayer with multiple brass nozzles.',
      images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600'],
      unit: 'piece',
      price: 3200,
      discount: 15,
      tax: 12,
      stockQuantity: 25,
      minimumOrderQuantity: 1,
      status: PRODUCT_STATUS.ACTIVE,
      adminApprovalStatus: 'APPROVED',
    },
  ];

  for (const prd of sampleProducts) {
    await Product.findOneAndUpdate({ id: prd.id }, prd, { upsert: true });
  }
  console.log('[Seed] Sample Dealer products seeded.');

  // 6. Approved Farmer Account with Crop Listing
  const farmerPasswordHash = await hashPassword('Farmer@123');
  const approvedFarmer = await User.findOneAndUpdate(
    { phone: '9777777777' },
    {
      id: 'usr_farmer_approved_01',
      name: 'Sunil Prasad',
      email: 'farmer@farma.com',
      phone: '9777777777',
      passwordHash: farmerPasswordHash,
      role: ROLES.FARMER,
      status: USER_STATUS.ACTIVE,
      kccStatus: KCC_STATUS.APPROVED,
      district: 'Muzaffarpur',
      state: 'Bihar',
      village: 'Kanti',
      isVerified: true,
    },
    { upsert: true, new: true }
  );

  await FarmerProfile.findOneAndUpdate(
    { userId: approvedFarmer.id },
    {
      userId: approvedFarmer.id,
      landSizeAcres: 5.5,
      primaryCrops: ['Paddy', 'Wheat', 'Maize'],
      farmingType: 'conventional',
      addresses: [
        {
          id: 'addr_farmer_01',
          title: 'Farm House',
          addressLine: 'Village Kanti, Near Kali Mandir',
          district: 'Muzaffarpur',
          state: 'Bihar',
          pincode: '843109',
          isDefault: true,
        },
      ],
    },
    { upsert: true }
  );

  // Crop listing from approved farmer
  await CropListing.findOneAndUpdate(
    { id: 'crp_paddy_sharbati_01' },
    {
      id: 'crp_paddy_sharbati_01',
      farmerId: approvedFarmer.id,
      categoryId: 'cat_crops_grains',
      cropName: 'Sharbati Paddy (Premium Basmati)',
      cropVariety: 'Sharbati 1121',
      description: 'Clean harvested, sun dried aromatic Sharbati paddy with low moisture content (<12%).',
      quantity: 120,
      initialQuantity: 120,
      unit: 'quintal',
      expectedPrice: 3250,
      qualityGrade: 'A+',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600'],
      location: {
        village: 'Kanti',
        district: 'Muzaffarpur',
        state: 'Bihar',
      },
      status: CROP_STATUS.ACTIVE,
      adminApprovalStatus: 'APPROVED',
    },
    { upsert: true }
  );
  console.log('[Seed] Approved Farmer & Crop Listing created.');

  // 7. Unverified Farmer Account (for testing KCC flow)
  await User.findOneAndUpdate(
    { phone: '9666666666' },
    {
      id: 'usr_farmer_unverified_02',
      name: 'Ajay Verma (New Farmer)',
      email: 'newfarmer@farma.com',
      phone: '9666666666',
      passwordHash: farmerPasswordHash,
      role: ROLES.FARMER,
      status: USER_STATUS.ACTIVE,
      kccStatus: KCC_STATUS.NOT_APPLIED,
      district: 'Gaya',
      state: 'Bihar',
      village: 'Bodhgaya',
    },
    { upsert: true, new: true }
  );
  console.log('[Seed] New unverified Farmer created: newfarmer@farma.com / Farmer@123 (KCC: NOT_APPLIED)');

  console.log('=======================================================');
  console.log('✅ PRD Database Seed Completed Successfully!');
  console.log('=======================================================');
};

// If run directly via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedPRDData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default seedPRDData;

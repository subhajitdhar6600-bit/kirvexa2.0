import mongoose from 'mongoose';
import User from '../models/User.js';

const uri = 'mongodb://root:sg9Xo1IlsyuVyGbqPBrIc4JneLSKsTldKZcjWXFSK7ZvB0hsun38mxELV1BgGA0Z@187.127.157.13:8236/Farma?authSource=admin&directConnection=true';

async function cleanUsers() {
  await mongoose.connect(uri);
  console.log('[Clean Users] Connected to remote MongoDB.');

  // Delete automated test script artifacts
  const delRes = await User.deleteMany({
    $or: [
      { id: { $regex: 'test' } },
      { name: { $regex: 'Test' } },
      { fullName: { $regex: 'Test' } },
      { phone: { $regex: '^91[0-9]{8}$' } },
    ]
  });
  console.log(`[Clean Users] Deleted ${delRes.deletedCount} automated test users.`);

  // Seed authentic, realistic platform users across roles
  const authenticUsers = [
    {
      id: 'usr_admin_master',
      fullName: 'Platform Admin',
      name: 'Platform Admin',
      email: 'admin@farma.com',
      phone: '9999999999',
      role: 'admin',
      district: 'Patna',
      state: 'Bihar',
      status: 'active',
      isActive: true,
      verificationStatus: 'Verified',
      isPhoneVerified: true,
    },
    {
      id: 'usr_dealer_01',
      fullName: 'Ramesh Kumar',
      name: 'Ramesh Kumar',
      businessName: 'Kisan Agro Kendra',
      dealerType: 'Wholesaler & Retailer',
      email: 'dealer@farma.com',
      phone: '9888888888',
      role: 'dealer',
      district: 'Patna',
      state: 'Bihar',
      village: 'Danapur Market',
      status: 'active',
      isActive: true,
      verificationStatus: 'Verified',
      isPhoneVerified: true,
    },
    {
      id: 'usr_dealer_02',
      fullName: 'Manoj Gupta',
      name: 'Manoj Gupta',
      businessName: 'Bihar Beej & Khad Bhandar',
      dealerType: 'Fertilizers & Seeds Dealer',
      email: 'manoj.gupta@agrobharat.in',
      phone: '9555555555',
      role: 'dealer',
      district: 'Muzaffarpur',
      state: 'Bihar',
      village: 'Brahmpura',
      status: 'active',
      isActive: true,
      verificationStatus: 'Verified',
      isPhoneVerified: true,
    },
    {
      id: 'usr_farmer_approved_01',
      fullName: 'Sunil Prasad',
      name: 'Sunil Prasad',
      email: 'sunil.prasad@gmail.com',
      phone: '9777777777',
      role: 'farmer',
      district: 'Muzaffarpur',
      state: 'Bihar',
      village: 'Kanti',
      occupation: 'Paddy & Mustard Farming',
      landSize: '4.5 Acres',
      status: 'active',
      isActive: true,
      verificationStatus: 'Verified',
      isPhoneVerified: true,
    },
    {
      id: 'usr_farmer_02',
      fullName: 'Mahesh Singh',
      name: 'Mahesh Singh',
      email: 'mahesh.singh88@gmail.com',
      phone: '9123456789',
      role: 'farmer',
      district: 'Nalanda',
      state: 'Bihar',
      village: 'Chandi',
      occupation: 'Vegetables & Wheat Farming',
      landSize: '6.0 Acres',
      status: 'active',
      isActive: true,
      verificationStatus: 'Verified',
      isPhoneVerified: true,
    },
    {
      id: 'usr_farmer_03',
      fullName: 'Ajay Verma',
      name: 'Ajay Verma',
      email: 'ajay.verma@biharfarmers.org',
      phone: '9666666666',
      role: 'farmer',
      district: 'Rohtas',
      state: 'Bihar',
      village: 'Bikramganj',
      occupation: 'Wheat & Pulses Cultivation',
      landSize: '3.8 Acres',
      status: 'active',
      isActive: true,
      verificationStatus: 'Verified',
      isPhoneVerified: true,
    },
    {
      id: 'usr_farmer_04',
      fullName: 'Rajesh Kumar Sharma',
      name: 'Rajesh Kumar Sharma',
      email: 'rajesh.sharma@patnafarms.com',
      phone: '9876543210',
      role: 'farmer',
      district: 'Patna',
      state: 'Bihar',
      village: 'Rampur, Danapur',
      occupation: 'Certified Organic Farming',
      landSize: '8.2 Acres',
      status: 'active',
      isActive: true,
      verificationStatus: 'Verified',
      isPhoneVerified: true,
    },
    {
      id: 'usr_service_01',
      fullName: 'Shakti Agro Machinery Services',
      name: 'Vikram Choudhary',
      businessName: 'Shakti Custom Hiring Center',
      email: 'shakti.chc@biharagri.gov.in',
      phone: '9444444444',
      role: 'service_provider',
      district: 'Gaya',
      state: 'Bihar',
      village: 'Dobhi Block',
      occupation: 'Tractor & Harvester Rental Services',
      status: 'active',
      isActive: true,
      verificationStatus: 'Verified',
      isPhoneVerified: true,
    },
  ];

  for (const u of authenticUsers) {
    await User.findOneAndUpdate({ phone: u.phone }, u, { upsert: true, new: true });
  }

  const allCount = await User.countDocuments();
  console.log(`[Clean Users] Total clean authentic users in Farma: ${allCount}`);
  await mongoose.disconnect();
}

cleanUsers().catch(console.error);

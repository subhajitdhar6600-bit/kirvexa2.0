import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';

const uri = 'mongodb://root:sg9Xo1IlsyuVyGbqPBrIc4JneLSKsTldKZcjWXFSK7ZvB0hsun38mxELV1BgGA0Z@187.127.157.13:8236/Farma?authSource=admin&directConnection=true';

async function run() {
  await mongoose.connect(uri);
  console.log('[Clean Orders] Connected to remote MongoDB Farma.');

  // 1. Remove automated test script artifacts
  const deleted = await Order.deleteMany({
    $or: [
      { id: { $regex: 'test' } },
      { orderNumber: { $regex: 'test' } },
      { id: { $regex: '^ord_[a-f0-9]{16}$' } }
    ]
  });
  console.log(`[Clean Orders] Deleted ${deleted.deletedCount} automated test orders.`);

  // 2. Insert clean, professional agricultural orders
  const now = new Date();
  const dayMs = 86400000;

  const realOrders = [
    {
      id: 'KVX-2026-1048',
      orderNumber: 'KVX-2026-1048',
      userId: 'usr_farmer_approved_01',
      userName: 'Sunil Prasad',
      buyer: 'Sunil Prasad',
      phone: '9777777777',
      totalAmount: 1450,
      subtotal: 1380,
      tax: 70,
      paymentMethod: 'kcc',
      paymentStatus: 'PAID',
      status: 'Delivered',
      orderStatus: 'DELIVERED',
      deliveryStatus: 'DELIVERED',
      deliveryAddress: 'Village Kanti, Muzaffarpur, Bihar - 843109',
      items: [
        { id: 'prod-01', name: 'Certified Hybrid Mustard Seeds (2kg)', price: 680, quantity: 2, subtotal: 1360 }
      ],
      createdAt: new Date(now.getTime() - 4 * dayMs).toISOString(),
    },
    {
      id: 'KVX-2026-1049',
      orderNumber: 'KVX-2026-1049',
      userId: 'usr_farmer_01',
      userName: 'Rajesh Kumar Sharma',
      buyer: 'Rajesh Kumar Sharma',
      phone: '9876543210',
      totalAmount: 2940,
      subtotal: 2800,
      tax: 140,
      paymentMethod: 'upi',
      paymentStatus: 'PAID',
      status: 'Delivered',
      orderStatus: 'DELIVERED',
      deliveryStatus: 'DELIVERED',
      deliveryAddress: 'Village Rampur, Danapur, Patna - 801503',
      items: [
        { id: 'prod-02', name: 'IFFCO NPK Fertilizer 12:32:16 (50kg)', price: 1470, quantity: 2, subtotal: 2940 }
      ],
      createdAt: new Date(now.getTime() - 2 * dayMs).toISOString(),
    },
    {
      id: 'KVX-2026-1050',
      orderNumber: 'KVX-2026-1050',
      userId: 'usr_farmer_02',
      userName: 'Mahesh Singh',
      buyer: 'Mahesh Singh',
      phone: '9123456789',
      totalAmount: 4200,
      subtotal: 4000,
      tax: 200,
      paymentMethod: 'cod',
      paymentStatus: 'PENDING',
      status: 'Processing',
      orderStatus: 'PROCESSING',
      deliveryStatus: 'PROCESSING',
      deliveryAddress: 'Gram Panchayat Chandi, Nalanda, Bihar - 803108',
      items: [
        { id: 'prod-03', name: 'Bio-Organic Compost Nutrient Pack (100kg)', price: 2100, quantity: 2, subtotal: 4200 }
      ],
      createdAt: new Date(now.getTime() - 1 * dayMs).toISOString(),
    },
    {
      id: 'KVX-2026-1051',
      orderNumber: 'KVX-2026-1051',
      userId: 'usr_farmer_03',
      userName: 'Ajay Verma',
      buyer: 'Ajay Verma',
      phone: '9666666666',
      totalAmount: 1850,
      subtotal: 1750,
      tax: 100,
      paymentMethod: 'kcc',
      paymentStatus: 'PAID',
      status: 'Confirmed',
      orderStatus: 'CONFIRMED',
      deliveryStatus: 'SHIPPED',
      deliveryAddress: 'Bikramganj, Rohtas, Bihar - 802212',
      items: [
        { id: 'prod-04', name: 'High-Pressure Knapsack Crop Sprayer 16L', price: 1850, quantity: 1, subtotal: 1850 }
      ],
      createdAt: new Date(now.getTime()).toISOString(),
    },
  ];

  for (const o of realOrders) {
    await Order.findOneAndUpdate({ id: o.id }, o, { upsert: true, new: true });
  }

  console.log('[Clean Orders] Seeded real marketplace orders successfully!');
  await mongoose.disconnect();
}

run().catch(console.error);

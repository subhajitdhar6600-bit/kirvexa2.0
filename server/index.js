import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// PRD Modular Routes
import authRoutes from './routes/auth.js';
import farmerRoutes from './routes/farmer.js';
import dealerRoutes from './routes/dealer.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import cropRoutes from './routes/crops.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import complaintRoutes from './routes/complaints.js';
import notificationRoutes from './routes/notifications.js';

// Legacy / Auxiliary Routes for Backward Compatibility
import healthRoutes from './routes/health.js';
import seedRoutes from './routes/seed.js';
import userRoutes from './routes/users.js';
import kccRoutes from './routes/kcc.js';
import labourRoutes from './routes/labour.js';
import machineryRoutes from './routes/machinery.js';
import expertRoutes from './routes/expert.js';
import mandiRoutes from './routes/mandi.js';
import pathshalaRoutes from './routes/pathshala.js';
import cardRoutes from './routes/cards.js';
import registeredFarmersRoutes from './routes/farmers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB Database
connectDB();

// Ensure MongoDB connection is established on every request (critical for Vercel serverless)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// PRD Primary API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notifications', notificationRoutes);

// Legacy Auxiliary Routes
app.use('/api/health', healthRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kcc', kccRoutes);
app.use('/api/labour', labourRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/expert', expertRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/pathshala', pathshalaRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/farmers', registeredFarmersRoutes);

// Root Health & Metadata
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Farma Web Farmer & Dealer Agricultural Marketplace API Running',
    version: '2.0.0',
    docs: '/api/health',
  });
});

// Centralized Error Handling Middleware (PRD Section 30)
app.use((err, req, res, next) => {
  console.error(`[Unhandled Error] ${err.stack || err.message}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'An unexpected internal server error occurred.',
    errors: err.errors || [],
  });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`ð¾ Farma Agricultural Marketplace Backend API on port ${PORT}`);
    console.log(`ð Database URL: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/Farma'}`);
    console.log(`=======================================================`);
  });
}

export default app;

import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = mongoose.connection.readyState;

  res.json({
    status: 'ok',
    database: 'Farma',
    connectionState: states[dbState] || 'unknown',
    isConnected: dbState === 1,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/Farma',
    timestamp: new Date().toISOString(),
  });
});

export default router;

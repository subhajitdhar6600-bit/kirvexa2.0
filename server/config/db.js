import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Farma';
  try {
    const options = {
      dbName: process.env.MONGODB_DB_NAME || 'Farma',
      authSource: process.env.MONGODB_AUTH_SOURCE || 'admin',
    };

    const conn = await mongoose.connect(mongoURI, options);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    // Log warning instead of immediate crash so server can attempt reconnect or state fallback
    return null;
  }
};

export default connectDB;


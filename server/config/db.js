import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Farma';

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      dbName: process.env.MONGODB_DB_NAME || 'Farma',
      authSource: process.env.MONGODB_AUTH_SOURCE || 'admin',
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      bufferCommands: false, // Disable buffering so errors surface immediately instead of hanging 10s
    };

    cached.promise = mongoose.connect(mongoURI, options).then((conn) => {
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
      console.log(`[MongoDB] Database Name: ${conn.connection.name}`);
      return conn;
    }).catch((error) => {
      cached.promise = null;
      console.error(`[MongoDB Error] Connection failed: ${error.message}`);
      return null;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;


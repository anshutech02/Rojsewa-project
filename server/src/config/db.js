import mongoose from 'mongoose';
import { setMongoConnected } from '../utils/modelProxy.js';

const connectDB = async () => {
  try {
    // Disable buffering so mongoose operations fail fast if mongo is down
    mongoose.set('bufferCommands', false);

    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000, // 2 seconds timeout
    });
    
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    setMongoConnected(true);
  } catch (error) {
    console.error(`⚠️ MongoDB connection failed: ${error.message}`);
    console.log('📂 Falling back to local file-based database (JSON files)...');
    setMongoConnected(false);
  }
};

export default connectDB;

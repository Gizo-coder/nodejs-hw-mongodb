// scripts/testConnect.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('MONGO_URI (masked):', uri ? uri.slice(0,40) + '...' : 'MONGO_URI not set');

const tryConnect = async () => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Mongoose connected successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('🔥 Connection failed — error.message:', err.message);
    // detaylı hata
    console.error(err);
    process.exit(1);
  }
};

tryConnect();

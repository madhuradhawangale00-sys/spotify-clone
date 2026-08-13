import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ Error: MONGODB_URI is not defined in your server/.env file.');
      process.exit(1);
    }

    try {
      const conn = await mongoose.connect(uri);
      console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (primaryError) {
      console.warn(`⚠️ Primary MongoDB Connection failed (${primaryError.message}). Attempting fallback connection...`);
      // Fallback connection to local MongoDB
      const fallbackUri = 'mongodb://localhost:27017/spotify_clone';
      const conn = await mongoose.connect(fallbackUri);
      console.log(`🍃 Connected to Local MongoDB Fallback: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectdb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("🔌 Connecting to:", MONGODB_URI);

    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast if no connection
    })
    .then((mongoose) => {
      console.log("✅ MongoDB connected");
      return mongoose;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectdb;

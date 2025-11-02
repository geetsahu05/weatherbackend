import mongoose from "mongoose";

export default async function connectDB() {
  const uri = "mongodb+srv://geetsahu1852005_db_user:AxFAOU2z1E8lxM2n@cluster1.zuzlzqv.mongodb.net/?appName=Cluster1";
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

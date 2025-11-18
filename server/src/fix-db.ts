import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const fixDatabase = async () => {
  console.log("🔧 Connecting to MongoDB...");
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected.");

    console.log("🗑️ Attempting to delete the bad 'inviteCode' index...");
    
    // This command forces MongoDB to delete the strict rule
    try {
      await mongoose.connection.collection("couples").dropIndex("inviteCode_1");
      console.log("🎉 SUCCESS: The bad index was deleted!");
    } catch (err: any) {
      if (err.code === 27) {
        console.log("ℹ️ Index not found (It might be already fixed).");
      } else {
        console.error("⚠️ Error dropping index:", err.message);
      }
    }

    // Optional: Clear broken data just to be safe
    // await mongoose.connection.collection("couples").deleteMany({});
    // await mongoose.connection.collection("users").deleteMany({});
    // console.log("🧹 Cleaned up old data.");

  } catch (error) {
    console.error("❌ Connection Error:", error);
  } finally {
    console.log("👋 Closing connection.");
    await mongoose.connection.close();
    process.exit();
  }
};

fixDatabase();
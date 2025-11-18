import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

console.log("🔍 Testing Cloudinary Connection...");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Present ✅" : "Missing ❌");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Try to verify credentials by listing resources
cloudinary.api.ping()
  .then((res) => {
    console.log("✅ SUCCESS! Connected to Cloudinary.");
    console.log("Response:", res);
  })
  .catch((err) => {
    console.error("❌ FAILED to connect.");
    console.error("Error Code:", err.http_code);
    console.error("Message:", err.message);
  });
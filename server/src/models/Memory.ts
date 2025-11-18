import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    coupleId: { type: mongoose.Schema.Types.ObjectId, ref: "Couple", required: true },
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true }, // Needed to delete image later
    caption: { type: String, default: "" },
  },
  { timestamps: true }
);

const Memory = mongoose.model("Memory", memorySchema);
export default Memory;
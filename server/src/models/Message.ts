import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    coupleId: { type: mongoose.Schema.Types.ObjectId, ref: "Couple", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["text", "image"], default: "text" },
  },
  { timestamps: true }
);

// Index for fast history fetching (Air Alien Optimization 🚀)
messageSchema.index({ coupleId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
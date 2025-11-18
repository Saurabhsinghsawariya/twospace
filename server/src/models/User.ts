import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    coupleId: { type: mongoose.Schema.Types.ObjectId, ref: "Couple", default: null },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const User = mongoose.model("User", userSchema);
export default User;
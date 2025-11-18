import mongoose from "mongoose";

const coupleSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    inviteCode: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls if needed
  },
  { timestamps: true }
);

const Couple = mongoose.model("Couple", coupleSchema);
export default Couple;
import mongoose from "mongoose";

const diaryEntrySchema = new mongoose.Schema(
  {
    coupleId: { type: mongoose.Schema.Types.ObjectId, ref: "Couple", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    mood: { type: String, default: "😊" }, // Emojis: 😊, 😢, ❤️, 🔥, 😴
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema);
export default DiaryEntry;
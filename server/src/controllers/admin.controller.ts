import { NextFunction, Request, Response } from "express";
import Couple from "../models/Couple";
import DiaryEntry from "../models/DiaryEntry";
import Memory from "../models/Memory";
import Message from "../models/Message";
import User from "../models/User";

// @desc    Get System Stats
// @route   GET /api/admin/stats
export const getSystemStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCount = await User.countDocuments();
    const messageCount = await Message.countDocuments();
    const coupleCount = await Couple.countDocuments();
    const memoryCount = await Memory.countDocuments();
    const diaryCount = await DiaryEntry.countDocuments();

    res.json({
      users: userCount,
      messages: messageCount,
      couples: coupleCount,
      memories: memoryCount,
      diaryEntries: diaryCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    NUCLEAR OPTION: Reset Messages & Chat
// @route   POST /api/admin/reset-chat
export const resetChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Deletes all messages but keeps users/couples intact
    await Message.deleteMany({});
    res.json({ message: "💥 Chat History Wiped Successfully" });
  } catch (error) {
    next(error);
  }
};
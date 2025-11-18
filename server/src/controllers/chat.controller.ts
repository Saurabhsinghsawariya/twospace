import { NextFunction, Request, Response } from "express";
import Message from "../models/Message";

// @desc    Get Chat History
// @route   GET /api/chat/:coupleId
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { coupleId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 50; // Load 50 messages at a time

    const messages = await Message.find({ coupleId })
      .sort({ createdAt: -1 }) // Newest first
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("senderId", "name avatarUrl");

    // Reverse to show oldest -> newest in the UI
    res.json(messages.reverse());
  } catch (error) {
    next(error);
  }
};
import { NextFunction, Request, Response } from "express";
import DiaryEntry from "../models/DiaryEntry";
import { getIO } from "../socket"; // <--- Import

export const getEntries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const coupleId = req.user.coupleId;
    const entries = await DiaryEntry.find({ coupleId })
      .sort({ date: -1 })
      .populate("authorId", "name");
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

export const createEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, mood, date } = req.body;
    // @ts-ignore
    const user = req.user;

    const entry = await DiaryEntry.create({
      coupleId: user.coupleId,
      authorId: user._id,
      title,
      content,
      mood,
      date: date || Date.now(),
    });

    // 🔔 NOTIFY EVERYONE
    try {
        getIO().to(user.coupleId.toString()).emit("refreshDiary");
    } catch (e) {}

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const user = req.user; // Need user to get coupleId for room emission
    
    await DiaryEntry.findByIdAndDelete(id);

    // 🔔 NOTIFY EVERYONE OF DELETION
    try {
         getIO().to(user.coupleId.toString()).emit("refreshDiary");
    } catch (e) {}

    res.json({ message: "Entry deleted" });
  } catch (error) {
    next(error);
  }
};
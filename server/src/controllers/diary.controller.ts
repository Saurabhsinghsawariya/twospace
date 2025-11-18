import { NextFunction, Request, Response } from "express";
import DiaryEntry from "../models/DiaryEntry";

// @desc    Get All Entries
// @route   GET /api/diary
export const getEntries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const coupleId = req.user.coupleId;
    const entries = await DiaryEntry.find({ coupleId })
      .sort({ date: -1 }) // Newest first
      .populate("authorId", "name");
    
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

// @desc    Create Entry
// @route   POST /api/diary
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

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Entry
// @route   DELETE /api/diary/:id
export const deleteEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await DiaryEntry.findByIdAndDelete(id);
    res.json({ message: "Entry deleted" });
  } catch (error) {
    next(error);
  }
};
import crypto from "crypto"; // Built-in Node module for random strings
import { NextFunction, Request, Response } from "express";
import Couple from "../models/Couple";
import User from "../models/User";

// Helper: Generate 6-digit code
const generateCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g., "A1B2C3"
};

// @desc    Generate Invite Code
// @route   POST /api/couple/generate
export const generateInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore - req.user comes from middleware
    const userId = req.user._id;

    const code = generateCode();

    // Create new Couple with just this user
    const newCouple = await Couple.create({
      users: [userId],
      inviteCode: code,
    });

    // Update User with this coupleId
    await User.findByIdAndUpdate(userId, { coupleId: newCouple._id });

    res.status(201).json({
      coupleId: newCouple._id,
      inviteCode: code,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join via Invite Code
// @route   POST /api/couple/join
export const joinCouple = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { inviteCode } = req.body;
    // @ts-ignore
    const userId = req.user._id;

    // Find couple with this code
    const couple = await Couple.findOne({ inviteCode });

    if (!couple) {
      res.status(404);
      throw new Error("Invalid Invite Code");
    }

    if (couple.users.length >= 2) {
      res.status(400);
      throw new Error("This couple is already full!");
    }

    // Add user to couple
    couple.users.push(userId);
    couple.inviteCode = undefined; // Clear code so no one else can join
    await couple.save();

    // Update User
    await User.findByIdAndUpdate(userId, { coupleId: couple._id });

    res.status(200).json({
      message: "Connected successfully! ❤️",
      coupleId: couple._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User Data (Polished for Dashboard)
// @route   GET /api/couple/me
export const getMyStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = await User.findById(req.user._id).populate("coupleId");
    res.json(user);
  } catch (error) {
    next(error);
  }
};
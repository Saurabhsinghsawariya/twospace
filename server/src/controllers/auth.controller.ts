import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema";
import generateToken from "../utils/generateToken";

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input
    const result = RegisterSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400);
      // 🛠 FIX: Use 'issues' instead of 'errors' to satisfy TypeScript
      throw new Error(result.error.issues[0].message);
    }

    const { name, email, password } = result.data;

    // 2. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        coupleId: user.coupleId,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400);
      // 🛠 FIX: Use 'issues' instead of 'errors' here too
      throw new Error(result.error.issues[0].message);
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email });

    // 🛡️ Safer Check: Ensure user AND user.password exist
    if (!user || !user.password) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (await bcrypt.compare(password, user.password)) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        coupleId: user.coupleId,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / Clear cookie
// @route   POST /api/auth/logout
export const logoutUser = (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
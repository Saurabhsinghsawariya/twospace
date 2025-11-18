import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Extend the Express Request type to include the user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // 1. Read the token from the HTTP-Only Cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // 2. Verify the token using your secret
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // 3. Fetch the user from DB (exclude password) and attach to req object
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};
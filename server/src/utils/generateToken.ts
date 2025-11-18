import { Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (res: Response, userId: any) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });

  // Set HTTP-Only Cookie (The "Air Alien" Security Layer)
  res.cookie("jwt", token, {
    httpOnly: true, // Client-side JS cannot read this (Prevents XSS)
    secure: process.env.NODE_ENV !== "development", // Use HTTPS in prod
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
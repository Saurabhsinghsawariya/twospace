import { NextFunction, Request, Response } from "express";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
    next(); // You are the chosen one. Proceed.
  } else {
    res.status(403); // Forbidden
    throw new Error("⛔ Access Denied: You are not the Admin.");
  }
};
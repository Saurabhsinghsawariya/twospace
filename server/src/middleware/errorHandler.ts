import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error for the developer
  console.error(err.stack);

  // Send a generic message to the client (don't leak stack traces in prod)
  res.status(500).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
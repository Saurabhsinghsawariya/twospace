import { NextFunction, Request, Response } from "express";
import stream from "stream";
import cloudinary from "../config/cloudinary";
import Memory from "../models/Memory";

// @desc    Upload a new Photo (Stream Method)
// @route   POST /api/memories/upload
export const uploadMemory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }

    // @ts-ignore
    const user = req.user;

    // Create a Promise to handle the stream upload
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const theStream = cloudinary.uploader.upload_stream(
          { folder: "twospace_memories" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        // Pipe the buffer to Cloudinary
        const bufferStream = new stream.PassThrough();
        // @ts-ignore
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(theStream);
      });
    };

    // Await the upload
    const result: any = await uploadStream();

    // Save to DB
    const newMemory = await Memory.create({
      coupleId: user.coupleId,
      uploaderId: user._id,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json(newMemory);
  } catch (error) {
    console.error("❌ Upload Error:", error); // This will print specific errors if it fails
    next(error);
  }
};

// @desc    Get All Memories
// @route   GET /api/memories
export const getMemories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const coupleId = req.user.coupleId;
    const memories = await Memory.find({ coupleId }).sort({ createdAt: -1 });
    res.json(memories);
  } catch (error) {
    next(error);
  }
};
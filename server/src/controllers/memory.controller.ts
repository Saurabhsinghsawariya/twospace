import { NextFunction, Request, Response } from "express";
import stream from "stream";
import cloudinary from "../config/cloudinary";
import Memory from "../models/Memory";
import { getIO } from "../socket"; // <--- Import this

export const uploadMemory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }

    // @ts-ignore
    const user = req.user;

    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const theStream = cloudinary.uploader.upload_stream(
          { folder: "twospace_memories" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        const bufferStream = new stream.PassThrough();
        // @ts-ignore
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(theStream);
      });
    };

    const result: any = await uploadStream();

    const newMemory = await Memory.create({
      coupleId: user.coupleId,
      uploaderId: user._id,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    // 🔔 NOTIFY EVERYONE IN THE COUPLE
    try {
        getIO().to(user.coupleId.toString()).emit("refreshMemories");
    } catch (e) {
        console.error("Socket emit failed", e);
    }

    res.status(201).json(newMemory);
  } catch (error) {
    console.error("Upload Error:", error);
    next(error);
  }
};

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
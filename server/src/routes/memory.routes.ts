import express from "express";
import multer from "multer";
import { getMemories, uploadMemory } from "../controllers/memory.controller";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Store file in memory (RAM) temporarily
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", protect, upload.single("file"), uploadMemory);
router.get("/", protect, getMemories);

export default router;
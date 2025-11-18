import express from "express";
import { getMessages } from "../controllers/chat.controller";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:coupleId", protect, getMessages);

export default router;
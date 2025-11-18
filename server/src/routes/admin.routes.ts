import express from "express";
import { getSystemStats, resetChat } from "../controllers/admin.controller";
import { adminOnly } from "../middleware/adminMiddleware";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Protect ensures they are logged in
// AdminOnly ensures they are YOU
router.get("/stats", protect, adminOnly, getSystemStats);
router.post("/reset-chat", protect, adminOnly, resetChat);

export default router;
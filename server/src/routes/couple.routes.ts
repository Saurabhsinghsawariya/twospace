import express from "express";
import { generateInvite, getMyStatus, joinCouple } from "../controllers/couple.controller";
import { protect } from "../middleware/authMiddleware"; // We will create this next

const router = express.Router();

router.get("/me", protect, getMyStatus);
router.post("/generate", protect, generateInvite);
router.post("/join", protect, joinCouple);

export default router;
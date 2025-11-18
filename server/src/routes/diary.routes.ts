import express from "express";
import { createEntry, deleteEntry, getEntries } from "../controllers/diary.controller";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getEntries);
router.post("/", protect, createEntry);
router.delete("/:id", protect, deleteEntry);

export default router;
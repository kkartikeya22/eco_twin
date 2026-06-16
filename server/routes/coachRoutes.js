import express from "express";
import { getCoachMessage } from "../controllers/coachController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/getCoachMessage", protect, getCoachMessage);

export default router;
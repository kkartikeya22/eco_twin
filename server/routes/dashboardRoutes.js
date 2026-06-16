import express from "express";
import {
  getDailySummary,
  getWeeklySummary,
  getInsights,
} from "../controllers/dashboardController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/daily", protect, getDailySummary);
router.get("/weekly", protect, getWeeklySummary);
router.get("/insights", protect, getInsights);

export default router;
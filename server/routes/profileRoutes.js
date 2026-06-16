import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { getProfile, updateGoal } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/goal", protect, updateGoal);

export default router;

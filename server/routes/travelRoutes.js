import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { upload } from "../middleware/upload.js";

import {
  logTravel,
  importGoogleTimeline,
} from "../controllers/travelController.js";

const router =
  express.Router();

router.post(
  "/manual",
  protect,
  logTravel
);

router.post(
  "/timeline",
  protect,
  upload.single("timeline"),
  importGoogleTimeline
);

export default router;
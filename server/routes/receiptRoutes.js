import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { upload } from "../middleware/upload.js";

import { scanReceipt } from "../controllers/receiptController.js";

const router = express.Router();

router.post(
  "/scan",
  protect,
  upload.single("receipt"),
  scanReceipt
);

export default router;
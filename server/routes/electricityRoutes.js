import express from "express";

import { protect }
from "../middleware/authMiddleware.js";

import { upload }
from "../middleware/upload.js";

import {
  scanElectricityBill,
}
from "../controllers/electricityController.js";

const router = express.Router();

router.post(
  "/scan",
  protect,
  upload.single("bill"),
  scanElectricityBill
);

export default router;
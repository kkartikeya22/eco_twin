import express from "express";

import { protect }
from "../middleware/authMiddleware.js";

import { upload }
from "../middleware/upload.js";

import { scanFood }
from "../controllers/foodController.js";

const router = express.Router();

router.post(
  "/scan",
  protect,
  upload.single("image"),
  scanFood
);

export default router;
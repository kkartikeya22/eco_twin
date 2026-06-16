import cloudinary from "../config/cloudinary.js";
import CarbonEntry from "../models/CarbonEntry.js";
import { recordActivity } from "../services/activityService.js";
import { extractReceiptText }
  from "../services/ocrService.js";
import { analyseReceiptText }
  from "../services/geminiService.js";


export const scanReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Receipt image required",
      });
    }

    const { buffer, mimetype } = req.file;

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "ecotwin/receipts",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const receiptText = await extractReceiptText(buffer);
    if (!receiptText.trim()) {
      return res.status(400).json({
        message:
          "No readable text found in receipt",
      });
    }
    const items = await analyseReceiptText(receiptText);

    if (!Array.isArray(items)) {
      throw new Error(
        "Gemini returned invalid receipt data"
      );
    }

    const totalKgCO2 = items.reduce(
      (sum, item) =>
        sum + Number(item.estimatedKgCO2 || 0),
      0
    );

    const entry = await CarbonEntry.create({
      userId: req.user._id,
      category: "shopping",
      source: "Receipt Scan",
      kgCO2: totalKgCO2,

      metadata: {
        imageUrl: uploadResult.secure_url,
        ocrText: receiptText,
        items,
      },
    });

    const { dailySummary, gamification, newBadges } = await recordActivity(
      req.user,
      "shopping",
      totalKgCO2
    );

    res.status(201).json({
      success: true,
      entry,
      items,
      totalKgCO2,
      dailySummary,
      gamification,
      newBadges,
    });
  } catch (error) {
    console.error("Receipt Scan Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Receipt scan failed",
    });
  }
};
import cloudinary from "../config/cloudinary.js";

import CarbonEntry from "../models/CarbonEntry.js";

import { analyseFood }
from "../services/geminiService.js";

import { recordActivity }
from "../services/activityService.js";

export const scanFood = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Food image required",
      });
    }

    const {
      buffer,
      mimetype,
    } = req.file;

    const uploadResult =
      await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder:
                  "ecotwin/food",
              },
              (
                error,
                result
              ) => {
                if (error)
                  reject(error);
                else
                  resolve(result);
              }
            )
            .end(buffer);
        }
      );

    const analysis =
      await analyseFood(
        buffer,
        mimetype
      );

    const entry =
      await CarbonEntry.create({
        userId:
          req.user._id,

        category: "food",

        source:
          analysis.dish,

        kgCO2:
          analysis.totalKgCO2,

        metadata: {
          imageUrl:
            uploadResult.secure_url,

          analysis,
        },
      });

    const { dailySummary, gamification, newBadges } = await recordActivity(
      req.user,
      "food",
      analysis.totalKgCO2
    );

    res.status(201).json({
      success: true,
      entry,
      analysis,
      dailySummary,
      gamification,
      newBadges,
    });
  } catch (error) {
    console.error(
      "Food Scan Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
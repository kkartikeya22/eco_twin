import cloudinary
from "../config/cloudinary.js";

import CarbonEntry
from "../models/CarbonEntry.js";

import {
  analyseElectricityBill,
}
from "../services/geminiService.js";

import {
  recordActivity,
}
from "../services/activityService.js";

export const scanElectricityBill =
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            "Electricity bill image required",
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
                    "ecotwin/electricity",
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
        await analyseElectricityBill(
          buffer,
          mimetype
        );

      const entry =
        await CarbonEntry.create({
          userId:
            req.user._id,

          category:
            "electricity",

          source:
            "Electricity Bill",

          kgCO2:
            analysis.kgCO2,

          metadata: {
            imageUrl:
              uploadResult.secure_url,

            analysis,
          },
        });

      const { dailySummary, gamification, newBadges } = await recordActivity(
        req.user,
        "electricity",
        analysis.kgCO2
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
        "Electricity Scan Error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };
import CarbonEntry from "../models/CarbonEntry.js";
import { TRAVEL_FACTORS } from "../utils/constants.js";
import { recordActivity } from "../services/activityService.js";
import { updateDailySummary } from "../services/dailySummaryService.js";
import { applyActivityXP, getLevelProgress } from "../services/gamificationService.js";

export const logTravel = async (req, res) => {
  try {
    const { mode, distanceKm, date } = req.body;

    const factor = TRAVEL_FACTORS[mode] ?? 0;

    const kgCO2 = factor * Number(distanceKm);

    const entryDate = date ? new Date(date) : new Date();
    const entryDateStr = entryDate.toISOString().split("T")[0];

    const entry = await CarbonEntry.create({
      userId: req.user._id,
      category: "travel",
      subtype: mode,
      kgCO2,

      // ✅ FIX: required field added
      source: "manual",

      metadata: {
        mode,
        distanceKm,
        factor,
      },

      date: entryDate,
    });

    const { dailySummary, gamification, newBadges } = await recordActivity(
      req.user,
      "travel",
      kgCO2,
      { mode, date: entryDateStr }
    );

    res.status(201).json({
      success: true,
      entry,
      kgCO2,
      dailySummary,
      gamification,
      newBadges,
    });
  } catch (error) {
    console.error("Travel Log Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const importGoogleTimeline = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Timeline JSON required",
      });
    }

    const timeline = JSON.parse(req.file.buffer.toString());

    const activities =
      timeline.timelineObjects?.filter((obj) => obj.activitySegment) || [];

    const modeMap = {
      IN_PASSENGER_VEHICLE: "car",
      ON_BUS: "bus",
      IN_SUBWAY: "metro",
      CYCLING: "bike",
      WALKING: "walk",
      FLYING: "flight",
    };

    const entries = [];
    let totalKgCO2 = 0;

    for (const obj of activities) {
      const seg = obj.activitySegment;

      const mode = modeMap[seg.activityType] || "car";

      const distanceKm = (seg.distance || 0) / 1000;

      const factor = TRAVEL_FACTORS[mode] || 0;

      const kgCO2 = factor * distanceKm;

      if (kgCO2 === 0 && mode === "walk") continue;

      const entryDate = new Date(seg.duration?.startTimestamp || Date.now());
      const entryDateStr = entryDate.toISOString().split("T")[0];

      const entry = await CarbonEntry.create({
        userId: req.user._id,
        category: "travel",
        subtype: mode,
        kgCO2,

        // ✅ FIX: required field added
        source: "google_timeline",

        metadata: {
          mode,
          distanceKm,
        },

        date: entryDate,
      });

      // Credit each trip to the day it actually happened on, so historical
      // imports don't all land on "today".
      await updateDailySummary(req.user._id, "travel", kgCO2, entryDateStr);

      totalKgCO2 += kgCO2;
      entries.push(entry);
    }

    // Grant a single XP/streak update for the import itself (rather than
    // once per historical trip), and skip the "low carbon day" check since
    // the totals are spread across many days.
    let gamification = null;
    let newBadges = [];

    if (entries.length > 0) {
      const result = await applyActivityXP(req.user, { category: "travel" });
      newBadges = result.newBadges;

      const { level, xpIntoLevel, xpForNextLevel } = getLevelProgress(req.user.xp);
      gamification = {
        xp: req.user.xp,
        xpGain: result.xpGain,
        level,
        xpIntoLevel,
        xpForNextLevel,
        streakDays: req.user.streakDays || 0,
        badges: req.user.badges,
      };
    }

    res.json({
      success: true,
      imported: entries.length,
      totalKgCO2,
      entries,
      gamification,
      newBadges,
    });
  } catch (error) {
    console.error("Timeline Import Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
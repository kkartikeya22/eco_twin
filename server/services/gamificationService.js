import {
  XP_PER_LOG,
  XP_LOW_CARBON_TRAVEL_BONUS,
  XP_PER_LEVEL,
  LOW_CARBON_TRAVEL_MODES,
  LOW_CARBON_TRAVEL_BADGE_THRESHOLD,
  LOW_CARBON_DAY_THRESHOLD_KGCO2,
  STREAK_BADGE_THRESHOLDS,
} from "../utils/constants.js";

const todayStr = () => new Date().toISOString().split("T")[0];

const isYesterday = (dateStr, today) => {
  const d = new Date(dateStr);
  const t = new Date(today);
  const diffDays = Math.round((t - d) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

/**
 * Given a user's total XP, derive their level and progress towards the
 * next one. Levelling is a simple flat curve: every XP_PER_LEVEL points
 * is one level.
 */
export const getLevelProgress = (xp = 0) => {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
  };
};

/**
 * Apply XP, streak, and badge updates to a user document after a new
 * carbon entry is logged. Mutates and saves `user`. Does not touch
 * DailySummary — that's handled separately by dailySummaryService.
 *
 * @param {import("mongoose").Document} user - a full User document (not lean)
 * @param {object} options
 * @param {string} options.category - "food" | "travel" | "shopping" | "electricity"
 * @param {string} [options.mode] - travel mode, if category === "travel"
 * @param {number} [options.dailyTotalKgCO2] - the *current* day's running total,
 *   used for the "low carbon day" badge. Pass `undefined` to skip that check
 *   (e.g. for bulk imports spanning many historical days).
 * @returns {Promise<{ xpGain: number, newBadges: string[] }>}
 */
export const applyActivityXP = async (user, options = {}) => {
  const { category, mode, dailyTotalKgCO2 } = options;
  const today = todayStr();
  const newBadges = [];

  if (!Array.isArray(user.badges)) user.badges = [];
  if (!Array.isArray(user.categoriesUsed)) user.categoriesUsed = [];

  // --- XP -----------------------------------------------------------
  let xpGain = XP_PER_LOG;

  if (category === "travel" && LOW_CARBON_TRAVEL_MODES.includes(mode)) {
    xpGain += XP_LOW_CARBON_TRAVEL_BONUS;
    user.lowCarbonTravelCount = (user.lowCarbonTravelCount || 0) + 1;

    if (
      user.lowCarbonTravelCount >= LOW_CARBON_TRAVEL_BADGE_THRESHOLD &&
      !user.badges.includes("green-commuter")
    ) {
      user.badges.push("green-commuter");
      newBadges.push("green-commuter");
    }
  }

  user.xp = (user.xp || 0) + xpGain;

  // --- Streak ---------------------------------------------------------
  if (user.lastLogDate !== today) {
    if (user.lastLogDate && isYesterday(user.lastLogDate, today)) {
      user.streakDays = (user.streakDays || 0) + 1;
    } else {
      user.streakDays = 1;
    }
    user.lastLogDate = today;
  }

  for (const { days, id } of STREAK_BADGE_THRESHOLDS) {
    if (user.streakDays >= days && !user.badges.includes(id)) {
      user.badges.push(id);
      newBadges.push(id);
    }
  }

  // --- Lifetime counters & "explorer" badge ----------------------------
  user.totalEntries = (user.totalEntries || 0) + 1;

  if (user.totalEntries === 1 && !user.badges.includes("first-log")) {
    user.badges.push("first-log");
    newBadges.push("first-log");
  }

  if (category && !user.categoriesUsed.includes(category)) {
    user.categoriesUsed.push(category);
  }

  if (user.categoriesUsed.length >= 4 && !user.badges.includes("explorer")) {
    user.badges.push("explorer");
    newBadges.push("explorer");
  }

  // --- Light footprint day ---------------------------------------------
  if (
    typeof dailyTotalKgCO2 === "number" &&
    dailyTotalKgCO2 > 0 &&
    dailyTotalKgCO2 < LOW_CARBON_DAY_THRESHOLD_KGCO2 &&
    !user.badges.includes("low-carbon-day")
  ) {
    user.badges.push("low-carbon-day");
    newBadges.push("low-carbon-day");
  }

  // --- Level -------------------------------------------------------------
  user.level = getLevelProgress(user.xp).level;

  await user.save();

  return { xpGain, newBadges };
};

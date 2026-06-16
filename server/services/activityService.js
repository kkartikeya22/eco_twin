import { updateDailySummary } from "./dailySummaryService.js";
import { applyActivityXP, getLevelProgress } from "./gamificationService.js";

const todayStr = () => new Date().toISOString().split("T")[0];

/**
 * Record a single logged activity: update the relevant DailySummary and
 * apply XP / streak / badge changes to the user.
 *
 * @param {import("mongoose").Document} user - req.user, a full User document
 * @param {string} category - "food" | "travel" | "shopping" | "electricity"
 * @param {number} kgCO2
 * @param {object} [options]
 * @param {string} [options.mode] - travel mode, for low-carbon travel bonuses
 * @param {string} [options.date] - YYYY-MM-DD the activity actually happened on
 *   (defaults to today). DailySummary is updated for this date.
 * @param {boolean} [options.grantXP=true] - whether to apply gamification at all
 */
export const recordActivity = async (user, category, kgCO2, options = {}) => {
  const { mode, date, grantXP = true } = options;

  const dailySummary = await updateDailySummary(user._id, category, kgCO2, date);

  let xpGain = 0;
  let newBadges = [];

  if (grantXP) {
    const isToday = !date || date === todayStr();

    const result = await applyActivityXP(user, {
      category,
      mode,
      // Only use the running total for the "light footprint day" badge
      // when the activity actually happened today — otherwise the
      // DailySummary total isn't a meaningful "today" figure.
      dailyTotalKgCO2: isToday ? dailySummary.totalKgCO2 : undefined,
    });

    xpGain = result.xpGain;
    newBadges = result.newBadges;
  }

  const { level, xpIntoLevel, xpForNextLevel } = getLevelProgress(user.xp);

  return {
    dailySummary,
    gamification: {
      xp: user.xp,
      xpGain,
      level,
      xpIntoLevel,
      xpForNextLevel,
      streakDays: user.streakDays || 0,
      badges: user.badges,
    },
    newBadges,
  };
};

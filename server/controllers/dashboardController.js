import DailySummary from "../models/DailySummary.js";
import CarbonEntry from "../models/CarbonEntry.js";
import { getLevelProgress } from "../services/gamificationService.js";
import {
  GLOBAL_AVG_DAILY_KGCO2,
  INDIA_AVG_DAILY_KGCO2,
  PARIS_TARGET_DAILY_KGCO2,
  RECOMMENDATIONS,
} from "../utils/constants.js";

export const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "date (YYYY-MM-DD) is required",
      });
    }

    const summary = await DailySummary.findOne({
      userId: req.user._id,
      date,
    });

    if (!summary) {
      return res.json({
        date,
        totalKgCO2: 0,
        byCategory: {
          food: 0,
          travel: 0,
          shopping: 0,
          electricity: 0,
        },
        entries: [],
      });
    }

    const entries = await CarbonEntry.find({
      userId: req.user._id,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      },
    });

    res.json({
      date,
      totalKgCO2: summary.totalKgCO2,
      byCategory: {
        food: summary.food,
        travel: summary.travel,
        shopping: summary.shopping,
        electricity: summary.electricity,
      },
      entries,
    });
  } catch (error) {
    console.error("❌ DailySummary error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getWeeklySummary = async (req, res) => {
  try {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const date = d.toISOString().split("T")[0];

      const summary = await DailySummary.findOne({
        userId: req.user._id,
        date,
      });

      days.push({
        date,
        totalKgCO2: summary?.totalKgCO2 || 0,
      });
    }

    res.json(days);
  } catch (error) {
    console.error("❌ WeeklySummary error:", error);
    res.status(500).json({ message: error.message });
  }
};

/** Returns an array of `n` YYYY-MM-DD date strings ending today (inclusive). */
const lastNDates = (n) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

/**
 * The "Understand & Reduce" hub: this week vs. last week, progress towards
 * the user's personal goal, how they compare to national/global averages,
 * and a short list of personalized, ranked reduction tips.
 */
export const getInsights = async (req, res) => {
  try {
    const user = req.user;
    const today = new Date().toISOString().split("T")[0];

    // Last 14 days: first 7 = "last week", final 7 (incl. today) = "this week"
    const fourteenDates = lastNDates(14);
    const lastWeekDates = fourteenDates.slice(0, 7);
    const thisWeekDates = fourteenDates.slice(7);

    const summaries = await DailySummary.find({
      userId: user._id,
      date: { $in: fourteenDates },
    });

    const byDate = {};
    summaries.forEach((s) => {
      byDate[s.date] = s;
    });

    const sumDays = (dates) => {
      const acc = {
        total: 0,
        food: 0,
        travel: 0,
        shopping: 0,
        electricity: 0,
        loggedDays: 0,
      };

      for (const d of dates) {
        const s = byDate[d];
        if (s) {
          acc.total += s.totalKgCO2;
          acc.food += s.food;
          acc.travel += s.travel;
          acc.shopping += s.shopping;
          acc.electricity += s.electricity;
          if (s.totalKgCO2 > 0) acc.loggedDays += 1;
        }
      }

      return acc;
    };

    const thisWeek = sumDays(thisWeekDates);
    const lastWeek = sumDays(lastWeekDates);

    const todaySummary =
      byDate[today] || { totalKgCO2: 0, food: 0, travel: 0, shopping: 0, electricity: 0 };

    const weekOverWeekChangePercent =
      lastWeek.total > 0
        ? Math.round(((thisWeek.total - lastWeek.total) / lastWeek.total) * 1000) / 10
        : null;

    const dailyAverageThisWeek = thisWeek.total / 7;

    const categoryTotals = {
      food: thisWeek.food,
      travel: thisWeek.travel,
      shopping: thisWeek.shopping,
      electricity: thisWeek.electricity,
    };

    const sortedCategories = Object.entries(categoryTotals)
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1]);

    // Personalized tips, ranked by which categories are driving the
    // footprint this week.
    const recommendations = [];
    for (const [category, value] of sortedCategories.slice(0, 2)) {
      const tips = RECOMMENDATIONS[category] || [];
      for (const tip of tips.slice(0, 2)) {
        recommendations.push({
          category,
          title: tip.title,
          estimatedSavingKgCO2PerWeek: Math.round(value * tip.savingPercent * 100) / 100,
        });
      }
    }

    // Badges that depend on aggregated weekly data rather than a single log.
    const newBadges = [];

    if (
      thisWeek.loggedDays >= 3 &&
      thisWeek.total > 0 &&
      thisWeek.total <= user.weeklyGoalKgCO2 &&
      !user.badges.includes("goal-getter")
    ) {
      user.badges.push("goal-getter");
      newBadges.push("goal-getter");
    }

    if (
      weekOverWeekChangePercent !== null &&
      weekOverWeekChangePercent <= -10 &&
      !user.badges.includes("trend-setter")
    ) {
      user.badges.push("trend-setter");
      newBadges.push("trend-setter");
    }

    if (newBadges.length > 0) {
      await user.save();
    }

    const { level, xpIntoLevel, xpForNextLevel } = getLevelProgress(user.xp);

    res.json({
      today: {
        date: today,
        totalKgCO2: todaySummary.totalKgCO2,
        byCategory: {
          food: todaySummary.food,
          travel: todaySummary.travel,
          shopping: todaySummary.shopping,
          electricity: todaySummary.electricity,
        },
      },
      thisWeek: {
        totalKgCO2: thisWeek.total,
        dailyAverageKgCO2: dailyAverageThisWeek,
        loggedDays: thisWeek.loggedDays,
        byCategory: categoryTotals,
      },
      lastWeek: {
        totalKgCO2: lastWeek.total,
      },
      weekOverWeekChangePercent,
      goal: {
        weeklyGoalKgCO2: user.weeklyGoalKgCO2,
        progressPercent:
          user.weeklyGoalKgCO2 > 0
            ? Math.round((thisWeek.total / user.weeklyGoalKgCO2) * 1000) / 10
            : 0,
        remainingKgCO2: Math.max(
          Math.round((user.weeklyGoalKgCO2 - thisWeek.total) * 100) / 100,
          0
        ),
        onTrack: thisWeek.total <= user.weeklyGoalKgCO2,
      },
      benchmarks: {
        yourDailyAverageKgCO2: Math.round(dailyAverageThisWeek * 100) / 100,
        indiaAvgDailyKgCO2: INDIA_AVG_DAILY_KGCO2,
        globalAvgDailyKgCO2: GLOBAL_AVG_DAILY_KGCO2,
        targetDailyKgCO2_2030: PARIS_TARGET_DAILY_KGCO2,
      },
      recommendations,
      gamification: {
        xp: user.xp,
        level,
        xpIntoLevel,
        xpForNextLevel,
        streakDays: user.streakDays || 0,
        totalEntries: user.totalEntries || 0,
        badges: user.badges,
      },
      newBadges,
    });
  } catch (error) {
    console.error("❌ Insights error:", error);
    res.status(500).json({ message: error.message });
  }
};
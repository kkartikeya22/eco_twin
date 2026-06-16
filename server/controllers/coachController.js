import { generateCoachNote } from "../services/geminiService.js";
import DailySummary from "../models/DailySummary.js";

const lastNDates = (n) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

export const getCoachMessage = async (req, res) => {
  try {
    const { dailySummary } = req.body;

    if (!dailySummary) {
      return res.status(400).json({
        message: "dailySummary is required",
      });
    }

    const thisWeekDates = lastNDates(7);
    const summaries = await DailySummary.find({
      userId: req.user._id,
      date: { $in: thisWeekDates },
    });
    const thisWeekTotalKgCO2 = summaries.reduce((sum, s) => sum + (s.totalKgCO2 || 0), 0);

    const note = await generateCoachNote(req.user.name, dailySummary, {
      weeklyGoalKgCO2: req.user.weeklyGoalKgCO2,
      streakDays: req.user.streakDays,
      thisWeekTotalKgCO2,
    });

    res.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("❌ Coach Controller error:", error);
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};
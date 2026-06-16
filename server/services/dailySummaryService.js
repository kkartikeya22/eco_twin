import DailySummary from "../models/DailySummary.js";

export const updateDailySummary = async (
  userId,
  category,
  kgCO2,
  date
) => {
  const day = date || new Date().toISOString().split("T")[0];

  let summary = await DailySummary.findOne({
    userId,
    date: day,
  });

  if (!summary) {
    summary = await DailySummary.create({
      userId,
      date: day,
      totalKgCO2: 0,
      food: 0,
      travel: 0,
      shopping: 0,
      electricity: 0,
    });
  }

  summary.totalKgCO2 += kgCO2;

  if (category === "food") {
    summary.food += kgCO2;
  }

  if (category === "travel") {
    summary.travel += kgCO2;
  }

  if (category === "shopping") {
    summary.shopping += kgCO2;
  }

  if (category === "electricity") {
    summary.electricity += kgCO2;
  }

  await summary.save();

  return summary;
};
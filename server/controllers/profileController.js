export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateGoal = async (req, res) => {
  try {
    const { weeklyGoalKgCO2 } = req.body;

    const goal = Number(weeklyGoalKgCO2);

    if (!Number.isFinite(goal) || goal <= 0) {
      return res.status(400).json({
        message: "weeklyGoalKgCO2 must be a positive number",
      });
    }

    req.user.weeklyGoalKgCO2 = goal;
    await req.user.save();

    res.json({
      success: true,
      weeklyGoalKgCO2: req.user.weeklyGoalKgCO2,
    });
  } catch (error) {
    console.error("❌ Update Goal error:", error);
    res.status(500).json({ message: error.message });
  }
};

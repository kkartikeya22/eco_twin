import mongoose from "mongoose";
import { DEFAULT_WEEKLY_GOAL_KGCO2 } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    badges: {
      type: [String],
      default: [],
    },

    ecopetMood: {
      type: String,
      default: "happy",
    },

    // Personal weekly carbon reduction goal, in kg CO2e.
    weeklyGoalKgCO2: {
      type: Number,
      default: DEFAULT_WEEKLY_GOAL_KGCO2,
    },

    // Consecutive days (including today) the user has logged at least one activity.
    streakDays: {
      type: Number,
      default: 0,
    },

    // YYYY-MM-DD of the last day an activity was logged, used to compute streaks.
    lastLogDate: {
      type: String,
      default: null,
    },

    // Total number of carbon entries ever logged, across all categories.
    totalEntries: {
      type: Number,
      default: 0,
    },

    // Distinct categories the user has logged at least once (for the "explorer" badge).
    categoriesUsed: {
      type: [String],
      default: [],
    },

    // Count of low-carbon travel logs (walk/bike/bus/metro), for the "green-commuter" badge.
    lowCarbonTravelCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
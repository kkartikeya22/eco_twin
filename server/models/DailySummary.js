import mongoose from "mongoose";

const dailySummarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    totalKgCO2: {
      type: Number,
      default: 0,
    },

    food: {
      type: Number,
      default: 0,
    },

    travel: {
      type: Number,
      default: 0,
    },

    shopping: {
      type: Number,
      default: 0,
    },

    electricity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

dailySummarySchema.index(
  {
    userId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

const DailySummary = mongoose.model(
  "DailySummary",
  dailySummarySchema
);

export default DailySummary;
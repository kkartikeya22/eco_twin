import mongoose from "mongoose";

const carbonEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "travel",
        "food",
        "shopping",
        "electricity",
      ],
      required: true,
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    kgCO2: {
      type: Number,
      required: true,
      min: 0,
    },

    // The calendar date the activity actually happened on (not just when
    // it was logged). Defaults to "now" for scanners that don't supply one;
    // travel logs and timeline imports can backdate this.
    date: {
      type: Date,
      default: Date.now,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const CarbonEntry = mongoose.model(
  "CarbonEntry",
  carbonEntrySchema
);

export default CarbonEntry;
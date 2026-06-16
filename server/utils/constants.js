export const INDIA_GRID_EMISSION_FACTOR = 0.82;
export const TRAVEL_FACTORS = {
  car: 0.21,
  bus: 0.089,
  metro: 0.041,
  bike: 0.021,
  walk: 0,
  flight: 0.255,
};

/* ----------------------------------------------------------------------
 * Reference benchmarks
 * ----------------------------------------------------------------------
 * Approximate per-person figures (kg CO2e / day) used purely to give users
 * context for "is my footprint high or low?". Derived from commonly cited
 * global figures (Global Carbon Project / Our World in Data style
 * estimates): world average ~4.7 t/yr, India average ~1.9 t/yr, and an
 * indicative 1.5°C-aligned per-capita pathway of ~2.3 t/yr by 2030.
 * These are intentionally rounded — they're for orientation, not audits.
 */
export const GLOBAL_AVG_DAILY_KGCO2 = 12.9;
export const INDIA_AVG_DAILY_KGCO2 = 5.2;
export const PARIS_TARGET_DAILY_KGCO2 = 6.3;

export const DEFAULT_WEEKLY_GOAL_KGCO2 = 70;

/* ----------------------------------------------------------------------
 * Gamification
 * ---------------------------------------------------------------------- */
export const XP_PER_LOG = 10;
export const XP_LOW_CARBON_TRAVEL_BONUS = 5;
export const XP_PER_LEVEL = 100;

// Travel modes considered "low carbon" for bonus XP + badges
export const LOW_CARBON_TRAVEL_MODES = ["walk", "bike", "metro", "bus"];
export const LOW_CARBON_TRAVEL_BADGE_THRESHOLD = 5;

// A logged day with a total under this is considered a "light footprint" day
export const LOW_CARBON_DAY_THRESHOLD_KGCO2 = 3;

export const STREAK_BADGE_THRESHOLDS = [
  { days: 3, id: "streak-3" },
  { days: 7, id: "streak-7" },
  { days: 30, id: "streak-30" },
];

// Metadata for every badge a user can earn. `icon` is a key the client
// maps to a real icon component.
export const BADGE_DEFINITIONS = {
  "first-log": {
    label: "First Step",
    description: "Logged your very first activity.",
    icon: "footprints",
  },
  "streak-3": {
    label: "On a Roll",
    description: "Logged activity 3 days in a row.",
    icon: "flame",
  },
  "streak-7": {
    label: "Week Warrior",
    description: "Logged activity 7 days in a row.",
    icon: "flame",
  },
  "streak-30": {
    label: "Habit Builder",
    description: "Logged activity 30 days in a row.",
    icon: "flame",
  },
  "low-carbon-day": {
    label: "Light Footprint",
    description: "Kept a logged day under 3 kg CO2e.",
    icon: "feather",
  },
  "green-commuter": {
    label: "Green Commuter",
    description: "Logged 5 low-carbon trips (walk, bike, bus, or metro).",
    icon: "compass",
  },
  explorer: {
    label: "Full Toolkit",
    description: "Used every EcoTwin tracker at least once.",
    icon: "sparkles",
  },
  "goal-getter": {
    label: "Goal Getter",
    description: "Stayed within your weekly carbon goal.",
    icon: "target",
  },
  "trend-setter": {
    label: "Trend Setter",
    description: "Cut your footprint by 10%+ vs. last week.",
    icon: "trending-down",
  },
};

/* ----------------------------------------------------------------------
 * Personalized recommendations
 * ----------------------------------------------------------------------
 * Simple per-category tips with a rough estimate of how much weekly CO2e
 * could be saved, expressed as a percentage of that category's weekly
 * total. The dashboard surfaces the 1-2 highest-emitting categories with
 * their top tips so suggestions stay relevant to each user.
 */
export const RECOMMENDATIONS = {
  food: [
    {
      title:
        "Swap red meat for chicken, fish, or a plant-based meal twice a week",
      savingPercent: 0.25,
    },
    {
      title: "Choose seasonal, local produce over imported or out-of-season items",
      savingPercent: 0.1,
    },
    {
      title: "Cut back on cheese and dairy-heavy dishes — try a plant-based milk",
      savingPercent: 0.15,
    },
  ],
  travel: [
    {
      title: "Swap one car trip a week for the bus, metro, or a carpool",
      savingPercent: 0.2,
    },
    {
      title: "Walk or cycle for trips under 2 km instead of driving",
      savingPercent: 0.1,
    },
    {
      title: "Combine errands into a single trip to cut total distance",
      savingPercent: 0.08,
    },
  ],
  electricity: [
    {
      title: "Set your AC to 24°C instead of 18°C",
      savingPercent: 0.2,
    },
    {
      title: "Switch to LED bulbs and unplug devices left on standby",
      savingPercent: 0.1,
    },
    {
      title: "Only run washing machines and dishwashers on full loads",
      savingPercent: 0.05,
    },
  ],
  shopping: [
    {
      title: "Buy less packaged and ultra-processed food",
      savingPercent: 0.15,
    },
    {
      title: "Choose products with minimal or recyclable packaging",
      savingPercent: 0.1,
    },
    {
      title: "Plan meals ahead to cut food waste from over-buying",
      savingPercent: 0.12,
    },
  ],
};
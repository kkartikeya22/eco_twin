import {
  IconFootprints,
  IconFlame,
  IconFeather,
  IconCompass,
  IconSparkles,
  IconTarget,
  IconTrendingDown,
  IconAward,
} from "../components/icons";

// Mirrors server/utils/constants.js BADGE_DEFINITIONS. Keep ids in sync.
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

export const BADGE_ICON_MAP = {
  footprints: IconFootprints,
  flame: IconFlame,
  feather: IconFeather,
  compass: IconCompass,
  sparkles: IconSparkles,
  target: IconTarget,
  "trending-down": IconTrendingDown,
  award: IconAward,
};

export function getBadgeMeta(id) {
  return (
    BADGE_DEFINITIONS[id] || {
      label: id,
      description: "",
      icon: "award",
    }
  );
}

export function getBadgeIcon(id) {
  const meta = getBadgeMeta(id);
  return BADGE_ICON_MAP[meta.icon] || IconAward;
}

/** Ordered list of all badge ids, for rendering locked + unlocked together. */
export const ALL_BADGE_IDS = Object.keys(BADGE_DEFINITIONS);

/** Format a kg CO2e value for display, trimming noisy decimals. */
export function formatKg(value, digits = 1) {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 100) return n.toFixed(0);
  return n.toFixed(digits);
}

/** Format a +/- percentage with a sign, e.g. "+12.4%" / "-8%". */
export function formatPercent(value) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

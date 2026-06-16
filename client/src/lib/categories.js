// Shared category metadata so tags, charts, and timeline rows all agree
// on the same labels and Notion-style tag colors.

export const CATEGORY_META = {
  food: {
    label: "Food",
    bg: "var(--color-tag-food-bg)",
    text: "var(--color-tag-food-text)",
    dot: "#4d8f6f",
  },
  travel: {
    label: "Travel",
    bg: "var(--color-tag-travel-bg)",
    text: "var(--color-tag-travel-text)",
    dot: "#4f97c7",
  },
  electricity: {
    label: "Electricity",
    bg: "var(--color-tag-electricity-bg)",
    text: "var(--color-tag-electricity-text)",
    dot: "#d9a73b",
  },
  shopping: {
    label: "Shopping",
    bg: "var(--color-tag-shopping-bg)",
    text: "var(--color-tag-shopping-text)",
    dot: "#9b6fce",
  },
};

export const DEFAULT_CATEGORY = {
  label: "Other",
  bg: "var(--color-tag-default-bg)",
  text: "var(--color-tag-default-text)",
  dot: "#9b9a97",
};

export function getCategoryMeta(key) {
  if (!key) return DEFAULT_CATEGORY;
  const normalized = String(key).toLowerCase();
  return (
    CATEGORY_META[normalized] || {
      ...DEFAULT_CATEGORY,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }
  );
}

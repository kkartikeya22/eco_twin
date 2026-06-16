import { ProgressBar } from "./ui";
import { formatKg } from "../lib/gamification";

/**
 * Horizontal bars comparing the user's current daily average footprint
 * against reference points: a 2030 climate-aligned target, the national
 * average, and the global average. Gives users immediate context for
 * whether their footprint is "high" or "low".
 */
export function BenchmarkBars({ benchmarks, className = "" }) {
  if (!benchmarks) return null;

  const {
    yourDailyAverageKgCO2 = 0,
    indiaAvgDailyKgCO2 = 0,
    globalAvgDailyKgCO2 = 0,
    targetDailyKgCO2_2030 = 0,
  } = benchmarks;

  const items = [
    {
      key: "you",
      label: "You — daily average",
      value: yourDailyAverageKgCO2,
      tone: "brand",
      highlight: true,
    },
    {
      key: "target",
      label: "2030 climate-aligned target",
      value: targetDailyKgCO2_2030,
      tone: "info",
    },
    {
      key: "india",
      label: "India average",
      value: indiaAvgDailyKgCO2,
      tone: "warning",
    },
    {
      key: "global",
      label: "Global average",
      value: globalAvgDailyKgCO2,
      tone: "muted",
    },
  ];

  const max = Math.max(...items.map((i) => i.value), 1) * 1.08;

  return (
    <div className={`space-y-3.5 ${className}`}>
      {items.map((item) => (
        <div key={item.key}>
          <div className="mb-1 flex items-baseline justify-between text-[13px]">
            <span className={item.highlight ? "font-semibold text-ink" : "text-ink-2"}>
              {item.label}
            </span>
            <span className={item.highlight ? "font-semibold text-ink" : "text-ink-3"}>
              {formatKg(item.value)} kg/day
            </span>
          </div>
          <ProgressBar value={item.value} max={max} tone={item.tone} />
        </div>
      ))}
      <p className="pt-1 text-[12px] leading-relaxed text-ink-3">
        Figures are approximate per-person reference points used for context only — not a precise audit.
      </p>
    </div>
  );
}

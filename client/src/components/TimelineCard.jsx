import { getCategoryMeta } from "../lib/categories";
import { Tag } from "./ui";

export default function TimelineCard({ title, subtitle, value, category }) {
  const meta = getCategoryMeta(category);

  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-border bg-canvas px-4 py-3.5 transition-colors hover:bg-hover/60">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: meta.dot }}
        />
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-medium text-ink">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 truncate text-[12.5px] text-ink-3">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Tag label={meta.label} bg={meta.bg} text={meta.text} />
        {value !== undefined && (
          <span className="text-[13.5px] font-semibold text-ink">
            {value} kg CO₂
          </span>
        )}
      </div>
    </div>
  );
}

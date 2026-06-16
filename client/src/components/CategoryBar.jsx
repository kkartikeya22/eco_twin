import { getCategoryMeta } from "../lib/categories";
import { Card, SectionTitle } from "./ui";

export default function CategoryBar({ data, title = "Category breakdown" }) {
  // data = { food: 2.3, travel: 5.1, ... }

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>

      <div className="space-y-4">
        {entries.map(([key, value]) => {
          const percent = total ? (value / total) * 100 : 0;
          const meta = getCategoryMeta(key);

          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: meta.dot }}
                  />
                  {meta.label}
                </span>

                <span className="text-[12.5px] text-ink-2">
                  {value.toFixed(2)} kg
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-hover">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${percent}%`, backgroundColor: meta.dot }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

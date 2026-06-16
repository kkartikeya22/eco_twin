import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import CategoryBar from "../components/CategoryBar";
import TimelineCard from "../components/TimelineCard";
import {
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  PageHeader,
  SectionTitle,
  StatTile,
} from "../components/ui";
import { IconCalendarDay } from "../components/icons";

const MODE_LABELS = {
  car: "Car trip",
  bus: "Bus trip",
  metro: "Metro trip",
  bike: "Bike ride",
  walk: "Walk",
  flight: "Flight",
};

function describeEntry(entry) {
  const meta = entry.metadata || {};

  if (entry.category === "travel") {
    const title = MODE_LABELS[meta.mode] || "Trip";
    const subtitle =
      typeof meta.distanceKm === "number" || typeof meta.distanceKm === "string"
        ? `${Number(meta.distanceKm).toFixed(1)} km`
        : undefined;
    return { title, subtitle };
  }

  if (entry.category === "electricity") {
    const subtitle =
      meta.analysis?.units_kwh !== undefined ? `${meta.analysis.units_kwh} kWh` : undefined;
    return { title: "Electricity bill", subtitle };
  }

  if (entry.category === "shopping") {
    const count = meta.items?.length;
    const subtitle = count ? `${count} item${count === 1 ? "" : "s"}` : undefined;
    return { title: "Receipt scan", subtitle };
  }

  // food entries already store a descriptive dish name in `source`
  return { title: entry.source || "Logged activity", subtitle: undefined };
}

export default function DailyTimeline() {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchDaily = async () => {
    if (!date) return;

    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(`/api/dashboard/daily?date=${date}`);

      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaily();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <PageHeader
        icon={<IconCalendarDay className="h-5 w-5" />}
        eyebrow="Overview"
        title="Daily timeline"
        description="Pick a date to see your total footprint, category breakdown, and every entry logged that day."
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="field-input w-auto"
            />
          </Field>

          <Button onClick={fetchDaily} disabled={!date} loading={loading}>
            {loading ? "Loading…" : "Get summary"}
          </Button>
        </div>

        {error && (
          <div className="mt-4">
            <ErrorBanner>{error}</ErrorBanner>
          </div>
        )}
      </Card>

      {data ? (
        <div className="fade-in space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatTile label={data.date} value={data.totalKgCO2.toFixed(2)} unit="kg CO₂" tone="brand" />
            <StatTile label="Entries logged" value={data.entries?.length ?? 0} />
          </div>

          {Object.keys(data.byCategory || {}).length > 0 && (
            <CategoryBar data={data.byCategory} />
          )}

          <div>
            <SectionTitle>Entries</SectionTitle>
            {data.entries?.length > 0 ? (
              <div className="space-y-2">
                {data.entries.map((entry) => {
                  const { title, subtitle } = describeEntry(entry);
                  return (
                    <TimelineCard
                      key={entry._id}
                      title={title}
                      subtitle={subtitle}
                      category={entry.category}
                      value={entry.kgCO2?.toFixed?.(2) ?? entry.kgCO2}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<IconCalendarDay className="h-5 w-5" />}
                title="Nothing logged on this day"
                description="Scan a receipt, meal, or bill to start building your timeline."
              />
            )}
          </div>
        </div>
      ) : (
        !loading && (
          <EmptyState
            icon={<IconCalendarDay className="h-5 w-5" />}
            title="Choose a date to get started"
            description="Your daily summary, category breakdown, and entries will appear here."
          />
        )
      )}
    </Layout>
  );
}

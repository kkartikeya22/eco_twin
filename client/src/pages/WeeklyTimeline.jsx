import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import {
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  PageHeader,
  StatTile,
} from "../components/ui";
import { GoalProgress } from "../components/Gamification";
import { useAuth } from "../context/AuthContext";
import { IconBarChart } from "../components/icons";

export default function WeeklyTimeline() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const fetchWeekly = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/api/dashboard/weekly");
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch weekly data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekly();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = data.reduce((sum, day) => sum + day.totalKgCO2, 0);
  const max = data.reduce((m, day) => Math.max(m, day.totalKgCO2), 0) || 1;
  const average = data.length ? total / data.length : 0;
  const daysLogged = data.filter((d) => d.totalKgCO2 > 0).length;

  const formatDay = (dateStr) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <PageHeader
        icon={<IconBarChart className="h-5 w-5" />}
        eyebrow="Overview"
        title="Weekly timeline"
        description="Compare your daily totals over the past 7 days and track progress against your goal."
        actions={
          <Button onClick={fetchWeekly} loading={loading} variant="secondary" size="sm">
            {loading ? "Loading…" : "Refresh"}
          </Button>
        }
      />

      {error && (
        <div className="mb-6">
          <ErrorBanner>{error}</ErrorBanner>
        </div>
      )}

      {!loading && data.length > 0 ? (
        <div className="fade-in space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatTile label="7-day total" value={total.toFixed(2)} unit="kg CO₂" tone="brand" />
            <StatTile label="Daily average" value={average.toFixed(2)} unit="kg CO₂" />
            <StatTile label="Days with activity" value={`${daysLogged} / 7`} />
          </div>

          {user?.weeklyGoalKgCO2 > 0 && (
            <Card>
              <GoalProgress totalKgCO2={total} goalKgCO2={user.weeklyGoalKgCO2} />
            </Card>
          )}

          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-border">
              {data.map((day) => {
                const hasData = day.totalKgCO2 > 0;
                const percent = hasData ? Math.max((day.totalKgCO2 / max) * 100, 3) : 0;
                return (
                  <div key={day.date} className="flex items-center gap-4 px-5 py-3.5">
                    <span className="w-28 shrink-0 text-[13px] font-medium text-ink-2">
                      {formatDay(day.date)}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-hover">
                      {hasData && (
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: "var(--color-brand)",
                          }}
                        />
                      )}
                    </div>
                    <span className={`w-20 shrink-0 text-right text-[13.5px] font-semibold ${hasData ? "text-ink" : "text-ink-3"}`}>
                      {hasData ? `${day.totalKgCO2.toFixed(2)} kg` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      ) : (
        !loading && (
          <EmptyState
            icon={<IconBarChart className="h-5 w-5" />}
            title="No activity logged yet this week"
            description="Use a scanner or tracker to log your first activity — it'll appear here straight away."
          />
        )
      )}
    </Layout>
  );
}

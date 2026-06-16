import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Layout from "../components/Layout";
import { PageHeader, Card, SectionTitle, StatTile, ErrorBanner } from "../components/ui";
import { BenchmarkBars } from "../components/Benchmarks";
import {
  LevelProgress,
  StreakChip,
  GoalProgress,
  GamificationEarnedCallout,
} from "../components/Gamification";
import {
  IconHome,
  IconReceipt,
  IconUtensils,
  IconBolt,
  IconCompass,
  IconSparkles,
  IconCalendarDay,
  IconBarChart,
  IconArrowRight,
  IconTarget,
  IconLeaf,
  IconLoader,
} from "../components/icons";
import { formatKg, formatPercent } from "../lib/gamification";
import { getCategoryMeta } from "../lib/categories";

const TOOLS = [
  {
    to: "/insights",
    title: "Insights & goals",
    description: "Set a weekly carbon goal, compare to benchmarks, and get ranked reduction tips.",
    icon: IconTarget,
  },
  {
    to: "/receipt-scanner",
    title: "Receipt scanner",
    description: "Upload a grocery receipt and get an instant CO₂ breakdown per item.",
    icon: IconReceipt,
  },
  {
    to: "/food-scanner",
    title: "Food scanner",
    description: "Snap a meal photo to estimate emissions and find lower-carbon swaps.",
    icon: IconUtensils,
  },
  {
    to: "/electricity-scanner",
    title: "Electricity bill",
    description: "Scan a utility bill to see your usage and monthly footprint estimate.",
    icon: IconBolt,
  },
  {
    to: "/travel-tracker",
    title: "Travel tracker",
    description: "Log trips manually or import your Google Timeline for automatic tracking.",
    icon: IconCompass,
  },
  {
    to: "/daily-timeline",
    title: "Daily timeline",
    description: "See everything logged on a given day, grouped by category.",
    icon: IconCalendarDay,
  },
  {
    to: "/weekly-timeline",
    title: "Weekly timeline",
    description: "Compare your daily totals across the past week at a glance.",
    icon: IconBarChart,
  },
  {
    to: "/ai-coach",
    title: "AI climate coach",
    description: "Get a personalized note on how your day went and what to try next.",
    icon: IconSparkles,
  },
];

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .get("/api/dashboard/insights")
      .then(({ data }) => {
        if (!mounted) return;
        setData(data);
        updateUser({
          xp: data.gamification.xp,
          level: data.gamification.level,
          badges: data.gamification.badges,
          streakDays: data.gamification.streakDays,
          weeklyGoalKgCO2: data.goal.weeklyGoalKgCO2,
        });
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.response?.data?.message || "Couldn't load your stats right now.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topRecommendation = data?.recommendations?.[0];
  const topCategoryMeta = topRecommendation ? getCategoryMeta(topRecommendation.category) : null;

  return (
    <Layout>
      <PageHeader
        icon={<IconHome className="h-5 w-5" />}
        eyebrow="Dashboard"
        title={`Welcome back, ${firstName}`}
        description="Your EcoTwin workspace — track today's footprint, follow your weekly goal, and jump into a tool to log activity."
      />

      {error && (
        <div className="mb-4">
          <ErrorBanner>{error}</ErrorBanner>
        </div>
      )}

      {loading && !data && (
        <div className="mb-6 flex items-center gap-2 text-ink-2">
          <IconLoader className="h-4 w-4" />
          <span className="text-[13.5px]">Crunching your numbers…</span>
        </div>
      )}

      {data && (
        <div className="mb-6 space-y-4">
          {data.newBadges?.length > 0 && (
            <GamificationEarnedCallout gamification={data.gamification} newBadges={data.newBadges} />
          )}

          {/* Hero stats */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              label="Today's footprint"
              value={formatKg(data.today.totalKgCO2)}
              unit="kg CO₂e"
              icon={<IconLeaf className="h-4 w-4" />}
            />
            <StatTile
              label="This week"
              value={formatKg(data.thisWeek.totalKgCO2)}
              unit="kg CO₂e"
              tone={data.goal.onTrack ? "brand" : "danger"}
              icon={<IconTarget className="h-4 w-4" />}
            />
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[13px] font-medium text-ink-2">Logging streak</p>
              </div>
              <div className="flex items-center gap-2">
                <StreakChip streakDays={data.gamification.streakDays} className="text-[13px]" />
              </div>
              <p className="mt-3 text-[12.5px] text-ink-3">
                {data.gamification.totalEntries} activities logged in total
              </p>
            </Card>
            <Card>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[13px] font-medium text-ink-2">Level {data.gamification.level}</p>
              </div>
              <LevelProgress
                level={data.gamification.level}
                xpIntoLevel={data.gamification.xpIntoLevel}
                xpForNextLevel={data.gamification.xpForNextLevel}
                className="mt-2"
              />
            </Card>
          </div>

          {/* Goal + benchmark */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <SectionTitle
                action={
                  <Link to="/insights" className="text-[12.5px] font-medium text-brand hover:underline">
                    Edit goal
                  </Link>
                }
              >
                Weekly goal
              </SectionTitle>
              <GoalProgress totalKgCO2={data.thisWeek.totalKgCO2} goalKgCO2={data.goal.weeklyGoalKgCO2} />
              {data.weekOverWeekChangePercent !== null && (
                <p className="mt-3 text-[12.5px] text-ink-2">
                  <span
                    className={`font-semibold ${
                      data.weekOverWeekChangePercent <= 0 ? "text-brand" : "text-danger"
                    }`}
                  >
                    {formatPercent(data.weekOverWeekChangePercent)}
                  </span>{" "}
                  vs. last week
                </p>
              )}
            </Card>

            <Card>
              <SectionTitle
                action={
                  <Link to="/insights" className="text-[12.5px] font-medium text-brand hover:underline">
                    Full breakdown
                  </Link>
                }
              >
                How you compare
              </SectionTitle>
              <BenchmarkBars benchmarks={data.benchmarks} />
            </Card>
          </div>

          {/* Top tip */}
          {topRecommendation && topCategoryMeta && (
            <Card className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                <IconSparkles className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-3">
                  Top tip · {topCategoryMeta.label}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink">{topRecommendation.title}</p>
                {topRecommendation.estimatedSavingKgCO2PerWeek > 0 && (
                  <p className="mt-1 text-[12.5px] font-medium text-brand">
                    ~{formatKg(topRecommendation.estimatedSavingKgCO2PerWeek)} kg CO2e/week potential saving
                  </p>
                )}
              </div>
              <Link to="/insights" className="text-[12.5px] font-medium text-brand hover:underline">
                More tips
              </Link>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ to, title, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="surface-card group flex flex-col p-5 transition-shadow hover:shadow-[var(--shadow-popover)]"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-brand-soft text-brand">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-[14.5px] font-semibold text-ink">{title}</h3>
            <p className="mt-1 flex-1 text-[13px] leading-relaxed text-ink-2">
              {description}
            </p>
            <div className="mt-3 flex items-center gap-1 text-[13px] font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
              Open
              <IconArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

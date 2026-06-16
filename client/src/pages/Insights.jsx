import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  PageHeader,
  Card,
  SectionTitle,
  ErrorBanner,
  Button,
  Field,
  Tag,
  EmptyState,
} from "../components/ui";
import CategoryBar from "../components/CategoryBar";
import { BenchmarkBars } from "../components/Benchmarks";
import {
  LevelProgress,
  StreakChip,
  BadgeGrid,
  GoalProgress,
  GamificationEarnedCallout,
} from "../components/Gamification";
import {
  IconTarget,
  IconLoader,
  IconSparkles,
  IconCompass,
} from "../components/icons";
import { formatKg, formatPercent, ALL_BADGE_IDS } from "../lib/gamification";
import { getCategoryMeta } from "../lib/categories";

export default function Insights() {
  const { updateUser } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [goalInput, setGoalInput] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);

  const load = async () => {
    try {
      setError("");
      const { data } = await api.get("/api/dashboard/insights");
      setData(data);
      setGoalInput(String(data.goal.weeklyGoalKgCO2));

      updateUser({
        xp: data.gamification.xp,
        level: data.gamification.level,
        badges: data.gamification.badges,
        streakDays: data.gamification.streakDays,
        weeklyGoalKgCO2: data.goal.weeklyGoalKgCO2,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load your insights right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveGoal = async (e) => {
    e.preventDefault();

    const goal = Number(goalInput);
    if (!Number.isFinite(goal) || goal <= 0) {
      setError("Enter a weekly goal greater than 0.");
      return;
    }

    setSavingGoal(true);
    setGoalSaved(false);

    try {
      await api.put("/api/profile/goal", { weeklyGoalKgCO2: goal });
      await load();
      setGoalSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update your goal.");
    } finally {
      setSavingGoal(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center gap-2 text-ink-2">
          <IconLoader className="h-4 w-4" />
          <span className="text-[13.5px]">Loading your insights…</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        icon={<IconTarget className="h-5 w-5" />}
        eyebrow="Insights & goals"
        title="Understand, track, and reduce"
        description="Set a personal weekly carbon goal, see how your footprint compares to broader benchmarks, and follow tips ranked by how much they could actually save you."
      />

      {error && (
        <div className="mb-4">
          <ErrorBanner>{error}</ErrorBanner>
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {data.newBadges?.length > 0 && (
            <GamificationEarnedCallout gamification={data.gamification} newBadges={data.newBadges} />
          )}

          {/* Goal, trend, and progress */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <SectionTitle>Weekly goal</SectionTitle>
              <GoalProgress totalKgCO2={data.thisWeek.totalKgCO2} goalKgCO2={data.goal.weeklyGoalKgCO2} />

              <form onSubmit={handleSaveGoal} className="mt-4 flex items-end gap-2">
                <Field label="New weekly target (kg CO2e)">
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    className="field-input"
                    value={goalInput}
                    onChange={(e) => {
                      setGoalInput(e.target.value);
                      setGoalSaved(false);
                    }}
                  />
                </Field>
                <Button type="submit" size="sm" loading={savingGoal}>
                  Save
                </Button>
              </form>
              {goalSaved && <p className="mt-2 text-[12.5px] text-brand">Goal updated.</p>}
            </Card>

            <Card>
              <SectionTitle>Weekly trend</SectionTitle>
              <p className="text-[28px] font-bold leading-none text-ink">
                {formatKg(data.thisWeek.totalKgCO2)}
                <span className="ml-1 text-[14px] font-medium text-ink-3">kg this week</span>
              </p>
              <p className="mt-2.5 text-[13px] leading-relaxed text-ink-2">
                {data.weekOverWeekChangePercent === null ? (
                  "Keep logging — once you've tracked a full week, you'll see how it compares to the one before."
                ) : (
                  <>
                    <span
                      className={`font-semibold ${
                        data.weekOverWeekChangePercent <= 0 ? "text-brand" : "text-danger"
                      }`}
                    >
                      {formatPercent(data.weekOverWeekChangePercent)}
                    </span>{" "}
                    vs. last week ({formatKg(data.lastWeek.totalKgCO2)} kg)
                  </>
                )}
              </p>
              <p className="mt-3 text-[13px] text-ink-2">
                Daily average: <span className="font-semibold text-ink">{formatKg(data.thisWeek.dailyAverageKgCO2)} kg</span>
                {" · "}Logged {data.thisWeek.loggedDays}/7 days
              </p>
            </Card>

            <Card>
              <SectionTitle>Your progress</SectionTitle>
              <LevelProgress
                level={data.gamification.level}
                xpIntoLevel={data.gamification.xpIntoLevel}
                xpForNextLevel={data.gamification.xpForNextLevel}
              />
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <StreakChip streakDays={data.gamification.streakDays} />
                <span className="text-[12.5px] text-ink-3">
                  {data.gamification.totalEntries} activities logged in total
                </span>
              </div>
            </Card>
          </div>

          {/* Benchmarks + recommendations */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <SectionTitle>How you compare</SectionTitle>
              <BenchmarkBars benchmarks={data.benchmarks} />
            </Card>

            <Card>
              <SectionTitle>Personalized next steps</SectionTitle>
              {data.recommendations.length === 0 ? (
                <EmptyState
                  icon={<IconCompass className="h-5 w-5" />}
                  title="Log a few activities to unlock tips"
                  description="Once you've tracked food, travel, electricity, or shopping this week, EcoTwin will suggest the swaps with the biggest impact for you."
                />
              ) : (
                <div className="space-y-3">
                  {data.recommendations.map((rec, i) => {
                    const meta = getCategoryMeta(rec.category);
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-[var(--radius-card)] border border-border p-3"
                      >
                        <Tag label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
                        <div className="flex-1">
                          <p className="text-[13.5px] leading-snug text-ink">{rec.title}</p>
                          {rec.estimatedSavingKgCO2PerWeek > 0 && (
                            <p className="mt-1 text-[12px] font-medium text-brand">
                              ~{formatKg(rec.estimatedSavingKgCO2PerWeek)} kg CO2e/week potential saving
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Category breakdown + achievements */}
          <div className="grid gap-4 lg:grid-cols-2">
            <CategoryBar data={data.thisWeek.byCategory} title="This week, by category" />

            <Card>
              <SectionTitle>
                Achievements
                <span className="ml-2 text-[12.5px] font-normal text-ink-3">
                  ({data.gamification.badges.length}/{ALL_BADGE_IDS.length} unlocked)
                </span>
              </SectionTitle>
              <BadgeGrid unlockedBadgeIds={data.gamification.badges} />
            </Card>
          </div>

          <Card className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
              <IconSparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-ink">Want a deeper, AI-written take?</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
                Your AI climate coach reads today's log alongside your weekly goal and streak to suggest what to
                try tomorrow.
              </p>
              <a href="/ai-coach" className="mt-2 inline-block text-[13px] font-medium text-brand hover:underline">
                Open AI coach →
              </a>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
}

import { ProgressBar } from "./ui";
import { IconFlame, IconLock2 } from "./icons";
import { getBadgeMeta, getBadgeIcon, ALL_BADGE_IDS, formatKg } from "../lib/gamification";

/* -------------------------------------------------------------------- */
/* Level + XP progress                                                   */
/* -------------------------------------------------------------------- */

export function LevelProgress({ level = 1, xpIntoLevel = 0, xpForNextLevel = 100, className = "" }) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
        <span className="font-semibold text-ink">Level {level}</span>
        <span className="text-ink-3">
          {xpIntoLevel} / {xpForNextLevel} XP
        </span>
      </div>
      <ProgressBar value={xpIntoLevel} max={xpForNextLevel} tone="brand" />
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Streak chip                                                            */
/* -------------------------------------------------------------------- */

export function StreakChip({ streakDays = 0, className = "" }) {
  const active = streakDays > 0;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12.5px] font-medium ${className}`}
      style={{
        backgroundColor: active ? "var(--color-warning-soft)" : "var(--color-hover)",
        color: active ? "var(--color-warning)" : "var(--color-ink-3)",
      }}
      title="Consecutive days you've logged at least one activity"
    >
      <IconFlame className="h-3.5 w-3.5" />
      {streakDays > 0 ? `${streakDays}-day streak` : "No streak yet"}
    </span>
  );
}

/* -------------------------------------------------------------------- */
/* Badge tile + grid                                                      */
/* -------------------------------------------------------------------- */

export function BadgeTile({ id, unlocked }) {
  const meta = getBadgeMeta(id);
  const Icon = unlocked ? getBadgeIcon(id) : IconLock2;

  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-[var(--radius-card)] border px-3 py-4 text-center transition-colors ${
        unlocked ? "border-border bg-canvas" : "border-border bg-sidebar"
      }`}
      title={meta.description}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full"
        style={{
          backgroundColor: unlocked ? "var(--color-brand-soft)" : "var(--color-hover)",
          color: unlocked ? "var(--color-brand)" : "var(--color-ink-3)",
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className={`text-[12.5px] font-semibold ${unlocked ? "text-ink" : "text-ink-3"}`}>
          {meta.label}
        </p>
        <p className="mt-0.5 text-[11.5px] leading-snug text-ink-3">{meta.description}</p>
      </div>
    </div>
  );
}

export function BadgeGrid({ unlockedBadgeIds = [], className = "" }) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 ${className}`}>
      {ALL_BADGE_IDS.map((id) => (
        <BadgeTile key={id} id={id} unlocked={unlockedBadgeIds.includes(id)} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Earn toast — shown after logging an activity                          */
/* -------------------------------------------------------------------- */

export function GamificationEarnedCallout({ gamification, newBadges = [] }) {
  if (!gamification && (!newBadges || newBadges.length === 0)) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-[var(--radius-card)] border border-border px-4 py-3 text-[13.5px]"
      style={{ backgroundColor: "var(--color-brand-soft)", color: "var(--color-brand-soft-text)" }}
    >
      {gamification?.xpGain ? (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-canvas px-2 py-1 font-semibold text-brand">
          +{gamification.xpGain} XP
        </span>
      ) : null}

      {gamification?.streakDays ? (
        <StreakChip streakDays={gamification.streakDays} />
      ) : null}

      {newBadges.map((id) => {
        const meta = getBadgeMeta(id);
        const Icon = getBadgeIcon(id);
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 rounded-md bg-canvas px-2 py-1 font-medium text-ink"
          >
            <Icon className="h-3.5 w-3.5 text-brand" />
            New badge: {meta.label}
          </span>
        );
      })}

      {gamification && (
        <span className="ml-auto text-[12.5px] text-ink-2">
          Level {gamification.level} · {gamification.xpIntoLevel}/{gamification.xpForNextLevel} XP
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Goal progress card piece                                               */
/* -------------------------------------------------------------------- */

export function GoalProgress({ totalKgCO2 = 0, goalKgCO2 = 0, className = "" }) {
  const pct = goalKgCO2 > 0 ? (totalKgCO2 / goalKgCO2) * 100 : 0;
  const over = totalKgCO2 > goalKgCO2;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <p className="text-[13px] font-medium text-ink-2">This week vs. your goal</p>
        <p className="text-[13px] text-ink-3">
          {formatKg(totalKgCO2)} / {formatKg(goalKgCO2)} kg
        </p>
      </div>
      <ProgressBar value={totalKgCO2} max={goalKgCO2} tone={over ? "danger" : "brand"} />
      <p className="mt-1.5 text-[12.5px] text-ink-3">
        {over
          ? `${formatKg(totalKgCO2 - goalKgCO2)} kg over your weekly goal`
          : `${formatKg(goalKgCO2 - totalKgCO2)} kg of headroom left this week`}
      </p>
    </div>
  );
}

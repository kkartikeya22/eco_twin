import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import {
  Button,
  Callout,
  Card,
  ErrorBanner,
  Field,
  PageHeader,
  SectionTitle,
} from "../components/ui";
import { GamificationEarnedCallout } from "../components/Gamification";
import { useAuth } from "../context/AuthContext";
import { IconCompass, IconFileJson, IconLeaf } from "../components/icons";

const TRAVEL_MODES = [
  { value: "car", label: "Car" },
  { value: "bus", label: "Bus" },
  { value: "metro", label: "Metro" },
  { value: "bike", label: "Bike" },
  { value: "walk", label: "Walk" },
  { value: "flight", label: "Flight" },
];

const today = () => new Date().toISOString().split("T")[0];

export default function TravelTracker() {
  const { updateUser } = useAuth();
  const [mode, setMode] = useState("car");
  const [distanceKm, setDistanceKm] = useState("");
  const [date, setDate] = useState(today());

  const [travelResult, setTravelResult] = useState(null);

  const [timelineFile, setTimelineFile] = useState(null);

  const [timelineResult, setTimelineResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const [error, setError] = useState("");

  const handleTravelSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data } = await api.post("/api/travel/manual", {
        mode,
        distanceKm,
        date,
      });

      setTravelResult(data);

      if (data.gamification) {
        updateUser({
          xp: data.gamification.xp,
          level: data.gamification.level,
          badges: data.gamification.badges,
          streakDays: data.gamification.streakDays,
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to calculate travel emissions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTimelineFileChange = (e) => {
    setTimelineFile(e.target.files[0]);
    setTimelineResult(null);
    setError("");
  };

  const handleTimelineUpload = async () => {
    if (!timelineFile) return;

    try {
      setTimelineLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("timeline", timelineFile);

      const { data } = await api.post("/api/travel/timeline", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTimelineResult(data);

      if (data.gamification) {
        updateUser({
          xp: data.gamification.xp,
          level: data.gamification.level,
          badges: data.gamification.badges,
          streakDays: data.gamification.streakDays,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Timeline import failed");
    } finally {
      setTimelineLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        icon={<IconCompass className="h-5 w-5" />}
        eyebrow="Track emissions"
        title="Travel tracker"
        description="Log a single trip manually, or import your Google Timeline to track travel automatically."
      />

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div className="mt-4 space-y-6">
        {/* Manual Travel */}
        <Card>
          <SectionTitle>Log a trip</SectionTitle>

          <form onSubmit={handleTravelSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Travel mode">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="field-input"
                >
                  {TRAVEL_MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Distance (km)">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  placeholder="e.g. 12.5"
                  className="field-input"
                />
              </Field>

              <Field label="Date">
                <input
                  type="date"
                  value={date}
                  max={today()}
                  onChange={(e) => setDate(e.target.value)}
                  className="field-input"
                />
              </Field>
            </div>

            <Button type="submit" loading={loading}>
              {loading ? "Calculating…" : "Calculate CO₂"}
            </Button>
          </form>

          {travelResult && (
            <div className="mt-5 fade-in space-y-3">
              <Callout tone="brand" icon={<IconLeaf className="h-4 w-4" />}>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <span>
                    Mode:{" "}
                    <strong className="capitalize">
                      {travelResult.entry.metadata?.mode}
                    </strong>
                  </span>
                  <span>
                    Distance:{" "}
                    <strong>
                      {travelResult.entry?.metadata?.distanceKm} km
                    </strong>
                  </span>
                  <span className="font-semibold text-brand-soft-text">
                    {travelResult.kgCO2.toFixed(2)} kg CO₂
                  </span>
                </div>
              </Callout>
              {(travelResult.gamification || travelResult.newBadges?.length > 0) && (
                <GamificationEarnedCallout
                  gamification={travelResult.gamification}
                  newBadges={travelResult.newBadges}
                />
              )}
            </div>
          )}
        </Card>

        {/* Timeline Upload */}
        <Card>
          <SectionTitle>Import Google Timeline</SectionTitle>
          <p className="mb-4 text-[13.5px] text-ink-2">
            Upload a Google Timeline export (.json) to bulk-import your trips
            and estimate their combined footprint.
          </p>

          <label className="group flex cursor-pointer items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-border-strong bg-sidebar px-4 py-3 transition-colors hover:border-brand hover:bg-brand-soft/40">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-canvas text-ink-2 shadow-sm transition-colors group-hover:text-brand">
              <IconFileJson className="h-4.5 w-4.5" />
            </div>
            <span className="text-[13.5px] font-medium text-ink">
              {timelineFile ? timelineFile.name : "Choose a Timeline.json file"}
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleTimelineFileChange}
              className="hidden"
            />
          </label>

          <div className="mt-4">
            <Button
              onClick={handleTimelineUpload}
              disabled={!timelineFile}
              loading={timelineLoading}
              variant="secondary"
            >
              {timelineLoading ? "Importing…" : "Import timeline"}
            </Button>
          </div>

          {timelineResult && (
            <div className="mt-5 fade-in space-y-3">
              <Callout tone="info">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <span>
                    Trips imported: <strong>{timelineResult.imported}</strong>
                  </span>
                  <span className="font-semibold">
                    Total: {timelineResult.totalKgCO2.toFixed(2)} kg CO₂
                  </span>
                </div>
              </Callout>
              {(timelineResult.gamification || timelineResult.newBadges?.length > 0) && (
                <GamificationEarnedCallout
                  gamification={timelineResult.gamification}
                  newBadges={timelineResult.newBadges}
                />
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

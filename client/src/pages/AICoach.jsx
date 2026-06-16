import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import {
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  PageHeader,
} from "../components/ui";
import { IconSparkles } from "../components/icons";

export default function AICoach() {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const getCoach = async () => {
    if (!date) return;

    try {
      setLoading(true);
      setError("");
      setNote("");

      // Step 1: fetch daily summary
      const summaryRes = await api.get(`/api/dashboard/daily?date=${date}`);

      // Step 2: send to coach API
      const coachRes = await api.post("/api/coach/getCoachMessage", {
        dailySummary: summaryRes.data,
      });

      setNote(coachRes.data.note);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate coach message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        icon={<IconSparkles className="h-5 w-5" />}
        eyebrow="Guidance"
        title="AI climate coach"
        description="Pick a day and your coach will review your activity and suggest one thing to try next."
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Day to review">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="field-input w-auto"
            />
          </Field>

          <Button onClick={getCoach} disabled={!date} loading={loading}>
            {loading ? "Thinking…" : "Get coach advice"}
          </Button>
        </div>

        {error && (
          <div className="mt-4">
            <ErrorBanner>{error}</ErrorBanner>
          </div>
        )}
      </Card>

      {note ? (
        <Card className="fade-in border-brand/20 bg-brand-soft/40">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
              <IconSparkles className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-[15px] font-semibold text-ink">
              Your EcoTwin coach
            </h2>
          </div>
          <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-ink">
            {note}
          </p>
        </Card>
      ) : (
        !loading && (
          <EmptyState
            icon={<IconSparkles className="h-5 w-5" />}
            title="No coaching note yet"
            description="Choose a date above and EcoTwin will summarize the day and suggest a small change."
          />
        )
      )}
    </Layout>
  );
}

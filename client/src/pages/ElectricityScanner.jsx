import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import {
  Button,
  Callout,
  Card,
  ErrorBanner,
  FileDrop,
  PageHeader,
  StatTile,
} from "../components/ui";
import { GamificationEarnedCallout } from "../components/Gamification";
import { useAuth } from "../context/AuthContext";
import { IconBolt, IconTrendingDown } from "../components/icons";

export default function ElectricityScanner() {
  const { updateUser } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [newBadges, setNewBadges] = useState([]);

  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    setResult(null);
    setGamification(null);
    setNewBadges([]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("bill", file);

      const { data } = await api.post("/api/electricity/scan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(data.analysis);
      setGamification(data.gamification || null);
      setNewBadges(data.newBadges || []);

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
        err.response?.data?.message || "Electricity bill analysis failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        icon={<IconBolt className="h-5 w-5" />}
        eyebrow="Track emissions"
        title="Electricity bill scanner"
        description="Upload a photo or PDF of your utility bill to estimate the emissions behind your electricity usage."
      />

      <Card className="mb-6">
        <FileDrop
          accept="image/*,.pdf"
          onChange={handleFileChange}
          fileName={file?.name}
          hint="Image or PDF of your latest electricity bill"
        />

        {preview && file?.type.startsWith("image/") && (
          <img
            src={preview}
            alt="Bill preview"
            className="mt-4 max-h-72 w-full rounded-[var(--radius-card)] border border-border object-contain"
          />
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={handleUpload} disabled={!file} loading={loading}>
            {loading ? "Analyzing bill…" : "Scan electricity bill"}
          </Button>
          {error && <ErrorBanner>{error}</ErrorBanner>}
        </div>
      </Card>

      {result && (
        <div className="fade-in space-y-6">
          {(gamification || newBadges.length > 0) && (
            <GamificationEarnedCallout gamification={gamification} newBadges={newBadges} />
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Units consumed" value={result.units_kwh} unit="kWh" />
            <StatTile
              label="Billing period"
              value={result.billing_period_days}
              unit="days"
            />
            <StatTile
              label="Carbon footprint"
              value={result.kgCO2?.toFixed(2)}
              unit="kg CO₂"
              tone="danger"
            />
            <StatTile
              label="Monthly estimate"
              value={result.monthly_estimate_kgCO2?.toFixed(2)}
              unit="kg CO₂ / mo"
              tone="brand"
            />
          </div>

          <Callout
            tone="info"
            icon={<IconTrendingDown className="h-4 w-4" />}
            title="Sustainability insight"
          >
            <p>
              Your electricity usage generated approximately{" "}
              <strong>{result.kgCO2?.toFixed(2)} kg CO₂</strong>. Reducing
              consumption by just 10% could save around{" "}
              <strong>{(result.kgCO2 * 0.1).toFixed(2)} kg CO₂</strong> during
              this billing period.
            </p>
          </Callout>
        </div>
      )}
    </Layout>
  );
}

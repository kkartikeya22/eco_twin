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
  SectionTitle,
  StatTile,
} from "../components/ui";
import { GamificationEarnedCallout } from "../components/Gamification";
import { useAuth } from "../context/AuthContext";
import { IconUtensils, IconLeaf } from "../components/icons";

export default function FoodScanner() {
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

      formData.append("image", file);

      const { data } = await api.post("/api/food/scan", formData, {
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
      setError(err.response?.data?.message || "Food analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        icon={<IconUtensils className="h-5 w-5" />}
        eyebrow="Track emissions"
        title="Food scanner"
        description="Upload a photo of a meal to estimate its carbon footprint and discover lower-impact alternatives."
      />

      <Card className="mb-6">
        <FileDrop
          accept="image/*"
          onChange={handleFileChange}
          fileName={file?.name}
          hint="PNG or JPG of a plated meal or dish"
        />

        {preview && (
          <img
            src={preview}
            alt="Food preview"
            className="mt-4 max-h-72 w-full rounded-[var(--radius-card)] border border-border object-contain"
          />
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={handleUpload} disabled={!file} loading={loading}>
            {loading ? "Analyzing meal…" : "Analyze food"}
          </Button>
          {error && <ErrorBanner>{error}</ErrorBanner>}
        </div>
      </Card>

      {result && (
        <div className="fade-in space-y-6">
          {(gamification || newBadges.length > 0) && (
            <GamificationEarnedCallout gamification={gamification} newBadges={newBadges} />
          )}

          <Card className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-3">
                Dish
              </p>
              <h3 className="mt-0.5 text-[18px] font-semibold text-ink">
                {result.dish}
              </h3>
            </div>
            <StatTile
              label="Total footprint"
              value={result.totalKgCO2.toFixed(2)}
              unit="kg CO₂e"
              tone="brand"
              className="min-w-[180px]"
            />
          </Card>

          {result.ingredients?.length > 0 && (
            <Card className="p-0 overflow-hidden">
              <div className="border-b border-border px-5 py-4">
                <SectionTitle>Ingredients</SectionTitle>
              </div>
              <div className="divide-y divide-border">
                {result.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-hover/60"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-ink">
                        {ingredient.name}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-ink-3">
                        {ingredient.estimatedGrams} g · {ingredient.kgCO2PerKg}{" "}
                        kgCO₂e/kg
                      </p>
                    </div>
                    <span className="text-[13.5px] font-semibold text-ink">
                      {ingredient.kgCO2} kg
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {result.swapSuggestion && (
            <Callout
              tone="brand"
              icon={<IconLeaf className="h-4 w-4" />}
              title="Eco-friendly alternative"
            >
              <p>{result.swapSuggestion.description}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-[13.5px]">
                <span>
                  Alternative footprint:{" "}
                  <strong>{result.swapSuggestion.totalKgCO2} kg CO₂</strong>
                </span>
                <span className="font-semibold text-brand-soft-text">
                  You could save {result.swapSuggestion.savedKgCO2} kg CO₂
                </span>
              </div>
            </Callout>
          )}
        </div>
      )}
    </Layout>
  );
}

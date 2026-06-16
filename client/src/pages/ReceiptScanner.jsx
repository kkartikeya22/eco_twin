import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import {
  Button,
  Card,
  ErrorBanner,
  FileDrop,
  PageHeader,
  SectionTitle,
  StatTile,
  Tag,
} from "../components/ui";
import { GamificationEarnedCallout } from "../components/Gamification";
import { useAuth } from "../context/AuthContext";
import { getCategoryMeta } from "../lib/categories";
import { IconReceipt } from "../components/icons";

export default function ReceiptScanner() {
  const { updateUser } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("receipt", file);

      const { data } = await api.post("/api/receipts/scan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(data);

      if (data.gamification) {
        updateUser({
          xp: data.gamification.xp,
          level: data.gamification.level,
          badges: data.gamification.badges,
          streakDays: data.gamification.streakDays,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        icon={<IconReceipt className="h-5 w-5" />}
        eyebrow="Track emissions"
        title="Receipt scanner"
        description="Upload a photo of a grocery receipt and EcoTwin will estimate the carbon footprint of each item."
      />

      <Card className="mb-6">
        <FileDrop
          accept="image/*"
          onChange={handleFileChange}
          fileName={file?.name}
          hint="PNG or JPG, ideally a clear, well-lit photo"
        />

        {preview && (
          <img
            src={preview}
            alt="Receipt preview"
            className="mt-4 max-h-72 w-full rounded-[var(--radius-card)] border border-border object-contain"
          />
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={handleUpload} disabled={!file} loading={loading}>
            {loading ? "Analyzing receipt…" : "Scan receipt"}
          </Button>
          {error && <ErrorBanner>{error}</ErrorBanner>}
        </div>
      </Card>

      {result && (
        <div className="fade-in space-y-6">
          {(result.gamification || result.newBadges?.length > 0) && (
            <GamificationEarnedCallout gamification={result.gamification} newBadges={result.newBadges} />
          )}

          <StatTile
            label="Total estimated footprint"
            value={result.totalKgCO2.toFixed(2)}
            unit="kg CO₂e"
            tone="brand"
          />

          <Card className="p-0 overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <SectionTitle>Items on this receipt</SectionTitle>
            </div>
            <div className="divide-y divide-border">
              {result.items.map((item, index) => {
                const meta = getCategoryMeta(item.category);
                return (
                  <div
                    key={index}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-hover/60"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-ink">
                        {item.item}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-ink-3">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag
                        label={meta.label}
                        bg={meta.bg}
                        text={meta.text}
                        dot={meta.dot}
                      />
                      <span className="text-[13.5px] font-semibold text-ink">
                        {item.estimatedKgCO2} kg
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
}

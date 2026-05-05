import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Download, Sparkles, Key, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { generationsApi } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ArtStyle, Generation } from "@/lib/types";

export default function StudioPage() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState<Generation | null>(null);

  // Fetch styles
  const { data: stylesData } = useQuery({
    queryKey: ["styles"],
    queryFn: () => generationsApi.getStyles().then((r) => r.data.data.styles as ArtStyle[]),
    staleTime: Infinity,
  });

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: (formData: FormData) => generationsApi.generate(formData),
    onSuccess: ({ data }) => {
      const gen = data.data.generation as Generation;
      setResult(gen);
      updateUser({ credits: (user?.credits ?? 0) - 1 });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      toast.success("Image generated successfully!");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Generation failed";
      toast.error(msg);
    },
  });

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const handleGenerate = () => {
    if (!selectedFile) return toast.error("Please upload a photo");
    if (!selectedStyleId) return toast.error("Please choose a style");
    if (!apiKey.trim()) return toast.error("Please enter your Gemini API key");

    const fd = new FormData();
    fd.append("image", selectedFile);
    fd.append("styleId", selectedStyleId);
    fd.append("geminiApiKey", apiKey.trim());
    generateMutation.mutate(fd);
  };

  const handleDownload = () => {
    if (!result?.generatedImageUrl) return;
    const a = document.createElement("a");
    a.href = result.generatedImageUrl;
    a.download = `${result.styleName.toLowerCase().replace(" ", "-")}-portrait.png`;
    a.click();
  };

  const selectedStyle = stylesData?.find((s) => s.id === selectedStyleId);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 4vw, 34px)",
          fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6,
        }}>
          ✦ Studio
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Upload your photo, pick a style, and let AI do the magic.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>

        {/* LEFT — Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Step 1: Upload */}
          <StepCard step={1} title="Upload your photo">
            {previewUrl ? (
              <div style={{ position: "relative" }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: "100%", borderRadius: "var(--radius-sm)", maxHeight: 280, objectFit: "cover" }}
                />
                <button
                  onClick={clearImage}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    width: 30, height: 30,
                    background: "rgba(0,0,0,0.6)",
                    border: "none", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", cursor: "pointer",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                style={{
                  border: `2px dashed ${isDragActive ? "var(--accent)" : "var(--border-strong)"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "40px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: isDragActive ? "var(--accent-dim)" : "var(--bg-secondary)",
                  transition: "all 0.2s",
                }}
              >
                <input {...getInputProps()} />
                <Upload size={28} color={isDragActive ? "var(--accent)" : "var(--text-muted)"} style={{ margin: "0 auto 12px" }} />
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                  {isDragActive ? "Drop it here!" : "Drag & drop your photo"}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  or click to browse — JPG, PNG, WEBP up to 10MB
                </p>
              </div>
            )}
          </StepCard>

          {/* Step 2: Style */}
          <StepCard step={2} title="Choose art style">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: 10,
            }}>
              {stylesData?.map((style) => {
                const active = selectedStyleId === style.id;
                return (
                  <motion.button
                    key={style.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedStyleId(style.id)}
                    style={{
                      background: active ? "var(--accent-dim)" : "var(--bg-secondary)",
                      border: `1.5px solid ${active ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: "var(--radius-sm)",
                      padding: "14px 10px",
                      cursor: "pointer",
                      textAlign: "left",
                      position: "relative",
                      transition: "all 0.15s",
                    }}
                  >
                    {active && (
                      <CheckCircle
                        size={14}
                        color="var(--accent)"
                        style={{ position: "absolute", top: 8, right: 8 }}
                      />
                    )}
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{style.emoji}</div>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700, fontSize: 12, marginBottom: 3,
                      color: active ? "var(--accent)" : "var(--text)",
                    }}>
                      {style.name}
                    </div>
                    <div style={{
                      fontSize: 10, fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>
                      {style.creditsRequired} credit{style.creditsRequired !== 1 ? "s" : ""}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </StepCard>

          {/* Step 3: API Key */}
          <StepCard step={3} title="Gemini API key">
            <div style={{
              padding: "10px 14px",
              background: "rgba(126,184,240,0.06)",
              border: "1px solid rgba(126,184,240,0.15)",
              borderRadius: "var(--radius-sm)",
              marginBottom: 12,
              fontSize: 12,
              color: "rgba(200,220,255,0.75)",
              lineHeight: 1.5,
            }}>
              Your key is sent directly to Gemini and never stored on our servers.
              Get one free at{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent3)", fontWeight: 600 }}
              >
                aistudio.google.com
              </a>
              <br />
              <p>Because AI Costs money and I have no money.😭</p>
            </div>
            <Input
              type="password"
              placeholder="AIza..."
              icon={<Key size={14} />}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </StepCard>

          {/* Generate Button */}
          <Button
            size="lg"
            loading={generateMutation.isPending}
            onClick={handleGenerate}
            style={{ width: "100%", boxShadow: "0 0 40px rgba(200,240,110,0.15)" }}
          >
            <Sparkles size={16} />
            {generateMutation.isPending ? "Generating..." : `Generate — ${selectedStyle?.creditsRequired ?? 1} credit`}
          </Button>

          {user && (
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: -8 }}>
              You have <strong style={{ color: "var(--accent)" }}>{user.credits}</strong> credits remaining
            </p>
          )}
        </div>

        {/* RIGHT — Result */}
        <div style={{ position: "sticky", top: 80 }}>
          <AnimatePresence mode="wait">
            {generateMutation.isPending ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "80px 40px",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: 20 }}>
                  <svg
                    width="44" height="44"
                    viewBox="0 0 44 44"
                    style={{ animation: "spin 1s linear infinite", margin: "0 auto" }}
                  >
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <circle
                      cx="22" cy="22" r="18"
                      stroke="var(--accent)" strokeWidth="3"
                      fill="none" strokeLinecap="round"
                      strokeDasharray="40 72"
                    />
                  </svg>
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                  Generating your artwork...
                </p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Gemini is transforming your photo into {selectedStyle?.name}. This takes 10–30 seconds.
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: "var(--card)",
                  border: "1px solid rgba(200,240,110,0.2)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={15} color="var(--accent)" />
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700, fontSize: 14, color: "var(--accent)",
                    }}>
                      {result.styleName} — Generated
                    </span>
                  </div>
                  <Button size="sm" variant="secondary" icon={<Download size={13} />} onClick={handleDownload}>
                    Download
                  </Button>
                </div>
                <img
                  src={result.generatedImageUrl}
                  alt="Generated"
                  style={{ width: "100%", display: "block" }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: "var(--card)",
                  border: "2px dashed var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "80px 40px",
                  textAlign: "center",
                  minHeight: 400,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>🖼️</div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                  Your artwork will appear here
                </p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 280 }}>
                  Complete the steps on the left and hit Generate to transform your photo.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {generateMutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 12,
                padding: "12px 16px",
                background: "rgba(240,112,112,0.08)",
                border: "1px solid rgba(240,112,112,0.2)",
                borderRadius: "var(--radius-sm)",
                display: "flex", alignItems: "flex-start", gap: 10,
                fontSize: 13, color: "var(--danger)",
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                {(generateMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Generation failed. Check your API key and try again."}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function StepCard({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: step * 0.08 }}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }}
    >
      <div style={{
        padding: "14px 18px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{
          width: 22, height: 22,
          background: "var(--accent)", color: "#0d0d0f",
          borderRadius: "50%",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12,
          flexShrink: 0,
        }}>
          {step}
        </span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "18px" }}>{children}</div>
    </motion.div>
  );
}

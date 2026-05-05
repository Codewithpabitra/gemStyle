import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, X, Image } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { generationsApi } from "@/api/client";
import { Button } from "@/components/ui/Button";
import type { Generation } from "@/lib/types";

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<Generation | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["generations", page],
    queryFn: () =>
      generationsApi.getMyGenerations(page, 12).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => generationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setLightbox(null);
      toast.success("Deleted");
    },
    onError: () => toast.error("Delete failed"),
  });

  const generations: Generation[] = data?.data?.generations ?? [];
  const meta = data?.meta;

  const handleDownload = (gen: Generation) => {
    const a = document.createElement("a");
    a.href = gen.generatedImageUrl;
    a.download = `${gen.styleName.toLowerCase().replace(" ", "-")}.png`;
    a.click();
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 12 }}
      >
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6,
          }}>
            🖼️ My Gallery
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
            {meta?.total ?? 0} artwork{(meta?.total ?? 0) !== 1 ? "s" : ""} generated
          </p>
        </div>
        <Link to="/studio">
          <Button variant="primary" size="md">+ New artwork</Button>
        </Link>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}>
          {Array(12).fill(0).map((_, i) => (
            <div key={i} style={{
              aspectRatio: "1",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.05}s`,
            }} />
          ))}
        </div>
      ) : generations.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 24px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
        }}>
          <Image size={40} color="var(--text-muted)" style={{ margin: "0 auto 16px" }} />
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No artworks yet</p>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
            Head to Studio and create your first AI portrait!
          </p>
          <Link to="/studio"><Button>Open Studio</Button></Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {generations.map((gen, i) => (
            <motion.div
              key={gen._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              style={{
                position: "relative",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--card)",
                cursor: "pointer",
                aspectRatio: "1",
              }}
              onClick={() => setLightbox(gen)}
            >
              <img
                src={gen.generatedImageUrl}
                alt={gen.styleName}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(transparent 50%, rgba(0,0,0,0.75))",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "16px 12px 12px",
                }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                    {gen.styleName}
                  </p>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(gen); }}
                      style={{
                        flex: 1, padding: "6px",
                        background: "rgba(255,255,255,0.15)",
                        border: "none", borderRadius: 6, color: "#fff",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(gen._id); }}
                      style={{
                        flex: 1, padding: "6px",
                        background: "rgba(240,112,112,0.25)",
                        border: "none", borderRadius: 6, color: "#f07070",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
          {Array(meta.totalPages).fill(0).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                width: 36, height: 36,
                background: page === i + 1 ? "var(--accent)" : "var(--card)",
                border: `1px solid ${page === i + 1 ? "var(--accent)" : "var(--border-strong)"}`,
                borderRadius: "var(--radius-sm)",
                color: page === i + 1 ? "#0d0d0f" : "var(--text-secondary)",
                fontFamily: "var(--font-display)",
                fontWeight: 700, fontSize: 14,
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                maxWidth: 560, width: "100%",
              }}
            >
              <div style={{
                padding: "14px 18px",
                borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>
                  {lightbox.styleName}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button size="sm" variant="secondary" icon={<Download size={13} />} onClick={() => handleDownload(lightbox)}>
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    loading={deleteMutation.isPending}
                    icon={<Trash2 size={13} />}
                    onClick={() => deleteMutation.mutate(lightbox._id)}
                  >
                    Delete
                  </Button>
                  <button
                    onClick={() => setLightbox(null)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <img src={lightbox.generatedImageUrl} alt={lightbox.styleName} style={{ width: "100%", display: "block" }} />
              <div style={{ padding: "12px 18px", fontSize: 12, color: "var(--text-muted)" }}>
                Created {new Date(lightbox.createdAt).toLocaleDateString()} · {lightbox.creditsUsed} credit used
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}

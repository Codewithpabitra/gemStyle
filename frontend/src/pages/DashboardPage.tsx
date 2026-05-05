import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Image, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { usersApi } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import type { DashboardStats, Generation } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07 } }),
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => usersApi.getDashboard().then((r) => r.data.data as DashboardStats),
  });

  const stats = [
    {
      label: "Total Generations",
      value: data?.stats.totalGenerations ?? 0,
      icon: Image,
      color: "var(--accent)",
      bg: "var(--accent-dim)",
    },
    {
      label: "Credits Remaining",
      value: data?.stats.credits ?? 0,
      icon: Sparkles,
      color: "var(--accent2)",
      bg: "rgba(232,168,124,0.1)",
    },
    {
      label: "Styles Available",
      value: 10,
      icon: TrendingUp,
      color: "var(--accent3)",
      bg: "rgba(126,184,240,0.1)",
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 40 }}
      >
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(26px, 4vw, 36px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          marginBottom: 6,
        }}>
          Welcome back, <span style={{ color: "var(--accent)" }}>{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Here's what's happening with your studio.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 40,
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "24px 22px",
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div style={{
              width: 44, height: 44, flexShrink: 0,
              background: s.bg,
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: 28, fontWeight: 800,
                lineHeight: 1,
                marginBottom: 4,
              }}>
                {isLoading ? (
                  <span style={{ display: "inline-block", width: 48, height: 28, background: "var(--surface-hover)", borderRadius: 6 }} />
                ) : s.value}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 48 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Link
            to="/studio"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px",
              background: "linear-gradient(135deg, rgba(200,240,110,0.12), rgba(200,240,110,0.04))",
              border: "1px solid rgba(200,240,110,0.2)",
              borderRadius: "var(--radius)",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 40, height: 40,
                background: "var(--accent)", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Plus size={18} color="#0d0d0f" />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>New Generation</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Pick a style and upload</div>
              </div>
            </div>
            <ArrowRight size={16} color="var(--accent)" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Link
            to="/gallery"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px",
              background: "var(--card)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 40, height: 40,
                background: "rgba(126,184,240,0.1)", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Image size={18} color="var(--accent3)" />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>My Gallery</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>View all your art</div>
              </div>
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </Link>
        </motion.div>
      </div>

      {/* Recent Generations */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Recent generations</h2>
          <Link to="/gallery" style={{ fontSize: 13, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4 }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {isLoading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} style={{
                height: 200, background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        ) : data?.recentGenerations?.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 24px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🎨</div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No generations yet</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
              Go to the Studio and create your first AI artwork!
            </p>
            <Link
              to="/studio"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "9px 20px",
                background: "var(--accent)", color: "#0d0d0f",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-display)",
                fontWeight: 700, fontSize: 14,
              }}
            >
              <Plus size={14} /> Open Studio
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}>
            {data?.recentGenerations.map((gen: Generation) => (
              <motion.div
                key={gen._id}
                whileHover={{ scale: 1.02 }}
                style={{
                  position: "relative",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  aspectRatio: "1",
                  background: "var(--card)",
                }}
              >
                <img
                  src={gen.generatedImageUrl}
                  alt={gen.styleName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "20px 10px 10px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{gen.styleName}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
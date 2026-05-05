import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Shield, Palette, Star } from "lucide-react";

const STYLE_PREVIEWS = [
  { emoji: "🌸", name: "Cute Doodle", tag: "Popular" },
  { emoji: "🎬", name: "Pixar 3D", tag: "Trending" },
  { emoji: "🎨", name: "Studio Ghibli", tag: "Dreamy" },
  { emoji: "⚡", name: "Cyberpunk", tag: "Futuristic" },
  { emoji: "🖌️", name: "Oil Painting", tag: "Classic" },
  { emoji: "💧", name: "Watercolor", tag: "Artistic" },
  { emoji: "✏️", name: "Pencil Sketch", tag: "Minimal" },
  { emoji: "⚔️", name: "Fantasy", tag: "Epic" },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "10 Unique Art Styles",
    desc: "From cute doodles to cyberpunk neon — powered by Gemini's latest image generation model.",
    color: "var(--accent)",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Generate stunning AI portraits in under 30 seconds. Your creativity shouldn't wait.",
    color: "var(--accent2)",
  },
  {
    icon: Shield,
    title: "Your Key, Your Control",
    desc: "Bring your own Gemini API key. No hidden usage, no data retention — full transparency.",
    color: "var(--accent3)",
  },
  {
    icon: Palette,
    title: "Gallery & Downloads",
    desc: "Every generation saved to your personal gallery. Download in full quality anytime.",
    color: "#c87ef0",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "UI Designer",
    text: "The Ghibli style blew my mind. Used it for my portfolio profile and got 10x more DMs.",
    stars: 5,
  },
  {
    name: "Rahul M.",
    role: "Content Creator",
    text: "I make a new styled photo every week now. The doodle style is my favorite for Instagram.",
    stars: 5,
  },
  {
    name: "Anya K.",
    role: "Developer",
    text: "Clean code, real API integration. No black box. I trust it because I see exactly what it does.",
    stars: 5,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div style={{ overflow: "hidden" }}>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        position: "relative",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "20%", left: "50%",
          transform: "translateX(-50%)",
          width: 600, height: 400,
          background: "radial-gradient(ellipse, rgba(200,240,110,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          style={{ maxWidth: 720, position: "relative" }}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 14px",
              background: "var(--accent-dim)",
              border: "1px solid rgba(200,240,110,0.2)",
              borderRadius: 99,
              fontSize: 12,
              color: "var(--accent)",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              <Sparkles size={11} />
              Powered by Gemini AI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 8vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: 24,
            }}
          >
            Transform your photo<br />
            into any <span style={{
              color: "var(--accent)",
              display: "inline-block",
            }}>art style</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: "clamp(16px, 2.5vw, 20px)",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: 40,
              maxWidth: 520,
              margin: "0 auto 40px",
            }}
          >
            Upload a photo, choose from 10 hand-crafted AI art styles, and get a stunning portrait in seconds — no design skills needed.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px",
                  background: "var(--accent)", color: "#0d0d0f",
                  borderRadius: "var(--radius)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700, fontSize: 15,
                  boxShadow: "0 0 40px rgba(200,240,110,0.2)",
                }}
              >
                Start creating free
                <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/studio"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px",
                  background: "var(--surface)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600, fontSize: 15,
                  color: "var(--text)",
                }}
              >
                View demo
              </Link>
            </motion.div>
          </motion.div>

          {/* Social proof */}
          <motion.p variants={fadeUp} style={{
            marginTop: 28,
            fontSize: 13,
            color: "var(--text-muted)",
          }}>
            10 free credits on signup &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; Use your own Gemini key
          </motion.p>
        </motion.div>
      </section>

      {/* ── Styles Grid ──────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
              Art Styles
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}>
              10 stunning styles, one upload
            </h2>
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}>
            {STYLE_PREVIEWS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4, borderColor: "var(--border-strong)" }}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "24px 20px",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.emoji}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                  {s.name}
                </div>
                <span style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  background: "var(--accent-dim)",
                  border: "1px solid rgba(200,240,110,0.15)",
                  borderRadius: 99,
                  fontSize: 11,
                  color: "var(--accent)",
                  fontWeight: 600,
                }}>
                  {s.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
              Why gemStyle
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}>
              Built for real creators
            </h2>
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "28px 24px",
                }}
              >
                <div style={{
                  width: 44, height: 44,
                  background: `${f.color}15`,
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <f.icon size={20} color={f.color} />
                </div>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700, fontSize: 16,
                  marginBottom: 8,
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}>
              Creators love it
            </h2>
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "24px",
                }}
              >
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} size={14} fill="var(--accent)" color="var(--accent)" />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 16 }}>
                  "{t.text}"
                </p>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "60px 40px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: "-40%", left: "50%",
            transform: "translateX(-50%)",
            width: 300, height: 300,
            background: "radial-gradient(circle, rgba(200,240,110,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 16,
            position: "relative",
          }}>
            Ready to transform yourself?
          </h2>
          <p style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            marginBottom: 32,
            lineHeight: 1.6,
            position: "relative",
          }}>
            Join thousands of creators turning ordinary photos into extraordinary art.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: "inline-block", position: "relative" }}>
            <Link
              to="/register"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 32px",
                background: "var(--accent)", color: "#0d0d0f",
                borderRadius: "var(--radius)",
                fontFamily: "var(--font-display)",
                fontWeight: 700, fontSize: 15,
                boxShadow: "0 0 50px rgba(200,240,110,0.25)",
              }}
            >
              Create your first artwork free
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "28px 24px",
        textAlign: "center",
        fontSize: 13,
        color: "white",
      }}>
        <p>&copy; {new Date().getFullYear()} gemStyle - Built with love💗. Your key, Your art.</p>
      </footer>
    </div>
  );
}

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "40px 24px",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 480 }}
      >
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 100, fontWeight: 800,
          color: "var(--accent)",
          lineHeight: 1, marginBottom: 16,
          opacity: 0.4,
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: 28, fontWeight: 800,
          letterSpacing: "-0.02em",
          marginBottom: 12,
        }}>
          Page not found
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 32 }}>
          This page doesn't exist. It might have moved, or you may have followed a broken link.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 24px",
            background: "var(--accent)", color: "#0d0d0f",
            borderRadius: "var(--radius)",
            fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 14,
          }}
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}

import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, LayoutDashboard, Image, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/client";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/studio", label: "Studio", icon: Sparkles },
  { to: "/gallery", label: "Gallery", icon: Image },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (_) {
      // ignore
    } finally {
      logout();
      navigate("/");
      toast.success("Logged out");
    }
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(9,9,11,0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border)",
      padding: "5px"
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "0 24px",
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30,
            background: "var(--accent)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={16} color="#0d0d0f" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
            gem<span style={{ color: "var(--accent)" }}>Style</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        {isAuthenticated && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 14, fontWeight: 500,
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                    background: active ? "var(--accent-dim)" : "transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isAuthenticated ? (
            <>
              {/* Credits badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px",
                background: "var(--accent-dim)",
                border: "1px solid rgba(200,240,110,0.15)",
                borderRadius: 99,
                fontSize: 13,
              }}>
                <Sparkles size={12} color="var(--accent)" />
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  {user?.credits ?? 0}
                </span>
              </div>

              {/* User menu */}
              <Link to="/settings" style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "5px 10px",
                background: "var(--surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: 99,
                fontSize: 13,
                color: "var(--text-secondary)",
              }}>
                <User size={14} />
                <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  display: "flex", alignItems: "center",
                  padding: 6,
                  borderRadius: 6,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              {/* <Link
                to="/login"
                style={{
                  fontSize: 14, fontWeight: 500,
                  color: "var(--text-secondary)",
                  padding: "6px 14px",
                }}
              >
                Log in
              </Link> */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: 14, fontWeight: 600,
                    background: "var(--accent)", color: "#0d0d0f",
                    padding: "7px 18px",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Log in
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
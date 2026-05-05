import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const styles: Record<Variant, string> = {
  primary: `
    background: var(--accent); color: #0d0d0f;
    border: none; font-weight: 600;
  `,
  secondary: `
    background: var(--surface-hover); color: var(--text);
    border: 1px solid var(--border-strong);
  `,
  ghost: `
    background: transparent; color: var(--text-secondary);
    border: 1px solid var(--border);
  `,
  danger: `
    background: rgba(240,112,112,0.1); color: var(--danger);
    border: 1px solid rgba(240,112,112,0.2);
  `,
};

const sizes: Record<Size, string> = {
  sm: "padding: 7px 14px; font-size: 13px; border-radius: var(--radius-sm);",
  md: "padding: 11px 22px; font-size: 14px; border-radius: var(--radius-sm);",
  lg: "padding: 14px 28px; font-size: 15px; border-radius: var(--radius);",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, children, style, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        disabled={disabled || loading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          cursor: disabled || loading ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
          whiteSpace: "nowrap",
          ...parseCssString(styles[variant]),
          ...parseCssString(sizes[size]),
          ...style,
        }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? <Spinner /> : icon}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.7s linear infinite" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="28 56" />
    </svg>
  );
}

function parseCssString(css: string): React.CSSProperties {
  const result: Record<string, string> = {};
  css.split(";").forEach((rule) => {
    const [prop, val] = rule.split(":").map((s) => s.trim());
    if (prop && val) {
      const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      result[camel] = val;
    }
  });
  return result as React.CSSProperties;
}
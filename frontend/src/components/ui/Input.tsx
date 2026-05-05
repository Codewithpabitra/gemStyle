import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, style, ...props }, ref) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {label && (
          <label
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative" }}>
          {icon && (
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            style={{
              width: "100%",
              background: "var(--surface)",
              border: `1px solid ${error ? "rgba(240,112,112,0.5)" : "var(--border-strong)"}`,
              borderRadius: "var(--radius-sm)",
              padding: icon ? "11px 14px 11px 38px" : "11px 14px",
              color: "var(--text)",
              fontSize: 14,
              fontFamily: "var(--font-body)",
              outline: "none",
              transition: "border-color 0.15s",
              ...style,
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = error
                ? "rgba(240,112,112,0.8)"
                : "rgba(200,240,110,0.5)";
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = error
                ? "rgba(240,112,112,0.5)"
                : "var(--border-strong)";
            }}
            {...props}
          />
        </div>
        {error && (
          <span style={{ fontSize: 12, color: "var(--danger)", marginTop: 2 }}>
            {error}
          </span>
        )}
        {hint && !error && (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{hint}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
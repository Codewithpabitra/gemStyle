import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authApi } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: ({ data }) => {
      const { user, accessToken } = data.data;
      setAuth(user, accessToken);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from, { replace: true });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Login failed";
      toast.error(msg);
    },
  });

  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%", maxWidth: 420,
          background: "var(--card)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          padding: "40px 36px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48,
            background: "var(--accent-dim)",
            borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <Sparkles size={22} color="var(--accent)" />
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 26, fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 6,
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Sign in to your gemStyle account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((d) => loginMutation.mutate(d))}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={15} />}
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={15} />}
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            size="lg"
            loading={loginMutation.isPending}
            style={{ width: "100%", marginTop: 4 }}
          >
            Sign in
          </Button>
        </form>

        <p style={{
          textAlign: "center", marginTop: 24,
          fontSize: 14, color: "var(--text-secondary)",
        }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

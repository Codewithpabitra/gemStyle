import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, User, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authApi } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data),
    onSuccess: ({ data }) => {
      const { user, accessToken } = data.data;
      setAuth(user, accessToken);
      toast.success(`Welcome to gemStyle, ${user.name}! You have 10 free credits.`);
      navigate("/dashboard");
    },
    onError: (err: unknown) => {
      const apiErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const errs = apiErr?.response?.data?.errors;
      if (errs) {
        Object.values(errs).flat().forEach((e) => toast.error(e));
      } else {
        toast.error(apiErr?.response?.data?.message ?? "Registration failed");
      }
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
          width: "100%", maxWidth: 440,
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
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Start with 10 free credits — no card required
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((d) => registerMutation.mutate(d))}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Input
            label="Full name"
            type="text"
            placeholder="John Doe"
            icon={<User size={15} />}
            error={errors.name?.message}
            {...register("name")}
          />
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
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            icon={<Lock size={15} />}
            error={errors.password?.message}
            hint="Min. 8 characters, one uppercase, one number"
            {...register("password")}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={15} />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            size="lg"
            loading={registerMutation.isPending}
            style={{ width: "100%", marginTop: 6 }}
          >
            Create account
          </Button>
        </form>

        <p style={{
          textAlign: "center", marginTop: 24,
          fontSize: 14, color: "var(--text-secondary)",
        }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

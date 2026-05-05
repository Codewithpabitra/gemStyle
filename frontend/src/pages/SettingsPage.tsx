import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Key, Sparkles, Save } from "lucide-react";
import toast from "react-hot-toast";
import { usersApi } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { updateProfileSchema, type UpdateProfileFormData } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileFormData) => usersApi.updateProfile(data),
    onSuccess: ({ data }) => {
      updateUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Profile updated");
    },
    onError: () => toast.error("Update failed"),
  });

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6,
        }}>
          ⚙️ Settings
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 36 }}>
          Manage your account and preferences.
        </p>

        {/* Credits Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(200,240,110,0.1), rgba(200,240,110,0.03))",
          border: "1px solid rgba(200,240,110,0.15)",
          borderRadius: "var(--radius)",
          padding: "20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44,
              background: "var(--accent)", borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={20} color="#0d0d0f" />
            </div>
            <div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>Available Credits</p>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: 28, fontWeight: 800,
                color: "var(--accent)", lineHeight: 1,
              }}>
                {user?.credits ?? 0}
              </p>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "right" }}>
            <p>1 credit = 1 generation</p>
            <p style={{ color: "var(--text-muted)" }}>2 credits for premium styles</p>
          </div>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSubmit((d) => updateMutation.mutate(d))}
          style={{ display: "flex", flexDirection: "column", gap: 0 }}
        >
          <SectionCard title="Profile" icon={<User size={16} />}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Input
                label="Full name"
                placeholder="Your name"
                error={errors.name?.message}
                {...register("name")}
              />
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                  Email
                </label>
                <div style={{
                  padding: "11px 14px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 14, color: "var(--text-muted)",
                }}>
                  {user?.email}
                </div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Email cannot be changed</p>
              </div>
            </div>
          </SectionCard>

          <div style={{ height: 16 }} />

          <SectionCard title="Gemini API Key" icon={<Key size={16} />}>
            <Input
              label="API Key"
              type="password"
              placeholder="AIza... (leave blank to keep current)"
              hint="Your key is never stored — it's used only per-request"
              {...register("geminiApiKey")}
            />
          </SectionCard>

          <div style={{ height: 20 }} />

          <Button
            type="submit"
            size="lg"
            loading={updateMutation.isPending}
            disabled={!isDirty}
            icon={<Save size={15} />}
            style={{ width: "100%" }}
          >
            Save changes
          </Button>
        </form>

        {/* Account Info */}
        <div style={{
          marginTop: 24,
          padding: "16px 20px",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          fontSize: 13, color: "var(--text-secondary)",
        }}>
          <p>Account role: <strong style={{ color: "var(--text)" }}>{user?.role}</strong></p>
          <p style={{ marginTop: 4 }}>Member since: <strong style={{ color: "var(--text)" }}>
            {user ? new Date().toLocaleDateString() : "—"}
          </strong></p>
        </div>
      </motion.div>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ color: "var(--accent)" }}>{icon}</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

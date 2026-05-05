import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().trim().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(50).optional(),
  geminiApiKey: z.string().trim().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
import { z } from "zod";

export interface PasswordReset {
  id: number;
  userId: string;
  token: string;
  expiresAt: Date;
  used: 0 | 1; // 0 false / 1 true
  createdAt: Date;
}

export const recoverPasswordSchema = z.object({
  email: z.string().email("Email is required").max(255, "Email too long"),
});

export const resetPasswordSchema = z.object({
  code: z.string().min(6, "Wrong code"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password too long"),
  email: z.string().email("Email is required"),
});

export type RecoverPasswordInput = z.infer<typeof recoverPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

import { z } from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<User, "passwordHash">;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  email: z.string().email("Email is required").max(255, "Email too long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password too long"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long")
    .optional(),
  email: z
    .string()
    .email("Email is required")
    .max(255, "Email too long")
    .optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

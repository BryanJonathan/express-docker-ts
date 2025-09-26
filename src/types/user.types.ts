import { z } from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  email: z.string().email("Email is required").max(255, "Email too long"),
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

import { z } from "zod";

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .trim()
        .toLowerCase()
        .email("Invalid email address format"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be at most 100 characters long"),
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be at most 50 characters long")
        .optional(),
});

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .trim()
        .toLowerCase()
        .email("Invalid email address format"),
    password: z
        .string()
        .min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be at most 50 characters long"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
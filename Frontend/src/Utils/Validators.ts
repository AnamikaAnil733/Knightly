import { z } from "zod";

export const ProfileSchema = z.object({
  displayname: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_ ]+$/,
      "Only letters, numbers, spaces and underscores allowed",
    )
    .trim(),
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Enter valid email"),
  password: z.string().min(1, "Password required"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const SignupSchema = z
  .object({
    displayname: z.string().min(2, "Full name required"),
    email: z.string().email("Enter valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[A-Z]/, "Must contain at least one capital letter")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one symbol"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof SignupSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must contain at least one special character",
      )
      .refine((val) => !/\s/.test(val), "Password must not contain spaces"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export const AchievementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string(),
  criteriaType: z.string(),
  criteriaValue: z.number().min(1, "Value must be at least 1"),
});

export type AchievementFormData = z.infer<typeof AchievementSchema>;

export const ForgetPasswordSchema = z.object({
  email: z.string().email("Enter valid email"),
});

export type ForgetPasswordFormData = z.infer<typeof ForgetPasswordSchema>;

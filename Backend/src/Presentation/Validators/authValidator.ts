import {z} from "zod";
import { UserRole } from "../../Domain/Types/UserRole";


export const AuthRequestSchema =  z.object({
    displayname: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  role: z.enum(UserRole),
  password: z.string().optional(),

})


export const GoogleAuthRequestSchema = z.object({
  token: z
    .string()
    .min(1, "Google token is required")
    .regex(/^[\w-]+\.[\w-]+\.[\w-]+$/, "Invalid Google token format"),
  role: z.enum(UserRole),
});


export const VerifyOtpRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),

  otp: z.preprocess(
    (val) => {
      if (typeof val === "number") return String(val);
      return val;
    },
    z
      .string()
      .length(7, "OTP must be exactly 7 digits")
      .regex(/^\d+$/, "OTP must contain only numbers")
  ),
});

export const ResetPasswordRequestSchema = z.object({
  email: z.email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      "Invalid password"
    ),
});

export const ForgotPasswordRequestSchema = z.object({
displayname: z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name must not exceed 50 characters"),
email: z.email("Invalid email address").min(1, "Email is required"),
role: z.enum(UserRole),
});


export const ForgotPasswordVerifyOtpRequestSchema = z.object({
  email: z.email("Invalid email format").min(1, "Email is required"),
  otp: z
    .string()
    .length(7, "OTP must be exactly 7 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export const SignupRequestSchema = z.object({
  displayname: z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name must not exceed 50 characters"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const AUTH_ROUTES = {
  SEND_OTP: "/send-otp",
  VERIFY_OTP: "/verify-otp",
  REGISTER: "/register",
  LOGIN: "/login",
  RESEND_OTP: "/resend-otp",

  FORGET_PASSWORD: "/forget-password",
  VERIFY_FORGET_PASSWORD_OTP: "/verify-forgetpasswordOTP",
  RESET_PASSWORD: "/reset-password",

  GOOGLE_AUTH: "/googleAuth",
  REFRESH: "/refresh",
} as const;

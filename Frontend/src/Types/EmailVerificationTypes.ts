export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface RegisterPayload {
  displayname: string;
  email: string;
  password: string;
}

export interface ApiErrorResponse {
  message: string;
}

export interface OTPVerifyProps {
  mode: "signup" | "forgot";
}

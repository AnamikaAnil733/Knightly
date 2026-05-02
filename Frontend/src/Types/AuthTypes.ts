export type Role = "ADMIN" | "USER";

export interface AuthPageProps {
  role?: Role;
  initialMode?: "LOGIN" | "SIGNUP";
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  displayname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import { EyeIcon, EyeOffIcon, ShieldCheckIcon } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import axiosAdmin from "../../Service/Api/Axios/Adminaxios";
import axiosUser from "../../Service/Api/Axios/Useraxios";

import {
  setAccessToken as setAdminAccessToken,
  setAdmin,
} from "../../Store/Slices/Auth/AdminAuthSlice";

import {
  setuserAccessToken,
  setUser,
} from "../../Store/Slices/Auth/UserAuthSlice";

/* ===================== TYPES ===================== */

type FormValues = {
  email: string;
  password: string;
};

type LoginPageProps = {
  role: "ADMIN" | "USER";
};

interface CredentialResponse {
  credential?: string;
}

/* ===================== COMPONENT ===================== */

export function LoginPage({ role }: LoginPageProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  /* ===================== LOGIN ===================== */

  const onSubmit = async (data: FormValues) => {
    const api = role === "ADMIN" ? axiosAdmin : axiosUser;

    try {
      const res = await api.post("/auth/login", data);

      const { userInfo } = res.data;
      const { accessToken } = userInfo;

      if (role === "ADMIN") {
        dispatch(setAdminAccessToken(accessToken));
        dispatch(setAdmin(userInfo));
        navigate("/admin/users", { replace: true });
      } else {
        dispatch(setuserAccessToken(accessToken));
        // Fetch full profile to get signed avatarUrl and all stats
        const profileRes = await axiosUser.get("/user/profile");
        dispatch(setUser(profileRes.data));
        navigate("/landing-page", { replace: true });
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message ?? "Login failed");
    }
  };

  /* ===================== GOOGLE LOGIN ===================== */

  const handleGoogleLogin = async (response: CredentialResponse) => {
    const api = role === "ADMIN" ? axiosAdmin : axiosUser;

    try {
      if (!response.credential) {
        toast.error("No Google token received");
        return;
      }

      const res = await api.post("/auth/googleAuth", {
        token: response.credential,
        role: role.toLowerCase(),
      });

      const { accessToken, userInfo } = res.data;

      if (role === "ADMIN") {
        dispatch(setAdminAccessToken(accessToken));
        dispatch(setAdmin(userInfo));
        navigate("/admin/users", { replace: true });
      } else {
        dispatch(setuserAccessToken(accessToken));
        // Fetch full profile to get signed avatarUrl and all stats
        const profileRes = await axiosUser.get("/user/profile");
        dispatch(setUser(profileRes.data));
        navigate("/landing-page", { replace: true });
      }
    } catch {
      toast.error("Google authentication failed");
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0F2C] px-4">
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 bg-[#3A6FF7] opacity-20 blur-xl rounded-2xl -rotate-3"></div>

        <div className="relative bg-[#11193F] rounded-xl shadow-2xl z-10">
          {/* Header */}
          <div className="pt-8 pb-6 px-8 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#0A0F2C] border border-[#3A6FF7]/30 mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-[#FFD166]" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">
              {role === "ADMIN"
                ? "Knightly Admin Login"
                : "Knightly User Login"}
            </h1>
            <p className="text-[#C9CAD9] text-sm">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">
            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm text-[#C9CAD9] mb-2">Email</label>
              <input
                type="email"
                className={`w-full px-4 py-3 bg-[#0A0F2C] border rounded-lg text-white ${
                  errors.email ? "border-red-500" : "border-[#3A6FF7]/30"
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm text-[#C9CAD9] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 bg-[#0A0F2C] border rounded-lg text-white pr-10 ${
                    errors.password ? "border-red-500" : "border-[#3A6FF7]/30"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot */}
            <div className="text-right mb-6">
              <a
                href="/forgotpassword"
                className="text-sm text-[#6B2EFF] hover:text-[#FFD166]"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#FFD166] text-[#0A0F2C] font-medium py-3 rounded-lg hover:opacity-90"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#3A6FF7]/30"></div>
              <span className="text-sm text-[#C9CAD9]">or</span>
              <div className="flex-1 h-px bg-[#3A6FF7]/30"></div>
            </div>

            {/* Google */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
              />
            </div>

            {/* Signup */}
            <p className="text-center text-sm text-[#C9CAD9] mt-6">
              Don’t have an account?{" "}
              <a
                href="/"
                className="text-[#FFD166] hover:text-[#6B2EFF] font-semibold"
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

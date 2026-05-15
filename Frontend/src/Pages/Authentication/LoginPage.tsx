import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, ShieldCheckIcon, CrownIcon } from "lucide-react";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginFormData } from "../../Utils/Validators";

/* ===================== TYPES ===================== */

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
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  /* ===================== LOGIN ===================== */

  const onSubmit = async (data: LoginFormData) => {
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
    <div className="flex items-center justify-center min-h-screen bg-[#050816] px-4 relative overflow-hidden font-inter">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="absolute inset-0 bg-[#3A6FF7] opacity-5 blur-[100px] rounded-full"></div>

        <div className="relative bg-[#0F172A]/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD166]/30 to-transparent"></div>

          {/* Brand Emblem Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none opacity-[0.05] z-0">
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <CrownIcon
                size={280}
                strokeWidth={0.5}
                className="text-[#FFD166]"
              />
            </motion.div>
          </div>

          {/* Header */}
          <div className="pt-10 pb-6 px-8 text-center relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 shadow-inner mb-6"
            >
              <ShieldCheckIcon className="h-10 w-10 text-[#FFD166] drop-shadow-[0_0_8px_rgba(255,209,102,0.5)]" />
            </motion.div>

            <h1
              className="text-3xl font-bold text-white mb-2 tracking-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {role === "ADMIN" ? (
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
                  Knightly Admin
                </span>
              ) : (
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
                  Knightly Login
                </span>
              )}
            </h1>
            <p className="text-[#94A3B8] text-sm font-medium">
              Access the grandmaster command center
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">
            {/* Email */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-2 px-1">
                Email
              </label>
              <input
                type="email"
                className={`w-full px-4 py-3 bg-[#0A0F2C]/50 border rounded-xl text-white transition-all duration-300 focus:ring-2 focus:ring-[#3A6FF7]/30 outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-[#3A6FF7]/20 focus:border-[#3A6FF7]/50"
                }`}
                {...register("email")}
                placeholder="name@company.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-2 px-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 bg-[#0A0F2C]/50 border rounded-xl text-white pr-10 transition-all duration-300 focus:ring-2 focus:ring-[#3A6FF7]/30 outline-none ${
                    errors.password
                      ? "border-red-500"
                      : "border-[#3A6FF7]/20 focus:border-[#3A6FF7]/50"
                  }`}
                  {...register("password")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFD166] transition-colors"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
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
            {role !== "ADMIN" && (
              <div className="text-right mb-6">
                <a
                  href="/forgotpassword"
                  className="text-sm text-[#6B2EFF] hover:text-[#FFD166]"
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FFD166] to-[#ffb84d] text-[#0A0F2C] font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_15px_30px_-5px_rgba(255,209,102,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(255,209,102,0.4)] mb-2"
            >
              Sign In
            </button>

            {role !== "ADMIN" && (
              <>
                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3A6FF7]/20 to-transparent"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                    or continue with
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3A6FF7]/20 to-transparent"></div>
                </div>

                {/* Google */}
                <div className="flex justify-center mb-8">
                  <div className="p-[1px] bg-gradient-to-r from-white/10 to-transparent rounded-lg">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => toast.error("Google login failed")}
                      theme="filled_black"
                      shape="pill"
                    />
                  </div>
                </div>

                {/* Signup */}
                <div className="pt-4 border-t border-white/5">
                  <p className="text-center text-sm text-[#94A3B8]">
                    New to the realm?{" "}
                    <a
                      href="/"
                      className="text-[#FFD166] hover:text-white transition-colors font-bold ml-1"
                    >
                      Create an Account
                    </a>
                  </p>
                </div>
              </>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}

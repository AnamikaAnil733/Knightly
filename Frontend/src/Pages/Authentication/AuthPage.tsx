import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import {
  MailIcon,
  LockIcon,
  UserIcon,
  ShieldCheckIcon,
  CrownIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import axiosAdmin from "../../Service/Api/Axios/Adminaxios";
import axiosUser from "../../Service/Api/Axios/Useraxios";
import { sendSignupOtp } from "../../Service/Api/Authapi";
import {
  setAccessToken as setAdminAccessToken,
  setAdmin,
} from "../../Store/Slices/Auth/AdminAuthSlice";
import {
  setuserAccessToken,
  setUser,
} from "../../Store/Slices/Auth/UserAuthSlice";
import ChessAnimation from "../../Components/Authentication/ChessAnimation";
import {
  AuthPageProps,
  LoginFormData,
  SignupFormData,
} from "../../Types/AuthTypes";

export const AuthPage: React.FC<AuthPageProps> = ({
  role = "USER",
  initialMode = "LOGIN",
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(initialMode === "SIGNUP");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login Form
  const {
    register: regLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  // Signup Form
  const {
    register: regSignup,
    handleSubmit: handleSignupSubmit,
    getValues,
    formState: { errors: signupErrors },
  } = useForm<SignupFormData>({
    defaultValues: {
      displayname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
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
        const profileRes = await axiosUser.get("/user/profile");
        dispatch(setUser(profileRes.data));
        navigate("/landing-page", { replace: true });
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message ?? "Login failed");
    }
  };

  const signupMutation = useMutation({
    mutationFn: sendSignupOtp,
    onSuccess: (_, variables) => {
      const signupData = getValues();
      navigate("/verify-otp", {
        state: {
          displayname: signupData.displayname,
          email: variables.email,
          password: signupData.password,
        },
      });
      toast.success("Verification code sent!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });

  const onSignupSubmit = async (data: SignupFormData) => {
    signupMutation.mutate({
      displayname: data.displayname,
      email: data.email,
      role: "user",
    });
  };

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
        const profileRes = await axiosUser.get("/user/profile");
        dispatch(setUser(profileRes.data));
        navigate("/landing-page", { replace: true });
      }
      toast.success("Google Login successful!");
    } catch {
      toast.error("Google authentication failed");
    }
  };

  return (
    <>
      <style>{`
        @keyframes showPanel {
          0%, 49.9% { opacity: 0; z-index: 1; }
          50%, 100%  { opacity: 1; z-index: 5; }
        }
        .auth-signup-active { animation: showPanel 0.8s forwards; }
      `}</style>

      {/* Page container */}
      <div className="flex items-center justify-center min-h-screen overflow-hidden font-inter text-white relative bg-[#050816]">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex flex-col md:flex-row overflow-hidden rounded-[2rem] border border-white/10 z-10 w-full max-w-[1000px] min-h-[600px] md:h-[650px]"
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD166]/20 to-transparent"></div>
          {/* ── LOGIN FORM ── */}
          <div
            className={`absolute top-0 left-0 flex flex-col justify-center z-[2] transition-all duration-[0.8s] w-full md:w-1/2 h-full px-6 md:px-[60px] ${
              isSignup ? "md:translate-x-full opacity-0 hidden md:flex" : "translate-x-0 opacity-100 flex"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.7,0,0.3,1)",
            }}
          >
            <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
              <div className="flex items-center gap-2 mb-2">
                <CrownIcon
                  className="text-[#FFD166]"
                  size={28}
                  fill="#FFD166"
                />
                <h1
                  className="mb-0 text-3xl font-extrabold tracking-tight"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    background: "linear-gradient(to right, #FFF, #FFD166, #ffb84d)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 2px 8px rgba(255,209,102,0.3))"
                  }}
                >
                  Knightly Login
                </h1>
              </div>
              <p className="text-sm mb-6" style={{ color: "#C9CAD9" }}>
                Login to your Knightly account
              </p>

              {/* Email */}
              <div className="mb-5 w-full">
                <div className="relative flex items-center">
                  <MailIcon
                    className="absolute left-3.5 pointer-events-none"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    size={18}
                  />
                  {(() => {
                    const { onBlur: rhfBlur, ...rest } = regLogin("email", {
                      required: "Email is required",
                    });
                    return (
                        <input
                          type="email"
                          className="w-full rounded-2xl text-sm text-white pl-11 pr-11 py-4 focus:outline-none transition-all duration-300 bg-[#0A0F2C]/40 border border-white/10 focus:border-[#FFD166]/60 focus:ring-4 focus:ring-[#FFD166]/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)] backdrop-blur-sm"
                          placeholder="Email Address"
                          {...rest}
                        />
                    );
                  })()}
                </div>
                {loginErrors.email && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {loginErrors.email.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="mb-5 w-full">
                <div className="relative flex items-center">
                  <LockIcon
                    className="absolute left-3.5 pointer-events-none"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    size={18}
                  />
                  {(() => {
                    const { onBlur: rhfBlur, ...rest } = regLogin("password", {
                      required: "Password is required",
                    });
                    return (
                      <div className="relative w-full">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full rounded-2xl text-sm text-white pl-11 pr-11 py-4 focus:outline-none transition-all duration-300 bg-[#0A0F2C]/40 border border-white/10 focus:border-[#FFD166]/60 focus:ring-4 focus:ring-[#FFD166]/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)] backdrop-blur-sm"
                          placeholder="Password"
                          {...rest}
                        />
                        <button
                          type="button"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFD166] transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                      </div>
                    );
                  })()}
                </div>
                {loginErrors.password && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {loginErrors.password.message}
                  </span>
                )}
              </div>

              {role !== "ADMIN" && (
                <div className="text-right mb-4">
                  <a
                    href="/forgotpassword"
                    className="text-sm"
                    style={{ color: "#FFD166" }}
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full text-[#0A0F2C] font-bold py-4 rounded-xl border-none cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_15px_30px_-5px_rgba(255,209,102,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(255,209,102,0.4)]"
                style={{
                  background: "linear-gradient(135deg, #FFD166 0%, #ffb84d 100%)",
                }}
              >
                Sign In
              </button>

              {role !== "ADMIN" && (
                <>
                  {/* Divider */}
                  <div
                    className="flex items-center my-5 text-xs"
                    style={{ color: "#C9CAD9" }}
                  >
                    <span
                      className="flex-1 h-px"
                      style={{ background: "rgba(255,255,255,0.1)" }}
                    />
                    <span className="px-2.5">OR</span>
                    <span
                      className="flex-1 h-px"
                      style={{ background: "rgba(255,255,255,0.1)" }}
                    />
                  </div>

                  <div className="flex justify-center items-center mt-5">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => toast.error("Google login failed")}
                    />
                  </div>
                </>
              )}
              {/* Mobile toggle */}
              <div className="md:hidden text-center mt-6">
                <p className="text-sm text-[#94A3B8]">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignup(true)}
                    className="text-[#FFD166] font-bold"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* ── SIGNUP FORM ── */}
          <div
            className={`absolute top-0 left-0 flex flex-col justify-center z-[5] transition-all duration-[0.8s] w-full md:w-1/2 h-full px-6 md:px-[60px] ${
              isSignup ? "md:translate-x-full opacity-100 flex" : "-translate-x-full opacity-0 hidden md:flex"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.7,0,0.3,1)",
            }}
          >
            {/* Logic to only show for USER role */}
            {role !== "ADMIN" && (
              <form onSubmit={handleSignupSubmit(onSignupSubmit)}>
                <div className="flex items-center gap-2 mb-2">
                  <CrownIcon
                    className="text-[#FFD166]"
                    size={28}
                    fill="#FFD166"
                  />
                  <h1
                    className="mb-0 text-3xl font-extrabold tracking-tight"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      background: "linear-gradient(to right, #FFF, #FFD166, #ffb84d)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 2px 8px rgba(255,209,102,0.3))"
                    }}
                  >
                    Knightly Signup
                  </h1>
                </div>
                <p className="text-sm mb-6" style={{ color: "#C9CAD9" }}>
                  Join the Knightly grandmasters
                </p>

                {/* Display Name */}
                <div className="mb-5 w-full">
                  <div className="relative flex items-center">
                    <UserIcon
                      className="absolute left-3.5 pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      size={18}
                    />
                    {(() => {
                      const { onBlur: rhfBlur, ...rest } = regSignup(
                        "displayname",
                        { required: "Name is required" },
                      );
                      return (
                        <input
                          type="text"
                          className="w-full rounded-2xl text-sm text-white pl-11 pr-11 py-4 focus:outline-none transition-all duration-300 bg-[#0A0F2C]/40 border border-white/10 focus:border-[#FFD166]/60 focus:ring-4 focus:ring-[#FFD166]/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)] backdrop-blur-sm"
                          placeholder="Full Name"
                          {...rest}
                        />
                      );
                    })()}
                  </div>
                  {signupErrors.displayname && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {signupErrors.displayname.message}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="mb-5 w-full">
                  <div className="relative flex items-center">
                    <MailIcon
                      className="absolute left-3.5 pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      size={18}
                    />
                    {(() => {
                      const { onBlur: rhfBlur, ...rest } = regSignup("email", {
                        required: "Email is required",
                      });
                      return (
                        <input
                          type="email"
                          className="w-full rounded-2xl text-sm text-white pl-11 pr-11 py-4 focus:outline-none transition-all duration-300 bg-[#0A0F2C]/40 border border-white/10 focus:border-[#FFD166]/60 focus:ring-4 focus:ring-[#FFD166]/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)] backdrop-blur-sm"
                          placeholder="Email Address"
                          {...rest}
                        />
                      );
                    })()}
                  </div>
                  {signupErrors.email && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {signupErrors.email.message}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div className="mb-5 w-full">
                  <div className="relative flex items-center">
                    <LockIcon
                      className="absolute left-3.5 pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      size={18}
                    />
                    {(() => {
                      const { onBlur: rhfBlur, ...rest } = regSignup("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Min 8 characters" },
                      });
                      return (
                      <div className="relative w-full">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full rounded-2xl text-sm text-white pl-11 pr-11 py-4 focus:outline-none transition-all duration-300 bg-[#0A0F2C]/40 border border-white/10 focus:border-[#FFD166]/60 focus:ring-4 focus:ring-[#FFD166]/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)] backdrop-blur-sm"
                          placeholder="Password"
                          {...rest}
                        />
                        <button
                          type="button"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFD166] transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                      </div>
                      );
                    })()}
                  </div>
                  {signupErrors.password && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {signupErrors.password.message}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-5 w-full">
                  <div className="relative flex items-center">
                    <ShieldCheckIcon
                      className="absolute left-3.5 pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      size={18}
                    />
                    {(() => {
                      const { onBlur: rhfBlur, ...rest } = regSignup(
                        "confirmPassword",
                        {
                          required: "Confirm password",
                          validate: (val) =>
                            val === getValues("password") ||
                            "Passwords do not match",
                        },
                      );
                      return (
                      <div className="relative w-full">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full rounded-2xl text-sm text-white pl-11 pr-11 py-4 focus:outline-none transition-all duration-300 bg-[#0A0F2C]/40 border border-white/10 focus:border-[#FFD166]/60 focus:ring-4 focus:ring-[#FFD166]/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)] backdrop-blur-sm"
                          placeholder="Confirm Password"
                          {...rest}
                        />
                        <button
                          type="button"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFD166] transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                      </div>
                      );
                    })()}
                  </div>
                  {signupErrors.confirmPassword && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {signupErrors.confirmPassword.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-bold py-4 rounded-xl border-none cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_15px_30px_-5px_rgba(58,111,247,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(58,111,247,0.5)]"
                  style={{
                    background: "linear-gradient(135deg, #3A6FF7 0%, #6B2EFF 100%)",
                  }}
                >
                  {signupMutation.isPending ? "Sending OTP..." : "Start Journey"}
                </button>

                <div className="flex justify-center items-center mt-5">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => toast.error("Google login failed")}
                  />
                </div>
                <div className="md:hidden text-center mt-6">
                  <p className="text-sm text-[#94A3B8]">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignup(false)}
                      className="text-[#FFD166] font-bold"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ── OVERLAY SECTION ── */}
          <div
            className="absolute top-0 overflow-hidden z-10 transition-transform duration-[0.8s] hidden md:block"
            style={{
              left: "50%",
              width: "50%",
              height: "100%",
              transform: isSignup ? "translateX(-100%)" : "translateX(0)",
              transitionTimingFunction: "cubic-bezier(0.7,0,0.3,1)",
            }}
          >
            <div
              className="relative h-full text-white transition-transform duration-[0.8s]"
              style={{
                left: "-100%",
                width: "200%",
                transform: isSignup ? "translateX(50%)" : "translateX(0)",
                borderLeft: "1px solid rgba(255,209,102,0.15)",
                transitionTimingFunction: "cubic-bezier(0.7,0,0.3,1)",
              }}
            >
              {/* Rich deep background */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 60% 30%, #1a0a3d 0%, #0a0f2c 55%, #050816 100%)",
                }}
              />
              {/* Subtle top glow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(107,46,255,0.25) 0%, transparent 60%)",
                  pointerEvents: "none",
                }}
              />
              {/* Chess board animation — centered upper area */}
              <ChessAnimation isSignup={isSignup} />
              {/* Left panel — shown when signing up */}
              <div
                className="absolute flex flex-col items-center justify-end text-center top-0 h-full transition-transform duration-[0.8s]"
                style={{
                  width: "50%",
                  padding: "0 40px 80px",
                  transform: isSignup ? "translateX(0)" : "translateX(-20%)",
                  transitionTimingFunction: "cubic-bezier(0.7,0,0.3,1)",
                }}
              >
                <h1
                  className="text-3xl font-bold tracking-wide mb-2"
                  style={{ fontFamily: "'Cinzel', serif", color: "#FFF" }}
                >
                  Existing User?
                </h1>
                <p
                  className="text-sm mb-0"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  Log in and continue your path to chess mastery.
                </p>
                <button
                  className="mt-6 bg-transparent font-bold uppercase tracking-[0.2em] cursor-pointer rounded-full px-10 py-3.5 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                  style={{
                    border: "2px solid #FFD166",
                    color: "#FFD166",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget;
                    b.style.background = "#FFD166";
                    b.style.boxShadow = "0 0 30px rgba(255,209,102,0.5)";
                    b.style.color = "#0A0F2C";
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget;
                    b.style.background = "transparent";
                    b.style.boxShadow = "none";
                    b.style.color = "#FFD166";
                  }}
                  onClick={() => setIsSignup(false)}
                >
                  Sign In
                </button>
              </div>

              {/* Right panel — shown when logging in */}
              {role !== "ADMIN" && (
                <div
                  className="absolute right-0 flex flex-col items-center justify-end text-center top-0 h-full transition-transform duration-[0.8s]"
                  style={{
                    width: "50%",
                    padding: "0 40px 80px",
                    transform: isSignup ? "translateX(20%)" : "translateX(0)",
                    transitionTimingFunction: "cubic-bezier(0.7,0,0.3,1)",
                  }}
                >
                  <h1
                    className="text-3xl font-bold tracking-wide mb-2"
                    style={{ fontFamily: "'Cinzel', serif", color: "#FFF" }}
                  >
                    Hello, Friend!
                  </h1>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Start your journey and play with thousands of players
                    worldwide.
                  </p>
                  <button
                    className="mt-6 bg-transparent font-bold uppercase tracking-[0.2em] cursor-pointer rounded-full px-10 py-3.5 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                    style={{
                      border: "2px solid #FFD166",
                      color: "#FFD166",
                    }}
                    onMouseEnter={(e) => {
                      const b = e.currentTarget;
                      b.style.background = "#FFD166";
                      b.style.boxShadow = "0 0 30px rgba(255,209,102,0.5)";
                      b.style.color = "#0A0F2C";
                    }}
                    onMouseLeave={(e) => {
                      const b = e.currentTarget;
                      b.style.background = "transparent";
                      b.style.boxShadow = "none";
                      b.style.color = "#FFD166";
                    }}
                    onClick={() => setIsSignup(true)}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

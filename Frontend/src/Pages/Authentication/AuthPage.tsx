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
} from "lucide-react";

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
      <div
        className="flex items-center justify-center min-h-screen overflow-hidden font-inter text-white"
        style={{
          background:
            "radial-gradient(circle at top right, #1B1452, #0A0F2C, #050816)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Card */}
        <div
          className="relative flex overflow-hidden rounded-3xl border border-white/10"
          style={{
            width: "1000px",
            maxWidth: "95vw",
            height: "650px",
            background: "rgba(17, 25, 63, 0.4)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          }}
        >
          {/* ── LOGIN FORM ── */}
          <div
            className="absolute top-0 flex flex-col justify-center z-[2] transition-all duration-[0.8s]"
            style={{
              width: "50%",
              height: "100%",
              padding: "40px 60px",
              left: 0,
              transform: isSignup ? "translateX(100%)" : "translateX(0)",
              opacity: isSignup ? 0 : 1,
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
                  className="mb-0 text-3xl font-bold tracking-wide"
                  style={{
                    color: "#FFD166",
                    fontFamily: "'Cinzel', serif",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Welcome Back
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
                        className="w-full rounded-xl text-sm text-white pl-11 pr-4 py-3.5 focus:outline-none transition-all duration-300"
                        style={{
                          background: "#0A0F2C",
                          border: "1px solid rgba(58,111,247,0.2)",
                        }}
                        placeholder="Email Address"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#FFD166";
                          e.currentTarget.style.boxShadow =
                            "0 0 15px rgba(255,209,102,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(58,111,247,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                          rhfBlur(e);
                        }}
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
                      <input
                        type="password"
                        className="w-full rounded-xl text-sm text-white pl-11 pr-4 py-3.5 focus:outline-none transition-all duration-300"
                        style={{
                          background: "#0A0F2C",
                          border: "1px solid rgba(58,111,247,0.2)",
                        }}
                        placeholder="Password"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#FFD166";
                          e.currentTarget.style.boxShadow =
                            "0 0 15px rgba(255,209,102,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(58,111,247,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                          rhfBlur(e);
                        }}
                        {...rest}
                      />
                    );
                  })()}
                </div>
                {loginErrors.password && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {loginErrors.password.message}
                  </span>
                )}
              </div>

              <div className="text-right mb-4">
                <a
                  href="/forgotpassword"
                  className="text-sm"
                  style={{ color: "#FFD166" }}
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full text-white font-semibold py-3.5 rounded-xl border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
                style={{
                  background: "linear-gradient(90deg, #3A6FF7, #6B2EFF)",
                  boxShadow: "0 10px 30px rgba(58,111,247,0)",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLButtonElement).style.boxShadow =
                    "0 10px 30px rgba(58,111,247,0.4)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLButtonElement).style.boxShadow = "none")
                }
              >
                Sign In
              </button>

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
            </form>
          </div>

          {/* ── SIGNUP FORM ── */}
          <div
            className={`absolute top-0 flex flex-col justify-center transition-all duration-[0.8s] ${
              isSignup ? "auth-signup-active" : ""
            }`}
            style={{
              width: "50%",
              height: "100%",
              padding: "40px 60px",
              left: "50%",
              opacity: isSignup ? 1 : 0,
              zIndex: isSignup ? 5 : 1,
              transitionTimingFunction: "cubic-bezier(0.7,0,0.3,1)",
            }}
          >
            <form onSubmit={handleSignupSubmit(onSignupSubmit)}>
              <div className="flex items-center gap-2 mb-2">
                <CrownIcon
                  className="text-[#FFD166]"
                  size={28}
                  fill="#FFD166"
                />
                <h1
                  className="mb-0 text-3xl font-bold tracking-wide"
                  style={{
                    color: "#FFD166",
                    fontFamily: "'Cinzel', serif",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Create Account
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
                        className="w-full rounded-xl text-sm text-white pl-11 pr-4 py-3.5 focus:outline-none transition-all duration-300"
                        style={{
                          background: "#0A0F2C",
                          border: "1px solid rgba(58,111,247,0.2)",
                        }}
                        placeholder="Full Name"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#FFD166";
                          e.currentTarget.style.boxShadow =
                            "0 0 15px rgba(255,209,102,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(58,111,247,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                          rhfBlur(e);
                        }}
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
                        className="w-full rounded-xl text-sm text-white pl-11 pr-4 py-3.5 focus:outline-none transition-all duration-300"
                        style={{
                          background: "#0A0F2C",
                          border: "1px solid rgba(58,111,247,0.2)",
                        }}
                        placeholder="Email Address"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#FFD166";
                          e.currentTarget.style.boxShadow =
                            "0 0 15px rgba(255,209,102,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(58,111,247,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                          rhfBlur(e);
                        }}
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
                      <input
                        type="password"
                        className="w-full rounded-xl text-sm text-white pl-11 pr-4 py-3.5 focus:outline-none transition-all duration-300"
                        style={{
                          background: "#0A0F2C",
                          border: "1px solid rgba(58,111,247,0.2)",
                        }}
                        placeholder="Password"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#FFD166";
                          e.currentTarget.style.boxShadow =
                            "0 0 15px rgba(255,209,102,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(58,111,247,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                          rhfBlur(e);
                        }}
                        {...rest}
                      />
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
                      <input
                        type="password"
                        className="w-full rounded-xl text-sm text-white pl-11 pr-4 py-3.5 focus:outline-none transition-all duration-300"
                        style={{
                          background: "#0A0F2C",
                          border: "1px solid rgba(58,111,247,0.2)",
                        }}
                        placeholder="Confirm Password"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#FFD166";
                          e.currentTarget.style.boxShadow =
                            "0 0 15px rgba(255,209,102,0.2)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(58,111,247,0.2)";
                          e.currentTarget.style.boxShadow = "none";
                          rhfBlur(e);
                        }}
                        {...rest}
                      />
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
                className="w-full text-white font-semibold py-3.5 rounded-xl border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
                style={{
                  background: "linear-gradient(90deg, #6B2EFF, #3A6FF7)",
                }}
              >
                {signupMutation.isPending ? "Sending OTP..." : "Get Started"}
              </button>

              <div className="flex justify-center items-center mt-5">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google login failed")}
                />
              </div>
            </form>
          </div>

          {/* ── OVERLAY SECTION ── */}
          <div
            className="absolute top-0 overflow-hidden z-10 transition-transform duration-[0.8s]"
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
                  className="mt-5 bg-transparent font-semibold uppercase tracking-widest cursor-pointer rounded-full px-8 py-3 transition-all duration-300 hover:text-[#0A0F2C]"
                  style={{
                    border: "1px solid #FFD166",
                    color: "#FFD166",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget;
                    b.style.background = "#FFD166";
                    b.style.boxShadow = "0 0 20px rgba(255,209,102,0.4)";
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
                  className="mt-5 bg-transparent font-semibold uppercase tracking-widest cursor-pointer rounded-full px-8 py-3 transition-all duration-300"
                  style={{
                    border: "1px solid #FFD166",
                    color: "#FFD166",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget;
                    b.style.background = "#FFD166";
                    b.style.boxShadow = "0 0 20px rgba(255,209,102,0.4)";
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

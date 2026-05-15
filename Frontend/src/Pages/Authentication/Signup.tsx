import  { useState } from "react";
import {
  MailIcon,
  LockIcon,
  UserIcon,
  CrownIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { sendSignupOtp } from "../../Service/Api/Authapi";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import axios from "../../Service/Api/Axios/Useraxios";
import {
  setuserAccessToken,
  setUser,
} from "../../Store/Slices/Auth/UserAuthSlice";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, SignupFormData } from "../../Utils/Validators";

interface ApiErrorResponse {
  message: string;
}
interface CredentialResponse {
  clientId?: string;
  credential?: string;
  select_by?: string;
}

export function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      displayname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  // Password validation visuals
  const hasMinLength = watchedPassword.length >= 8;
  const hasNumber = /\d/.test(watchedPassword);
  const hasCapital = /[A-Z]/.test(watchedPassword);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(watchedPassword);

  const signupMutation = useMutation({
    mutationFn: sendSignupOtp,
    onSuccess: (_, variables) => {
      navigate("/verify-otp", {
        state: {
          displayname: variables.displayname,
          email: variables.email,
          password: watchedPassword,
        },
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate({
      displayname: data.displayname,
      email: data.email,
      role: "user",
    });
  };

  const onInvalid = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleGoogleLogin = async (response: CredentialResponse) => {
    try {
      const token = response.credential;
      if (!token) return toast.error("No Google token received");

      const res = await axios.post("/auth/googleAuth", { token, role: "user" });
      const accessToken = res.data.accessToken;

      dispatch(setuserAccessToken(accessToken));
      // Fetch full profile including signed avatarUrl
      const profileRes = await axios.get("/user/profile");
      dispatch(setUser(profileRes.data));

      navigate("/landing-page", { replace: true });
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0A0F2C 0%, #1B1452 100%)",
      }}
    >
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CrownIcon className="w-10 h-10 text-[#FFD166]" fill="#FFD166" />
            <h1
              className="text-4xl font-bold text-[#FFD166]"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Knightly
            </h1>
          </div>
          <p className="text-[#C9CAD9] text-sm">
            {" "}
            Begin your journey to mastery.{" "}
          </p>
        </div>

        <div
          className={`rounded-2xl p-10 backdrop-blur-md relative ${shake ? "animate-shake" : ""}`}
          style={{
            background: "rgba(17, 25, 63, 0.85)",
            border: "1px solid transparent",
            backgroundImage:
              "linear-gradient(rgba(17, 25, 63, 0.85), rgba(17, 25, 63, 0.85)), linear-gradient(135deg, #3A6FF7, #6B2EFF)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            boxShadow: "0 0 40px rgba(58, 111, 247, 0.2)",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-5">
            <div>
              <label className="text-white text-sm font-medium">
                Full Name
              </label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  {...register("displayname")}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white"
                />
              </div>
              {errors.displayname && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.displayname.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-white text-sm font-medium">Email</label>
              <div className="relative mt-1">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-white text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Create password"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}

              {/* Password Requirements */}
              <div className="mt-3 space-y-2 text-xs text-[#C9CAD9]">
                <p className="font-medium">Password must include:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon
                      className="w-3 h-3"
                      style={{ color: hasMinLength ? "#FFD166" : "#C9CAD9" }}
                    />
                    <span
                      style={{ color: hasMinLength ? "#FFD166" : "#C9CAD9" }}
                    >
                      8+ characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon
                      className="w-3 h-3"
                      style={{ color: hasNumber ? "#FFD166" : "#C9CAD9" }}
                    />
                    <span style={{ color: hasNumber ? "#FFD166" : "#C9CAD9" }}>
                      1 number
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon
                      className="w-3 h-3"
                      style={{ color: hasCapital ? "#FFD166" : "#C9CAD9" }}
                    />
                    <span style={{ color: hasCapital ? "#FFD166" : "#C9CAD9" }}>
                      1 capital letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon
                      className="w-3 h-3"
                      style={{ color: hasSymbol ? "#FFD166" : "#C9CAD9" }}
                    />
                    <span style={{ color: hasSymbol ? "#FFD166" : "#C9CAD9" }}>
                      1 symbol
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-white text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="w-full bg-transparent border border-purple-600 rounded-xl px-11 py-3 text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className={`w-full py-3 rounded-xl text-white font-semibold text-lg
              ${signupMutation.isPending ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"}`}
              style={{ background: "linear-gradient(90deg,#3A6FF7,#6B2EFF)" }}
            >
              {signupMutation.isPending ? "Sending OTP..." : "Create Account"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600" />
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-gray-600" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google Auth Failed")}
            />
          </div>

          <p className="text-center mt-6 text-gray-300">
            Already have an account?
            <a
              href="/user/login"
              className="text-[#FFD166] font-semibold hover:underline"
            >
              {" "}
              Login
            </a>
          </p>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

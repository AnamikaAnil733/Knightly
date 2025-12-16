import React, { useEffect, useState, useRef } from "react";
import { CheckCircle2Icon, XCircleIcon, CrownIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { KnightlyParticles } from "../../utils/Particle";
import api from "../../Service/api/axios"; 

/* ---------------- TYPES ---------------- */


interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface RegisterPayload {
  displayname: string;
  email: string;
  password: string;
}
interface ApiErrorResponse {
  message: string;
}

/* ---------------- API ---------------- */

const verifyOtpRequest = async (data: VerifyOtpPayload) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

const registerRequest = async (data: RegisterPayload) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

/* ---------------- COMPONENT ---------------- */

export function OTP() {
  /* ---------- ROUTER ---------- */
  const location = useLocation();
  const navigate = useNavigate();

  const { email, displayname, password } = location.state || {};


  // Guard: user should not access OTP page directly
  useEffect(() => {
    if (!email || !displayname || !password) {
      navigate("/signup");
    }
  }, [email, displayname, password, navigate]);

  /* ---------- STATE ---------- */
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", "",""]);
  const [timer, setTimer] = useState(300);
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* ---------- MUTATION ---------- */
  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: () => {
      navigate("/landing-page");
    },
    onError: () => {
      setMessage({
        type: "error",
        text: "Account creation failed. Try again.",
      });
    },
  });

  /* ---------- VERIFY OTP MUTATION ---------- */
  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpRequest,
    onSuccess: () => {
      setMessage({
        type: "success",
        text: "OTP verified. Creating account...",
      });

      registerMutation.mutate({
        displayname,
        email,
        password,
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      setMessage({
        type: "error",
        text: error.response?.data.message || "Invalid OTP. Try again.",
      });

      setOtp(["", "", "", "", "", "",""]);
      inputRefs.current[0]?.focus();
    },
  });

  /* ---------- HANDLERS ---------- */
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 6) {
      inputRefs.current[index + 1]?.focus();
    }

    setMessage({ type: null, text: "" });
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 7);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });

    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 6)]?.focus();
  };

  const handleVerify = () => {
    const otpString = otp.join("");

    if (otpString.length !==7) {
      setMessage({
        type: "error",
        text: "Please enter all 7 digits.",
      });
      return;
    }

    verifyOtpMutation.mutate({
      email,
      otp: otpString,
    });
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(300);
      setOtp(["", "", "", "", "", "",""]);
      setMessage({ type: null, text: "" });
      inputRefs.current[0]?.focus();
      // later: call resend OTP API
    }
  };
  const minutes = Math.floor(timer / 60);
const seconds = timer % 60;


  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen w-full bg-knightly-gradient relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 pointer-events-none">
        <KnightlyParticles />
      </div>

      <header className="pt-12 pb-8 text-center">
        <div className="flex justify-center gap-3 mb-2">
          <CrownIcon className="w-10 h-10 text-gold" />
          <h1 className="text-4xl font-bold text-gold">Knightly</h1>
        </div>
        <p className="text-gray-light text-sm">
          OTP sent to <b>{email}</b>
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-navy-midnight/85 p-8 rounded-2xl">
          <h2 className="text-center text-2xl text-gold mb-6">
            Verify Your Account
          </h2>

          {/* OTP INPUTS */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl rounded-xl bg-navy-deep text-white border border-purple"
              />
            ))}
          </div>

          {/* TIMER */}
          <div className="text-center mb-6">
            {timer > 0 ? (
              <span className="text-gray-light text-sm">
                Resend OTP in {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-gold text-sm underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* MESSAGE */}
          {message.type && (
            <div
              className={`flex items-center gap-2 mb-4 justify-center ${
                message.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2Icon />
              ) : (
                <XCircleIcon />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleVerify}
            disabled={verifyOtpMutation.isPending || registerMutation.isPending}
            className="w-full py-3 roundnavigateed-xl bg-button-gradient text-white font-semibold disabled:opacity-50"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Crown,
  ArrowRight,
  Loader2,
  AlertCircle,
  BookOpen,
  Star,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import userApi from "../../Service/Api/Axios/Useraxios";
import { updateUser } from "../../Store/Slices/Auth/UserAuthSlice";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const activatePremium = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setErrorMsg("No session ID found in the URL.");
        setStatus("error");
        return;
      }

      try {
        // Verify the Stripe session server-side and activate premium in the DB
        const response = await userApi.post("/payment/verify-session", { sessionId });

        // Update Redux state so UI immediately reflects premium status
        dispatch(updateUser({ 
          premium: true, 
          subscriptionStart: response.data.subscriptionStart 
        }));
        setStatus("success");
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Failed to activate premium. Please contact support.";
        setErrorMsg(msg);
        setStatus("error");
      }
    };

    activatePremium();
  }, [dispatch, searchParams]);

  return (
    <div className="min-h-screen bg-[#0B1437] text-white flex items-center justify-center p-6 relative overflow-hidden font-['Poppins']">
      {/* Royal Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,124,255,0.1),transparent)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6D5DF6]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFD166]/5 blur-[120px] rounded-full" />

      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center z-10"
          >
            <div className="relative mb-8">
              <Loader2 className="w-20 h-20 text-[#FFD166] animate-spin mx-auto opacity-50" />
              <Crown className="w-8 h-8 text-[#FFD166] absolute inset-0 m-auto" />
            </div>
            <h2 className="text-2xl font-cinzel mb-2 tracking-widest text-[#FFD166]">
              Anointing the King
            </h2>
            <p className="text-[#AAB3D1] animate-pulse">
              Securing your royal status...
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center z-10 bg-[#11193F]/40 backdrop-blur-xl p-12 rounded-[2.5rem] border border-red-500/20 shadow-2xl"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-cinzel mb-4 text-white">
              Something went wrong
            </h1>
            <p className="text-[#AAB3D1] mb-10 leading-relaxed">{errorMsg}</p>
            <button
              onClick={() => navigate("/pricing")}
              className="w-full py-5 rounded-2xl bg-white/5 text-white font-black tracking-widest uppercase hover:bg-white/10 transition-all border border-white/10"
            >
              Back to Pricing
            </button>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl w-full text-center z-10"
          >
            {/* Celebration Visual */}
            <div className="relative inline-block mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="w-40 h-40 bg-gradient-to-br from-[#1A1F4F] to-[#0B1437] rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,209,102,0.2)] border border-[#FFD166]/30 relative z-20"
              >
                <Crown className="w-20 h-20 text-[#FFD166] drop-shadow-[0_0_15px_rgba(255,209,102,0.5)]" />
              </motion.div>

              {/* Particle Effects */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: (i % 2 === 0 ? 1 : -1) * (40 + i * 20),
                    y: -60 - i * 10,
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[#FFD166] z-10"
                />
              ))}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.5 }}
                className="absolute -bottom-2 -right-2 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-[#0B1437] z-30 shadow-lg"
              >
                <CheckCircle2 className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-5xl md:text-6xl font-cinzel mb-6 tracking-tight"
              style={{
                fontFamily: "'Cinzel', serif",
                background: "linear-gradient(to bottom, #fff, #FFD166)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LONG LIVE THE KING
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-[#AAB3D1] text-xl font-light mb-12 leading-relaxed"
            >
              Your journey to mastery has begun. Your account is now fully
              upgraded with all Premium privileges.
            </motion.p>

            {/* Premium Features Quick Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/learn")}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#4F7CFF]/50 transition-all text-left flex items-center gap-5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#4F7CFF]/10 flex items-center justify-center group-hover:bg-[#4F7CFF]/20 transition-all">
                  <BookOpen className="w-6 h-6 text-[#4F7CFF]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Master Lessons
                  </h3>
                  <p className="text-xs text-[#AAB3D1]">Unlocked & Ready</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/puzzles")}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFD166]/50 transition-all text-left flex items-center gap-5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFD166]/10 flex items-center justify-center group-hover:bg-[#FFD166]/20 transition-all">
                  <Star className="w-6 h-6 text-[#FFD166]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Unlimited Puzzles
                  </h3>
                  <p className="text-xs text-[#AAB3D1]">Push your limits</p>
                </div>
              </motion.button>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={() => navigate("/landing-page")}
              className="group flex items-center gap-3 text-[#FFD166] text-sm font-black tracking-[0.2em] uppercase mx-auto hover:gap-5 transition-all"
            >
              Back to the Kingdom
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Royal Watermarks */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-[0.02] pointer-events-none hidden xl:block">
        <Crown className="w-72 h-72 text-white" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-[0.02] pointer-events-none hidden xl:block">
        <Sparkles className="w-64 h-64 text-[#FFD166]" />
      </div>
    </div>
  );
};

export default SuccessPage;

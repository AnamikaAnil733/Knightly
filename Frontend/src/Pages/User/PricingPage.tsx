import React from "react";
import {
  Check,
  Crown,
  Zap,
  Shield,
  BookOpen,
  Puzzle,
  ChevronLeft,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { PaymentService } from "../../Service/Api/PaymentService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSystemSettings } from "../../Context/SystemSettingsContext";

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSystemSettings();
  const handleUpgrade = async () => {
    try {
      const { url } = await PaymentService.createCheckoutSession();
      window.location.href = url;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to start upgrade process",
      );
    }
  };

  return (
    <div className="h-screen bg-[#0B1437] text-white overflow-hidden relative font-['Poppins'] flex flex-col">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#4F7CFF]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-[#6D5DF6]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 w-full h-full flex flex-col justify-between">
        {/* Header Navigation */}
        <header className="">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/landing-page")}
            className="flex items-center gap-2 text-[#AAB3D1] hover:text-white transition-all group px-4 py-2 rounded-full bg-white/5 border border-white/10"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-xs tracking-wide">Back</span>
          </motion.button>
        </header>

        {/* Hero Section */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD166]/10 border border-[#FFD166]/30 text-[#FFD166] text-[10px] font-black mb-4 tracking-[0.2em] uppercase"
          >
            <Star className="w-3 h-3 fill-[#FFD166]" />
            Royal Memberships
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl mb-4 font-cinzel tracking-tight"
            style={{
              fontFamily: "'Cinzel', serif",
              background: "linear-gradient(to bottom, #fff, #FFD166)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Claim Your Path
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#AAB3D1] text-base lg:text-lg max-w-xl mx-auto font-light"
          >
            Command the board with professional tools and unlimited access.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto items-stretch py-4 overflow-hidden">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col p-8 rounded-[2rem] bg-[#11193F]/40 backdrop-blur-xl border border-white/5 relative"
          >
            <div className="mb-6">
              <h2 className="text-[#AAB3D1] font-bold text-[10px] tracking-[0.2em] uppercase mb-2">
                The Squire
              </h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-[#AAB3D1] text-xs">/forever</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow overflow-y-auto no-scrollbar">
              {[
                { text: "Unlimited Online Matchmaking", icon: Shield },
                { text: "Access to Beginner Academy", icon: BookOpen },
                { text: "5 Daily Tactical Puzzles", icon: Puzzle },
                { text: "Standard Profile View", icon: Star },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-[#AAB3D1]"
                >
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">{item.text}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full py-4 rounded-xl bg-white/5 text-[#AAB3D1] font-black text-xs tracking-widest uppercase cursor-not-allowed border border-white/5"
            >
              ACTIVE
            </button>
          </motion.div>

          {/* Premium Tier */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col p-8 rounded-[2rem] bg-gradient-to-br from-[#1A1F4F] to-[#0B1437] border-2 border-[#FFD166]/30 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-6 right-[-30px] bg-[#FFD166] text-black px-10 py-1 rotate-45 font-black text-[9px] tracking-widest">
              PRO
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 text-[#FFD166] mb-2">
                <Crown className="w-4 h-4 fill-[#FFD166]" />
                <h2 className="font-black text-[10px] tracking-[0.2em] uppercase">
                  The Grandmaster
                </h2>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">
                  ${settings?.monthlyPrice || "9.99"}
                </span>
                <span className="text-[#C9CAD9] text-xs">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow overflow-y-auto no-scrollbar">
              {[
                { text: "Unlimited Tactical Puzzles", icon: Zap },
                { text: "ALL Pro Academy Lessons", icon: BookOpen },
                { text: "Advanced Engine Analysis", icon: Puzzle },
                { text: "Exclusive Profile Badge", icon: Crown },
                { text: "Ad-Free Concentration Zone", icon: Shield },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white">
                  <div className="w-5 h-5 rounded-lg bg-[#FFD166]/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-3 h-3 text-[#FFD166]" />
                  </div>
                  <span className="text-sm font-bold">{item.text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#6D5DF6] text-white font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.02] shadow-xl relative overflow-hidden group/btn"
            >
              UPGRADE NOW
            </button>
          </motion.div>
        </div>

        {/* Footer info */}
        <footer className="py-4 text-center">
          <p className="text-[#AAB3D1]/40 text-[10px] font-medium tracking-wide">
            Secure payment via Stripe • Cancel anytime
          </p>
        </footer>
      </div>

      {/* Decorative Watermarks */}
      <div className="absolute top-1/2 left-5 -translate-y-1/2 opacity-[0.03] pointer-events-none hidden xl:block">
        <Crown className="w-48 h-48 text-white rotate-[-15deg]" />
      </div>
      <div className="absolute bottom-5 right-5 opacity-[0.03] pointer-events-none hidden xl:block">
        <Sparkles className="w-32 h-32 text-[#FFD166] rotate-12" />
      </div>
    </div>
  );
};

export default PricingPage;

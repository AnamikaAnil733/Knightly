import React from "react";
import { Check, Crown, Zap, Shield, BookOpen, Puzzle } from "lucide-react";
import { motion } from "framer-motion";
import { PaymentService } from "../../Service/Api/PaymentService";
import { toast } from "react-hot-toast";

const PricingPage: React.FC = () => {
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
    <div className="min-h-screen bg-[#0a0a0b] text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            Unleash Your Potential
          </h1>
          <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto">
            Master the board with Knightly Premium. Get unlimited access to
            advanced training tools and exclusive features.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#151518] p-8 rounded-3xl border border-white/5 flex flex-col"
          >
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <p className="text-4xl font-black mb-6">$0</p>
            <ul className="space-y-4 mb-8 text-left flex-grow">
              <li className="flex items-center gap-3 text-gray-400">
                <Check className="text-green-500 w-5 h-5" /> Unlimited Online
                Play
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Check className="text-green-500 w-5 h-5" /> Basic Lessons
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Check className="text-green-500 w-5 h-5" /> 5 Puzzles Daily
              </li>
              <li className="flex items-center gap-3 text-gray-400/50">
                <Shield className="w-5 h-5" /> Ad-Supported
              </li>
            </ul>
            <button
              disabled
              className="w-full py-4 rounded-xl bg-white/5 text-gray-500 font-bold cursor-not-allowed"
            >
              Current Plan
            </button>
          </motion.div>

          {/* Premium Tier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-b from-[#1a1a1e] to-[#0a0a0b] p-8 rounded-3xl border-2 border-amber-500/50 relative overflow-hidden shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]"
          >
            <div className="absolute top-0 right-0 bg-amber-500 text-black px-4 py-1 rounded-bl-xl font-bold text-sm tracking-wider">
              MOST POPULAR
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="text-amber-500 w-6 h-6 fill-amber-500" />
              <h2 className="text-2xl font-bold">Premium</h2>
            </div>
            <p className="text-4xl font-black mb-6">
              $9.99
              <span className="text-base text-gray-400 font-normal">/mo</span>
            </p>
            <ul className="space-y-4 mb-8 text-left flex-grow">
              <li className="flex items-center gap-3">
                <Zap className="text-amber-500 w-5 h-5 fill-amber-500" />{" "}
                Unlimited Puzzles
              </li>
              <li className="flex items-center gap-3">
                <BookOpen className="text-amber-500 w-5 h-5" /> ALL Master
                Lessons
              </li>
              <li className="flex items-center gap-3">
                <Crown className="text-amber-500 w-5 h-5" /> Exclusive Profile
                Badge
              </li>
              <li className="flex items-center gap-3">
                <Shield className="text-amber-500 w-5 h-5" /> Ad-Free Experience
              </li>
              <li className="flex items-center gap-3">
                <Puzzle className="text-amber-500 w-5 h-5" /> Advanced Game
                Analysis
              </li>
            </ul>
            <button
              onClick={handleUpgrade}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold text-lg hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              Upgrade Now
            </button>
          </motion.div>
        </div>

        <p className="mt-12 text-gray-500 text-sm">
          Cancel anytime. Secure payment via Stripe.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;

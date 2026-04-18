import React from "react";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CancelPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <XCircle className="w-24 h-24 text-red-500 mx-auto mb-8" />

        <h1 className="text-4xl font-black mb-4">Payment Cancelled</h1>
        <p className="text-gray-400 mb-10 text-lg">
          No worries! Your payment was not processed. You can try again whenever
          you're ready.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/pricing")}
            className="w-full py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            Go Back to Pricing
          </button>
          <button
            onClick={() => navigate("/landing-page")}
            className="w-full py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CancelPage;

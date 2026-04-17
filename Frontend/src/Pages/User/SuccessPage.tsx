import React, { useEffect, useState } from "react";
import { CheckCircle2, Crown, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import userApi from "../../Service/Api/Axios/Useraxios";
import { setUser } from "../../Store/Slices/Auth/UserAuthSlice";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    // Re-fetch the user profile so the Redux store reflects the new premium status
    const refreshUserProfile = async () => {
      try {
        const profileRes = await userApi.get("/user/profile");
        dispatch(setUser(profileRes.data));
      } catch (err) {
        console.error("Failed to refresh user profile after payment:", err);
      } finally {
        setRefreshing(false);
      }
    };

    refreshUserProfile();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="relative inline-block mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Crown className="w-24 h-24 text-amber-500 fill-amber-500/20 mx-auto" />
          </motion.div>
          {refreshing ? (
            <Loader2 className="w-10 h-10 text-amber-400 absolute -bottom-2 -right-2 bg-[#0a0a0b] rounded-full animate-spin" />
          ) : (
            <CheckCircle2 className="w-10 h-10 text-green-500 absolute -bottom-2 -right-2 bg-[#0a0a0b] rounded-full" />
          )}
        </div>

        <h1 className="text-4xl font-black mb-4">Welcome to Premium!</h1>
        <p className="text-gray-400 mb-10 text-lg">
          Your payment was successful. Your account has been upgraded to
          Knightly Premium.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/landing-page")}
            className="w-full py-4 rounded-xl bg-amber-500 text-black font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
          >
            Back to Home <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/learn")}
            className="w-full py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
          >
            Start Premium Lessons
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;

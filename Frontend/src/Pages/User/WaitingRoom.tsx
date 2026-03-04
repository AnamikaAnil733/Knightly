import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Users, Shield, Zap, X } from "lucide-react";
import { socket } from "../../Service/Socket";
import { RootState } from "../../Store/Store";

export function WaitingRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.userAuth.user);
  
  // Get format from navigation state
  const { format = "3+0", modeName = "Blitz" } = location.state || {};
  
  const [queueSize, setQueueSize] = useState(1);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
      return;
    }

    // Step 1: Tell backend we are looking for a match with SPECIFIC format
    socket.emit("findMatch", user.id, format);

    // Step 2: Listen for updates
    socket.on("waiting", (data) => {
      setQueueSize(data.queueSize);
    });

    socket.on("matchFound", (data) => {
      const { gameId } = data;
      // Navigate to the match page with the new game ID
      navigate(`/match/${gameId}`);
    });

    socket.on("searchCancelled", () => {
      navigate("/landing-page");
    });

    // Animated dots for the "Looking for opponent" text
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => {
      socket.off("waiting");
      socket.off("matchFound");
      socket.off("searchCancelled");
      clearInterval(dotInterval);
    };
  }, [user, navigate, format]);

  const handleCancel = () => {
    socket.emit("cancelSearch");
  };

  return (
    <div className="w-full h-screen bg-[#0A0F2C] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3A6FF7]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6B2EFF]/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className="bg-[#11193F]/60 backdrop-blur-xl border border-[#3A6FF7]/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle animated border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3A6FF7]/10 to-transparent animate-pulse" />

          <div className="flex flex-col items-center text-center relative z-10">
            {/* Animated Icon Container */}
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border-2 border-dashed border-[#3A6FF7]/40 flex items-center justify-center"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 bg-gradient-to-tr from-[#3A6FF7] to-[#6B2EFF] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(58,111,247,0.4)]">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </div>

            {/* Title & Status */}
            <h2 className="text-3xl font-bold text-white mb-2 font-['Poppins']">
              Finding Opponent{dots}
            </h2>
            <p className="text-[#C9CAD9] text-sm mb-8 font-['Inter']">
              Searching for a <span className="text-[#3A6FF7] font-bold">{format.replace('+', ' | ')}</span> match
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
                <Users className="w-5 h-5 text-[#3A6FF7] mb-2" />
                <span className="text-white font-bold text-lg">
                  {queueSize}
                </span>
                <span className="text-[#C9CAD9] text-xs">Players waiting</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
                <Zap className="w-5 h-5 text-[#FFD166] mb-2" />
                <span className="text-white font-bold text-lg">{modeName}</span>
                <span className="text-[#C9CAD9] text-xs">Format</span>
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 hover:border-red-500/50 hover:text-red-400 font-medium"
            >
              <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Cancel Search
            </button>
          </div>
        </div>

        {/* User Badge */}
        {user && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 w-fit mx-auto"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#FFD166] overflow-hidden">
              <img
                src={user.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm leading-tight">
                {user.displayname}
              </p>
              <p className="text-[#C9CAD9] text-xs">
                Rating:{" "}
                {typeof user.rating === "number"
                  ? user.rating
                  : user.rating?.BLITZ || 1200}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Chess Piece Decorations */}
      <div className="absolute top-[20%] right-[15%] text-white/5 text-9xl select-none pointer-events-none transform rotate-12">
        ♞
      </div>
      <div className="absolute bottom-[20%] left-[10%] text-white/5 text-9xl select-none pointer-events-none transform -rotate-12">
        ♝
      </div>
    </div>
  );
}

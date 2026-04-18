import { motion } from "framer-motion";
import { Hammer, Sparkles, Shield, AlertTriangle } from "lucide-react";
import { useSystemSettings } from "../../Context/SystemSettingsContext";

export function MaintenancePage() {
  const { settings } = useSystemSettings();

  return (
    <div className="min-h-screen bg-[#060B28] flex items-center justify-center p-6 text-white font-['Poppins'] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#FFD166]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
          <div className="grid grid-cols-8 gap-4 rotate-12 scale-150">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square border border-white/10 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        {/* Animated Icon Container */}
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#FFD166]/20 to-transparent rounded-3xl border border-[#FFD166]/20 mb-8 relative group"
        >
          <Hammer className="text-[#FFD166] w-10 h-10 relative z-10" />
          <div className="absolute inset-0 bg-[#FFD166]/20 blur-xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-500" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          Polishing{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] to-[#fff]">
            the Throne.
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">
          <span className="font-bold text-white tracking-widest uppercase text-sm">
            {settings?.platformName || "Knightly"}
          </span>{" "}
          is undergoing essential refinements to enhance your professional chess
          experience. The grandmasters are at work—please stand by.
        </p>

        {/* Info Highlights */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
          <div className="flex items-center gap-3 px-6 py-4 bg-[#11193F]/60 backdrop-blur-md border border-[#FFD166]/10 rounded-2xl shadow-xl">
            <Shield className="text-[#FFD166]" size={18} />
            <span className="text-sm font-semibold tracking-wide uppercase">
              Downtime in Progress
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#FFD166] text-xs font-bold animate-pulse">
            Self-refreshing every few seconds...
          </div>
        </div>

        {/* Footer Design */}
        <div className="pt-10 border-t border-white/5 flex flex-wrap justify-center gap-x-12 gap-y-4 opacity-40">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3 text-[#FFD166]" />
            Coming Back Stronger
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
            <AlertTriangle className="w-3 h-3 text-[#FFD166]" />
            Maintenance Ongoing
          </div>
        </div>
      </motion.div>
    </div>
  );
}

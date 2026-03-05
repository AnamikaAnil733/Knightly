
import { motion, AnimatePresence } from "framer-motion";
import { FlagIcon, XIcon, HelpCircleIcon } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ResignModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#11193F] border border-[#FFD166]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E74C3C] to-transparent opacity-50" />
            
            <div className="p-8">
              {/* Icon & Close */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E74C3C]/10 border border-[#E74C3C]/20">
                  <FlagIcon className="h-6 w-6 text-[#E74C3C]" />
                </div>
                <button 
                  onClick={onClose}
                  className="rounded-lg p-1 text-[#9ca3af] hover:bg-white/5 hover:text-white transition-colors"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Text Content */}
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                 Resign Game?
              </h2>
              <p className="text-[#9ca3af] leading-relaxed mb-8">
                Are you sure you want to resign? This will end the game and count as a loss. There is no way to undo this action.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  Keep Playing
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-[#E74C3C] text-white font-semibold shadow-[0_4px_15px_rgba(231,76,60,0.3)] hover:bg-[#C0392B] hover:shadow-[0_6px_20px_rgba(231,76,60,0.4)] transition-all active:scale-[0.98]"
                >
                  Resign
                </button>
              </div>
            </div>

            {/* Subtle bottom detail */}
            <div className="bg-[#0A0F2C]/50 px-8 py-4 border-t border-white/5 flex items-center gap-2">
              <HelpCircleIcon className="h-4 w-4 text-[#9ca3af]" />
              <span className="text-xs text-[#9ca3af]">Think twice before you surrender, knight!</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

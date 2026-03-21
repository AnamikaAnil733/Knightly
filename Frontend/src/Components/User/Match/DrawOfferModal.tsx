import { motion, AnimatePresence } from "framer-motion";
import { HandshakeIcon, XIcon, CheckIcon } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DrawOfferModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD166] to-transparent opacity-50" />

            <div className="p-8">
              {/* Icon & Close */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD166]/10 border border-[#FFD166]/20">
                  <HandshakeIcon className="h-6 w-6 text-[#FFD166]" />
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
                Draw Offered
              </h2>
              <p className="text-[#9ca3af] leading-relaxed mb-8">
                Your opponent has offered a draw. Do you want to accept it?
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-[#FFD166] text-[#0A0F2C] font-bold shadow-[0_4px_15px_rgba(255,209,102,0.3)] hover:bg-[#F4C14D] hover:shadow-[0_6px_20px_rgba(255,209,102,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  Accept Draw
                </button>
              </div>
            </div>

            <div className="bg-[#0A0F2C]/50 px-8 py-4 border-t border-white/5 flex items-center gap-2">
              <span className="text-xs text-[#9ca3af]">
                A draw will result in +0 ELO for both players.
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

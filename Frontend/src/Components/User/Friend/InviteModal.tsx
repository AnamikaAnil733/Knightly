import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, XIcon, CheckIcon, Timer } from "lucide-react";

type Props = {
  isOpen: boolean;
  senderId: string;
  senderName: string;
  gameFormat: string;
  senderIsPublic?: boolean;
  onClose: () => void;
  onAccept: (isPublic: boolean) => void;
  onReject: () => void;
};

export function InviteModal(props: Props) {
  return (
    <AnimatePresence>
      {props.isOpen && <InviteModalContent {...props} />}
    </AnimatePresence>
  );
}

function InviteModalContent({
  senderName,
  gameFormat,
  senderIsPublic = false,
  onClose,
  onAccept,
  onReject,
}: Props) {
  const [receiverIsPublic, setReceiverIsPublic] = useState(senderIsPublic);

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#0F172A] border border-[#FFD166]/30 shadow-[0_0_50px_rgba(0,0,0,0.6)]"
      >
        {/* Header Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD166] to-transparent opacity-50" />

        <div className="p-8">
          {/* Icon & Close */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD166]/10 border border-[#FFD166]/20">
              <Swords className="h-8 w-8 text-[#FFD166]" />
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-[#9ca3af] hover:bg-white/10 hover:text-white transition-colors"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Text Content */}
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
            Challenge Received!
          </h2>
          <p className="text-[#94A3B8] leading-relaxed mb-6">
            Your friend{" "}
            <span className="text-[#FFD166] font-bold">
              {senderName || "Player"}
            </span>{" "}
            has challenged you to a match.
          </p>

          {/* Game Info & Public Toggle */}
          <div className="space-y-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFD166]/10 rounded-lg">
                  <Timer className="w-5 h-5 text-[#FFD166]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] uppercase font-bold tracking-wider">
                    Time Control
                  </p>
                  <p className="text-white font-bold">{gameFormat}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#64748B] uppercase font-bold tracking-wider">
                  Match Visibility
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded ${senderIsPublic ? "bg-[#06D6A0]/10 text-[#06D6A0]" : "bg-white/5 text-[#94A3B8]"}`}
                  >
                    Sender: {senderIsPublic ? "Public" : "Private"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white">
                  Make Public?
                </span>
                <button
                  onClick={() => setReceiverIsPublic(!receiverIsPublic)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    receiverIsPublic ? "bg-[#FFD166]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      receiverIsPublic ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {senderIsPublic && !receiverIsPublic && (
              <p className="text-[10px] text-[#FFD166]/60 italic">
                Note: Match will be private unless you also agree to make it
                public.
              </p>
            )}
            {!senderIsPublic && receiverIsPublic && (
              <p className="text-[10px] text-[#FFD166]/60 italic">
                Note: Match will be private because the sender requested a
                private game.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onReject();
                onClose();
              }}
              className="flex-1 px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              Decline
            </button>
            <button
              onClick={() => {
                onAccept(receiverIsPublic);
                onClose();
              }}
              className="flex-1 px-6 py-4 rounded-xl bg-[#FFD166] text-[#0F172A] font-black shadow-[0_4px_20px_rgba(255,209,102,0.4)] hover:bg-[#F4C14D] hover:shadow-[0_6px_25px_rgba(255,209,102,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-6 h-6 stroke-[3px]" />
              Accept
            </button>
          </div>
        </div>

        <div className="bg-[#0A0F2C]/50 px-8 py-4 border-t border-white/5">
          <span className="text-xs text-[#64748B] font-medium">
            Accepting will redirect you to the game immediately.
          </span>
        </div>
      </motion.div>
    </div>
  );
}

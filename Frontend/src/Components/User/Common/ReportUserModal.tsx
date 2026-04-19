import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, XIcon, AlertCircle, Loader2 } from "lucide-react";
import axios from "../../../Service/Api/Axios/Useraxios";
import toast from "react-hot-toast";

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

interface ReportEvidence {
  gameId?: string;
  chatSnapshot?: ChatMessage[];
}

interface ReportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedId: string;
  reportedName: string;
  gameId?: string;
  chatMessages?: ChatMessage[];
}

export const ReportUserModal = ({
  isOpen,
  onClose,
  reportedId,
  reportedName,
  gameId,
  chatMessages,
}: ReportUserModalProps) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    { value: "CHEATING", label: "Cheating / Engine Use" },
    { value: "HARASSMENT", label: "Harassment / Verbal Abuse" },
    { value: "SPAM", label: "Spam / Advertising" },
    { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content" },
    { value: "OTHER", label: "Other / Unsportsmanlike Conduct" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !description) {
      toast.error("Please provide a reason and description");
      return;
    }

    setIsSubmitting(true);
    try {
      const evidence: ReportEvidence = {};
      if (gameId) evidence.gameId = gameId;
      if (chatMessages && chatMessages.length > 0) {
        // Take last 20 messages for context
        evidence.chatSnapshot = chatMessages.slice(-20);
      }

      await axios.post("/user/reports", {
        reportedId,
        reason,
        description,
        evidence,
      });

      toast.success("Report submitted. Thank you for keeping Knightly safe!");
      onClose();
      // Reset form
      setReason("");
      setDescription("");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      console.error("Report submission failed:", error);
      toast.error(err.response?.data?.error || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0B1437]/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#11193F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <Flag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Report User
                    </h2>
                    <p className="text-sm text-gray-400">
                      Reporting {reportedName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl border border-white/5 hover:bg-white/5 text-gray-400 transition-all"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-4 items-start">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-500/80 leading-relaxed">
                  Flagged activity is reviewed by our moderation team. Abuse of
                  the reporting system may lead to actions against your own
                  account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 ml-1">
                    Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-[#4F7CFF] transition-all appearance-none"
                  >
                    <option value="" className="bg-[#11193F]">
                      Select a reason
                    </option>
                    {reasons.map((r) => (
                      <option
                        key={r.value}
                        value={r.value}
                        className="bg-[#11193F]"
                      >
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 ml-1">
                    Details
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us what happened..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-[#4F7CFF] transition-all h-32 resize-none text-sm leading-relaxed"
                  />
                </div>

                {gameId && (
                  <div className="flex items-center gap-2 text-[10px] text-[#4F7CFF] font-black uppercase tracking-widest bg-[#4F7CFF]/10 w-fit px-3 py-1 rounded-full border border-[#4F7CFF]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F7CFF] animate-pulse" />
                    Automatic Match Context Attached
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 px-6 rounded-2xl border border-white/5 text-gray-300 font-bold hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 px-6 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

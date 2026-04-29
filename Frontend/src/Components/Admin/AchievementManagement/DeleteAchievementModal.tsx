import { useState } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import type { Achievement } from "../../../Service/Api/AdminAchievementApi";

interface Props {
  achievement: Achievement;
  onClose:     () => void;
  onConfirm:   (id: string) => Promise<void>;
}

export function DeleteAchievementModal({ achievement, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm(achievement.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-red-500/20
                      bg-gradient-to-br from-[#0A0F2C] via-[#0d1535] to-[#060B2E]
                      shadow-[0_0_60px_rgba(239,68,68,0.15)]">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400
                     hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Body */}
        <div className="p-8 flex flex-col items-center text-center">
          {/* Warning icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20
                          flex items-center justify-center mb-5">
            <AlertTriangle size={28} className="text-red-400" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Delete Achievement</h2>
          <p className="text-sm text-gray-400 mb-1">
            You are about to permanently delete:
          </p>
          <p className="text-base font-semibold text-[#FFD166] mb-4">
            "{achievement.title}"
          </p>
          <p className="text-xs text-gray-500">
            This action cannot be undone. Any users who have earned this
            achievement will no longer see it.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300
                       border border-white/10 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2
                       px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-r from-red-600 to-red-500
                       border border-red-400/20
                       hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
          >
            <Trash2 size={15} />
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

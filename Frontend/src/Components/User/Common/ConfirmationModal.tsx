import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-navy-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header/Banner */}
            <div className="h-2 bg-red-500" />

            <div className="p-8">
              {/* Close Button */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon & Content */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h3 className="text-2xl font-cinzel font-bold text-white mb-3">
                  {title}
                </h3>

                <p className="text-gray-light font-inter leading-relaxed mb-8">
                  {message}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10 disabled:opacity-50"
                  >
                    {cancelLabel}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      confirmLabel
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

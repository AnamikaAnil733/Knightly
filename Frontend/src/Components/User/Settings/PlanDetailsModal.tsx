import { XIcon, Crown, Calendar, CheckCircle2 } from "lucide-react";
import { IUser } from "../../../Types/UserTypes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
}

export const PlanDetailsModal = ({ isOpen, onClose, user }: Props) => {
  if (!isOpen || !user) return null;

  const subscriptionDate = user.subscriptionStart
    ? new Date(user.subscriptionStart)
    : null;

  // Calculate expiry date (30 days after subscription start)
  const expiryDate = subscriptionDate ? new Date(subscriptionDate) : null;
  if (expiryDate) {
    expiryDate.setDate(expiryDate.getDate() + 30);
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div
        className="bg-[#0B1437] w-full max-w-md rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(79,124,255,0.2)] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD166]/10 blur-3xl rounded-full -mr-16 -mt-16" />

        {/* Header */}
        <div className="bg-gradient-to-br from-[#1A2352] to-[#0B1437] p-8 border-b border-white/5 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all hover:rotate-90 p-1"
          >
            <XIcon size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F7E7CE] via-[#E7D4B5] to-[#D4AF37] flex items-center justify-center mb-4 shadow-lg shadow-[#D4AF37]/20">
              <Crown className="w-8 h-8 text-black fill-black" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Knightly Pro
            </h3>
            <div className="mt-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest">
                Active Member
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Joined On
                </p>
                <p className="text-white font-semibold">
                  {subscriptionDate
                    ? formatDate(subscriptionDate)
                    : "Processing..."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFD166]/5 border border-[#FFD166]/20 hover:border-[#FFD166]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FFD166]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#FFD166]" />
              </div>
              <div>
                <p className="text-[10px] text-[#FFD166] font-bold uppercase tracking-wider">
                  Next Billing
                </p>
                <p className="text-white font-bold text-lg">
                  {expiryDate ? formatDate(expiryDate) : "Processing..."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Premium Privileges
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Unlimited Tactical Engine Puzzles",
                "Grandmaster Course Access",
                "Advanced Game Performance Analysis",
                "Exclusive Royal Badge & Flair",
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/20 flex flex-col gap-3">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#6D5DF6] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#4F7CFF]/20"
          >
            Keep Dominating
          </button>
          <p className="text-[10px] text-center text-gray-500">
            Managed via Stripe Billing • Cancel anytime in billing portal
          </p>
        </div>
      </div>
    </div>
  );
};

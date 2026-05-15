import {
  // PaletteIcon,
  GridIcon,
  // SlidersIcon,
  UserIcon,
  Crown,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../Store/Store";
import { PlanDetailsModal } from "./PlanDetailsModal";
interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}
export const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const navItems = [
    // {
    //   id: "theme",
    //   label: "Website Theme",
    //   icon: <PaletteIcon size={20} />,
    // },
    {
      id: "chessboard",
      label: "Chessboard Themes",
      icon: <GridIcon size={20} />,
    },
    // {
    //   id: "controls",
    //   label: "Controls",
    //   icon: <SlidersIcon size={20} />,
    // },
    {
      id: "account",
      label: "Account",
      icon: <UserIcon size={20} />,
    },
  ];
  return (
    <aside className="w-64 bg-[#11193F] p-6 hidden md:block">
      <div className="mb-8">
        <h1 className="text-xl font-bold flex items-center"></h1>
        <p className="text-[#FFD166] font-bold  mt-1">User Settings</p>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all text-left ${activeSection === item.id ? "text-white border-l-4 border-[#6B2EFF] bg-opacity-10 bg-[#7C4DFF]" : "text-[#C9CAD9] hover:bg-[#1A2352] hover:text-white"}`}
              >
                <span
                  className={`mr-3 ${activeSection === item.id ? "text-[#7C4DFF]" : ""}`}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {!user?.premium && (
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-[#F7E7CE]/10 to-[#D4AF37]/5 border border-[#F7E7CE]/20">
          <div className="flex items-center gap-2 mb-2 text-[#E7D4B5]">
            <Crown className="w-5 h-5 fill-[#E7D4B5]" />
            <span className="font-bold text-sm tracking-wide">PREMIUM</span>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Unlock unlimited puzzles and advanced engine analysis.
          </p>
          <Link
            to="/pricing"
            className="block w-full py-2.5 text-center rounded-xl bg-gradient-to-r from-[#F7E7CE] to-[#E7D4B5] text-black font-bold text-sm hover:scale-[1.02] transition-transform active:scale-[0.98]"
          >
            Upgrade Now
          </Link>
        </div>
      )}

      {user?.premium && (
        <button
          onClick={() => setIsPlanModalOpen(true)}
          className="mt-8 w-full p-4 rounded-2xl bg-[#1A2352]/50 border border-[#F7E7CE]/20 flex items-center gap-3 hover:bg-[#1A2352]/80 transition-all text-left group"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#F7E7CE] to-[#E7D4B5] group-hover:scale-110 transition-transform">
            <Crown className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Knightly Pro</p>
            <p className="text-xs text-[#E7D4B5]/80">Active Member</p>
          </div>
        </button>
      )}

      <PlanDetailsModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        user={user}
      />
    </aside>
  );
};

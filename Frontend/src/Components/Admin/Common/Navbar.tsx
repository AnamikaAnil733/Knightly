import React from "react";
import { UserIcon } from "lucide-react";
interface NavbarProps {
  toggleSidebar: () => void;
}
const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-[#0A0F2C] border-b border-[#1e2547] py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-[#1e2547] text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#1e2547] rounded-full flex items-center justify-center">
              <UserIcon size={18} className="text-[#FFD166]" />
            </div>
            <span className="ml-2 text-sm font-medium text-[#FFD166]">
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;

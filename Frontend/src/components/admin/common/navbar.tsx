import React from 'react'
import { BellIcon, SearchIcon, UserIcon } from 'lucide-react'
interface NavbarProps {
  toggleSidebar: () => void
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
          <div className="ml-4 relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1e2547] text-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD166] w-64"
            />
            <SearchIcon
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md hover:bg-[#1e2547] text-gray-300 relative">
            <BellIcon size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#1e2547] rounded-full flex items-center justify-center">
              <UserIcon size={18} className="text-[#FFD166]" />
            </div>
            <span className="ml-2 text-sm font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  )
}
export default Navbar

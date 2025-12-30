import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboardIcon,
  UsersIcon,
  PuzzleIcon,
  FileTextIcon,
  FlagIcon,
  AwardIcon,
  CreditCardIcon,
  DollarSignIcon,
  GraduationCapIcon,
  GamepadIcon,
  BarChartIcon,
  SettingsIcon,
  LogOutIcon,
} from 'lucide-react'
interface SidebarProps {
  collapsed: boolean
}
const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navItems = [
    {
      icon: <LayoutDashboardIcon size={20} />,
      name: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: <UsersIcon size={20} />,
      name: 'User Management',
      path: '/admin/users',
    },
    {
      icon: <PuzzleIcon size={20} />,
      name: 'Puzzle Management',
      path: '/puzzles',
    },
    {
      icon: <FileTextIcon size={20} />,
      name: 'Blog Management',
      path: '/blog',
    },
    {
      icon: <FlagIcon size={20} />,
      name: 'Report Center',
      path: '/reports',
    },
    {
      icon: <AwardIcon size={20} />,
      name: 'Rewards & Achievements',
      path: '/rewards',
    },
    {
      icon: <CreditCardIcon size={20} />,
      name: 'Subscriptions',
      path: '/subscriptions',
    },
    {
      icon: <DollarSignIcon size={20} />,
      name: 'Transactions',
      path: '/transactions',
    },
    {
      icon: <GraduationCapIcon size={20} />,
      name: 'Learning Lessons',
      path: '/learning',
    },
    {
      icon: <GamepadIcon size={20} />,
      name: 'Live Game Monitor',
      path: '/live-games',
    },
    {
      icon: <BarChartIcon size={20} />,
      name: 'Analytics',
      path: '/analytics',
    },
    {
      icon: <SettingsIcon size={20} />,
      name: 'System Settings',
      path: '/settings',
    },
  ]
  return (
    <aside
      className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out h-screen bg-[#0A0F2C] border-r border-[#1e2547] shadow-lg`}
    >
      <div className="p-4 flex items-center justify-center">
        {!collapsed && (
          <h1 className="text-xl font-bold text-[#FFD166] font-['Poppins']">
            Knightly Chess
          </h1>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-[#FFD166] rounded-md flex items-center justify-center">
            <span className="text-[#0A0F2C] font-bold">K</span>
          </div>
        )}
      </div>
      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-[#1e2547] text-[#FFD166] shadow-[0_0_10px_rgba(107,46,255,0.3)]' : 'text-gray-300 hover:bg-[#1e2547] hover:text-[#FFD166]'}`
                }
              >
                <span className="text-[#FFD166]">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full p-4">
        <button className="flex items-center w-full p-3 text-gray-300 rounded-lg hover:bg-[#1e2547] hover:text-[#FFD166] transition-all duration-200">
          <span className="text-[#FFD166]">
            <LogOutIcon size={20} />
          </span>
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
export default Sidebar

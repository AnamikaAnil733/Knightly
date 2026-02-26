import { PaletteIcon, GridIcon, SlidersIcon, UserIcon} from 'lucide-react'
interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}
export const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const navItems = [
    {
      id: 'theme',
      label: 'Website Theme',
      icon: <PaletteIcon size={20} />,
    },
    {
      id: 'chessboard',
      label: 'Chessboard Themes',
      icon: <GridIcon size={20} />,
    },
    {
      id: 'controls',
      label: 'Controls',
      icon: <SlidersIcon size={20} />,
    },
    {
      id: 'account',
      label: 'Account',
      icon: <UserIcon size={20} />,
    },
  ]
  return (
    <aside className="w-64 bg-[#11193F] p-6 hidden md:block">
      <div className="mb-8">
        <h1 className="text-xl font-bold flex items-center">
       
        </h1>
        <p className="text-[#FFD166] font-bold  mt-1">User Settings</p>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all text-left ${activeSection === item.id ? 'text-white border-l-4 border-[#6B2EFF] bg-opacity-10 bg-[#7C4DFF]' : 'text-[#C9CAD9] hover:bg-[#1A2352] hover:text-white'}`}
              >
                <span
                  className={`mr-3 ${activeSection === item.id ? 'text-[#7C4DFF]' : ''}`}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
     
    </aside>
  )
}

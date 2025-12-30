
import { CrownIcon } from 'lucide-react'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/slices/auth/userAuthSlice';

export function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state:any) => state.userAuth.user);

  function handleLogout(){
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("user");
  
    dispatch(logout());       // clears redux state
    navigate("/user/login");  // redirect page
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F2C]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CrownIcon className="w-8 h-8 text-[#FFD166]" />
          <span
            className="text-2xl font-bold text-[#FFD166]"
            style={{
              fontFamily: 'Cinzel, serif',
            }}
          >
            Knightly
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Play
          </a>
          
          <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Leaderboard
          </a>
          <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            About
          </a>
        
        <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            setting
          </a>
          </div>
        
        <div>
          {user ? (
       <div className="flex items-center gap-3">
       <Link  to="/user/profile"  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3A6FF7] to-[#6B2EFF] text-white font-semibold">
         {user.displayname}
       </Link>
     
       <button
         onClick={handleLogout}
         className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold"
       >
         Logout
       </button>
     </div>
          ) : (
            <div className="flex gap-3">
              <Link 
                to="/user/login" 
                className="px-6 py-2 rounded-full bg-[#3A6FF7] text-white font-semibold hover:bg-[#3458d4]"
              >
                Login
              </Link>

              <Link 
                to="/signup" 
                className="px-6 py-2 rounded-full bg-[#6B2EFF] text-white font-semibold hover:bg-[#5620d4]"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

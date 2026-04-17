import { useState, useEffect, useRef } from "react";
import {
  CrownIcon,
  Users,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../Store/Slices/Auth/UserAuthSlice";
import { RootState } from "../../../Store/Store";
import { getPendingRequests } from "../../../Service/Api/FriendApi";
import { socket } from "../../../Service/Socket";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userAuth.user);
  const [pendingCount, setPendingCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadPendingCount = async () => {
    try {
      const data = await getPendingRequests();
      setPendingCount(data.requests?.length || 0);
    } catch (err) {
      console.error("Failed to load pending count:", err);
    }
  };

  useEffect(() => {
    if (user) {
      loadPendingCount();
      socket.on("receive_friend_request", () => {
        setPendingCount((prev) => prev + 1);
      });
      return () => {
        socket.off("receive_friend_request");
      };
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/user/login", { replace: true });
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  }

  const mainNavLinks = [
    { to: "/landing-page", label: "Home" },
    { to: "/play", label: "Play", asExternal: true },
    { to: "/live", label: "Live" },
    { to: "/leaderboard", label: "Leaderboard", asExternal: true },
    {
      to: "/friends",
      label: "Friends",
      icon: <Users className="w-4 h-4" />,
      hasBadge: true,
    },
    { to: "/puzzles", label: "Puzzles" },
    { to: "/learn", label: "Learn" },
    { to: "/about", label: "About" },
  ];

  const userMenuItems = [
    {
      to: "/user/profile",
      label: "My Profile",
      icon: <UserIcon className="w-4 h-4" />,
    },
    {
      to: "/dashboard/blogs",
      label: "My Blogs",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: <SettingsIcon className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1437]/90 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/landing-page"
          className="flex items-center gap-2 flex-shrink-0"
        >
          <CrownIcon className="w-8 h-8 text-[#FFD166]" />
          <span
            className="text-2xl font-bold text-[#FFD166] hidden sm:block"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Knightly
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {mainNavLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 relative group text-sm font-semibold tracking-wide"
            >
              {link.icon}
              {link.label}
              {link.hasBadge && pendingCount > 0 && (
                <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] bg-[#EF476F] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0B1437]">
                  {pendingCount}
                </span>
              )}
              <span className="absolute bottom-[-18px] left-0 w-0 h-[2px] bg-[#4F7CFF] transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Action Buttons / User Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Premium Button */}
              {!user.premium && (
                <Link
                  to="/pricing"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F7E7CE] via-[#E7D4B5] to-[#D4AF37] text-black font-bold text-xs uppercase tracking-tighter hover:shadow-[0_0_20px_rgba(231,212,181,0.3)] transition-all"
                >
                  <CrownIcon className="w-3.5 h-3.5 fill-black" />
                  Upgrade
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4F7CFF] to-[#6D5DF6] flex items-center justify-center text-sm font-bold border border-white/20">
                    {user.displayname.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white max-w-[100px] truncate">
                    {user.displayname}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-[#11193F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                    >
                      <div className="px-4 py-2 mb-2 border-b border-white/5">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          Account
                        </p>
                      </div>

                      {userMenuItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                        >
                          <span className="text-gray-400">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}

                      <div className="h-px bg-white/5 my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/user/login"
                className="text-sm font-semibold text-white hover:text-[#4F7CFF] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/"
                className="px-5 py-2 rounded-lg bg-[#4F7CFF] text-white text-sm font-bold hover:bg-[#3d60c7] shadow-lg shadow-[#4F7CFF]/20 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white hover:text-[#4F7CFF] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 top-[73px] bg-[#0B1437] z-40 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col p-6 gap-2">
              {[...mainNavLinks, ...userMenuItems].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="p-4 text-lg text-white hover:bg-white/5 rounded-xl flex items-center gap-4 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-gray-400 group-hover:text-[#4F7CFF] transition-colors">
                    {link.icon || <div className="w-4 h-4" />}
                  </span>
                  {link.label}
                  {link.hasBadge && pendingCount > 0 && (
                    <span className="ml-auto bg-[#EF476F] text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              ))}

              {user && (
                <button
                  onClick={handleLogout}
                  className="mt-4 p-4 text-lg text-red-500 hover:bg-red-500/5 rounded-xl flex items-center gap-4"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

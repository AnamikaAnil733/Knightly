import { useState, useEffect } from "react";
import { CrownIcon, Users, Menu, X } from "lucide-react";
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
      const timer = setTimeout(() => {
        loadPendingCount();
      }, 0);

      socket.on("receive_friend_request", () => {
        setPendingCount((prev) => prev + 1);
      });

      return () => {
        clearTimeout(timer);
        socket.off("receive_friend_request");
      };
    }
  }, [user]);

  function handleLogout() {
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/user/login", { replace: true });
    setIsMenuOpen(false);
  }

  const navLinks = [
    { to: "/landing-page", label: "Home" },
    { to: "/play", label: "Play", asExternal: true },
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
    { to: "/settings", label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1437]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/landing-page" className="flex items-center gap-2">
          <CrownIcon className="w-8 h-8 text-[#FFD166]" />
          <span
            className="text-2xl font-bold text-[#FFD166]"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Knightly
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-white hover:text-[#4F7CFF] transition-colors flex items-center gap-2 relative group"
            >
              {link.icon}
              {link.label}
              {link.hasBadge && pendingCount > 0 && (
                <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] bg-[#EF476F] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#0B1437] animate-pulse">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* User Actions / Hamburger */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/user/profile"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#4F7CFF] to-[#6D5DF6] text-white font-semibold"
                >
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
                  className="px-6 py-2 rounded-full bg-[#4F7CFF] text-white font-semibold hover:bg-[#3d60c7]"
                >
                  Login
                </Link>
                <Link
                  to="/"
                  className="px-6 py-2 rounded-full bg-[#6D5DF6] text-white font-semibold hover:bg-[#5649c2]"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-[#4F7CFF] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0B1437] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-lg text-white hover:text-[#4F7CFF] transition-colors flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    {link.icon}
                    {link.label}
                  </span>
                  {link.hasBadge && pendingCount > 0 && (
                    <span className="min-w-[20px] h-[20px] bg-[#EF476F] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-2">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 mt-4">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/user/profile"
                      className="text-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#3A6FF7] to-[#6B2EFF] text-white font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {user.displayname}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/user/login"
                      className="text-center px-6 py-3 rounded-xl bg-[#3A6FF7] text-white font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/"
                      className="text-center px-6 py-3 rounded-xl bg-[#6B2EFF] text-white font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Signup
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

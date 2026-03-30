import { useState, useEffect } from "react";
import { CrownIcon, Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../Store/Slices/Auth/UserAuthSlice";
import { RootState } from "../../../Store/Store";
import { getPendingRequests } from "../../../Service/Api/FriendApi";
import { socket } from "../../../Service/Socket";

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userAuth.user);
  const [pendingCount, setPendingCount] = useState(0);

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
    dispatch(logout()); // clears redux state
    navigate("/user/login", { replace: true }); // redirect page
  }
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F2C]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CrownIcon className="w-8 h-8 text-[#FFD166]" />
          <span
            className="text-2xl font-bold text-[#FFD166]"
            style={{
              fontFamily: "Cinzel, serif",
            }}
          >
            Knightly
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/landing-page"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Home
          </Link>
          <a
            href="/play"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Play
          </a>

          <a
            href="/leaderboard"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Leaderboard
          </a>
          <Link
            to="/friends"
            className="text-white hover:text-[#FFD166] transition-colors flex items-center gap-2 relative group"
          >
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Friends
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] bg-[#EF476F] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#0A0F2C] animate-pulse">
                {pendingCount}
              </span>
            )}
          </Link>
          <Link
            to="/puzzles"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Puzzles
          </Link>
          <Link
            to="/learn"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Learn
          </Link>
          <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            About
          </a>

          <Link
            to="/settings"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Settings
          </Link>
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/user/profile"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3A6FF7] to-[#6B2EFF] text-white font-semibold"
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
                className="px-6 py-2 rounded-full bg-[#3A6FF7] text-white font-semibold hover:bg-[#3458d4]"
              >
                Login
              </Link>

              <Link
                to="/"
                className="px-6 py-2 rounded-full bg-[#6B2EFF] text-white font-semibold hover:bg-[#5620d4]"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

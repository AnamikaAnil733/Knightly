import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, GameType } from "../../Types/User";
import { getAvatarUrl } from "../../Utils/GetAvatarurl";
import { updateUser } from "../../Store/Slices/Auth/UserAuthSlice";
import toast from "react-hot-toast";
import axios from "../../Service/Api/Axios/Useraxios";

// Icons
import { Flame, Clock, Target, Crown, ChevronRight, Zap } from "lucide-react";
import { GameHistoryList } from "./GameHistoryList";
import { PerformanceChart } from "./PerformanceChart";
import { StreakCalendar } from "./Puzzle/StreakCalendar";
import { fetchSolveHistory } from "../../Service/Api/UserPuzzleApi";
import { AchievementSection } from "./Achievement/AchievementSection";

const generateDiceBearUrl = () => {
  const base = "https://api.dicebear.com/7.x/adventurer/svg";
  const randomSeed = Math.random().toString(36).substring(2);
  return `${base}?seed=${randomSeed}`;
};

export function ProfileUser() {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [solveHistory, setSolveHistory] = useState<string[]>([]);

  const [selectedRatingType, setSelectedRatingType] =
    useState<GameType>("RAPID");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetchSolveHistory();
        if (response.success) {
          setSolveHistory(response.history);
        }
      } catch (err) {
        console.error("Failed to fetch solve history:", err);
      }
    };
    fetchHistory();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B1437] flex items-center justify-center">
        <p className="text-[#FFD166] animate-pulse uppercase tracking-widest text-sm font-bold">
          Synchronizing Profile...
        </p>
      </div>
    );
  }

  const winRate =
    user.gamesPlayed > 0
      ? Math.round((user.gamesWin / user.gamesPlayed) * 100)
      : 0;

  // Filter history for the selected type
  const filteredHistory = (user.ratingHistory || []).filter(
    (h) => h.type === selectedRatingType,
  );

  const handleAvatarError = async () => {
    if (avatarError) return;
    setAvatarError(true);
    try {
      const profileRes = await axios.get("/user/profile");
      dispatch(updateUser({ avatarUrl: profileRes.data.avatarUrl }));
      setAvatarError(false);
    } catch {
      // silently fail
    }
  };

  const handleGenerateAvatar = async () => {
    try {
      setLoading(true);
      const diceBearUrl = generateDiceBearUrl();
      await axios.post("/user/avatar/dicebear", { diceBearUrl });
      const profileRes = await axios.get("/user/profile");
      dispatch(updateUser(profileRes.data));
      toast.success("Avatar updated!");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B1437] min-h-screen text-white">
      <div className="max-w-[1500px] mx-auto px-10 sm:px-20 lg:px-28 pt-28 pb-12">
        <div className="grid grid-cols-12 gap-10">
          {/* SIDEBAR */}
          <div className="col-span-12 lg:col-span-3 space-y-8">
            <div className="bg-[#111C44] rounded-2xl p-8 border border-[#7B61FF]/20 shadow-xl">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={getAvatarUrl(user)}
                    onError={handleAvatarError}
                    className={`w-40 h-40 rounded-2xl object-cover border-4 border-[#FFD166]/20 shadow-2xl transition-all ${loading ? "opacity-50" : ""}`}
                    alt="avatar"
                  />
                  <button
                    onClick={handleGenerateAvatar}
                    className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold uppercase"
                  >
                    Change
                  </button>
                </div>

                <div className="mt-6 text-center w-full">
                  <h1 className="text-2xl font-bold text-[#FFD166] flex items-center justify-center gap-2">
                    {user.displayname}
                    {user.premium && (
                      <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                    )}
                  </h1>
                  <p className="text-gray-400 text-sm mt-1 lowercase">
                    @{user.displayname.replace(" ", "_")}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">
                    Performance Ratings
                  </p>
                  {[
                    {
                      label: "Rapid",
                      value: user.rating?.RAPID || 300,
                      key: "RAPID",
                    },
                    {
                      label: "Blitz",
                      value: user.rating?.BLITZ || 300,
                      key: "BLITZ",
                    },
                    {
                      label: "Bullet",
                      value: user.rating?.BULLET || 300,
                      key: "BULLET",
                    },
                    {
                      label: "Classical",
                      value: user.rating?.CLASSICAL || 300,
                      key: "CLASSICAL",
                    },
                  ].map((r, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedRatingType(r.key as GameType)}
                      className={`flex justify-between items-center px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedRatingType === r.key
                          ? "bg-[#7B61FF]/10 border-[#7B61FF]/20 shadow-lg"
                          : "bg-white/2 border-white/5 hover:border-[#7B61FF]/30"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${selectedRatingType === r.key ? "text-[#7B61FF]" : "text-gray-500"}`}
                      >
                        {r.label}
                      </span>
                      <span
                        className={`text-sm font-black ${selectedRatingType === r.key ? "text-[#FFD166]" : "text-gray-200"}`}
                      >
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="bg-[#111C44] rounded-2xl p-8 border border-[#7B61FF]/20">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6">
                Tactical Stats
              </h3>
              <div className="space-y-5">
                {[
                  {
                    label: "Games Played",
                    value: user.gamesPlayed,
                    icon: <Clock size={14} />,
                    color: "text-blue-400",
                  },
                  {
                    label: "Total Wins",
                    value: user.gamesWin,
                    icon: <Flame size={14} />,
                    color: "text-orange-400",
                  },
                  {
                    label: "Win Rate",
                    value: `${winRate}%`,
                    icon: <Target size={14} />,
                    color: "text-[#FFD166]",
                  },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-400">
                      {stat.icon}
                      <span className="text-xs font-medium">{stat.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="col-span-12 lg:col-span-9 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* RATING CARD */}
              <div className="md:col-span-2 bg-[#111C44] rounded-2xl p-8 border border-[#7B61FF]/20 relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                      {selectedRatingType} Rating
                    </h3>
                    <p className="text-4xl font-black text-[#FFD166] mt-1">
                      {user.rating?.[selectedRatingType] || 300}
                    </p>
                  </div>
                  <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
                    {["BULLET", "BLITZ", "RAPID", "CLASSICAL"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedRatingType(type as GameType)}
                        className={`px-3 py-1 rounded-md text-[9px] font-black transition-all ${
                          selectedRatingType === type
                            ? "bg-[#7B61FF] text-white shadow-lg"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[240px] w-full relative">
                  <PerformanceChart data={filteredHistory} />
                </div>
              </div>

              {/* WIN RATE CARD */}
              <div className="bg-[#111C44] rounded-2xl p-8 border border-[#7B61FF]/20 flex flex-col items-center justify-center">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 text-center">
                  Victory Rate
                </h3>
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="402"
                      strokeDashoffset={402 * (1 - winRate / 100)}
                      className="text-[#FFD166]"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-3xl font-black text-white">
                    {winRate}%
                  </span>
                </div>
                <p className="mt-6 text-[10px] text-gray-500 uppercase font-bold tracking-widest text-center">
                  Across {user.gamesPlayed} Matches
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* STREAK CARD */}
              <div className="bg-[#111C44] rounded-2xl p-8 border border-[#7B61FF]/20 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Consistency
                  </h3>
                  <p className="text-4xl font-black text-[#FFD166]">
                    {user.currentStreak || 0}
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                    Current Day Streak
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center min-w-[120px]">
                  <Zap size={24} className="text-[#FFD166] mx-auto mb-2" />
                  <p className="text-lg font-black">
                    {user.longestStreak || 0}
                  </p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">
                    Best Streak
                  </p>
                </div>
              </div>

              {/* BADGES CARD */}
              <div className="bg-[#111C44] rounded-2xl p-8 border border-[#7B61FF]/20">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                    Trophy Collection
                  </h3>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
                <AchievementSection isCompact={true} />
              </div>
            </div>

            {/* HEATMAP */}
            <div className="bg-[#111C44] rounded-2xl p-8 border border-[#7B61FF]/20">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-8 text-center md:text-left">
                Activity Pulse
              </h3>
              <div className="w-full overflow-x-auto no-scrollbar">
                <StreakCalendar history={solveHistory} weeksToShow={52} />
              </div>
            </div>

            {/* HISTORY TABLE */}
            <div className="bg-[#111C44] rounded-2xl border border-[#7B61FF]/20 overflow-hidden shadow-2xl">
              <div className="px-8 py-6 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Recent Activity
                </h3>
              </div>
              <div className="bg-[#111C44]">
                <GameHistoryList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

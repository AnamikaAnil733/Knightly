import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../types/user";
import { getAvatarUrl } from "../../utils/getAvatarurl";
import { updateUser } from "../../store/slices/auth/userAuthSlice";
import toast from "react-hot-toast";

import axios from "../../Service/api/axios/Useraxios";

// Icons
import {
  TrophyIcon,
  FlameIcon,
  ClockIcon,
  TargetIcon,
} from "lucide-react";

/* ---------------- DiceBear URL Generator ---------------- */
const generateDiceBearUrl = (userId: string) => {
  const base = "https://api.dicebear.com/7.x/adventurer/svg";

  const params = new URLSearchParams({
    seed: userId
  });

  return `${base}?${params.toString()}`;
};

export function ProfileUser() {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  if (!user) {
    return <p className="text-center text-white pt-32">Loading profile...</p>;
  }

  /* ---------------- DiceBear HANDLER ---------------- */

  const handleGenerateAvatar = async () => {
    try {
      setLoading(true);

      const diceBearUrl = generateDiceBearUrl(user.id);
      console.log(diceBearUrl)

      const res = await axios.post("/user/avatar/dicebear", {
        diceBearUrl,
      });

      dispatch(updateUser({ avatarUrl: res.data.avatarUrl }));

      toast.success("Avatar generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate avatar");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-navy-dark min-h-screen px-6 pt-28 pb-12 text-white">
      {/* PROFILE HEADER */}
      <div className="max-w-7xl mx-auto flex justify-center mb-12">
        <div className="bg-navy-card rounded-2xl p-10 border border-purple-accent/30 w-full max-w-2xl">
          <div className="flex items-center gap-8">
            <div className="relative">
              <img
                src={getAvatarUrl(user)}
                className={`w-32 h-32 rounded-full border-4 border-gold shadow-lg ${
                  loading ? "opacity-50" : ""
                }`}
                alt="User avatar"
              />

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <span className="text-sm">Generating...</span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gold">
                {user.displayname}
              </h1>
              <p className="mt-3 text-3xl font-bold text-gold">
                {user.rating}
              </p>
              <span className="text-sm text-gray-light">Rating</span>

              {/* Generate Avatar Button */}
              <button
                onClick={handleGenerateAvatar}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm disabled:opacity-50"
              >
                Generate Avatar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            icon: <TrophyIcon className="w-8 h-8 text-gold" />,
            label: "Total Games",
            value: user.gamesPlayed,
          },
          {
            icon: <FlameIcon className="w-8 h-8 text-gold" />,
            label: "Wins",
            value: user.gamesWin,
          },
          {
            icon: <ClockIcon className="w-8 h-8 text-gold" />,
            label: "Losses",
            value: user.gamesPlayed - user.gamesWin,
          },
          {
            icon: <TargetIcon className="w-8 h-8 text-gold" />,
            label: "Win Rate",
            value:
              user.gamesPlayed > 0
                ? `${Math.round(
                    (user.gamesWin / user.gamesPlayed) * 100
                  )}%`
                : "0%",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-navy-card p-6 rounded-xl border border-blue-electric/30"
          >
            {item.icon}
            <p className="text-gray-light text-sm mt-2">{item.label}</p>
            <p className="text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

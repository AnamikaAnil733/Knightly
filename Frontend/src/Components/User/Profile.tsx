import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Types/User";
import { getAvatarUrl } from "../../Utils/GetAvatarurl";
import { updateUser } from "../../Store/Slices/Auth/UserAuthSlice";
import toast from "react-hot-toast";

import axios from "../../Service/Api/Axios/Useraxios";

// Icons
import {
  TrophyIcon,
  FlameIcon,
  ClockIcon,
  TargetIcon,
} from "lucide-react";

/* ---------------- DiceBear URL Generator ---------------- */
const generateDiceBearUrl = () => {
  const base = "https://api.dicebear.com/7.x/adventurer/svg";
  const randomSeed = Math.random().toString(36).substring(2);
  return `${base}?seed=${randomSeed}`;
};

export function ProfileUser() {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  



  if (!user) {
    return <p className="text-center text-white pt-32">Loading profile...</p>;
  }

 

  /* ---------------- Generate DiceBear Avatar ---------------- */
  const handleGenerateAvatar = async () => {
    try {
      setLoading(true);

      const diceBearUrl = generateDiceBearUrl();

      
      await axios.post("/user/avatar/dicebear", {
        diceBearUrl,
      });

    
      const profileRes = await axios.get("/user/profile");
      console.log(profileRes)

      dispatch(updateUser(profileRes.data));

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

              <div className="mt-3">
                <p className="text-3xl font-bold text-gold">
                  {user.rating?.RAPID || 1200}
                </p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>Blitz: {user.rating?.BLITZ || 1200}</span>
                  <span>Bullet: {user.rating?.BULLET || 1200}</span>
                </div>
              </div>

              <span className="text-sm text-gray-light">Active Rating</span>

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

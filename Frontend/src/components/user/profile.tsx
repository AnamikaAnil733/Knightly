import React from "react";
import { useSelector } from "react-redux";
import {
  TrophyIcon,
  FlameIcon,
  ClockIcon,
  TargetIcon,
  SettingsIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dummy Data (Replace with backend values later)
const performanceData = [
  { day: "Mon", rating: 1820 },
  { day: "Tue", rating: 1835 },
  { day: "Wed", rating: 1815 },
  { day: "Thu", rating: 1850 },
  { day: "Fri", rating: 1845 },
  { day: "Sat", rating: 1870 },
  { day: "Sun", rating: 1870 },
];

const recentMatches = [
  {
    opponent: "ChessMaster99",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ChessMaster99",
    result: "Win",
    ratingChange: "+12",
    time: "5 min Blitz",
    date: "Jan 15",
  },
  {
    opponent: "QueenGambit",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=QueenGambit",
    result: "Loss",
    ratingChange: "-8",
    time: "10 min Rapid",
    date: "Jan 14",
  },
];

const achievements = [
  { icon: "♕", title: "Tourney Champion", description: "Won a tournament" },
  { icon: "♘", title: "100 Wins", description: "Achieved 100 victories" },
  { icon: "♟", title: "Strategic Mastermind", description: "Master tactician" },
  { icon: "♔", title: "Grand Master", description: "Reached 1800+ rating" },
  { icon: "♖", title: "Speed Demon", description: "Won 50 bullet games" },
  { icon: "♗", title: "Opening Expert", description: "Mastered 10 openings" },
];

export function ProfileUser() {
    const user = useSelector((state:any) => state.userAuth.user);
    if (!user) return <p className="text-center text-white pt-32">Loading profile...</p>;
  return (
    <div className="bg-navy-dark min-h-screen px-6 pt-28 pb-12 text-white font-poppins">


      {/* PROFILE HEADER */}
      <div className="max-w-7xl mx-auto flex justify-center mb-12">
        <div className="bg-navy-card rounded-2xl p-10 border border-purple-accent/30 shadow-xl shadow-purple-accent/10 w-full max-w-2xl">
          <div className="flex items-center gap-8">

            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
              className="w-32 h-32 rounded-full border-4 border-gold shadow-lg"
            />

            <div className="flex-1">
              <h1 className="text-4xl font-cinzel text-gold font-bold">
              {user.displayname}
              </h1>
             

              <div className="mt-3">
                <span className="text-sm text-gray-light">Rating</span>
                <p className="text-3xl font-bold text-gold">{user.rating}</p>
              </div>
            </div>

            <button className="py-3 px-6 border border-gold rounded-lg text-gold hover:bg-gold/10 transition flex items-center gap-2">
              <SettingsIcon size={18} /> Edit Profile
            </button>

          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: <TrophyIcon className="w-8 h-8 text-gold" />, label: "Total Games", value:user.gamesPlayed},
          { icon: <FlameIcon className="w-8 h-8 text-gold" />, label: "Wins", value:user.gamesWin },
          { icon: <ClockIcon className="w-8 h-8 text-gold" />, label: "Losses", value: user.gamesPlayed-user.gamesWin },
          { icon: <TargetIcon className="w-8 h-8 text-gold" />, label: "Win Rate", value: user.gamesPlayed>0?((user.gamesWin/user.gamesPlayed)*100).toFixed(0):0},
        ].map((item, index) => (
          <div key={index} className="bg-navy-card p-6 rounded-xl border border-blue-electric/30 hover:scale-105 transition">
            {item.icon}
            <p className="text-gray-light text-sm mt-2">{item.label}</p>
            <p className="text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* PERFORMANCE GRAPH */}
      <div className="max-w-7xl mx-auto bg-navy-card p-8 rounded-2xl border border-blue-electric/20 mb-12">
        <h2 className="text-2xl font-semibold text-gold mb-6">Performance History</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3B5F" />
            <XAxis dataKey="day" stroke="#C9CAD9" />
            <YAxis stroke="#C9CAD9" />
            <Tooltip
              contentStyle={{ background: "#11193F", borderColor: "#FFD166" }}
              labelStyle={{ color: "#FFD166" }}
            />
            <Line type="monotone" dataKey="rating" stroke="#FFD166" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT MATCHES */}
      <div className="max-w-7xl mx-auto bg-navy-card p-8 rounded-2xl border border-blue-electric/20 mb-12">
        <h2 className="text-2xl font-semibold text-gold mb-6">Recent Matches</h2>
        <div className="space-y-4">
          {recentMatches.map((match, index) => (
            <div key={index} className="flex items-center justify-between bg-navy-dark p-4 rounded-lg hover:bg-navy-dark/70 transition">
              <div className="flex items-center gap-4">
                <img src={match.avatar} className="w-12 h-12 rounded-full" />
                <span>{match.opponent}</span>
              </div>
              <span className="text-sm">{match.time}</span>
              <span className="text-sm">{match.date}</span>
              <span className={`${match.result === "Win" ? "text-gold" : "text-red-400"}`}>{match.ratingChange}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="max-w-7xl mx-auto bg-navy-card p-8 rounded-2xl border border-blue-electric/20">
        <h2 className="text-2xl font-semibold text-gold mb-6">Achievements</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((a, i) => (
            <div key={i} className="bg-navy-dark p-6 rounded-xl text-center hover:bg-gold/10 transition cursor-pointer">
              <span className="text-5xl block mb-3">{a.icon}</span>
              <p className="text-gray-light hover:text-gold">{a.title}</p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

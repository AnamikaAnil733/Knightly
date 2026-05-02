import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Gamepad2,
  Banknote,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Puzzle,
  BookOpen,
  MonitorPlay,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../../Service/Api/Axios/Adminaxios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { AnalyticsData } from "../../Types/AdminTypes";

export function AdminDashboard() {
  const { data, isLoading, isError } = useQuery<AnalyticsData>({
    queryKey: ["admin-dashboard-summary"],
    queryFn: async () => {
      const res = await axios.get("/admin/analytics");
      return res.data;
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load dashboard metrics");
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0A0F2C]">
        <div className="animate-spin h-10 w-10 border-4 border-[#FFD166] border-t-transparent rounded-full" />
      </div>
    );
  }

  const getIcon = (name: string) => {
    switch (name) {
      case "users":
        return <Users className="h-6 w-6 text-[#FFD166]" />;
      case "gamepad":
        return <Gamepad2 className="h-6 w-6 text-[#FFD166]" />;
      case "banknotes":
        return <Banknote className="h-6 w-6 text-[#FFD166]" />;
      case "user-plus":
        return <UserPlus className="h-6 w-6 text-[#FFD166]" />;
      default:
        return <ShieldCheck className="h-6 w-6 text-[#FFD166]" />;
    }
  };

  const quickActions = [
    {
      name: "Manage Puzzles",
      icon: <Puzzle size={20} />,
      path: "/admin/puzzles",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      name: "Review Lessons",
      icon: <BookOpen size={20} />,
      path: "/admin/lessons",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      name: "Monitor Live",
      icon: <MonitorPlay size={20} />,
      path: "/admin/live-games",
      color: "bg-green-500/10 text-green-500",
    },
    {
      name: "Check Payments",
      icon: <Banknote size={20} />,
      path: "/admin/transactions",
      color: "bg-yellow-500/10 text-yellow-500",
    },
  ];

  return (
    <div className="w-full min-h-screen p-8 bg-[#0A0F2C] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome Back, Admin</h1>
          <p className="text-gray-400">
            Here's a summary of what's happening on Knightly today.
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {data?.stats.slice(0, 4).map((stat, i) => (
            <div
              key={i}
              className="bg-[#11193F] p-6 rounded-2xl border border-[#1e2547] shadow-xl hover:border-[#FFD166]/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#0A0F2C] rounded-xl border border-[#1e2547]">
                  {getIcon(stat.icon)}
                </div>
                <span className="text-xs bg-[#FFD166]/10 text-[#FFD166] px-2 py-1 rounded-full font-bold">
                  Live Data
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: ACTIVITY */}
          <div className="lg:col-span-2 space-y-8">
            {/* RECENT TRANSACTIONS */}
            <div className="bg-[#11193F] rounded-2xl border border-[#1e2547] shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#1e2547] flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-[#FFD166]" />
                  Recent Successful Payments
                </h3>
                <Link
                  to="/admin/transactions"
                  className="text-[#FFD166] text-sm hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="divide-y divide-[#1e2547]">
                {data?.recentTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="p-4 hover:bg-[#0A0F2C]/50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
                        {tx.userId?.displayname?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {tx.userId?.displayname || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {tx.userId?.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#06D6A0]">
                        +${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  to={action.path}
                  className={`p-4 rounded-xl ${action.color} border border-current/10 hover:border-current/30 transition-all flex flex-col items-center gap-3`}
                >
                  {action.icon}
                  <span className="text-xs font-bold text-center">
                    {action.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: NEW USERS */}
          <div className="bg-[#11193F] rounded-2xl border border-[#1e2547] shadow-xl overflow-hidden h-fit">
            <div className="p-6 border-b border-[#1e2547]">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#FFD166]" />
                New Members
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {data?.recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#0A0F2C]/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full border border-[#1e2547] overflow-hidden">
                    {user.avatarKey ? (
                      <img
                        src={user.avatarKey}
                        alt={user.displayname}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#1e2547] flex items-center justify-center text-gray-400">
                        <Users size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{user.displayname}</p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${user.role === "ADMIN" ? "bg-red-500/10 text-red-500" : "bg-[#FFD166]/10 text-[#FFD166]"}`}
                  >
                    {user.role}
                  </div>
                </div>
              ))}
              <Link
                to="/admin/users"
                className="block w-full text-center py-2 text-sm text-[#FFD166] hover:bg-[#FFD166]/5 rounded-lg border border-[#FFD166]/10 transition-colors"
              >
                View All Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

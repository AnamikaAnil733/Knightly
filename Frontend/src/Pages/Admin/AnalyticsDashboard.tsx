import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area 
} from "recharts";
import { Users, Gamepad2, Banknote, UserPlus, TrendingUp, Activity } from "lucide-react";
import axios from "../../Service/Api/Axios/Adminaxios";
import toast from "react-hot-toast";
import { useEffect } from "react";

type Stat = {
  label: string;
  value: string;
  icon: string;
};

type AnalyticsData = {
  growthData: { date: string; count: number }[];
  gameDistribution: { name: string; count: number }[];
  stats: Stat[];
};

const COLORS = ["#FFD166", "#06D6A0", "#118AB2", "#EF476F", "#9333EA"];

export function AnalyticsDashboard() {
  const { data, isLoading, isError } = useQuery<AnalyticsData>({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await axios.get("/admin/analytics");
      return res.data;
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load analytics data");
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
      case "users": return <Users className="h-6 w-6 text-[#FFD166]" />;
      case "gamepad": return <Gamepad2 className="h-6 w-6 text-[#FFD166]" />;
      case "banknotes": return <Banknote className="h-6 w-6 text-[#FFD166]" />;
      case "user-plus": return <UserPlus className="h-6 w-6 text-[#FFD166]" />;
      default: return <TrendingUp className="h-6 w-6 text-[#FFD166]" />;
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-[#0A0F2C] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#FFD166]/10 rounded-lg">
            <Activity className="h-8 w-8 text-[#FFD166]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Platform Analytics</h1>
            <p className="text-gray-400 text-sm">Comprehensive performance metrics and growth data</p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {data?.stats.map((stat, i) => (
            <div key={i} className="bg-[#11193F] p-6 rounded-2xl border border-[#1e2547] flex items-center gap-4 shadow-lg">
              <div className="p-3 bg-[#0A0F2C] rounded-xl border border-[#1e2547]">
                {getIcon(stat.icon)}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* USER GROWTH CHART */}
          <div className="lg:col-span-2 bg-[#11193F] p-6 rounded-2xl border border-[#1e2547] shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FFD166]" />
              User Growth (Last 30 Days)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.growthData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD166" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFD166" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2547" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickFormatter={(str) => new Date(str).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#4b5563" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0F2C', borderColor: '#1e2547', borderRadius: '8px' }}
                    itemStyle={{ color: '#FFD166' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#FFD166" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GAME DISTRIBUTION */}
          <div className="bg-[#11193F] p-6 rounded-2xl border border-[#1e2547] shadow-xl flex flex-col">
            <h3 className="text-lg font-bold mb-6">Game Mode Popularity</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.gameDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {data?.gameDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0F2C', borderColor: '#1e2547', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY MOCK/Placeholder for future extension */}
        <div className="bg-[#11193F] p-6 rounded-2xl border border-[#1e2547] shadow-xl mb-8">
            <h3 className="text-lg font-bold mb-6">Activity Peak Hours (Estimated)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { hour: '00', activity: 20 }, { hour: '04', activity: 10 }, 
                  { hour: '08', activity: 40 }, { hour: '12', activity: 70 }, 
                  { hour: '16', activity: 90 }, { hour: '20', activity: 100 }, 
                  { hour: '23', activity: 50 },
                ]}>
                  <XAxis dataKey="hour" stroke="#4b5563" fontSize={10} name="Hour of Day" />
                  <YAxis stroke="#4b5563" fontSize={10} hide />
                  <Tooltip 
                     cursor={{fill: '#1e2547'}}
                     contentStyle={{ backgroundColor: '#0A0F2C', borderColor: '#1e2547', borderRadius: '8px' }}
                  />
                  <Bar dataKey="activity" fill="#118AB2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceChartProps {
  data: {
    rating: number;
    date: string;
    type: string;
  }[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Process data to format dates for X-axis
  const chartData = data
    .slice(-7) // Last 7 matches for now, like the Mon-Sun in image
    .map((entry) => ({
      ...entry,
      displayDate: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      }).format(new Date(entry.date)),
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-navy-card rounded-2xl p-8 border border-purple-accent/20 text-center text-gray-400">
        Play more games to see your performance history!
      </div>
    );
  }

  return (
    <div className="bg-navy-card rounded-2xl p-8 border border-purple-accent/20 mb-12">
      <h2 className="text-xl font-bold mb-8 text-gold uppercase tracking-wider">
        Performance History
      </h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1e293b"
            />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #FFD70050",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#FFD700" }}
              cursor={{ stroke: "#FFD70050", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="rating"
              stroke="#FFD700"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRating)"
              dot={{ fill: "#FFD700", strokeWidth: 2, r: 4, stroke: "#0f172a" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

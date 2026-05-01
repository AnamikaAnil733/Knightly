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
  // Process data with unique IDs and clear date labels
  const chartData = data.slice(-10).map((entry, index) => ({
    ...entry,
    id: index,
    // Short date for the axis (e.g., "20 Apr")
    shortDate: new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
    }).format(new Date(entry.date)),
    // Full date for the tooltip
    fullDate: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(entry.date)),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-xs uppercase font-bold tracking-widest">
        No performance data available
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFD166" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FFD166" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#ffffff05"
          />
          <XAxis
            dataKey="id"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 9, fontWeight: "bold" }}
            tickFormatter={(index) => chartData[index]?.shortDate} // Show "20 Apr" labels
            dy={10}
          />
          <YAxis
            domain={["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }}
          />
          <Tooltip
            labelFormatter={(index) => chartData[index]?.fullDate}
            contentStyle={{
              backgroundColor: "#111C44",
              border: "1px solid #7B61FF30",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            itemStyle={{ color: "#FFD166", fontWeight: "bold" }}
            cursor={{ stroke: "#FFD16620", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="rating"
            stroke="#FFD166"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRating)"
            dot={{ fill: "#FFD166", strokeWidth: 2, r: 4, stroke: "#111C44" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

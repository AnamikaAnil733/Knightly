import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

interface SubscriptionStatsProps {
  stats: StatItem[];
}

export const SubscriptionStats: React.FC<SubscriptionStatsProps> = ({
  stats,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-[#0A0F2C] border border-[#1e2547] rounded-xl p-6 shadow-lg hover:shadow-[#FFD166]/10 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-400 text-sm font-medium">
              {stat.label}
            </span>
            <div
              className={`flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                stat.trend === "up"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {stat.trend === "up" ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {stat.change}
            </div>
          </div>
          <div className="text-3xl font-bold text-[#FFD166]">{stat.value}</div>
          <div className="mt-2 text-gray-500 text-xs">Since last month</div>
        </div>
      ))}
    </div>
  );
};

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

interface StreakCalendarProps {
  history: string[]; // Array of ISO date strings
  weeksToShow?: number;
  compact?: boolean;
  showCurrentMonthOnly?: boolean;
  hideHeader?: boolean;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  history,
  weeksToShow = 52,
  compact = false,
  showCurrentMonthOnly = false,
  hideHeader = false,
}) => {
  // Generate data
  const calendarData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const data = [];

    let startDate: Date;
    let endDate: Date;

    if (showCurrentMonthOnly) {
      // Start from the first day of the current month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      // Align to the start of the week (Sunday)
      startDate.setDate(startDate.getDate() - startDate.getDay());

      // End at the last day of the current month
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      // Align to the end of the week (Saturday)
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    } else {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - weeksToShow * 7);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate = new Date(today);
    }

    const solveDates = new Set(
      history.map((d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      }),
    );

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      data.push({
        date: new Date(currentDate),
        isSolved: solveDates.has(currentDate.getTime()),
        isCurrentMonth: currentDate.getMonth() === today.getMonth(),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }, [history, showCurrentMonthOnly, weeksToShow]);

  // Group into weeks for the grid
  const weeks = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  const monthLabels = useMemo(() => {
    if (showCurrentMonthOnly) return [];
    const labels: { label: string; index: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, i) => {
      const month = week[0].date.getMonth();
      if (month !== lastMonth) {
        labels.push({
          label: week[0].date.toLocaleString("default", { month: "short" }),
          index: i,
        });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks, showCurrentMonthOnly]);

  const boxSize = showCurrentMonthOnly
    ? "w-8 h-8 lg:w-10 lg:h-10"
    : compact
      ? "w-2.5 h-2.5"
      : "w-3 h-3";
  const gapSize = showCurrentMonthOnly
    ? "gap-2 lg:gap-3"
    : compact
      ? "gap-[4px]"
      : "gap-[5px]";

  return (
    <div
      className={`${hideHeader ? "" : "bg-[#11193F]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5"} relative overflow-hidden group ${compact ? "p-3 lg:p-4" : hideHeader ? "p-0" : "p-6 lg:p-7"}`}
    >
      {/* Background Decor */}
      {!hideHeader && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFD166]/5 blur-[80px] rounded-full pointer-events-none" />
      )}

      {!hideHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-0.5">
              Activity Heatmap
            </h3>
            <p className="text-[#C9CAD9]/60 text-[10px] font-medium">
              Solve history (
              {showCurrentMonthOnly
                ? "Current Month"
                : compact
                  ? "Recent Activity"
                  : `Last ${weeksToShow} weeks`}
              )
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-[#C9CAD9]/40 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-white/5" />
              <span>Off</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#FFD166]/20 border border-[#FFD166]/30" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#FFD166] shadow-[0_0_8px_rgba(255,209,102,0.4)]" />
              <span>Solved</span>
            </div>
          </div>
        </div>
      )}

      <div
        className={`relative custom-scrollbar scroll-smooth ${weeksToShow <= 12 || showCurrentMonthOnly ? "overflow-hidden" : "overflow-x-auto pb-4"}`}
      >
        <div
          className={`flex flex-col w-fit ${showCurrentMonthOnly ? "mx-auto" : ""}`}
        >
          {/* Month Labels */}
          {!showCurrentMonthOnly && (
            <div
              className={`flex h-5 relative mb-2 ${compact ? "ml-8" : "ml-10"}`}
            >
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="text-[10px] text-[#C9CAD9]/30 font-bold absolute uppercase tracking-tighter"
                  style={{ left: `${m.index * (compact ? 13.5 : 15.5)}px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          )}

          <div
            className={`flex ${showCurrentMonthOnly ? "gap-4" : compact ? "gap-1.5" : "gap-2"}`}
          >
            {/* Day Labels */}
            <div
              className={`flex flex-col ${showCurrentMonthOnly ? "pt-0 gap-2 lg:gap-3" : "pt-1 " + (compact ? "gap-[3px]" : "gap-[5px]")}`}
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, i) => (
                  <span
                    key={day}
                    className={`${showCurrentMonthOnly ? "text-[10px] w-8 h-8 lg:w-10 lg:h-10" : "text-[9px] h-3"} flex items-center justify-center font-bold uppercase tracking-tighter ${i % 2 === 0 || showCurrentMonthOnly ? "text-[#C9CAD9]/30" : "text-transparent"}`}
                  >
                    {day.charAt(0)}
                  </span>
                ),
              )}
            </div>

            {/* Grid */}
            <div className={`flex ${gapSize}`}>
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className={`flex flex-col ${gapSize}`}>
                  {week.map((day, dayIdx) => (
                    <motion.div
                      key={day.date.toISOString()}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (weekIdx * 7 + dayIdx) * 0.001 }}
                      data-tooltip-id="streak-tooltip"
                      data-tooltip-content={`${day.date.toDateString()}: ${day.isSolved ? "Completed" : "No activity"}`}
                      className={`
                        rounded-lg transition-all duration-500 cursor-pointer flex items-center justify-center text-[10px] font-bold
                        ${boxSize}
                        ${!day.isCurrentMonth && showCurrentMonthOnly ? "opacity-0 pointer-events-none" : "opacity-100"}
                        ${
                          day.isSolved
                            ? "bg-[#FFD166] text-[#0A0F2C] shadow-[0_0_20px_rgba(255,209,102,0.3)] border border-[#FFD166]/40 hover:scale-110 hover:z-10"
                            : "bg-white/5 border border-white/5 hover:bg-white/10 text-white/20"
                        }
                      `}
                    >
                      {showCurrentMonthOnly &&
                        day.isCurrentMonth &&
                        day.date.getDate()}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Tooltip
        id="streak-tooltip"
        className="!bg-[#0B1437] !text-white !text-[10px] !rounded-xl !px-3 !py-2 !border !border-[#FFD166]/20 !shadow-2xl !opacity-100 z-[200]"
        noArrow={false}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 209, 102, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 209, 102, 0.2);
        }
      `}</style>
    </div>
  );
};

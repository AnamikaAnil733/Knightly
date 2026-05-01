import React, { useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { StreakCalendarProps, CalendarDay } from "../../../Types/PuzzleTypes";

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  history,
  weeksToShow = 52,
  showCurrentMonthOnly = false,
  hideHeader = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to most recent data (right side)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [weeksToShow]);

  const calendarData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const data: CalendarDay[] = [];

    let startDate: Date;
    let endDate: Date;

    if (showCurrentMonthOnly) {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
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

  const weeks = useMemo(() => {
    const result: CalendarDay[][] = [];
    for (let i = 0; i < calendarData.length; i += 7) {
      result.push(calendarData.slice(i, i + 7));
    }
    return result;
  }, [calendarData]);

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
    : "w-[12px] h-[12px]";

  const gapSize = "gap-[4px]";

  return (
    <div
      className={`relative overflow-hidden group ${hideHeader ? "bg-transparent border-none p-0" : "bg-[#11193F]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 p-6 lg:p-7"}`}
    >
      {!hideHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-bold text-lg">Activity Heatmap</h3>
            <p className="text-[#C9CAD9]/60 text-[10px] font-medium uppercase tracking-widest">
              Last {weeksToShow} weeks
            </p>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="relative overflow-x-auto custom-mini-scrollbar pb-2"
      >
        <div
          className={`flex flex-col w-fit ${showCurrentMonthOnly ? "mx-auto" : ""}`}
        >
          {/* Month Labels */}
          {!showCurrentMonthOnly && (
            <div className={`flex h-4 relative mb-1 ml-6`}>
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="text-[8px] text-gray-600 font-bold absolute uppercase tracking-tighter"
                  style={{ left: `${m.index * 16}px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-1.5">
            {/* Day Labels */}
            <div className="flex flex-col pt-0.5 gap-[4px]">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <span
                  key={i}
                  className="text-[8px] h-[12px] w-4 flex items-center justify-center font-bold text-gray-700 uppercase"
                >
                  {day}
                </span>
              ))}
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
                      transition={{ delay: (weekIdx * 7 + dayIdx) * 0.0002 }}
                      data-tooltip-id="streak-tooltip"
                      data-tooltip-content={`${day.date.toDateString()}: ${day.isSolved ? "Completed" : "No activity"}`}
                      className={`
                        rounded-[2px] transition-all duration-300
                        ${boxSize}
                        ${
                          day.isSolved
                            ? "bg-[#FFD166] shadow-[0_0_10px_rgba(255,209,102,0.2)]"
                            : "bg-white/5 border border-white/5"
                        }
                      `}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Tooltip id="streak-tooltip" className="z-[200]" />

      <style>{`
        .custom-mini-scrollbar::-webkit-scrollbar {
          height: 3px;
        }
        .custom-mini-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-mini-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 209, 102, 0.1);
          border-radius: 10px;
        }
        .custom-mini-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 209, 102, 0.3);
        }
      `}</style>
    </div>
  );
};

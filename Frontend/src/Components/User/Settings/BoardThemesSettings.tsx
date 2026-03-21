import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Store/Store";
import { setBoardTheme } from "../../../Store/Slices/UISlice";
import { BOARD_THEMES } from "../Match/BoardThemes";
import { Check } from "lucide-react";

export function BoardThemesSettings() {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.ui.boardTheme);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-[#FFD166] mb-2">
          Chessboard Themes
        </h2>
        <p className="text-[#C9CAD9] text-sm">
          Customize the look and feel of your game.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(BOARD_THEMES) as Array<keyof typeof BOARD_THEMES>).map(
          (themeKey) => {
            const theme = BOARD_THEMES[themeKey];
            const isActive = currentTheme === themeKey;

            return (
              <button
                key={themeKey}
                onClick={() => dispatch(setBoardTheme(themeKey))}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  isActive
                    ? "border-[#6B2EFF] ring-2 ring-[#6B2EFF]/20"
                    : "border-[#3A6FF7]/20 hover:border-[#3A6FF7]/50"
                }`}
              >
                {/* Theme Preview */}
                <div className="aspect-square grid grid-cols-2 grid-rows-2">
                  <div style={{ backgroundColor: theme.light }}></div>
                  <div style={{ backgroundColor: theme.dark }}></div>
                  <div style={{ backgroundColor: theme.dark }}></div>
                  <div style={{ backgroundColor: theme.light }}></div>
                </div>

                {/* Theme Info */}
                <div className="p-4 bg-[#11193F] border-t border-[#3A6FF7]/20 flex items-center justify-between">
                  <span
                    className={`font-medium ${isActive ? "text-white" : "text-[#C9CAD9]"}`}
                  >
                    {theme.name}
                  </span>
                  {isActive && (
                    <div className="bg-[#6B2EFF] rounded-full p-1">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Hover Overlay */}
                {!isActive && (
                  <div className="absolute inset-0 bg-[#3A6FF7]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}

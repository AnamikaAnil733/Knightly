import {
  Trophy,
  Flame,
  Target,
  Zap,
  Star,
  Shield,
  Crown,
  Award,
} from "lucide-react";
import type { CriteriaType } from "../../../Service/Api/AdminAchievementApi";

export const ICON_OPTIONS = [
  { name: "Trophy", Component: Trophy },
  { name: "Flame", Component: Flame },
  { name: "Target", Component: Target },
  { name: "Zap", Component: Zap },
  { name: "Star", Component: Star },
  { name: "Shield", Component: Shield },
  { name: "Crown", Component: Crown },
  { name: "Award", Component: Award },
];

export const CRITERIA_OPTIONS: { value: CriteriaType; label: string }[] = [
  { value: "GAMES_WON", label: "Games Won" },
  { value: "GAMES_PLAYED", label: "Games Played" },
  { value: "PUZZLES_SOLVED", label: "Puzzles Solved" },
  { value: "STREAK_DAYS", label: "Streak Days" },
];

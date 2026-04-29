import { useEffect, useState } from "react";
import { PlusIcon, Trophy } from "lucide-react";
import toast from "react-hot-toast";

import {
  getAllAchievementsApi,
  createAchievementApi,
  updateAchievementApi,
  type Achievement,
  type CreateAchievementPayload,
  type UpdateAchievementPayload,
} from "../../Service/Api/AdminAchievementApi";
import { AchievementTable } from "../../Components/Admin/AchievementManagement/AchievementTable";
import { AchievementModal } from "../../Components/Admin/AchievementManagement/AchievementModal";

/* ─── Stat card helper ──────────────────────────────────── */
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A0F2C]/60 p-5">
      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export function AchievementManagement() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // null = Create mode, Achievement = Edit mode
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);

  /* ── Fetch ───────────────────────────────────────────── */
  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const data = await getAllAchievementsApi();
      setAchievements(data);
    } catch {
      toast.error("Failed to load achievements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  /* ── Create ──────────────────────────────────────────── */
  const handleCreate = async (payload: CreateAchievementPayload) => {
    await createAchievementApi(payload);
    toast.success("Achievement created!");
    fetchAchievements();
  };

  /* ── Update ──────────────────────────────────────────── */
  const handleUpdate = async (
    id: string,
    payload: UpdateAchievementPayload,
  ) => {
    await updateAchievementApi(id, payload);
    toast.success("Achievement updated!");
    fetchAchievements();
  };

  /* ── Open edit modal ─────────────────────────────────── */
  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsModalOpen(true);
  };

  /* ── Close modal ─────────────────────────────────────── */
  const handleClose = () => {
    setIsModalOpen(false);
    setEditingAchievement(null);
  };

  /* ── Derived stats ───────────────────────────────────── */
  const total = achievements.length;
  const byGames = achievements.filter(
    (a) => a.criteriaType === "GAMES_WON" || a.criteriaType === "GAMES_PLAYED",
  ).length;
  const byPuzzles = achievements.filter(
    (a) => a.criteriaType === "PUZZLES_SOLVED",
  ).length;
  const byStreak = achievements.filter(
    (a) => a.criteriaType === "STREAK_DAYS",
  ).length;

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#6B2EFF] to-[#3A6FF7]">
            <Trophy size={22} className="text-white" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold bg-gradient-to-r from-[#FFD166] to-white
                           bg-clip-text text-transparent"
            >
              Achievement Management
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Define milestones that players earn automatically.
            </p>
          </div>
        </div>

        <button
          id="btn-add-achievement"
          onClick={() => {
            setEditingAchievement(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                     bg-gradient-to-r from-[#6B2EFF] to-[#3A6FF7] text-white
                     border border-[#FFD166]/30
                     hover:shadow-[0_0_20px_rgba(107,46,255,0.5)]
                     transition-all duration-300"
        >
          <PlusIcon size={18} />
          Add Achievement
        </button>
      </div>

      {/* ── Stat Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={total} color="text-white" />
        <StatCard label="Game-based" value={byGames} color="text-[#FFD166]" />
        <StatCard
          label="Puzzle-based"
          value={byPuzzles}
          color="text-purple-400"
        />
        <StatCard
          label="Streak-based"
          value={byStreak}
          color="text-orange-400"
        />
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      <AchievementTable
        achievements={achievements}
        loading={loading}
        onEdit={handleEdit}
      />

      {/* ── Modal (Create or Edit) ──────────────────────── */}
      {isModalOpen && (
        <AchievementModal
          onClose={handleClose}
          onSave={handleCreate}
          onUpdate={handleUpdate}
          editData={editingAchievement}
        />
      )}
    </div>
  );
}

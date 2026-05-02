import { useEffect, useState } from "react";
import { PuzzleTable } from "../../Components/Admin/PuzzleManagement/PuzzleTable";
import {
  PuzzleModal,
  PuzzleFormData,
} from "../../Components/Admin/PuzzleManagement/PuzzleModal";
import { DailyPuzzle } from "../../Components/Admin/PuzzleManagement/DailyPuzzle";
import { PlusIcon } from "lucide-react";

import {
  createPuzzleApi,
  getAllPuzzlesApi,
  deletePuzzleApi,
  editPuzzlesApi,
  syncLichessDailyPuzzleApi,
  getDailyPuzzleApi,
  generatePuzzlesFromGameApi,
} from "../../Service/Api/AdminPuzzleApi";
import toast from "react-hot-toast";
import { Puzzle } from "../../Types/PuzzleTypes";

export function PuzzleManagement() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [dailyPuzzle, setDailyPuzzle] = useState<Puzzle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState<Puzzle | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPuzzles();
    fetchDailyPuzzle();
  }, [page]);

  const fetchPuzzles = async () => {
    try {
      const res = await getAllPuzzlesApi({ page, limit: 10 });
      setPuzzles(res.puzzles);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to fetch puzzles", error);
    }
  };

  const fetchDailyPuzzle = async () => {
    try {
      const res = await getDailyPuzzleApi();
      setDailyPuzzle({
        ...res,
        moves: res.solution || [],
        solutionLength: res.solution?.length || 0
      } as Puzzle);
    } catch (error) {
      console.error("Failed to fetch daily puzzle", error);
    }
  };

  const handleSavePuzzle = async (data: PuzzleFormData) => {
    try {
      if (editingPuzzle) {
        await editPuzzlesApi({
          id: editingPuzzle.id,
          fen: data.fen,
          difficulty: data.difficulty,
          moves: data.moves,
          description: data.description,
        });
      } else {
        await createPuzzleApi(data);
      }
      setIsModalOpen(false);
      setEditingPuzzle(null);
      fetchPuzzles();
      fetchDailyPuzzle();
    } catch (error) {
      console.error("Failed to save puzzle", error);
    }
  };

  const handleEditPuzzle = (puzzle: Puzzle) => {
    setEditingPuzzle(puzzle);
    setIsModalOpen(true);
  };

  const handleDeletePuzzle = async (id: string) => {
    try {
      await deletePuzzleApi(id);
      await fetchPuzzles();
      fetchDailyPuzzle();
    } catch (error) {
      console.error("Failed to delete puzzle", error);
    }
  };

  const handleSyncLichess = async () => {
    let loadingToast: string | undefined;
    try {
      loadingToast = toast.loading("Syncing Lichess daily puzzle...");
      await syncLichessDailyPuzzleApi();
      toast.success("Daily puzzle synced!", { id: loadingToast });
      fetchPuzzles();
      fetchDailyPuzzle();
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        error instanceof Error
          ? errorResponse.response?.data?.message ||
            "Failed to sync Lichess puzzle"
          : "Failed to sync Lichess puzzle";
      toast.error(message, { id: loadingToast });
      console.error(error);
    }
  };

  const handleBulkGenerate = async () => {
    let loadingToast: string | undefined;
    try {
      loadingToast = toast.loading("AI Scanning recent games for puzzles...");
      const res = await generatePuzzlesFromGameApi(""); 
      toast.success(`${res.data.length} puzzles generated!`, {
        id: loadingToast,
      });
      fetchPuzzles();
      fetchDailyPuzzle();
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        error instanceof Error
          ? errorResponse.response?.data?.message ||
            "Failed to generate puzzles from games"
          : "Failed to generate puzzles from games";
      toast.error(message, { id: loadingToast });
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFD166] to-white bg-clip-text text-transparent">
          Puzzle Management
        </h1>

        <div className="flex gap-4">
          <button
            onClick={handleSyncLichess}
            className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                       bg-[#0A0F2C] border border-[#3A6FF7]/50 text-[#C9CAD9]
                       hover:bg-[#11193F] transition-all duration-300"
          >
            Sync Daily
          </button>
          <button
            onClick={handleBulkGenerate}
            className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                       bg-[#0A0F2C] border border-[#3A6FF7]/50 text-[#C9CAD9]
                       hover:bg-[#11193F] transition-all duration-300"
          >
            AI Scan Games
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                       bg-gradient-to-r from-[#6B2EFF] to-[#3A6FF7]
                       border border-[#FFD166]
                       hover:shadow-[0_0_15px_rgba(58,111,247,0.6)]
                       transition-all duration-300"
          >
            <PlusIcon size={18} />
            Add Puzzle
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <PuzzleTable
            puzzles={puzzles}
            onEdit={handleEditPuzzle}
            onDelete={handleDeletePuzzle}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>

        <div className="lg:col-span-1">
          {dailyPuzzle && <DailyPuzzle puzzle={dailyPuzzle} />}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PuzzleModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingPuzzle(null);
          }}
          onSave={handleSavePuzzle}
          initialData={
            editingPuzzle
              ? {
                  fen: editingPuzzle.fen,
                  difficulty: editingPuzzle.difficulty,
                  moves: editingPuzzle.moves,
                  description: editingPuzzle.description,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

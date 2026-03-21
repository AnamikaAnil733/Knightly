import React, { useState } from "react";
import { ChessboardPreview } from "./ChessBoardPreview";
import { XIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { Chess } from "chess.js";
import toast from "react-hot-toast";

export interface PuzzleFormData {
  fen: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  moves: string[];
}

function validatePuzzle(fen: string, moves: string[]) {
  if (!fen) return { isValid: false as const, error: "FEN is required" };

  const chess = new Chess();
  try {
    chess.load(fen);
  } catch (e: unknown) {
    return {
      isValid: false as const,
      error: `Invalid FEN: ${e instanceof Error ? e.message : "Unknown error"}`,
    };
  }

  for (let i = 0; i < moves.length; i++) {
    try {
      const moveResult = chess.move(moves[i]);
      if (!moveResult) {
        return {
          isValid: false as const,
          error: `Move ${i + 1} (${moves[i]}) is illegal`,
        };
      }
    } catch {
      return {
        isValid: false as const,
        error: `Invalid move format: ${moves[i]}`,
      };
    }
  }

  return { isValid: true as const, finalFen: chess.fen() };
}

interface PuzzleModalProps {
  onClose: () => void;
  onSave: (data: PuzzleFormData) => void;
  initialData?: PuzzleFormData;
}

export function PuzzleModal({
  onClose,
  onSave,
  initialData,
}: PuzzleModalProps) {
  const [currentMove, setCurrentMove] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PuzzleFormData>(() => ({
    fen: initialData?.fen ?? "",
    difficulty: initialData?.difficulty ?? "Medium",
    moves: initialData?.moves ?? [],
  }));

  // Real-time validation — let React Compiler handle memoization automatically
  const validation = validatePuzzle(formData.fen, formData.moves);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleAddMove = () => {
    if (!currentMove.trim()) return;

    // Quick check if move is legal before adding
    const chess = new Chess();
    try {
      chess.load(formData.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
      for (const m of formData.moves) chess.move(m);

      const testMove = chess.move(currentMove.trim());
      if (!testMove) {
        toast.error(`"${currentMove}" is an illegal move in this position`);
        return;
      }
    } catch {
      toast.error("Cannot validate move: FEN is invalid");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      moves: [...prev.moves, currentMove.trim()],
    }));
    setCurrentMove("");
    setError(null);
  };

  const handleRemoveMove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      moves: prev.moves.filter((_, i) => i !== index),
    }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) {
      setError(validation.error || "Invalid puzzle data");
      toast.error(validation.error || "Invalid puzzle data");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div
        className="bg-gradient-to-b from-[#11193F] to-[#0A0F2C] rounded-xl w-full max-w-5xl 
                   shadow-[0_0_30px_rgba(107,46,255,0.4)] border border-[#3A6FF7]/30 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <div className="flex justify-between items-center p-4 border-b border-[#3A6FF7]/30 sticky top-0 bg-[#11193F] z-10">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "Edit Puzzle" : "Add New Puzzle"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#C9CAD9] hover:text-white transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Column 1: Configuration */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#C9CAD9] mb-1">
                  FEN Position
                </label>
                <input
                  type="text"
                  name="fen"
                  value={formData.fen}
                  onChange={handleChange}
                  className={`w-full bg-[#0A0F2C] border rounded-lg p-2.5 
                             text-white focus:ring-[#6B2EFF] focus:border-[#6B2EFF] outline-none transition-colors
                             ${error && error.includes("FEN") ? "border-red-500" : "border-[#3A6FF7]/50"}`}
                  placeholder="Enter FEN notation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C9CAD9] mb-1">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full bg-[#0A0F2C] border border-[#3A6FF7]/50 rounded-lg p-2.5 
                             text-white focus:ring-[#6B2EFF] focus:border-[#6B2EFF] outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C9CAD9] mb-1">
                  Solution Moves
                </label>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentMove}
                    onChange={(e) => setCurrentMove(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddMove())
                    }
                    className="flex-1 bg-[#0A0F2C] border border-[#3A6FF7]/50 rounded-lg p-2.5 
                               text-white focus:ring-[#6B2EFF] focus:border-[#6B2EFF] outline-none"
                    placeholder="e.g. e4, Nf3"
                  />
                  <button
                    type="button"
                    onClick={handleAddMove}
                    className="px-4 py-2 bg-[#6B2EFF] rounded-lg text-white 
                               hover:bg-[#6B2EFF]/80 transition-colors font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                  {formData.moves.length === 0 && (
                    <p className="text-sm text-[#C9CAD9]/40 italic py-4 text-center border border-dashed border-white/10 rounded-lg">
                      No moves added yet
                    </p>
                  )}
                  {formData.moves.map((move, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-[#0A0F2C]/50 p-2.5 rounded-lg border border-white/5 group hover:border-[#3A6FF7]/30 transition-all"
                    >
                      <div className="flex items-center">
                        <span className="text-[#3A6FF7] font-bold mr-3 text-xs w-4">
                          {index + 1}.
                        </span>
                        <span className="text-white font-medium">{move}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMove(index)}
                        className="text-[#C9CAD9]/50 hover:text-red-400 p-1 rounded hover:bg-red-400/10 transition-all"
                      >
                        <XIcon size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Initial Board Preview */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-[#C9CAD9] mb-3 flex items-center justify-between">
                <span>Initial Position</span>
                {validation.isValid && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> Valid
                  </span>
                )}
              </label>
              <div className="bg-[#0A0F2C] p-4 rounded-2xl border border-[#3A6FF7]/20 flex-1 flex items-center justify-center">
                <ChessboardPreview
                  fen={
                    formData.fen ||
                    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
                  }
                />
              </div>
            </div>

            {/* Column 3: Resulting Position Preview */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-[#C9CAD9] mb-3">
                Final Position
              </label>
              <div className="bg-[#0A0F2C] p-4 rounded-2xl border border-[#3A6FF7]/20 flex-1 flex items-center justify-center relative">
                {!validation.isValid ? (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl p-6 text-center">
                    <AlertCircle className="text-red-400 mb-2 w-8 h-8" />
                    <p className="text-xs text-red-200 font-medium">
                      {validation.error}
                    </p>
                  </div>
                ) : null}
                <ChessboardPreview
                  fen={
                    validation.isValid
                      ? validation.finalFen!
                      : formData.fen ||
                        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
                  }
                />
              </div>
            </div>
          </div>

          {/* Validation Error Message */}
          {error && (
            <div className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#3A6FF7]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#0A0F2C] border border-[#3A6FF7]/50 
                         text-[#C9CAD9] hover:bg-[#11193F] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!validation.isValid}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 border border-[#FFD166]
                         ${
                           validation.isValid
                             ? "bg-gradient-to-r from-[#6B2EFF] to-[#3A6FF7] hover:shadow-[0_0_20px_rgba(58,111,247,0.6)] cursor-pointer"
                             : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                         }`}
            >
              {initialData ? "Update Puzzle" : "Create Puzzle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

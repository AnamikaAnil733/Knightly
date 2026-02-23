
import { Puzzle } from '../../../pages/Admin/puzzleManagement'
import { PencilIcon, TrashIcon, ChevronLeft, ChevronRight } from 'lucide-react'

interface PuzzleTableProps {
  puzzles: Puzzle[]
  onEdit: (puzzle: Puzzle) => void
  onDelete: (id: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PuzzleTable({
  puzzles,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: PuzzleTableProps) {
  return (
    <div className="bg-gradient-to-b from-[#11193F] to-[#0A0F2C] rounded-xl p-1 overflow-hidden shadow-[0_0_20px_rgba(58,111,247,0.3)]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#3A6FF7]/30">
              <th className="px-4 py-3 text-left text-sm font-medium text-[#C9CAD9]">
                Puzzle ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#C9CAD9]">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#C9CAD9]">
                Solution Length
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[#C9CAD9]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {puzzles.map((puzzle) => (
              <tr
                key={puzzle.id}
                className="border-b border-[#3A6FF7]/20 hover:bg-[#11193F]/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-white">
                  {puzzle.id}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      puzzle.difficulty === 'Easy'
                        ? 'bg-green-900/40 text-green-300'
                        : puzzle.difficulty === 'Medium'
                          ? 'bg-blue-900/40 text-blue-300'
                          : puzzle.difficulty === 'Hard'
                            ? 'bg-orange-900/40 text-orange-300'
                            : 'bg-red-900/40 text-red-300'
                    }`}
                  >
                    {puzzle.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#C9CAD9]">
                  {puzzle.solutionLength} moves
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(puzzle)}
                      className="p-1 rounded text-[#C9CAD9] hover:text-[#FFD166] transition-colors"
                    >
                      <PencilIcon size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(puzzle.id)}
                      className="p-1 rounded text-[#C9CAD9] hover:text-red-400 transition-colors"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#3A6FF7]/30 bg-[#0A0F2C]/50">
          <div className="text-sm text-[#C9CAD9]">
            Showing page <span className="text-white font-medium">{currentPage}</span> of{' '}
            <span className="text-white font-medium">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-[#11193F] border border-[#3A6FF7]/30 text-[#C9CAD9] hover:bg-[#3A6FF7]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-[#11193F] border border-[#3A6FF7]/30 text-[#C9CAD9] hover:bg-[#3A6FF7]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

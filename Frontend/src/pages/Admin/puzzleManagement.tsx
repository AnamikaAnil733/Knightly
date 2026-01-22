import  { useState } from 'react'
import { PuzzleTable } from '../../components/admin/PuzzleManagement/puzzleTable'
import { PuzzleModal } from '../../components/admin/PuzzleManagement/puzzleModal'
import { DailyPuzzle } from '../../components/admin/PuzzleManagement/dailyPuzzle'
import { PlusIcon } from 'lucide-react'
// Mock puzzle data
export interface Puzzle {
  id: string
  fen: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'
  createdAt: string
  solutionLength: number
  moves: string[]
}
const initialPuzzles: Puzzle[] = [
  {
    id: 'PZ-001',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
    difficulty: 'Easy',
    createdAt: '2023-10-15',
    solutionLength: 3,
    moves: ['d4', 'exd4', 'e5'],
  },
  {
    id: 'PZ-002',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1',
    difficulty: 'Medium',
    createdAt: '2023-10-16',
    solutionLength: 4,
    moves: ['Bc4', 'Nf6', 'd4', 'exd4'],
  },
  {
    id: 'PZ-003',
    fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
    difficulty: 'Hard',
    createdAt: '2023-10-17',
    solutionLength: 5,
    moves: ['Nf3', 'd6', 'd4', 'cxd4', 'Nxd4'],
  },
  {
    id: 'PZ-004',
    fen: 'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 1',
    difficulty: 'Expert',
    createdAt: '2023-10-18',
    solutionLength: 6,
    moves: ['Bc4', 'e6', 'O-O', 'Be7', 'Bg5', 'O-O'],
  },
]
export function PuzzleManagement() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>(initialPuzzles)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPuzzle, setEditingPuzzle] = useState<Puzzle | null>(null)
  const handleAddPuzzle = (puzzle: Puzzle) => {
    if (editingPuzzle) {
      setPuzzles(puzzles.map((p) => (p.id === puzzle.id ? puzzle : p)))
    } else {
      setPuzzles([
        ...puzzles,
        {
          ...puzzle,
          id: `PZ-${String(puzzles.length + 1).padStart(3, '0')}`,
        },
      ])
    }
    setIsModalOpen(false)
    setEditingPuzzle(null)
  }
  const handleEditPuzzle = (puzzle: Puzzle) => {
    setEditingPuzzle(puzzle)
    setIsModalOpen(true)
  }
  const handleDeletePuzzle = (id: string) => {
    setPuzzles(puzzles.filter((puzzle) => puzzle.id !== id))
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFD166] to-white bg-clip-text text-transparent">
          Puzzle Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                     bg-gradient-to-r from-[#6B2EFF] to-[#3A6FF7] 
                     border border-[#FFD166] hover:shadow-[0_0_15px_rgba(58,111,247,0.6)] 
                     transition-all duration-300"
        >
          <PlusIcon size={18} />
          Add Puzzle
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <PuzzleTable
            puzzles={puzzles}
            onEdit={handleEditPuzzle}
            onDelete={handleDeletePuzzle}
          />
        </div>
        <div className="lg:col-span-1">
          <DailyPuzzle puzzle={puzzles[0]} />
        </div>
      </div>
      {isModalOpen && (
        <PuzzleModal
          onClose={() => {
            setIsModalOpen(false)
            setEditingPuzzle(null)
          }}
          onSave={handleAddPuzzle}
          puzzle={editingPuzzle}
        />
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { PuzzleTable } from '../../components/admin/PuzzleManagement/puzzleTable'
import { PuzzleModal, PuzzleFormData } from '../../components/admin/PuzzleManagement/puzzleModal'
import { DailyPuzzle } from '../../components/admin/PuzzleManagement/dailyPuzzle'
import { PlusIcon } from 'lucide-react'
import {
  createPuzzleApi,
} from '../../Service/api/adminPuzzleApi'

export interface Puzzle {
  id: string
  fen: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'
  moves: string[]
  solutionLength: number
  isActive: boolean
  createdAt: string
}

export function PuzzleManagement() {
  // const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPuzzle, setEditingPuzzle] = useState<Puzzle | null>(null)

  // 🔹 Fetch from backend
  // const fetchPuzzles = async () => {
  //   const res = await getAllPuzzlesApi()
  //   setPuzzles(res.data)
  // }

  // useEffect(() => {
  //   fetchPuzzles()
  // }, [])

  // 🔹 Create / Update
  const handleSavePuzzle = async (data: PuzzleFormData) => {
    if (!editingPuzzle) {
      await createPuzzleApi(data)
    }
    // (update API can be added later)

    setIsModalOpen(false)
    setEditingPuzzle(null)
    // fetchPuzzles()
  }

  // 🔹 Edit
  // const handleEditPuzzle = (puzzle: Puzzle) => {
  //   setEditingPuzzle(puzzle)
  //   setIsModalOpen(true)
  // }

  // 🔹 Delete (soft delete)
  // const handleDeletePuzzle = async (id: string) => {
  //   await deletePuzzleApi(id)
  //   fetchPuzzles()
  // }

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

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <PuzzleTable
            puzzles={puzzles}
            onEdit={handleEditPuzzle}
            onDelete={handleDeletePuzzle}
          />
        </div>
        <div className="lg:col-span-1">
          {puzzles.length > 0 && <DailyPuzzle puzzle={puzzles[0]} />}
        </div>
      </div> */}

      {isModalOpen && (
        <PuzzleModal
          key={editingPuzzle?.id ?? 'create'}
          onClose={() => {
            setIsModalOpen(false)
            setEditingPuzzle(null)
          }}
          onSave={handleSavePuzzle}
          initialData={
            editingPuzzle
              ? {
                  fen: editingPuzzle.fen,
                  difficulty: editingPuzzle.difficulty,
                  moves: editingPuzzle.moves,
                }
              : undefined
          }
        />
      )}
    </div>
  )
}

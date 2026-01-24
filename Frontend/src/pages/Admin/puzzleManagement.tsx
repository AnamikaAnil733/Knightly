import { useEffect, useState, useCallback } from 'react'
import { PuzzleTable } from '../../components/admin/PuzzleManagement/puzzleTable'
import {
  PuzzleModal,
  PuzzleFormData,
} from '../../components/admin/PuzzleManagement/puzzleModal'
import { DailyPuzzle } from '../../components/admin/PuzzleManagement/dailyPuzzle'
import { PlusIcon } from 'lucide-react'

import {
  createPuzzleApi,
  getAllPuzzlesApi,
  deletePuzzleApi,
  editPuzzlesApi,
} from '../../Service/api/adminPuzzleApi'

/* ===================== TYPES ===================== */

export interface Puzzle {
  id: string
  fen: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'
  moves: string[]
  solutionLength: number
  isActive: boolean
  createdAt: string
}

/* ===================== COMPONENT ===================== */

export function PuzzleManagement() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPuzzle, setEditingPuzzle] = useState<Puzzle | null>(null)

  /* ===================== FETCH ===================== */

  const fetchPuzzles = useCallback(async () => {
    try {
      const res = await getAllPuzzlesApi()
      setPuzzles(res.puzzles)
    } catch (error) {
      console.error('Failed to fetch puzzles', error)
    }
  }, [])

  useEffect(() => {
    fetchPuzzles()
  }, [fetchPuzzles])

  /* ===================== CREATE ===================== */

  const handleSavePuzzle = async (data: PuzzleFormData) => {
    try {
      if (editingPuzzle) {
        // EDIT
        await editPuzzlesApi({
          id: editingPuzzle.id,
          fen: data.fen,
          difficulty: data.difficulty,
          moves: data.moves,
        })
      } else {
        // CREATE
        await createPuzzleApi(data)
      }
      // update flow can be added later

      setIsModalOpen(false)
      setEditingPuzzle(null)
      fetchPuzzles()
    } catch (error) {
      console.error('Failed to save puzzle', error)
    }
  }

  /* ===================== EDIT ===================== */

  const handleEditPuzzle = (puzzle: Puzzle) => {
    setEditingPuzzle(puzzle)
    setIsModalOpen(true)
  }

  /* ===================== DELETE ===================== */

  const handleDeletePuzzle = async (id: string) => {
    try {
      await deletePuzzleApi(id)
      fetchPuzzles()
    } catch (error) {
      console.error('Failed to delete puzzle', error)
    }
  }

  /* ===================== RENDER ===================== */

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFD166] to-white bg-clip-text text-transparent">
          Puzzle Management
        </h1>

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

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PuzzleModal
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

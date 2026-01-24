import React, { useState } from 'react'
import { ChessboardPreview } from './chessBoardPreview'
import { XIcon } from 'lucide-react'

export interface PuzzleFormData {
  fen: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'
  moves: string[]
}

interface PuzzleModalProps {
  onClose: () => void
  onSave: (data: PuzzleFormData) => void
  initialData?: PuzzleFormData
}

export function PuzzleModal({
  onClose,
  onSave,
  initialData,
}: PuzzleModalProps) {
  const [currentMove, setCurrentMove] = useState('')

  const [formData, setFormData] = useState<PuzzleFormData>(() => ({
    fen: initialData?.fen ?? '',
    difficulty: initialData?.difficulty ?? 'Medium',
    moves: initialData?.moves ?? [],
  }))

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddMove = () => {
    if (!currentMove.trim()) return
    setFormData((prev) => ({
      ...prev,
      moves: [...prev.moves, currentMove.trim()],
    }))
    setCurrentMove('')
  }

  const handleRemoveMove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      moves: prev.moves.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }
  console.log(formData)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div
        className="bg-gradient-to-b from-[#11193F] to-[#0A0F2C] rounded-xl w-full max-w-4xl 
                  shadow-[0_0_30px_rgba(107,46,255,0.4)] border border-[#3A6FF7]/30"
      >
        <div className="flex justify-between items-center p-4 border-b border-[#3A6FF7]/30">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Puzzle' : 'Add New Puzzle'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#C9CAD9] hover:text-white transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* FEN */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#C9CAD9] mb-1">
                  FEN Position
                </label>
                <input
                  type="text"
                  name="fen"
                  value={formData.fen}
                  onChange={handleChange}
                  className="w-full bg-[#0A0F2C] border border-[#3A6FF7]/50 rounded-lg p-2.5 
                             text-white focus:ring-[#6B2EFF] focus:border-[#6B2EFF] outline-none"
                  placeholder="Enter FEN notation"
                  required
                />
              </div>

              {/* Difficulty */}
              <div className="mb-4">
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

              {/* Moves */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#C9CAD9] mb-1">
                  Solution Moves
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentMove}
                    onChange={(e) => setCurrentMove(e.target.value)}
                    className="flex-1 bg-[#0A0F2C] border border-[#3A6FF7]/50 rounded-lg p-2.5 
                               text-white focus:ring-[#6B2EFF] focus:border-[#6B2EFF] outline-none"
                    placeholder="e.g. e4, e5, Nf3"
                  />
                  <button
                    type="button"
                    onClick={handleAddMove}
                    className="px-4 py-2 bg-[#6B2EFF] rounded-lg text-white 
                               hover:bg-[#6B2EFF]/80 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {formData.moves.map((move, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-[#0A0F2C]/50 p-2 rounded"
                    >
                      <div className="flex items-center">
                        <span className="text-[#FFD166] mr-2">
                          {index + 1}.
                        </span>
                        <span className="text-white">{move}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMove(index)}
                        className="text-[#C9CAD9] hover:text-red-400 transition-colors"
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Board Preview */}
            <div>
              <label className="block text-sm font-medium text-[#C9CAD9] mb-3">
                Board Preview
              </label>
              <ChessboardPreview
                fen={
                  formData.fen ||
                  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#3A6FF7]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#0A0F2C] border border-[#3A6FF7]/50 
                         text-[#C9CAD9] hover:bg-[#11193F] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-medium
                         bg-gradient-to-r from-[#6B2EFF] to-[#3A6FF7] 
                         border border-[#FFD166] hover:shadow-[0_0_15px_rgba(58,111,247,0.6)] 
                         transition-all duration-300"
            >
              Save Puzzle
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

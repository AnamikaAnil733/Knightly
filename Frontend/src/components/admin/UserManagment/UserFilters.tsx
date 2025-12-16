import React from 'react'
import { SlidersHorizontalIcon } from 'lucide-react'
interface FiltersProps {
  filters: {
    premium: boolean
    banned: boolean
    sortBy: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      premium: boolean
      banned: boolean
      sortBy: string
    }>
  >
}
export function UserFilters({ filters, setFilters }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center ml-auto">
      <div className="flex items-center">
        <SlidersHorizontalIcon className="h-4 w-4 text-[#FFD166] mr-2" />
        <span className="text-gray-300 text-sm">Filters:</span>
      </div>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={filters.premium}
          onChange={() =>
            setFilters({
              ...filters,
              premium: !filters.premium,
            })
          }
          className="sr-only"
        />
        <span
          className={`px-3 py-1 text-sm rounded-full ${filters.premium ? 'bg-[#FFD166] text-[#0A0F2C]' : 'bg-[#11193F] text-gray-300'}`}
        >
          Premium
        </span>
      </label>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={filters.banned}
          onChange={() =>
            setFilters({
              ...filters,
              banned: !filters.banned,
            })
          }
          className="sr-only"
        />
        <span
          className={`px-3 py-1 text-sm rounded-full ${filters.banned ? 'bg-red-500 text-white' : 'bg-[#11193F] text-gray-300'}`}
        >
          Banned
        </span>
      </label>
      <select
        value={filters.sortBy}
        onChange={(e) =>
          setFilters({
            ...filters,
            sortBy: e.target.value,
          })
        }
        className="bg-[#11193F] text-gray-300 text-sm rounded-md px-3 py-1 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6B2EFF]"
      >
        <option value="rating">Sort by Rating</option>
        <option value="name">Sort by Name</option>
        <option value="createdAt">Sort by Date</option>
      </select>
    </div>
  )
}

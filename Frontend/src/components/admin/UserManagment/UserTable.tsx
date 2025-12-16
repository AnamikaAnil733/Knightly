import React from 'react'
import { User } from "../../../pages/Admin/UserManagment"
import {
  ChevronRightIcon,
  StarIcon,
  ShieldCheckIcon,
  BanIcon,
} from 'lucide-react'
interface UserTableProps {
  users: User[]
  onSelectUser: (user: User) => void
  onBanUser: (userId: string, ban: boolean) => void
  selectedUserId: string
}
export function UserTable({
  users,
  onSelectUser,
  onBanUser,
  selectedUserId,
}: UserTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-[#11193F] text-gray-300">
            <th className="px-4 py-3 text-left text-sm font-medium">User ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Rating</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Games</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Premium</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Created At
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {users.map((user) => (
            <tr
              key={user.id}
              className={`${selectedUserId === user.id ? 'bg-[#6B2EFF]/20' : 'hover:bg-[#11193F]/50'} cursor-pointer transition-colors`}
              onClick={() => onSelectUser(user)}
            >
              <td className="px-4 py-3 text-sm text-gray-300">
                {user.id.slice(0, 8)}...
              </td>
              <td className="px-4 py-3 text-sm text-white font-medium">
                {user.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">{user.email}</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-[#FFD166] mr-1" />
                  <span className="text-sm text-white">{user.rating}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {user.gamesPlayed}
              </td>
              <td className="px-4 py-3">
                {user.premium ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FFD166] text-[#0A0F2C]">
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    Premium
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onBanUser(user.id, !user.banned)
                    }}
                    className={`p-1 rounded-full ${user.banned ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30' : 'bg-red-600/20 text-red-500 hover:bg-red-600/30'}`}
                  >
                    <BanIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectUser(user)
                    }}
                    className="p-1 rounded-full bg-[#6B2EFF]/20 text-[#6B2EFF] hover:bg-[#6B2EFF]/30"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          No users found matching your filters
        </div>
      )}
    </div>
  )
}

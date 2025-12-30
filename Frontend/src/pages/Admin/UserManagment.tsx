import React, { useEffect, useState } from 'react'
import { UserTable } from '../../components/admin/UserManagment/UserTable'
import { UserProfile } from '../../components/admin/UserManagment/UserProfile'
import { UserFilters } from '../../components/admin/UserManagment/UserFilters'
import { mockUsers } from '../../components/admin/UserManagment/mockUsers'
import { SearchIcon } from 'lucide-react'
export interface User {
  id: string
  name: string
  email: string
  rating: number
  gamesPlayed: number
  premium: boolean
  createdAt: string
  banned: boolean
  avatar: string
  streaks: number
  rewards: number
  achievements: string[]
  savedGames: number
  reports: number
}
export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    premium: false,
    banned: false,
    sortBy: 'rating',
  })
  // Apply filters and search
  useEffect(() => {
    let result = [...mockUsers]
    // Apply premium filter
    if (filters.premium) {
      result = result.filter((user) => user.premium)
    }
    // Apply banned filter
    if (filters.banned) {
      result = result.filter((user) => user.banned)
    }
    // Apply search
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    // Apply sorting
    if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    }
    setFilteredUsers(result)
  }, [filters, searchTerm])
  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }
  const handleBanUser = (userId: string, ban: boolean) => {
    const updatedUsers = users.map((user) =>
      user.id === userId
        ? {
            ...user,
            banned: ban,
          }
        : user,
    )
    setUsers(updatedUsers)
    // Update the selected user if it's the one being banned/unbanned
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({
        ...selectedUser,
        banned: ban,
      })
    }
  }
  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">User Management</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1">
            {/* Search and filters */}
            <div className="bg-[#0A0F2C] rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#11193F] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#6B2EFF]"
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <UserFilters filters={filters} setFilters={setFilters} />
              </div>
            </div>
            {/* User table */}
            <div className="bg-[#0A0F2C] rounded-lg overflow-hidden">
              <UserTable
                users={filteredUsers}
                onSelectUser={handleUserSelect}
                onBanUser={handleBanUser}
                selectedUserId={selectedUser?.id || ''}
              />
            </div>
          </div>
          {/* User profile sidebar */}
          <div className="lg:w-80 mt-6 lg:mt-0">
            {selectedUser ? (
              <UserProfile user={selectedUser} onBanUser={handleBanUser} />
            ) : (
              <div className="bg-[#0A0F2C] rounded-lg p-6 text-center text-gray-400 h-full flex items-center justify-center">
                <p>Select a user to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

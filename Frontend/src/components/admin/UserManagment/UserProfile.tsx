import { User } from '../../../pages/Admin/UserManagment'
import {
  FlameIcon,
  TrophyIcon,
  AwardIcon,
  SaveIcon,
  AlertTriangleIcon,
  BanIcon,
  CheckCircleIcon,
  StarIcon,
} from 'lucide-react'
interface UserProfileProps {
  user: User
  onBanUser: (userId: string, ban: boolean) => void
}
export function UserProfile({ user, onBanUser }: UserProfileProps) {
  return (
    <div className="bg-[#0A0F2C] rounded-lg overflow-hidden">
      {/* Header with avatar */}
      <div className="p-6 pb-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#6B2EFF]"
            />
            {user.premium && (
              <div className="absolute -bottom-1 -right-1 bg-[#FFD166] rounded-full p-1">
                <ShieldCheckIcon className="h-4 w-4 text-[#0A0F2C]" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <div className="flex items-center mt-1">
              <StarIcon className="h-4 w-4 text-[#FFD166]" />
              <span className="text-white text-sm ml-1">
                {user.rating} Rating
              </span>
              <span className="mx-2 text-gray-600">•</span>
              <span className="text-gray-300 text-sm">
                {user.gamesPlayed} Games
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* User stats */}
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 mb-3">USER STATS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#11193F] p-3 rounded-lg">
            <div className="flex items-center text-[#FFD166]">
              <FlameIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <p className="text-white text-xl font-bold mt-1">
              {user.streaks} days
            </p>
          </div>
          <div className="bg-[#11193F] p-3 rounded-lg">
            <div className="flex items-center text-[#FFD166]">
              <TrophyIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Rewards</span>
            </div>
            <p className="text-white text-xl font-bold mt-1">{user.rewards}</p>
          </div>
        </div>
      </div>
      {/* Achievements */}
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 mb-3">ACHIEVEMENTS</h3>
        <div className="space-y-2">
          {user.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center">
              <AwardIcon className="h-4 w-4 text-[#6B2EFF] mr-2" />
              <span className="text-sm text-gray-300">{achievement}</span>
            </div>
          ))}
          {user.achievements.length === 0 && (
            <p className="text-sm text-gray-500">No achievements yet</p>
          )}
        </div>
      </div>
      {/* Saved Games */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-400">SAVED GAMES</h3>
          <span className="text-[#6B2EFF] text-sm font-medium">
            {user.savedGames}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <SaveIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-300">
            {user.savedGames > 0
              ? `${user.savedGames} games saved`
              : 'No saved games'}
          </span>
        </div>
      </div>
      {/* Report History */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-400">REPORT HISTORY</h3>
          <span
            className={`${user.reports > 0 ? 'text-red-400' : 'text-green-400'} text-sm font-medium`}
          >
            {user.reports}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <AlertTriangleIcon
            className={`h-4 w-4 ${user.reports > 0 ? 'text-red-400' : 'text-gray-400'} mr-2`}
          />
          <span className="text-sm text-gray-300">
            {user.reports > 0
              ? `${user.reports} reports received`
              : 'No reports'}
          </span>
        </div>
      </div>
      {/* Actions */}
      <div className="p-6">
        <button
          onClick={() => onBanUser(user.id, !user.banned)}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${user.banned ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
        >
          {user.banned ? (
            <>
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Unban User
            </>
          ) : (
            <>
              <BanIcon className="h-4 w-4 mr-2" />
              Ban User
            </>
          )}
        </button>
      </div>
    </div>
  )
}
// Import the ShieldCheckIcon to avoid error
import { ShieldCheckIcon } from 'lucide-react'

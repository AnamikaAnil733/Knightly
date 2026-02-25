import { IUser } from '../../../Types/User';
import { useState } from 'react';
import ConfirmationModal from '../../reuseable/conformationModel';

import {
  FlameIcon,
  TrophyIcon,
  // AwardIcon,
  SaveIcon,
  // AlertTriangleIcon,
  ShieldCheckIcon,
  BanIcon,
  CheckCircleIcon,
  StarIcon,
} from 'lucide-react';
import { getAvatarUrl } from "../../../Utils/GetAvatarurl";

interface UserProfileProps {
  user: IUser
  onBanUser: (userId: string, ban: boolean) => void
}
export function UserProfile({ user, onBanUser }: UserProfileProps) {
const [isModalOpen,setIsModalOpen] = useState(false)

const handleConfirmBan = () => {
  onBanUser(user.id, !user.isBlocked);
  setIsModalOpen(false);
};


  return (
    <div className="bg-[#0A0F2C] rounded-lg overflow-hidden">
      {/* Header with avatar */}
      <div className="p-6 pb-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={getAvatarUrl(user)}
              alt="hell0"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#6B2EFF]"
            />
            {user.premium && (
              <div className="absolute -bottom-1 -right-1 bg-[#FFD166] rounded-full p-1">
                <ShieldCheckIcon className="h-4 w-4 text-[#0A0F2C]" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-white">{user.displayname}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <div className="flex flex-col mt-1">
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-[#FFD166]" />
                <span className="text-white text-sm ml-1 font-semibold">
                  {user.rating?.RAPID || 1200}
                </span>
                <span className="text-gray-400 text-xs ml-1">Rapid</span>
              </div>
              <div className="flex items-center mt-1">
                 <span className="text-gray-500 text-xs">Blitz: {user.rating?.BLITZ || 1200}</span>
                 <span className="mx-1 text-gray-700">|</span>
                 <span className="text-gray-500 text-xs">Bullet: {user.rating?.BULLET || 1200}</span>
              </div>
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
              {user.longestStreak || 0} days
            </p>
          </div>
          <div className="bg-[#11193F] p-3 rounded-lg">
            <div className="flex items-center text-[#FFD166]">
              <TrophyIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Rewards</span>
            </div>
            <p className="text-white text-lg font-bold mt-1 truncate">
               {user.rewards && user.rewards.length > 0 ? user.rewards[0] : "No rewards"}
            </p>
          </div>
        </div>
      </div>
      {/* Achievements */}
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 mb-3">ACHIEVEMENTS</h3>
        <div className="space-y-1">
          {user.achievements && user.achievements.length > 0 ? (
            user.achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6B2EFF] mr-2"></div>
                <span className="text-xs text-gray-300">{achievement}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic">No achievements unlocked yet</p>
          )}
        </div>
      </div>
      {/* Saved Games */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-400">GAMES HISTORY</h3>
          <span className="text-[#6B2EFF] text-sm font-medium">
            {user.gamesPlayed || 0}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <SaveIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-300">
            {(user.gamesPlayed || 0) > 0
              ? `${user.gamesPlayed} matches completed`
              : 'No games recorded'}
          </span>
        </div>
      </div>
      {/* Account Info */}
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 mb-2">ACCOUNT STATUS</h3>
        <div className="flex items-center">
           <div className={`w-2 h-2 rounded-full mr-2 ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
           <span className="text-sm text-gray-300">
             {user.isBlocked ? 'Account Restricted' : 'Active Account'}
           </span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${user.isBlocked ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
        >
          {user.isBlocked ? (
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
      <ConfirmationModal
  isOpen={isModalOpen}
  title={user.isBlocked ? "Unban User" : "Ban User"}
  description={
    user.isBlocked
      ? "Are you sure you want to unban this user? They will regain full access."
      : "Are you sure you want to ban this user? This action will restrict their access."
  }
  confirmText={user.isBlocked ? "Unban" : "Ban"}
  confirmColor={
    user.isBlocked
      ? "bg-green-600 hover:bg-green-700"
      : "bg-red-600 hover:bg-red-700"
  }
  onConfirm={handleConfirmBan}
  onCancel={() => setIsModalOpen(false)}
/>

    </div>
  )
}



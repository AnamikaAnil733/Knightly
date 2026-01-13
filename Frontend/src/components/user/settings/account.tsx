
import { SectionHeader } from './heading/sectionheader'
import { UserIcon, MailIcon, LockIcon, BellIcon } from 'lucide-react'
export const AccountSettings = () => {
  return (
    <div>
      <SectionHeader
        title="Account Settings"
        description="Manage your personal information and preferences."
      />
      <div className="bg-[#11193F] rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[#C9CAD9] text-sm mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C9CAD9]">
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                className="w-full bg-[#0A0F2C] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF]"
                defaultValue="GrandMaster2000"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#C9CAD9] text-sm mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C9CAD9]">
                <MailIcon size={18} />
              </span>
              <input
                type="email"
                className="w-full bg-[#0A0F2C] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF]"
                defaultValue="player@example.com"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#11193F] rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Security</h3>
        <div className="space-y-4">
          <button className="flex items-center text-[#C9CAD9] hover:text-white">
            <LockIcon size={18} className="mr-2" />
            Change Password
          </button>
          <button className="flex items-center text-[#C9CAD9] hover:text-white">
            <BellIcon size={18} className="mr-2" />
            Notification Preferences
          </button>
        </div>
      </div>
      <div className="mt-8">
        <button className="py-2.5 px-5 rounded-lg bg-gradient-to-r from-[#6B2EFF] to-[#7C4DFF] text-white font-medium hover:opacity-90 transition-opacity">
          Save Changes
        </button>
        <button className="py-2.5 px-5 ml-3 rounded-lg border border-gray-600 text-[#C9CAD9] hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}

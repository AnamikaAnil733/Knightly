import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Store/Store";
import { SectionHeader } from "./Heading/Sectionheader";
import { UserIcon, MailIcon, LockIcon, Crown } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../../../Store/Slices/Auth/UserAuthSlice";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { editUserProfile } from "../../../Service/Api/UserApi";

export const AccountSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userAuth.user);

  const [nameError, setNameError] = useState("");
  const [displayname, setDisplayname] = useState(() => {
    return user?.displayname || "";
  });
  const [showChangePassword, setShowChangePassword] = useState(false);

  const validateDisplayName = (value: string) => {
    if (!value.trim()) {
      return "Username is required";
    }
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (value.length > 20) {
      return "Username must be at most 20 characters";
    }
    if (!/^[a-zA-Z0-9_ ]+$/.test(value)) {
      return "Only letters, numbers, and underscore allowed";
    }
    return "";
  };

  const editProfile = useMutation({
    mutationFn: async ({ displayname }: { displayname: string }) =>
      editUserProfile({ displayname }),

    onSuccess: () => {
      dispatch(updateUser({ displayname: displayname }));
      toast.success("User profile updated");
    },

    onError: () => {
      toast.error("Failed to update user profile");
    },
  });

  const handleSubmit = () => {
    const error = validateDisplayName(displayname);
    if (error) {
      setNameError(error);
      return;
    }
    console.log(displayname);
    editProfile.mutate({ displayname });
  };

  return (
    <div>
      <SectionHeader
        title="Account Settings"
        description="Manage your personal information and preferences."
      />

      {/* Personal Info */}
      <div className="bg-[#11193F] rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Personal Information</h3>

        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-[#C9CAD9] text-sm mb-1">
              Username
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9CAD9]">
                <UserIcon size={18} />
              </span>

              <input
                type="text"
                value={displayname}
                onChange={(e) => {
                  setDisplayname(e.target.value);
                  setNameError(validateDisplayName(e.target.value));
                }}
                onBlur={(e) =>
                  setNameError(validateDisplayName(e.target.value))
                }
                className={`w-full bg-[#0A0F2C] border rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none focus:ring-1
                  ${
                    nameError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700 focus:border-[#7C4DFF] focus:ring-[#7C4DFF]"
                  }`}
              />
            </div>

            {nameError && (
              <p className="mt-1 text-sm text-red-500">{nameError}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#C9CAD9] text-sm mb-1">Email</label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9CAD9]">
                <MailIcon size={18} />
              </span>

              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-[#0A0F2C] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white opacity-60 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#11193F] rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Security</h3>

        <div className="space-y-4">
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center text-[#C9CAD9] hover:text-white"
          >
            <LockIcon size={18} className="mr-2" />
            Change Password
          </button>

        </div>
      </div>
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      {/* Subscription Info */}
      {user?.premium && (
        <div className="bg-[#11193F] rounded-lg p-6 mb-6 border border-[#FFD166]/20 shadow-lg shadow-[#FFD166]/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#FFD166]/10">
              <Crown size={20} className="text-[#FFD166]" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Subscription Plan</h3>
              <p className="text-xs text-[#FFD166] font-bold uppercase tracking-widest">Knightly Pro Member</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0A0F2C] p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Current Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-white font-bold">Active</p>
              </div>
            </div>
            <div className="bg-[#0A0F2C] p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Next Billing Date</p>
              <p className="text-white font-bold">
                {user.subscriptionStart 
                  ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(
                      new Date(new Date(user.subscriptionStart).getTime() + 30 * 24 * 60 * 60 * 1000)
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          className="py-2.5 px-5 rounded-lg bg-gradient-to-r from-[#6B2EFF] to-[#7C4DFF] text-white font-medium hover:opacity-90 transition-opacity"
        >
          Save Changes
        </button>

        <button className="py-2.5 px-5 ml-3 rounded-lg border border-gray-600 text-[#C9CAD9] hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

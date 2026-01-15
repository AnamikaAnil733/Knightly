import { useState} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/user";
import { SectionHeader } from "./heading/sectionheader";
import { UserIcon, MailIcon, LockIcon, BellIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "../../../Service/api/axios/Useraxios";

export const AccountSettings = () => {
  const user = useSelector((state: RootState) => state.userAuth.user);


  const [nameError, setNameError] = useState("");
  const [displayname, setDisplayname] = useState(() => {
    return user?.displayname || "";
  });
  

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
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "Only letters, numbers, and underscore allowed";
    }
    return "";
  };

  const editProfile = useMutation({
    mutationFn: async ({ displayname }: { displayname: string }) =>
      axios.patch("/user/edit-profile", { displayname }),
  
    onSuccess: () => {
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
    console.log(displayname)
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
            <label className="block text-[#C9CAD9] text-sm mb-1">
              Email
            </label>

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

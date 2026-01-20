import { useState } from "react";
import { XIcon, LockIcon, EyeOffIcon, EyeIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import userApi from "../../../Service/api/axios/Useraxios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({ isOpen, onClose }: Props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");

  const changePassword = useMutation({
    mutationFn: async () =>
      userApi.patch("/user/change-password", {
        currentPassword,
        newPassword,
      }),
    onSuccess: () => {
      toast.success("Password updated successfully");
      onClose();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => {
      toast.error("Failed to update change Password");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    const validationError = validate(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    changePassword.mutate();
  };

  const validate = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return "Password is required";
    }

    if (trimmed.length < 8) {
      return "Password must be at least 8 characters";
    }

    if (!/[A-Z]/.test(trimmed)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[a-z]/.test(trimmed)) {
      return "Password must contain at least one lowercase letter";
    }

    if (!/[0-9]/.test(trimmed)) {
      return "Password must contain at least one number";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmed)) {
      return "Password must contain at least one special character";
    }

    if (/\s/.test(trimmed)) {
      return "Password must not contain spaces";
    }
    return "";
  };

  /* ===================== UI ===================== */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#0A0F2C] w-full max-w-md rounded-xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Change Password</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm text-[#C9CAD9] mb-1">
              Current Password
            </label>
            <div className="relative">
              <LockIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9CAD9]"
              />
              <input
                type={showPassword.oldPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#11193F] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    oldPassword: !showPassword.oldPassword,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
              >
                {showPassword.oldPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm text-[#C9CAD9] mb-1">
              New Password
            </label>
            <div className="relative">
              <LockIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9CAD9]"
              />
              <input
                type={showPassword.newPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#11193F] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    newPassword: !showPassword.newPassword,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-[#C9CAD9] mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <LockIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9CAD9]"
              />
              <input
                type={showPassword.confirmPassword
                ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#11193F] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    confirmPassword: !showPassword.confirmPassword,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600 text-[#C9CAD9] hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={changePassword.isPending}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6B2EFF] to-[#7C4DFF] text-white disabled:opacity-50"
          >
            {changePassword.isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

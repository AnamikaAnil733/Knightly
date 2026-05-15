import { useState } from "react";
import { XIcon, LockIcon, EyeOffIcon, EyeIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { changePasswordApi } from "../../../Service/Api/UserApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordSchema,
  ChangePasswordFormData,
} from "../../../Utils/Validators";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({ isOpen, onClose }: Props) => {
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePassword = useMutation({
    mutationFn: async (data: ChangePasswordFormData) =>
      changePasswordApi({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password updated successfully");
      onClose();
      reset();
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError.response?.data?.message || "Failed to update password";
      toast.error(errorMessage);
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword.mutate(data);
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
                {...register("currentPassword")}
                className={`w-full bg-[#11193F] border ${errors.currentPassword ? "border-red-500" : "border-gray-700"} rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none`}
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
                {...register("newPassword")}
                className={`w-full bg-[#11193F] border ${errors.newPassword ? "border-red-500" : "border-gray-700"} rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none`}
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
                {showPassword.newPassword ? (
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
                type={showPassword.confirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`w-full bg-[#11193F] border ${errors.confirmPassword ? "border-red-500" : "border-gray-700"} rounded-lg py-2.5 pl-10 pr-3 text-white focus:outline-none`}
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
                {showPassword.confirmPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
          </div>

          {errors.currentPassword && (
            <p className="text-sm text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
          )}
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
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
            onClick={handleSubmit(onSubmit)}
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

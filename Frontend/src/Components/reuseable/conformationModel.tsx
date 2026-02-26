interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  confirmColor = "bg-red-600 hover:bg-red-700",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[340px] rounded-lg bg-[#182e55] p-6 shadow-lg border border-1 border-[#4e668b]">
        <h2 className="text-lg lg:text-xl font-semibold text-white">{title}</h2>

        <p className="mt-2 text-sm lg:text-base text-gray-100">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm lg:text-base text-gray-100 hover:bg-black/10"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-sm lg:text-base text-white ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

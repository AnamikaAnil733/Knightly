import { useState } from "react";
import { X, Trophy, Award, Pencil } from "lucide-react";
import type {
  Achievement,
  CreateAchievementPayload,
  CriteriaType,
  UpdateAchievementPayload,
} from "../../../Service/Api/AdminAchievementApi";
import { ICON_OPTIONS, CRITERIA_OPTIONS } from "./AchievementConstants";

interface Props {
  onClose: () => void;
  onSave: (data: CreateAchievementPayload) => Promise<void>;
  onUpdate?: (id: string, data: UpdateAchievementPayload) => Promise<void>;
  // Pass the existing achievement to switch to Edit mode
  editData?: Achievement | null;
}

export function AchievementModal({
  onClose,
  onSave,
  onUpdate,
  editData,
}: Props) {
  const isEditMode = !!editData;

  const [form, setForm] = useState<CreateAchievementPayload>({
    title: editData?.title ?? "",
    description: editData?.description ?? "",
    icon: editData?.icon ?? "Trophy",
    criteriaType: editData?.criteriaType ?? "GAMES_WON",
    criteriaValue: editData?.criteriaValue ?? 1,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateAchievementPayload, string>>
  >({});

  /* ── Validation ─────────────────────────────────────────── */
  const validate = () => {
    const e: typeof errors = {};
    if (form.title.length < 3) e.title = "Title must be at least 3 characters.";
    if (form.description.length < 10)
      e.description = "Description must be at least 10 characters.";
    if (form.criteriaValue < 1) e.criteriaValue = "Value must be at least 1.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditMode && onUpdate) {
        await onUpdate(editData!.id, form);
      } else {
        await onSave(form);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  /* ── Selected icon preview ──────────────────────────────── */
  const SelectedIcon =
    ICON_OPTIONS.find((i) => i.name === form.icon)?.Component ?? Trophy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-[#3A6FF7]/40
                   bg-gradient-to-br from-[#0A0F2C] via-[#0d1535] to-[#060B2E]
                   shadow-[0_0_60px_rgba(58,111,247,0.2)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isEditMode
                  ? "bg-gradient-to-br from-[#FFD166]/30 to-amber-600/30 border border-[#FFD166]/30"
                  : "bg-gradient-to-br from-[#6B2EFF] to-[#3A6FF7]"
              }`}
            >
              {isEditMode ? (
                <Pencil size={20} className="text-[#FFD166]" />
              ) : (
                <Award size={20} className="text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {isEditMode ? "Edit Achievement" : "New Achievement"}
              </h2>
              {isEditMode && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Editing:{" "}
                  <span className="text-[#FFD166]">{editData?.title}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. First Blood"
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10
                         text-white placeholder-gray-500 text-sm
                         focus:outline-none focus:border-[#3A6FF7] transition-colors"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="What does the user need to do to earn this?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10
                         text-white placeholder-gray-500 text-sm resize-none
                         focus:outline-none focus:border-[#3A6FF7] transition-colors"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map(({ name, Component }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setForm({ ...form, icon: name })}
                  className={`flex items-center justify-center p-2.5 rounded-lg border transition-all
                    ${
                      form.icon === name
                        ? "border-[#FFD166] bg-[#FFD166]/20 text-[#FFD166] shadow-[0_0_10px_rgba(255,209,102,0.3)]"
                        : "border-white/10 text-gray-400 hover:border-[#3A6FF7]/50 hover:text-white bg-white/5"
                    }`}
                  title={name}
                >
                  <Component size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Criteria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Criteria Type
              </label>
              <select
                value={form.criteriaType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    criteriaType: e.target.value as CriteriaType,
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10
                           text-white text-sm focus:outline-none focus:border-[#3A6FF7]
                           transition-colors appearance-none cursor-pointer"
              >
                {CRITERIA_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-[#0A0F2C]"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Target Value
              </label>
              <input
                type="number"
                min={1}
                value={form.criteriaValue}
                onChange={(e) =>
                  setForm({ ...form, criteriaValue: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10
                           text-white text-sm focus:outline-none focus:border-[#3A6FF7] transition-colors"
              />
              {errors.criteriaValue && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.criteriaValue}
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-[#FFD166]/20 bg-[#FFD166]/5">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B2EFF]/40 to-[#3A6FF7]/40
                            flex items-center justify-center border border-[#FFD166]/30"
            >
              <SelectedIcon size={24} className="text-[#FFD166]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {form.title || "Achievement Title"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {form.description || "Achievement description..."}
              </p>
              <span
                className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full
                               bg-[#3A6FF7]/20 text-[#3A6FF7] border border-[#3A6FF7]/30"
              >
                {
                  CRITERIA_OPTIONS.find((c) => c.value === form.criteriaType)
                    ?.label
                }
                : {form.criteriaValue}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300
                         border border-white/10 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white
                         border transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         ${
                           isEditMode
                             ? "bg-gradient-to-r from-amber-600 to-[#FFD166] border-[#FFD166]/30 hover:shadow-[0_0_20px_rgba(255,209,102,0.4)] text-[#0A0F2C]"
                             : "bg-gradient-to-r from-[#6B2EFF] to-[#3A6FF7] border-[#FFD166]/30 hover:shadow-[0_0_20px_rgba(107,46,255,0.5)]"
                         }`}
            >
              {loading
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Achievement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

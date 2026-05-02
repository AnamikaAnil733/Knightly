import React, { useEffect, useState } from "react";
import axios from "../../Service/Api/Axios/Adminaxios";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Check, Lock } from "lucide-react";
import Pagination from "../../Components/Reuseable/Pagination";
import { LessonDetail } from "../../Types/LessonTypes";

const CATEGORIES = [
  "GETTING_STARTED",
  "TACTICS",
  "OPENINGS",
  "STRATEGY",
  "ENDGAMES",
];
const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const emptyForm = {
  title: "",
  category: "GETTING_STARTED",
  difficulty: "BEGINNER",
  content: "",
  order: 1,
  fen: "",
  isPremium: false,
};

export const LessonManagement: React.FC = () => {
  const [lessons, setLessons] = useState<LessonDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LessonDetail | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const fetchLessons = async () => {
    try {
      const res = await axios.get("/admin/lessons");
      setLessons(res.data.lessons || []);
    } catch {
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (lesson: LessonDetail) => {
    setEditing(lesson);
    setForm({
      title: lesson.title,
      category: lesson.category,
      difficulty: lesson.difficulty,
      content: lesson.content,
      order: lesson.order,
      fen: lesson.fen ?? "",
      isPremium: lesson.isPremium || false,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { ...form, fen: form.fen || undefined };
      if (editing) {
        await axios.put(`/admin/lessons/${editing.id}`, body);
        toast.success("Lesson updated!");
      } else {
        await axios.post("/admin/lessons", body);
        toast.success("Lesson created!");
      }
      setShowForm(false);
      fetchLessons();
    } catch {
      toast.error("Failed to save lesson");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await axios.delete(`/admin/lessons/${id}`);
      toast.success("Lesson deleted");
      fetchLessons();
    } catch {
      toast.error("Failed to delete lesson");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#0A0F2C] text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">Lesson Management</h1>
            <p className="text-xs text-[#9ca3af] mt-1 uppercase tracking-widest font-bold">
              Manage your Chess Academy curriculum
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFD166] text-[#0A0F2C] rounded-xl font-bold hover:bg-[#F4C14D] transition-all"
          >
            <Plus className="w-4 h-4" />
            New Lesson
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#11193F] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black">
                  {editing ? "Edit Lesson" : "Create Lesson"}
                </h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="w-5 h-5 text-[#9ca3af] hover:text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-1 block">
                    Title
                  </label>
                  <input
                    className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#FFD166]/50"
                    placeholder="Lesson title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-1 block">
                      Category
                    </label>
                    <select
                      className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#11193F]">
                          {c.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-1 block">
                      Difficulty
                    </label>
                    <select
                      className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                      value={form.difficulty}
                      onChange={(e) =>
                        setForm({ ...form, difficulty: e.target.value })
                      }
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d} value={d} className="bg-[#11193F]">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-1 block">
                      Sort Order
                    </label>
                    <input
                      className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#FFD166]/50"
                      type="number"
                      placeholder="e.g. 1"
                      value={form.order}
                      onChange={(e) =>
                        setForm({ ...form, order: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 hover:bg-white/5 transition-all">
                      <input
                        type="checkbox"
                        checked={form.isPremium}
                        onChange={(e) =>
                          setForm({ ...form, isPremium: e.target.checked })
                        }
                        className="w-4 h-4 rounded accent-[#FFD166]"
                      />
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-[#FFD166]" />
                        Premium
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-1 block">
                    FEN Position (Optional)
                  </label>
                  <input
                    className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#FFD166]/50"
                    placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
                    value={form.fen}
                    onChange={(e) => setForm({ ...form, fen: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-1 block">
                    Content (Markdown)
                  </label>
                  <textarea
                    className="w-full bg-[#0A0F2C] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#FFD166]/50 min-h-[160px] resize-y text-sm leading-relaxed"
                    placeholder="Describe the tactical concepts..."
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#FFD166] text-[#0A0F2C] rounded-xl font-bold hover:bg-[#F4C14D] transition-all disabled:opacity-50 mt-6 shadow-lg shadow-[#FFD166]/10"
              >
                <Check className="w-4 h-4" />
                {saving
                  ? "Saving…"
                  : editing
                    ? "Update Lesson"
                    : "Create Lesson"}
              </button>
            </div>
          </div>
        )}

        {/* Lessons Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD166]" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-20 bg-[#11193F]/30 rounded-2xl border border-dashed border-white/5">
            <p className="text-[#9ca3af]">
              No lessons yet. Create your first one!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {lessons
                .slice(
                    (currentPage - 1) * ITEMS_PER_PAGE,
                    currentPage * ITEMS_PER_PAGE,
                  )
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between bg-[#11193F] border border-white/5 p-5 rounded-2xl group hover:border-[#FFD166]/20 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <span className="w-10 h-10 rounded-xl bg-[#0A0F2C] border border-white/5 flex items-center justify-center text-[#9ca3af] font-black text-sm group-hover:text-[#FFD166] transition-colors">
                        {lesson.order}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-bold group-hover:text-[#FFD166] transition-colors">
                            {lesson.title}
                          </p>
                          {lesson.isPremium && (
                            <span className="bg-[#FFD166]/10 text-[#FFD166] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 border border-[#FFD166]/20">
                              <Lock className="w-2 h-2" />
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-[#9ca3af] text-[10px] font-bold uppercase tracking-tighter mt-1">
                          {lesson.category.replace("_", " ")} ·{" "}
                          <span className="text-white/40">
                            {lesson.difficulty}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(lesson)}
                        className="p-2.5 rounded-xl bg-white/5 text-[#9ca3af] hover:text-[#FFD166] hover:bg-[#FFD166]/10 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="p-2.5 rounded-xl bg-white/5 text-[#9ca3af] hover:text-[#EF476F] hover:bg-[#EF476F]/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalItems={lessons.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                label="lessons"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LessonManagement;

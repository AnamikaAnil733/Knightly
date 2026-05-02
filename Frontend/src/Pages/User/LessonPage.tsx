import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import { ChessboardPreview } from "../../Components/Admin/PuzzleManagement/ChessBoardPreview";
import { getLessonById, getLessons } from "../../Service/Api/LearnApi";
import { ArrowLeft, ArrowRight, BookOpen, Crown, Lock } from "lucide-react";
import { LessonDetail } from "../../Types/LessonTypes";
import { motion, AnimatePresence } from "framer-motion";

const DIFF_COLORS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  BEGINNER: { label: "Beginner", color: "#06D6A0", bg: "bg-[#06D6A0]/10" },
  INTERMEDIATE: {
    label: "Intermediate",
    color: "#FFD166",
    bg: "bg-[#FFD166]/10",
  },
  ADVANCED: { label: "Advanced", color: "#EF476F", bg: "bg-[#EF476F]/10" },
};

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [nextLesson, setNextLesson] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremiumLocked, setIsPremiumLocked] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setIsPremiumLocked(false);
        const data = await getLessonById(id!);
        setLesson(data.lesson);

        // Find next lesson in same category
        const siblingData = await getLessons({
          category: data.lesson.category,
        });
        const siblings: LessonDetail[] = siblingData.lessons || [];
        const sorted = siblings.sort(
          (a: LessonDetail, b: LessonDetail) => a.order - b.order,
        );
        const idx = sorted.findIndex(
          (l: LessonDetail) => l.id === data.lesson.id,
        );
        if (idx >= 0 && idx < sorted.length - 1) {
          const next = sorted[idx + 1];
          setNextLesson({ id: next.id, title: next.title });
        } else {
          setNextLesson(null);
        }
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const msg = error.response?.data?.message || error.message || "";
        if (msg.includes("Premium membership required")) {
          setIsPremiumLocked(true);
        }
        console.error("Failed to fetch lesson:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const d = lesson
    ? (DIFF_COLORS[lesson.difficulty] ?? DIFF_COLORS.BEGINNER)
    : DIFF_COLORS.BEGINNER;

  return (
    <div className="min-h-screen bg-[#0A0F2C] flex flex-col relative">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10 mt-16 flex flex-col relative">
        <AnimatePresence mode="wait">
          {loading && !lesson ? (
            <motion.div
              key="initial-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex items-center justify-center"
            >
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FFD166]" />
            </motion.div>
          ) : isPremiumLocked ? (
            <motion.div
              key="premium-locked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-grow flex items-center justify-center p-6"
            >
              <div className="max-w-md w-full bg-[#11193F] border border-amber-500/20 rounded-[2rem] p-8 text-center">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-amber-500" />
                </div>
                <h1 className="text-3xl font-black mb-4 text-white">
                  Master Lesson Locked
                </h1>
                <p className="text-[#9ca3af] mb-10 leading-relaxed">
                  This advanced lesson is exclusive to Knightly Premium members.
                  Upgrade your account to unlock master training.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate("/pricing")}
                    className="w-full py-4 rounded-xl bg-amber-500 text-black font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-all"
                  >
                    <Crown className="w-5 h-5 fill-black" />
                    Upgrade to Premium
                  </button>
                  <button
                    onClick={() => navigate("/learn")}
                    className="w-full py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                  >
                    Explore Free Lessons
                  </button>
                </div>
              </div>
            </motion.div>
          ) : !lesson && !loading ? (
            <motion.div
              key="not-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex items-center justify-center"
            >
              <p className="text-[#9ca3af]">Lesson not found.</p>
            </motion.div>
          ) : (
            <motion.div
              key={lesson?.id || "content"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`max-w-3xl mx-auto w-full transition-opacity duration-300 ${loading ? "opacity-30 pointer-events-none" : "opacity-100"}`}
            >
              {/* Breadcrumb */}
              <button
                onClick={() => navigate(`/learn/${lesson!.category}`)}
                className="flex items-center gap-2 text-[#9ca3af] hover:text-[#FFD166] transition-colors mb-8 text-sm font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to lessons
              </button>

              {/* Header */}
              <div className="mb-8">
                <span
                  className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${d.bg} mb-4 inline-block`}
                  style={{ color: d.color }}
                >
                  {d.label}
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-white mt-2 mb-1">
                  {lesson!.title}
                </h1>
                <p className="text-[#9ca3af] text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Lesson {lesson!.order}
                </p>
              </div>

              {/* FEN Board */}
              {lesson!.fen && (
                <div className="bg-[#11193F] border border-white/5 rounded-2xl p-6 mb-8">
                  <p className="text-[#9ca3af] text-xs font-mono mb-4 text-center">
                    Position: {lesson!.fen}
                  </p>
                  <ChessboardPreview fen={lesson!.fen} />
                </div>
              )}

              {/* Content */}
              <div className="bg-[#11193F] border border-white/5 rounded-2xl p-8 mb-8">
                <div className="prose prose-invert max-w-none text-[#d1d5db] leading-relaxed whitespace-pre-wrap text-[15px]">
                  {lesson!.content}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate(`/learn/${lesson!.category}`)}
                  className="flex items-center gap-2 px-5 py-3 bg-white/5 text-[#9ca3af] hover:text-white hover:bg-white/10 rounded-xl transition-all font-bold text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All Lessons
                </button>

                {nextLesson && (
                  <button
                    onClick={() => navigate(`/learn/lesson/${nextLesson.id}`)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#FFD166] text-[#0A0F2C] hover:bg-[#F4C14D] rounded-xl transition-all font-bold text-sm"
                  >
                    {nextLesson.title}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle loading indicator for subsequent loads */}
        {loading && lesson && (
          <div className="fixed top-20 right-8 z-[60]">
            <div className="flex items-center gap-3 bg-[#11193F] border border-[#FFD166]/20 px-4 py-2 rounded-full shadow-2xl">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#FFD166]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD166]">
                Loading Next...
              </span>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LessonPage;

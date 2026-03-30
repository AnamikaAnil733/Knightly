import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import { ChessboardPreview } from "../../Components/Admin/PuzzleManagement/ChessBoardPreview";
import { getLessonById, getLessons } from "../../Service/Api/LearnApi";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

interface LessonDetail {
  id: string;
  title: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  content: string;
  order: number;
  fen?: string;
}

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

  useEffect(() => {
    const fetch = async () => {
      try {
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
        }
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F2C] flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FFD166]" />
        </main>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0A0F2C] flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-[#9ca3af]">Lesson not found.</p>
        </main>
      </div>
    );
  }

  const d = DIFF_COLORS[lesson.difficulty] ?? DIFF_COLORS.BEGINNER;

  return (
    <div className="min-h-screen bg-[#0A0F2C] flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10 mt-16">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(`/learn/${lesson.category}`)}
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
              {lesson.title}
            </h1>
            <p className="text-[#9ca3af] text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Lesson {lesson.order}
            </p>
          </div>

          {/* FEN Board (read-only illustration) */}
          {lesson.fen && (
            <div className="bg-[#11193F] border border-white/5 rounded-2xl p-6 mb-8">
              <p className="text-[#9ca3af] text-xs font-mono mb-4 text-center">
                Position: {lesson.fen}
              </p>
              <ChessboardPreview fen={lesson.fen} />
            </div>
          )}

          {/* Content */}
          <div className="bg-[#11193F] border border-white/5 rounded-2xl p-8 mb-8">
            <div className="prose prose-invert max-w-none text-[#d1d5db] leading-relaxed whitespace-pre-wrap text-[15px]">
              {lesson.content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(`/learn/${lesson.category}`)}
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LessonPage;

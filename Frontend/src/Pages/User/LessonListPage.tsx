import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import LessonCard from "../../Components/User/Learning/LessonCard";
import { getLessons } from "../../Service/Api/LearnApi";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Lesson } from "../../Types/LessonTypes";

const CATEGORY_LABELS: Record<string, string> = {
  GETTING_STARTED: "Getting Started",
  TACTICS: "Tactics",
  OPENINGS: "Openings",
  STRATEGY: "Strategy",
  ENDGAMES: "Endgames",
};

const LessonListPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getLessons({ category });
        setLessons(data.lessons || []);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category]);

  const categoryLabel = CATEGORY_LABELS[category ?? ""] ?? category;

  return (
    <div className="min-h-screen bg-[#0A0F2C] flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10 mt-16">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/learn")}
            className="flex items-center gap-2 text-[#9ca3af] hover:text-[#FFD166] transition-colors mb-8 text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy
          </button>

          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-7 h-7 text-[#FFD166]" />
            <h1 className="text-3xl font-black text-white">{categoryLabel}</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD166]" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-20 bg-[#11193F]/30 rounded-2xl border border-dashed border-white/5">
              <p className="text-[#9ca3af]">
                No lessons in this category yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  id={lesson.id}
                  title={lesson.title}
                  difficulty={lesson.difficulty}
                  order={lesson.order}
                  category={lesson.category}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LessonListPage;

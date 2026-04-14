import React, { useEffect, useState } from "react";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import { BlogMasonryGrid } from "../../Components/User/Blog/BlogMasonryGrid";
import { getAllBlogs } from "../../Service/Api/BlogApi";
import { BlogResponseDTO } from "../../Types/BlogTypes";
import { motion, useScroll, useTransform } from "framer-motion";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { PenSquareIcon, PlusIcon, Sparkles } from "lucide-react";

const BlogListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();

  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs({});
      setBlogs(data.blogs);
    } catch {
      toast.error("Failed to fetch blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060918] font-inter text-white overflow-x-hidden">
      <Navbar />

      <main className="relative">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-accent/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-electric/10 blur-[150px] rounded-full animate-pulse delay-1000" />
        </div>

        {/* Cinematic Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060918]/60 to-[#060918] z-10" />
            <img
              src="https://images.unsplash.com/photo-1529692236671-f1f6e9460272?auto=format&fit=crop&q=80&w=2000"
              alt="Chess Library"
              className="w-full h-full object-cover opacity-30"
            />
          </motion.div>

          <div className="relative z-20 text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gold text-xs font-black uppercase tracking-[5px] mb-10 backdrop-blur-md"
            >
              <Sparkles size={16} /> The Grand Library
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="text-7xl md:text-9xl font-cinzel font-bold text-white mb-8 tracking-tighter"
            >
              Knightly{" "}
              <span className="text-gold italic block md:inline">
                Chronicles
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-light max-w-2xl mx-auto text-lg md:text-xl mb-14 leading-relaxed font-light italic opacity-80"
            >
              "In the game of kings, knowledge is the strongest move." Master
              the board through advanced strategy and timeless wisdom.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <Link
                to="/blog/create"
                className="group relative px-12 py-5 bg-gold hover:bg-gold-light text-navy-dark font-black rounded-2xl transition-all shadow-[0_0_50px_rgba(212,175,55,0.2)] hover:shadow-gold/40 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                <PenSquareIcon size={22} />
                <span className="uppercase tracking-[3px] text-xs">
                  Write Chronicle
                </span>
              </Link>

              <button
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }
                className="px-12 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black uppercase tracking-[3px] text-xs backdrop-blur-md transition-all hover:border-white/30"
              >
                Explore Library
              </button>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
          >
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/30 to-transparent mx-auto" />
          </motion.div>
        </section>

        {/* Blog Content Area */}
        <div className="max-w-[1600px] mx-auto pb-32">
          {loading ? (
            <div className="px-12">
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="break-inside-avoid w-full h-[300px] md:h-[450px] bg-white/5 animate-pulse rounded-3xl"
                  />
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <BlogMasonryGrid blogs={blogs} />
            </motion.div>
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-10 right-10 z-[100] md:hidden">
          <Link
            to="/blog/create"
            className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-navy-dark shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:scale-110 active:scale-95 transition-all"
          >
            <PlusIcon size={32} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogListPage;

import React, { useEffect, useState, useCallback } from "react";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import { BlogMasonryGrid } from "../../Components/User/Blog/BlogMasonryGrid";
import { getAllBlogs } from "../../Service/Api/BlogApi";
import { BlogResponseDTO, BlogCategory } from "../../Types/BlogTypes";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { PenSquareIcon, PlusIcon, Sparkles, Search } from "lucide-react";
import Pagination from "../../Components/Reuseable/Pagination";

const BlogListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "ALL">(
    "ALL",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { scrollY } = useScroll();

  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs({
        search: searchTerm,
        category: activeCategory === "ALL" ? undefined : activeCategory,
        page: currentPage,
        limit: itemsPerPage,
      });
      setBlogs(data.blogs);
      setTotalItems(data.total);
    } catch {
      toast.error("Failed to fetch blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeCategory, currentPage, itemsPerPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, activeCategory, currentPage, fetchBlogs]);

  const handleCategoryChange = (cat: BlogCategory | "ALL") => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#0B1437] font-['Poppins'] text-white overflow-x-hidden relative">
      {/* Page-wide subtle background texture */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url(/images/blogs-background-v2.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "blur(80px)",
        }}
      />
      <Navbar />

      <main className="relative z-10">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6D5DF6]/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFD166]/5 blur-[150px] rounded-full animate-pulse delay-1000" />
        </div>

        {/* Cinematic Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1437]/60 to-[#0B1437] z-10" />
            <img
              src="/images/blogs-background-v2.png"
              alt="The Royal Archives"
              className="w-full h-full object-cover opacity-80"
            />
          </motion.div>

          {/* Sparkle Particles Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
            <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-[#FFD166] rounded-full animate-ping" />
            <div className="absolute top-[40%] right-[20%] w-1.5 h-1.5 bg-[#FFD166] rounded-full animate-pulse delay-300" />
            <div className="absolute bottom-[30%] left-[30%] w-1 h-1 bg-[#FFD166] rounded-full animate-bounce delay-700" />
          </div>

          <div className="relative z-20 text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[#FFD166] text-xs font-black uppercase tracking-[5px] mb-10 backdrop-blur-md"
            >
              <Sparkles size={16} /> THE ROYAL ARCHIVES
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
              className="text-[#E2E8F0] max-w-2xl mx-auto text-lg md:text-xl mb-14 leading-relaxed font-light italic opacity-90 drop-shadow-lg"
            >
              "In the game of kings, knowledge is the strongest move." <br />
              Master the board through strategy and timeless wisdom.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <Link
                to="/blog/create"
                className="group relative px-12 py-5 bg-gradient-to-r from-[#4F7CFF] to-[#6D5DF6] text-white font-black rounded-2xl transition-all shadow-[0_15px_40px_rgba(79,124,255,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden border border-white/10"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
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
                className="px-12 py-5 bg-[#0B1437]/60 hover:bg-[#FFD166] hover:text-[#0B1437] border-2 border-[#FFD166] rounded-2xl text-[#FFD166] font-black uppercase tracking-[3px] text-xs backdrop-blur-md transition-all shadow-xl"
              >
                Explore Archives
              </button>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#FFD166]/40"
          >
            <div className="w-[2px] h-20 bg-gradient-to-b from-transparent via-[#FFD166]/50 to-transparent mx-auto" />
          </motion.div>
        </section>

        {/* Blog Controls Area */}
        <div className="max-w-7xl mx-auto px-6 mb-16 relative z-30">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-white/[0.02] border border-white/10 p-4 md:p-2 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
            {/* Search Bar */}
            <div
              className={`relative flex-1 group transition-all duration-500 ${isSearchFocused ? "md:flex-[1.5]" : "flex-1"}`}
            >
              <div
                className={`absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors duration-300 ${isSearchFocused ? "text-gold" : "text-gray-500"}`}
              >
                <Search size={20} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search chronicles or authors..."
                className="w-full bg-transparent border-none py-5 pl-16 pr-8 text-white focus:ring-0 placeholder:text-gray-600 font-medium text-lg leading-tight transition-all"
              />
              {isSearchFocused && (
                <motion.div
                  layoutId="searchHighlight"
                  className="absolute bottom-4 left-16 right-8 h-[2px] bg-gradient-to-r from-gold/50 to-transparent"
                />
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-[2rem] border border-white/5 overflow-x-auto no-scrollbar max-w-full">
              {["ALL", ...Object.values(BlogCategory)].map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    handleCategoryChange(cat as BlogCategory | "ALL")
                  }
                  className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-[2px] transition-all duration-300 whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-gold text-navy-dark shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105"
                      : "text-gray-light hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {searchTerm && blogs.length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 text-center text-gold/60 font-cinzel text-xs tracking-[4px] uppercase"
              >
                Showing {blogs.length} results for "{searchTerm}"
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Blog Content Area */}
        <div className="max-w-[1600px] mx-auto pb-32">
          {!loading && blogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 text-center"
            >
              <div className="inline-block p-10 rounded-full bg-white/5 border border-white/10 mb-8">
                <Search
                  size={64}
                  className="text-gray-600 mx-auto"
                  strokeWidth={1}
                />
              </div>
              <h3 className="text-4xl font-cinzel font-bold text-white mb-4">
                No Chronicles Found
              </h3>
              <p className="text-gray-light max-w-md mx-auto italic opacity-60">
                The library archives do not contain manuscripts matching your
                search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("ALL");
                }}
                className="mt-10 text-gold font-bold uppercase tracking-[3px] text-xs hover:text-white transition-colors border-b border-gold/30 pb-1"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : loading ? (
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

              {/* Pagination */}
              <div className="mt-16 px-12">
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  label="chronicles"
                />
              </div>
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

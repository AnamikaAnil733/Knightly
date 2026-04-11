import React, { useEffect, useState } from "react";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import { BlogCard } from "../../Components/User/Blog/BlogCard";
import { getAllBlogs } from "../../Service/Api/BlogApi";
import { BlogResponseDTO, BlogCategory } from "../../Types/BlogTypes";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { PenSquareIcon, PlusIcon } from "lucide-react";

const BlogListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<
    BlogCategory | "ALL"
  >("ALL");

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const filters =
        selectedCategory !== "ALL" ? { category: selectedCategory } : {};
      const data = await getAllBlogs(filters);
      setBlogs(data.blogs);
    } catch (error) {
      toast.error("Failed to fetch blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark font-inter">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-cinzel font-bold text-white mb-6 uppercase tracking-widest"
          >
            Knightly <span className="text-gold">Chronicles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-light max-w-2xl mx-auto text-lg mb-8"
          >
            Explore advanced chess strategies, community updates, and tactical
            tutorials from our master players.
          </motion.p>
          
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4 }}
          >
            <Link
              to="/blog/create"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-full transition-all shadow-lg hover:shadow-gold/20"
            >
              <PenSquareIcon size={18} />
              Write Your Own
            </Link>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {["ALL", ...Object.values(BlogCategory)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                selectedCategory === cat
                  ? "bg-gold text-navy-dark shadow-lg shadow-gold/20"
                  : "bg-navy-card text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 bg-navy-card rounded-2xl animate-pulse border border-white/5"
              ></div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gold text-xl font-cinzel">
              No blogs found in this category.
            </p>
          </div>
        )}
        {/* Floating Action Button for Mobile/Convenience */}
        <div className="fixed bottom-8 right-8 z-40 md:hidden">
          <Link
            to="/blog/create"
            className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-navy-dark shadow-2xl shadow-gold/40 hover:scale-110 active:scale-95 transition-all"
          >
            <PlusIcon size={28} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogListPage;

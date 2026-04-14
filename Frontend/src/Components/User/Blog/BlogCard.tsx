import React from "react";
import { Link } from "react-router-dom";
import { BlogResponseDTO, BlogAuthorRole } from "../../../Types/BlogTypes";
import { motion } from "framer-motion";
import { Eye, Clock, ArrowRight, User } from "lucide-react";

interface BlogCardProps {
  blog: BlogResponseDTO;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        y: -12,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      className="group relative bg-[#0D122B] rounded-3xl overflow-hidden border border-white/5 flex flex-col h-[520px] shadow-2xl transition-all duration-500 hover:border-gold/30"
    >
      {/* Premium Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

      <div className="relative flex flex-col h-full bg-[#0D122B] rounded-3xl z-10 overflow-hidden">
        {/* Cover Image Section */}
        <div className="relative h-60 overflow-hidden">
          <motion.img
            src={
              blog.coverImage ||
              "https://images.unsplash.com/photo-1522071823991-b96020518d6f?auto=format&fit=crop&q=80&w=800"
            }
            alt={blog.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          />

          {/* Category Badge */}
          <div className="absolute top-5 left-5 z-20">
            <span className="px-4 py-1.5 bg-navy-dark/60 backdrop-blur-xl text-gold text-[10px] font-black rounded-xl uppercase tracking-[2.5px] border border-white/10 shadow-2xl">
              {blog.category}
            </span>
          </div>

          {/* View Count Overlay */}
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/5 text-[10px] text-white/70 font-bold">
            <Eye size={12} className="text-gold" />
            {blog.viewCount || 0}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0D122B] via-transparent to-transparent opacity-80" />
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col flex-grow relative -mt-8 bg-[#0D122B] rounded-t-[40px]">
          <div className="mb-4 flex items-center gap-3">
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[9px] text-blue-electric font-black uppercase tracking-[2px] px-2 py-0.5 bg-blue-electric/10 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl md:text-2xl font-cinzel font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-gold transition-colors duration-300">
            {blog.title}
          </h3>

          <p className="text-gray-light/70 text-sm mb-6 line-clamp-3 leading-relaxed font-inter">
            {blog.excerpt}
          </p>

          {/* Premium Footer */}
          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-navy-midnight to-navy-dark flex items-center justify-center border border-white/10 shadow-xl overflow-hidden group-hover:border-gold/40 transition-colors">
                  {blog.authorRole === BlogAuthorRole.ADMIN ? (
                    <span className="text-xl">♔</span>
                  ) : (
                    <User size={20} className="text-gold/80" />
                  )}
                </div>
                {blog.authorRole === BlogAuthorRole.ADMIN && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-[#0D122B] shadow-sm animate-pulse" />
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-white font-black tracking-widest uppercase">
                  {blog.authorRole === BlogAuthorRole.ADMIN
                    ? "Grandmaster"
                    : "Tactician"}
                </span>
                <span className="text-[10px] text-gray-light/50 font-medium flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(blog.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <Link
              to={`/blogs/${blog.slug}`}
              className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold transition-all duration-300 hover:bg-gold hover:text-navy-dark hover:scale-110 hover:shadow-[0_0_20px_rgba(255,209,102,0.4)]"
            >
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import React from "react";
import { Link } from "react-router-dom";
import { BlogResponseDTO } from "../../../Types/BlogTypes";
import { motion } from "framer-motion";
import { Eye, Clock, ArrowUpRight } from "lucide-react";

interface BlogMasonryCardProps {
  blog: BlogResponseDTO;
  index: number;
}

export const BlogMasonryCard: React.FC<BlogMasonryCardProps> = ({
  blog,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="break-inside-avoid mb-6 group relative bg-[#11193F]/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 shadow-xl hover:shadow-[#FFD166]/10 transition-all duration-500"
    >
      <Link to={`/blogs/${blog.slug}`} className="block relative h-auto">
        {/* Cover Image */}
        <div className="relative overflow-hidden bg-[#0B1437]">
          <img
            src={
              blog.coverImage ||
              "https://images.unsplash.com/photo-1522071823991-b96020518d6f?auto=format&fit=crop&q=80&w=800"
            }
            alt={blog.title}
            className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:brightness-50"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 bg-[#0B1437]/60">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFD166]/20 backdrop-blur-md flex items-center justify-center text-[#FFD166] border border-[#FFD166]/30">
                  <Eye size={14} />
                </div>
                <span className="text-[10px] text-white/80 font-bold">
                  {blog.viewCount || 0} Views
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FFD166] flex items-center justify-center text-[#0B1437] shadow-xl">
                <ArrowUpRight size={20} />
              </div>
            </motion.div>
          </div>

          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-[#0B1437]/80 backdrop-blur-md text-[#FFD166] text-[9px] font-black rounded-lg uppercase tracking-widest border border-white/10 group-hover:border-[#FFD166]/50 transition-colors">
              {blog.category.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[8px] text-[#4F7CFF] font-black tracking-[0.2em] uppercase opacity-80"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h3 className="text-base font-cinzel font-bold text-white mb-3 line-clamp-2 group-hover:text-[#FFD166] transition-colors leading-snug">
            {blog.title}
          </h3>
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${blog.authorRole === "ADMIN" ? "bg-[#FFD166]" : "bg-[#4F7CFF]"}`}
              />
              <span className="text-[9px] text-[#AAB3D1] font-black uppercase tracking-widest">
                {blog.authorRole === "ADMIN" ? "♔ Grandmaster" : "♟ Tactician"}
              </span>
            </div>
            <span className="text-[9px] text-[#AAB3D1] font-medium flex items-center gap-1.5 opacity-60">
              <Clock size={10} />
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

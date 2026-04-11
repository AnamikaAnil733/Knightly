import React from "react";
import { Link } from "react-router-dom";
import { BlogResponseDTO } from "../../../Types/BlogTypes";
import { motion } from "framer-motion";

interface BlogCardProps {
  blog: BlogResponseDTO;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-navy-card rounded-2xl overflow-hidden border border-white/10 flex flex-col h-full shadow-lg hover:shadow-purple-accent/20 transition-all"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            blog.coverImage ||
            "https://images.unsplash.com/photo-1522071823991-b96020518d6f?auto=format&fit=crop&q=80&w=800"
          }
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-purple-accent text-white text-xs font-semibold rounded-full uppercase tracking-wider">
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-cinzel font-bold text-white mb-2 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-gray-light text-sm mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-blue-electric font-medium uppercase tracking-tighter"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-navy-dark flex items-center justify-center text-xs font-bold text-gold border border-gold/20">
              {blog.authorRole === "ADMIN" ? "👑" : "👤"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-white font-medium">
                Author_{blog.authorId.slice(-4)}
              </span>
              <span className="text-[10px] text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Link
            to={`/blogs/${blog.slug}`}
            className="text-xs font-semibold text-gold hover:text-white transition-colors uppercase tracking-widest"
          >
            Read More
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

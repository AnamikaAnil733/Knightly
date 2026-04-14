import React from "react";
import { BlogResponseDTO } from "../../../Types/BlogTypes";
import { BlogMasonryCard } from "./BlogMasonryCard";
import { motion } from "framer-motion";

interface BlogMasonryGridProps {
  blogs: BlogResponseDTO[];
}

export const BlogMasonryGrid: React.FC<BlogMasonryGridProps> = ({ blogs }) => {
  if (blogs.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 animate-pulse">
          <span className="text-3xl">🕳️</span>
        </div>
        <h3 className="text-2xl font-cinzel font-bold text-white mb-2">
          The Library is Empty
        </h3>
        <p className="text-gray-light max-w-sm">
          Try exploring a different wing of the chronicles.
        </p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 md:px-0"
    >
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {blogs.map((blog, idx) => (
          <BlogMasonryCard key={blog.id} blog={blog} index={idx} />
        ))}
      </div>
    </motion.div>
  );
};

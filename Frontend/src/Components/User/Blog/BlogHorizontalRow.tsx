import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { BlogResponseDTO } from "../../../Types/BlogTypes";
import { BlogCard } from "./BlogCard";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface BlogHorizontalRowProps {
  title: string;
  blogs: BlogResponseDTO[];
  viewAllLink?: string;
}

export const BlogHorizontalRow: React.FC<BlogHorizontalRowProps> = ({
  title,
  blogs,
  viewAllLink,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", checkScroll);
      checkScroll();
      // Also check on window resize
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (scrollEl) scrollEl.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [blogs]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll 80% of view
      const scrollTo =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (blogs.length === 0) return null;

  return (
    <div className="mb-24 relative group/row">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-10 px-6 md:px-0">
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-[2px] bg-gold" />
            <span className="text-gold text-[10px] font-black uppercase tracking-[4px]">
              Chronicles
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="group flex items-center gap-3 text-white/50 hover:text-gold transition-all duration-300"
          >
            <span className="text-[11px] font-black uppercase tracking-[2px]">
              Explore All
            </span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/10 transition-all">
              <ArrowRight size={18} />
            </div>
          </Link>
        )}
      </div>

      {/* Scroll Container with Buttons */}
      <div className="relative group">
        {/* Navigation Buttons (Netflix Style) */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll("left")}
              className="absolute left-0 top-0 bottom-10 z-30 w-16 bg-gradient-to-r from-navy-dark via-navy-dark/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:flex items-center justify-center hover:text-gold"
            >
              <div className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-gold/50 transition-all">
                <ChevronLeft size={32} />
              </div>
            </motion.button>
          )}

          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll("right")}
              className="absolute right-0 top-0 bottom-10 z-30 w-16 bg-gradient-to-l from-navy-dark via-navy-dark/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:flex items-center justify-center hover:text-gold"
            >
              <div className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-gold/50 transition-all">
                <ChevronRight size={32} />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* The Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 px-6 md:px-2 pb-12 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        >
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex-none w-[300px] sm:w-[350px] md:w-[420px] snap-start"
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </div>

        {/* Edge Fade Gradients for Mobile */}
        <div className="absolute top-0 right-0 bottom-12 w-16 bg-gradient-to-l from-navy-dark to-transparent pointer-events-none z-10 md:hidden" />
        <div className="absolute top-0 left-0 bottom-12 w-16 bg-gradient-to-r from-navy-dark to-transparent pointer-events-none z-10 md:hidden" />
      </div>
    </div>
  );
};

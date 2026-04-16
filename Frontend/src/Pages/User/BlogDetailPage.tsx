import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import {
  getBlogBySlug,
  incrementView,
  toggleLike,
} from "../../Service/Api/BlogApi";
import { BlogResponseDTO } from "../../Types/BlogTypes";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/Store";
import { LikeButton } from "../../Components/User/Blog/LikeButton";
import { CommentSection } from "../../Components/User/Blog/CommentSection";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  const user = useSelector((state: RootState) => state.userAuth.user);

  useEffect(() => {
    if (slug) {
      fetchBlogDetails(slug);
    }
  }, [slug]);

  const fetchBlogDetails = async (blogSlug: string) => {
    try {
      setLoading(true);
      const data = await getBlogBySlug(blogSlug);
      setBlog(data);
      // Increment view count
      await incrementView(data.id);
    } catch {
      toast.error("Could not load blog post.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      toast.error("Please log in to endorse this chronicle.");
      return;
    }

    if (!blog) return;

    try {
      setLikeLoading(true);
      const updatedBlog = await toggleLike(blog.id);
      setBlog(updatedBlog);
    } catch {
      toast.error("Action failed.");
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center text-gold font-cinzel">
        Loading...
      </div>
    );
  if (!blog)
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center text-white">
        Post not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-navy-dark font-inter overflow-x-hidden">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Cinematic Header */}
        <div className="relative h-[60vh] w-full">
          <img
            src={
              blog.coverImage ||
              "https://images.unsplash.com/photo-1522071823991-b96020518d6f?auto=format&fit=crop&q=80&w=1600"
            }
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-20 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <span className="px-4 py-1 bg-purple-accent text-white text-xs font-bold rounded-full uppercase tracking-widest">
                {blog.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-white leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center gap-6 text-gray-light text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gold">By</span>
                  <span className="text-white font-medium">
                    {blog.authorName}
                  </span>
                </div>
                <div>•</div>
                <div>{new Date(blog.createdAt).toLocaleDateString()}</div>
                <div>•</div>
                <div>{blog.viewCount} Views</div>
                <div className="hidden md:block scale-75 origin-left">
                  <LikeButton
                    likes={blog.likes || []}
                    userId={user?.id}
                    onToggle={handleToggleLike}
                    loading={likeLoading}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 mt-12">
          {/* Excerpt */}
          <div className="bg-navy-card/50 border-l-4 border-gold p-8 rounded-r-2xl mb-12 italic text-gray-light text-xl leading-relaxed">
            "{blog.excerpt}"
          </div>

          {/* Main Content */}
          <article className="prose prose-invert prose-gold max-w-none text-white leading-loose text-lg space-y-8 whitespace-pre-wrap">
            {blog.content}
          </article>
          {/* Tags */}
          <div className="mt-16 flex flex-wrap gap-3">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-navy-card border border-white/10 rounded-full text-xs text-blue-electric hover:border-blue-electric/50 transition-all cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Social Engagement Footer */}
          <div className="mt-12 py-8 border-y border-white/5 flex items-center justify-between">
            <LikeButton
              likes={blog.likes || []}
              userId={user?.id}
              onToggle={handleToggleLike}
              loading={likeLoading}
            />
          </div>

          {/* Comments Section */}
          <CommentSection blogId={blog.id} />

          {/* Navigation Back */}
          <div className="mt-20 pt-10 border-t border-white/5">
            <Link
              to="/blogs"
              className="text-gold hover:text-white flex items-center gap-2 font-cinzel tracking-widest transition-all"
            >
              ← Back to Chronicles
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;

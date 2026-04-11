import React, { useEffect, useState } from "react";
import { adminGetAllBlogs, moderateBlog } from "../../Service/Api/BlogApi";
import { BlogResponseDTO, BlogStatus } from "../../Types/BlogTypes";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export const AdminBlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BlogStatus>(BlogStatus.DRAFT);
  const [selectedBlog, setSelectedBlog] = useState<BlogResponseDTO | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, [filter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await adminGetAllBlogs({ status: filter });
      setBlogs(data.blogs);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch blogs for moderation.");
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (
    id: string,
    status: BlogStatus.PUBLISHED | BlogStatus.REJECTED,
  ) => {
    try {
      await moderateBlog({ id, status, rejectionReason });
      toast.success(
        `Blog ${status === BlogStatus.PUBLISHED ? "Approved" : "Rejected"} successfully!`,
      );
      setSelectedBlog(null);
      setRejectionReason("");
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || "Moderation failed.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-white">
            Blog <span className="text-gold">Moderation</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Review and manage community blog submissions.
          </p>
        </div>

        <div className="flex gap-2 bg-navy-card p-1 rounded-lg border border-white/5">
          {Object.values(BlogStatus).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                filter === s
                  ? "bg-purple-accent text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {blogs.map((blog) => (
            <motion.div
              layout
              key={blog.id}
              className="bg-navy-card border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start"
            >
              <img
                src={blog.coverImage}
                alt=""
                className="w-full md:w-48 h-32 object-cover rounded-xl border border-white/10"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white font-cinzel">
                    {blog.title}
                  </h3>
                  <span className="text-[10px] text-gray-500">
                    {new Date(blog.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-purple-accent font-semibold">
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    By Author_{blog.authorId.slice(-4)}
                  </span>
                </div>
              </div>

              {filter === BlogStatus.DRAFT && (
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleModerate(blog.id, BlogStatus.PUBLISHED)
                    }
                    className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-xs font-bold hover:bg-green-600/30 transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg text-xs font-bold hover:bg-red-600/30 transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}

              {filter === BlogStatus.REJECTED && blog.rejectionReason && (
                <div className="text-xs text-red-400 bg-red-400/5 p-3 rounded-lg border border-red-400/10 max-w-xs italic">
                  Reason: {blog.rejectionReason}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-navy-card rounded-2xl border border-dashed border-white/10">
          <p className="text-gray-500 font-cinzel">
            No blogs found in this state.
          </p>
        </div>
      )}

      {/* Rejection Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedBlog(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-navy-midnight border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-10"
            >
              <h2 className="text-2xl font-cinzel font-bold text-white mb-4">
                Reject <span className="text-red-400">Submission</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Briefly explain why this blog is being rejected.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Content contains inappropriate language or off-topic information..."
                className="w-full bg-navy-dark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-400 mb-6 h-32 resize-none"
              />
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    handleModerate(selectedBlog.id, BlogStatus.REJECTED)
                  }
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="flex-1 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlogManagement;

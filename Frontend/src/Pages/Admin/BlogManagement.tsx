import React, { useEffect, useState } from "react";
import {
  adminGetAllBlogs,
  moderateBlog,
  adminGetBlogById,
} from "../../Service/Api/BlogApi";
import { BlogResponseDTO, BlogStatus } from "../../Types/BlogTypes";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Eye,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  Search,
} from "lucide-react";
import Pagination from "../../Components/Reuseable/Pagination";

export const AdminBlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BlogStatus>(BlogStatus.DRAFT);
  const [selectedBlog, setSelectedBlog] = useState<BlogResponseDTO | null>(
    null,
  );
  const [reviewBlog, setReviewBlog] = useState<BlogResponseDTO | null>(null);
  const [fetchingReview, setFetchingReview] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  const fetchBlogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminGetAllBlogs({
        status: filter,
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
      });
      setBlogs(data.blogs);
      setTotalItems(data.total);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch blogs for moderation.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleFilterChange = (status: BlogStatus) => {
    setFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
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
      setReviewBlog(null);
      setRejectionReason("");
      fetchBlogs();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Moderation failed.";
      toast.error(errorMessage);
    }
  };

  const handleReview = async (id: string) => {
    try {
      setFetchingReview(true);
      const blog = await adminGetBlogById(id);
      setReviewBlog(blog);
    } catch {
      toast.error("Failed to fetch full blog content.");
    } finally {
      setFetchingReview(false);
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

        <div className="flex-1 max-w-md mx-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold transition-colors" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-navy-card border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-600 shadow-xl"
            />
          </div>
        </div>

        <div className="flex gap-2 bg-navy-card p-1 rounded-lg border border-white/5">
          {Object.values(BlogStatus).map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
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
                    By {blog.authorName}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleReview(blog.id)}
                  className="p-2 bg-white/5 hover:bg-gold hover:text-navy-dark rounded-lg transition-all text-gray-light"
                  title="Review Full Content"
                >
                  <Eye className="w-5 h-5" />
                </button>

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
              </div>

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

      {/* Pagination */}
      {blogs.length > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            label="blogs"
          />
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

      {/* Full Content Review Modal */}
      <AnimatePresence>
        {reviewBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy-midnight/90 backdrop-blur-md"
              onClick={() => setReviewBlog(null)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              className="bg-navy-card border-l border-white/10 w-full max-w-4xl h-full relative z-10 overflow-y-auto flex flex-col items-stretch"
            >
              {/* Header */}
              <div className="sticky top-0 bg-navy-card/80 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between z-20">
                <button
                  onClick={() => setReviewBlog(null)}
                  className="flex items-center gap-2 text-gray-light hover:text-gold transition-colors font-cinzel text-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Queue
                </button>
                {reviewBlog.status === BlogStatus.DRAFT && (
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleModerate(reviewBlog.id, BlogStatus.PUBLISHED)
                      }
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Request
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBlog(reviewBlog);
                      }}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Piece
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col">
                {reviewBlog.coverImage && (
                  <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-white/10 mb-12">
                    <img
                      src={reviewBlog.coverImage}
                      alt={reviewBlog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="max-w-2xl mx-auto w-full">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-accent/10 border border-purple-accent/30 text-purple-accent text-[10px] font-bold uppercase tracking-wider">
                      {reviewBlog.category}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(reviewBlog.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-8 leading-tight">
                    {reviewBlog.title}
                  </h1>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 mb-12">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-light uppercase tracking-tighter">
                        Submitted By
                      </p>
                      <p className="text-sm font-bold text-white">
                        {reviewBlog.authorName}
                      </p>
                    </div>
                  </div>

                  <p className="text-xl text-gray-light font-inter italic leading-relaxed mb-12 border-l-4 border-gold/30 pl-6">
                    {reviewBlog.excerpt}
                  </p>

                  <div className="prose prose-invert prose-gold max-w-none text-gray-300 font-inter leading-loose space-y-6 whitespace-pre-wrap">
                    {reviewBlog.content}
                  </div>

                  {reviewBlog.tags && (
                    <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-2">
                      {reviewBlog.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading Overlay for Detail Fetch */}
      <AnimatePresence>
        {fetchingReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-midnight/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
              <p className="text-gold font-cinzel tracking-widest text-sm animate-pulse">
                RETRIEVING FULL MANUSCRIPT...
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlogManagement;

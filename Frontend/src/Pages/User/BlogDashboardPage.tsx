import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import { deleteBlog, getUserBlogs } from "../../Service/Api/BlogApi";
import { BlogResponseDTO, BlogStatus } from "../../Types/BlogTypes";
import { RootState } from "../../Store/Store";
import { motion } from "framer-motion";
import {
  FileText,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Edit3,
  ExternalLink,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ConfirmationModal } from "../../Components/User/Common/ConfirmationModal";

const BlogDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userAuth.user);
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    views: 0,
  });

  // Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    blogId: string;
    blogTitle: string;
    loading: boolean;
  }>({
    isOpen: false,
    blogId: "",
    blogTitle: "",
    loading: false,
  });

  useEffect(() => {
    if (user) {
      loadUserBlogs();
    }
  }, [user]);

  const loadUserBlogs = async () => {
    try {
      setLoading(true);
      const data = await getUserBlogs();
      setBlogs(data.blogs);

      // Calculate stats
      const published = data.blogs.filter(
        (b) => b.status === BlogStatus.PUBLISHED,
      ).length;
      const drafts = data.blogs.filter(
        (b) => b.status === BlogStatus.DRAFT,
      ).length;
      const totalViews = data.blogs.reduce(
        (acc, curr) => acc + curr.viewCount,
        0,
      );

      setStats({
        total: data.blogs.length,
        published,
        drafts,
        views: totalViews,
      });
    } catch (error) {
      console.error("Failed to load blogs:", error);
      toast.error("Could not load your blogs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      blogId: id,
      blogTitle: title,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    const { blogId } = deleteModal;
    if (!blogId) return;

    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      await deleteBlog(blogId);
      toast.success("Blog deleted successfully.");
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));

      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
      setDeleteModal({
        isOpen: false,
        blogId: "",
        blogTitle: "",
        loading: false,
      });
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Failed to delete blog. Please try again.");
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const getStatusColor = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case BlogStatus.DRAFT:
        return "text-gold bg-gold/10 border-gold/20";
      case BlogStatus.REJECTED:
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusIcon = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return <CheckCircle2 className="w-3 h-3" />;
      case BlogStatus.DRAFT:
        return <Clock className="w-3 h-3" />;
      case BlogStatus.REJECTED:
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center text-white">
        Please login to view your dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-dark font-inter text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-cinzel font-bold mb-2"
            >
              My <span className="text-gold">Archives</span>
            </motion.h1>
            <p className="text-gray-light max-w-xl">
              Manage your contributions to the Knightly Chronicles and track
              your reach across the realm.
            </p>
          </div>
          <Link
            to="/blog/create"
            className="flex items-center gap-2 bg-button-gradient hover:opacity-90 px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-purple-accent/20 w-fit"
          >
            <Plus className="w-5 h-5" />
            Write New Blog
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Total Posts",
              value: stats.total,
              icon: FileText,
              color: "text-blue-400",
            },
            {
              label: "Published",
              value: stats.published,
              icon: CheckCircle2,
              color: "text-green-400",
            },
            {
              label: "In Review",
              value: stats.drafts,
              icon: Clock,
              color: "text-gold",
            },
            {
              label: "Total Reach",
              value: stats.views,
              icon: TrendingUp,
              color: "text-purple-accent",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-navy-card p-6 rounded-2xl border border-white/5 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-3xl font-bold font-cinzel mt-2">
                {stat.value}
              </h3>
              <p className="text-gray-light text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Blog List Section */}
        <div className="bg-navy-card rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold font-cinzel flex items-center gap-2">
              Recent <span className="text-gold">Contributions</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/2 bg-navy-dark/50">
                  <th className="px-8 py-5 text-xs font-semibold text-gray-light uppercase tracking-widest whitespace-nowrap">
                    Post Details
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-gray-light uppercase tracking-widest whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-gray-light uppercase tracking-widest whitespace-nowrap">
                    Reach
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-gray-light uppercase tracking-widest whitespace-nowrap">
                    Last Updated
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-gray-light uppercase tracking-widest whitespace-nowrap text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-10">
                        <div className="h-12 bg-white/5 rounded-xl w-full" />
                      </td>
                    </tr>
                  ))
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-white/20" />
                        </div>
                        <p className="text-gray-light">
                          You haven't written any blogs yet. Start your journey
                          today!
                        </p>
                        <Link
                          to="/blog/create"
                          className="text-gold hover:underline font-bold"
                        >
                          Create your first post
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-white/2 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                            {blog.coverImage ? (
                              <img
                                src={blog.coverImage}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white/10" />
                              </div>
                            )}
                          </div>
                          <div className="max-w-[300px]">
                            <h4 className="font-bold text-white truncate group-hover:text-gold transition-colors">
                              {blog.title}
                            </h4>
                            <p className="text-xs text-gray-light truncate">
                              {blog.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(
                            blog.status,
                          )}`}
                        >
                          {getStatusIcon(blog.status)}
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-gray-light">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {blog.viewCount} views
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-gray-light whitespace-nowrap">
                          {new Date(blog.updatedAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {blog.status === BlogStatus.PUBLISHED && (
                            <Link
                              to={`/blogs/${blog.slug}`}
                              className="p-2 bg-white/5 hover:bg-gold hover:text-navy-dark rounded-lg transition-all text-gray-light"
                              title="View Live"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            onClick={() => navigate(`/blog/edit/${blog.id}`)}
                            className="p-2 bg-white/5 hover:bg-purple-accent rounded-lg transition-all text-gray-light"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteClick(blog.id, blog.title)
                            }
                            className="p-2 bg-white/5 hover:bg-red-500/80 rounded-lg transition-all text-gray-light"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          title="Delete Blog Post"
          message={`Are you sure you want to delete "${deleteModal.blogTitle}"? This action is permanent and cannot be undone.`}
          confirmLabel="Delete Post"
          onConfirm={handleConfirmDelete}
          onCancel={() =>
            setDeleteModal({
              isOpen: false,
              blogId: "",
              blogTitle: "",
              loading: false,
            })
          }
          isLoading={deleteModal.loading}
        />
      </main>

      <Footer />
    </div>
  );
};

export default BlogDashboardPage;

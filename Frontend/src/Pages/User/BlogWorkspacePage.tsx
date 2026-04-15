import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import { BlogEditor } from "../../Components/User/Blog/BlogEditor";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogById, updateBlog, createBlog } from "../../Service/Api/BlogApi";
import {
  CreateBlogInputDTO,
  BlogAuthorRole,
  BlogResponseDTO,
} from "../../Types/BlogTypes";
import { RootState } from "../../Store/Store";

const BlogWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [initialData, setInitialData] =
    useState<Partial<BlogResponseDTO> | null>(null);
  const user = useSelector((state: RootState) => state.userAuth.user);

  const loadBlogData = useCallback(
    async (blogId: string) => {
      try {
        setFetching(true);
        const blog = await getBlogById(blogId);
        setInitialData(blog);
      } catch (error) {
        console.error("Failed to load blog:", error);
        toast.error("Could not load blog data for editing.");
        navigate("/dashboard/blogs");
      } finally {
        setFetching(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    if (id) {
      loadBlogData(id);
    }
  }, [id, loadBlogData]);

  const handleSubmit = async (data: CreateBlogInputDTO) => {
    try {
      setLoading(true);
      if (id) {
        await updateBlog({ ...data, id });
        toast.success("Blog updated successfully!");
      } else {
        await createBlog(data);
        toast.success("Blog submitted successfully! Awaiting moderation.");
      }
      navigate("/dashboard/blogs");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit blog. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center text-white">
        Please login to write a blog.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-dark font-inter">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-cinzel font-bold text-white mb-2"
          >
            {id ? "Edit Your" : "Authoring"}{" "}
            <span className="text-gold">{id ? "Masterpiece" : "Studio"}</span>
          </motion.h1>
          <p className="text-gray-light">
            {id
              ? "Refine your insights and share them with the realm."
              : "Share your chess mastery with the Knightly community."}
          </p>
        </div>

        {fetching ? (
          <div className="bg-navy-card p-20 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
            <p className="text-gray-light font-cinzel tracking-widest animate-pulse">
              RECALLING MANUSCRIPT...
            </p>
          </div>
        ) : (
          <BlogEditor
            onSubmit={handleSubmit}
            onCancel={() => navigate("/dashboard/blogs")}
            isLoading={loading}
            initialData={initialData || {}}
            authorId={user.id!}
            authorRole={
              user.role === "admin" ? BlogAuthorRole.ADMIN : BlogAuthorRole.USER
            }
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogWorkspacePage;

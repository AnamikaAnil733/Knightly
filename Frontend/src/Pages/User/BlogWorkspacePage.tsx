import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import { BlogEditor } from "../../Components/User/Blog/BlogEditor";
import { createBlog } from "../../Service/Api/BlogApi";
import { CreateBlogInputDTO, BlogAuthorRole } from "../../Types/BlogTypes";
import { RootState } from "../../Store/Store";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BlogWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.userAuth.user);

  const handleSubmit = async (data: CreateBlogInputDTO) => {
    try {
      setLoading(true);
      await createBlog(data);
      toast.success("Blog submitted successfully! Awaiting moderation.");
      navigate("/blogs");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit blog. Please try again.");
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
            Authoring <span className="text-gold">Studio</span>
          </motion.h1>
          <p className="text-gray-light">
            Share your chess mastery with the Knightly community.
          </p>
        </div>

        <BlogEditor
          onSubmit={handleSubmit}
          onCancel={() => navigate("/blogs")}
          isLoading={loading}
          authorId={user.id || (user as any)._id}
          authorRole={
            user.role === "admin" ? BlogAuthorRole.ADMIN : BlogAuthorRole.USER
          }
        />
      </main>

      <Footer />
    </div>
  );
};

export default BlogWorkspacePage;

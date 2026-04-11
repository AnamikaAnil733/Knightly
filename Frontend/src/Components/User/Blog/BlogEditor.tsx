import React, { useState } from "react";
import {
  BlogCategory,
  CreateBlogInputDTO,
  BlogAuthorRole,
} from "../../../Types/BlogTypes";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface BlogEditorProps {
  onSubmit: (data: CreateBlogInputDTO) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CreateBlogInputDTO>;
  authorId: string;
  authorRole: BlogAuthorRole;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
  authorId,
  authorRole,
}) => {
  const [formData, setFormData] = useState<
    Omit<CreateBlogInputDTO, "authorId" | "authorRole">
  >({
    title: initialData.title || "",
    excerpt: initialData.excerpt || "",
    content: initialData.content || "",
    tags: initialData.tags || [],
    category: initialData.category || BlogCategory.NEWS,
    coverImage: initialData.coverImage || "",
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error("Please fill in all required fields.");
      return;
    }
    await onSubmit({ ...formData, authorId, authorRole });
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-navy-card p-8 rounded-2xl border border-white/10 shadow-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gold uppercase tracking-widest mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title..."
            className="w-full bg-navy-dark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-accent transition-colors"
            required
          />
        </div>

        {/* Excerpt */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gold uppercase tracking-widest mb-2">
            Excerpt (Short Summary)
          </label>
          <input
            type="text"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="A brief overview of the blog..."
            className="w-full bg-navy-dark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-accent transition-colors"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gold uppercase tracking-widest mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-navy-dark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-accent transition-colors appearance-none"
          >
            {Object.values(BlogCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Image URL */}
        <div>
          <label className="block text-xs font-semibold text-gold uppercase tracking-widest mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-navy-dark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-accent transition-colors"
          />
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gold uppercase tracking-widest mb-2">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your content here..."
            rows={12}
            className="w-full bg-navy-dark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-accent transition-colors resize-none"
            required
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gold uppercase tracking-widest mb-2">
            Tags (Press Enter to add)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="bg-purple-accent/20 border border-purple-accent/50 text-purple-accent px-3 py-1 rounded-full text-xs flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  className="hover:text-white"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagsChange}
            placeholder="Strategy, Chess, Tutorial..."
            className="w-full bg-navy-dark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-accent transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-button-gradient hover:opacity-90 text-white font-bold py-3 px-10 rounded-xl shadow-lg shadow-purple-accent/30 transition-all disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit for Moderation"}
        </button>
      </div>
    </motion.form>
  );
};

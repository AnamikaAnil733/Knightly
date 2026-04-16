import React, { useState, useRef } from "react";
import {
  BlogCategory,
  CreateBlogInputDTO,
  BlogAuthorRole,
} from "../../../Types/BlogTypes";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { getBlogCoverUploadUrl } from "../../../Service/Api/BlogApi";
import axios from "axios";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

interface BlogEditorProps {
  onSubmit: (data: CreateBlogInputDTO) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateBlogInputDTO>;
  authorId: string;
  authorName: string;
  authorRole: BlogAuthorRole;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData = {},
  authorId,
  authorName,
  authorRole,
}) => {
  const [formData, setFormData] = useState<
    Omit<CreateBlogInputDTO, "authorId" | "authorRole" | "authorName">
  >({
    title: initialData.title || "",
    excerpt: initialData.excerpt || "",
    content: initialData.content || "",
    tags: initialData.tags || [],
    category: initialData.category || BlogCategory.NEWS,
    coverImage: initialData.coverImage || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData.coverImage || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      // Clean up the URL if we change it
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const uploadToS3 = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      // 1. Get signed URL
      const { uploadUrl, key } = await getBlogCoverUploadUrl(file.type);

      // 2. Upload to S3
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return key;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw new Error("Failed to upload image to storage.");
    } finally {
      setIsUploading(false);
    }
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

    let coverImageUrl = formData.coverImage;

    try {
      if (selectedFile) {
        coverImageUrl = await uploadToS3(selectedFile);
      } else if (!coverImageUrl) {
        toast.error("Please provide a cover image.");
        return;
      }

      await onSubmit({
        ...formData,
        coverImage: coverImageUrl,
        authorId,
        authorName,
        authorRole,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit blog.";
      toast.error(errorMessage);
    }
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

        {/* Cover Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gold uppercase tracking-widest mb-2">
            Cover Image
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
              previewUrl
                ? "border-purple-accent/50"
                : "border-white/10 hover:border-purple-accent/50 bg-white/5"
            }`}
          >
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <UploadCloud className="text-white text-2xl" />
                  <span className="text-white font-bold text-sm">
                    Change Image
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setFormData((prev) => ({ ...prev, coverImage: "" }));
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-all z-10"
                >
                  <X />
                </button>
              </>
            ) : (
              <div className="text-center p-6">
                <ImageIcon className="text-4xl text-gray-500 mb-3 mx-auto" />
                <p className="text-gray-400 text-sm">
                  Click or drag and drop to upload cover image
                </p>
                <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-tighter">
                  SVG, PNG, JPG (MAX. 5MB)
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
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

      <div className="flex justify-end gap-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="bg-button-gradient hover:opacity-90 text-white font-bold py-3 px-10 rounded-xl shadow-lg shadow-purple-accent/30 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Uploading...</span>
            </>
          ) : isLoading ? (
            <span>Submitting...</span>
          ) : (
            <span>Submit for Moderation</span>
          )}
        </button>
      </div>
    </motion.form>
  );
};

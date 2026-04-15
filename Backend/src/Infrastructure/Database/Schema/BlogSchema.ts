import { Schema, model } from "mongoose";
import { BlogCategory, BlogStatus, BlogAuthorRole } from "../../../Domain/Types/Blogtypes";

export interface BlogDocument {
  title: string;
  slug: string;
  coverImage?: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: BlogCategory;
  status: BlogStatus;
  authorId: string;
  authorName: string;
  authorRole: BlogAuthorRole;
  viewCount: number;
  likes: string[];
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const BlogSchema = new Schema<BlogDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: {
      type: String,
      enum: Object.values(BlogCategory),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BlogStatus),
      default: BlogStatus.DRAFT,
    },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorRole: {
      type: String,
      enum: Object.values(BlogAuthorRole),
      required: true,
    },
    viewCount: { type: Number, default: 0 },
    likes: { type: [String], default: [] },
    rejectionReason: { type: String },
  },
  { timestamps: true },
);

// Indexes for common queries
BlogSchema.index({ status: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ authorId: 1 });

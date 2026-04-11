import { z } from "zod";
import { BlogCategory, BlogAuthorRole, BlogStatus } from "../../Domain/Types/Blogtypes";

export const CreateBlogSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  excerpt: z
    .string()
    .min(10, { message: "Excerpt must be at least 10 characters long" })
    .max(300, { message: "Excerpt must not exceed 300 characters" }),
  content: z
    .string()
    .min(50, { message: "Content must be at least 50 characters long" }),
  tags: z.array(z.string()).optional(),
  category: z.nativeEnum(BlogCategory, {
    message: "Invalid blog category",
  }),
  coverImage: z.string().url({ message: "Invalid cover image URL" }).optional().or(z.literal("")),
  authorId: z.string().min(1, { message: "Author ID is required" }),
  authorRole: z.nativeEnum(BlogAuthorRole, {
    message: "Invalid author role",
  }),
});

export const UpdateBlogSchema = z.object({
  id: z.string().min(1, { message: "Blog ID is required" }),
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(100, { message: "Title must not exceed 100 characters" })
    .optional(),
  excerpt: z
    .string()
    .min(10, { message: "Excerpt must be at least 10 characters long" })
    .max(300, { message: "Excerpt must not exceed 300 characters" })
    .optional(),
  content: z
    .string()
    .min(50, { message: "Content must be at least 50 characters long" })
    .optional(),
  tags: z.array(z.string()).optional(),
  category: z.nativeEnum(BlogCategory).optional(),
  coverImage: z.string().url({ message: "Invalid cover image URL" }).optional().or(z.literal("")),
});

export const BlogModerationSchema = z.object({
  id: z.string().min(1, { message: "Blog ID is required" }),
  status: z.enum([BlogStatus.PUBLISHED, BlogStatus.REJECTED] as [string, ...string[]], {
    message: "Status must be either PUBLISHED or REJECTED",
  }),
  rejectionReason: z.string().optional(),
});

import { BlogCategory, BlogStatus, BlogAuthorRole } from "../Types/Blogtypes";

export interface BlogResponseDTO {
  id: string;
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

export interface CreateBlogInputDTO {
  title: string;
  excerpt: string;
  content: string;
  tags?: string[];
  category: BlogCategory;
  coverImage?: string;
  authorId: string;
  authorName: string;
  authorRole: BlogAuthorRole;
}

export interface UpdateBlogInputDTO {
  id: string;
  title?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  category?: BlogCategory;
  coverImage?: string;
}

export interface ModerationInputDTO {
  id: string;
  status: BlogStatus.PUBLISHED | BlogStatus.REJECTED;
  rejectionReason?: string;
}

export interface BlogListResponseDTO {
  blogs: BlogResponseDTO[];
  total: number;
}

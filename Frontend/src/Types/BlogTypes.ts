export enum BlogCategory {
  NEWS = "NEWS",
  STRATEGY = "STRATEGY",
  TUTORIAL = "TUTORIAL",
  ANNOUNCEMENT = "ANNOUNCEMENT",
}

export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}

export enum BlogAuthorRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

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
  authorRole: BlogAuthorRole;
  viewCount: number;
  likes: string[];
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogInputDTO {
  title: string;
  excerpt: string;
  content: string;
  tags?: string[];
  category: BlogCategory;
  coverImage?: string;
  authorId: string;
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

export interface CommentDTO {
  id: string;
  blogId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

import BlogEntity from "../../Entity/BlogEntity";
import { BlogCategory, BlogStatus } from "../../Types/Blogtypes";
import { IBaseRepository } from "./IBaseRepository";

export interface IBlogRepository extends IBaseRepository<BlogEntity, string> {
  findAll(filters?: {
    category?: BlogCategory;
    status?: BlogStatus;
    authorId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ blogs: BlogEntity[]; total: number }>;

  findBySlug(slug: string): Promise<BlogEntity | null>;
  incrementView(id: string): Promise<void>;
  getUserStats(authorId: string): Promise<{
    total: number;
    published: number;
    drafts: number;
    views: number;
  }>;
}

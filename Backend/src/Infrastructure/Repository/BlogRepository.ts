import { BaseRepository } from "./BaseRepository";
import BlogEntity from "../../Domain/Entity/BlogEntity";
import { BlogDocument } from "../Database/Schema/BlogSchema";
import { IBlogRepository } from "../../Domain/Interface/Repositories/IBlogRepository";
import { BlogCategory, BlogStatus } from "../../Domain/Types/Blogtypes";
import { MongoBlogMapper } from "../Mapper/MongoBlogMapper";
import { BlogModel } from "../Database/Model/BlogModel";

export class BlogRepository
  extends BaseRepository<BlogEntity, BlogDocument>
  implements IBlogRepository
{
  constructor() {
    super(BlogModel, MongoBlogMapper);
  }

  async findAll(filters?: {
    category?: BlogCategory;
    status?: BlogStatus;
    authorId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ blogs: BlogEntity[]; total: number }> {
    const query: any = {};
    if (filters?.category) query.category = filters.category;
    if (filters?.status) query.status = filters.status;
    if (filters?.authorId) query.authorId = filters.authorId;
    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { authorName: { $regex: filters.search, $options: "i" } },
        { tags: { $regex: filters.search, $options: "i" } },
      ];
    }

    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query).exec(),
    ]);

    return {
      blogs: docs.map((doc) => this.mapper.toEntityFromDocument(doc)),
      total,
    };
  }

  async findBySlug(slug: string): Promise<BlogEntity | null> {
    const doc = await this.model.findOne({ slug }).exec();
    return doc ? this.mapper.toEntityFromDocument(doc) : null;
  }

  async incrementView(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
  }
  async getUserStats(authorId: string): Promise<{
    total: number;
    published: number;
    drafts: number;
    views: number;
  }> {
    const stats = await this.model.aggregate([
      { $match: { authorId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ["$status", BlogStatus.PUBLISHED] }, 1, 0] },
          },
          drafts: {
            $sum: { $cond: [{ $eq: ["$status", BlogStatus.DRAFT] }, 1, 0] },
          },
          views: { $sum: "$viewCount" },
        },
      },
    ]);

    if (stats.length === 0) {
      return { total: 0, published: 0, drafts: 0, views: 0 };
    }

    return {
      total: stats[0].total,
      published: stats[0].published,
      drafts: stats[0].drafts,
      views: stats[0].views,
    };
  }
}

import { BaseRepository } from "./BaseRepository";
import BlogEntity from "../../Domain/Entity/BlogEntity";
import { BlogModel, BlogDocument } from "../Database/Schema/BlogSchema";
import { IBlogRepository } from "../../Domain/Interface/Repositories/IBlogRepository";
import { BlogCategory, BlogStatus } from "../../Domain/Types/Blogtypes";
import { MongoBlogMapper } from "../Mapper/MongoBlogMapper";

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
  }): Promise<{ blogs: BlogEntity[]; total: number }> {
    const query: any = {};
    if (filters?.category) query.category = filters.category;
    if (filters?.status) query.status = filters.status;
    if (filters?.authorId) query.authorId = filters.authorId;

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
}

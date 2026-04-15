import { HydratedDocument } from "mongoose";
import BlogEntity from "../../Domain/Entity/BlogEntity";
import { BlogDocument } from "../Database/Schema/BlogSchema";

export class MongoBlogMapper {
  static toEntityFromDocument(doc: HydratedDocument<BlogDocument>): BlogEntity {
    return new BlogEntity({
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      coverImage: doc.coverImage,
      excerpt: doc.excerpt,
      content: doc.content,
      tags: doc.tags,
      category: doc.category,
      status: doc.status,
      authorId: doc.authorId,
      authorName: doc.authorName,
      authorRole: doc.authorRole,
      viewCount: doc.viewCount,
      likes: doc.likes,
      rejectionReason: doc.rejectionReason,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocumentFromEntity(blog: BlogEntity) {
    return {
      title: blog.title,
      slug: blog.slug,
      coverImage: blog.coverImage,
      excerpt: blog.excerpt,
      content: blog.content,
      tags: blog.tags,
      category: blog.category,
      status: blog.status,
      authorId: blog.authorId,
      authorName: blog.authorName,
      authorRole: blog.authorRole,
      viewCount: blog.viewCount,
      likes: blog.likes,
      rejectionReason: blog.rejectionReason,
    };
  }
}

import BlogEntity from "../../Domain/Entity/BlogEntity";
import { BlogResponseDTO } from "Domain/DTOs/BlogDTOs";

export class BlogMapper {
  static toBlogResposeDTO(blog:BlogEntity):BlogResponseDTO{
    return{
      id:blog.id!,
      title:blog.title,
      slug:blog.slug,
      coverImage:blog.coverImage,
      excerpt:blog.excerpt,
      content:blog.content,
      tags:blog.tags,
      category:blog.category,
      status:blog.status,
      authorId:blog.authorId,
      authorName:blog.authorName,
      authorRole:blog.authorRole,
      viewCount:blog.viewCount,
      likes: blog.likes,
      rejectionReason:blog.rejectionReason,
      createdAt:blog.createdAt,
      updatedAt:blog.updatedAt,
    };
  }
}

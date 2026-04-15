import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { UpdateBlogInputDTO, BlogResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IUpdateBlogUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IUpdateBlogUseCase";
import { BlogStatus } from "../../../../Domain/Types/Blogtypes";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export class UpdateBlogUseCase implements IUpdateBlogUseCase {
  constructor(private readonly _blogRepository: IBlogRepository) {}

  async execute(input: UpdateBlogInputDTO, userId: string): Promise<BlogResponseDTO> {
    const blog = await this._blogRepository.findById(input.id);

    if (!blog) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Blog post not found");
    }

    if (!blog.isOwnedBy(userId)) {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        "You do not have permission to edit this blog",
      );
    }

    // Only allow updates while in DRAFT or REJECTED status
    // If it's already PUBLISHED, we might want to allow edits but reset status to DRAFT for re-moderation
    blog.update({
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      tags: input.tags,
      category: input.category,
      coverImage: input.coverImage,
    });

    // Reset status to DRAFT for re-moderation after any edit
    // (Cast to any/private access if needed, or use a method on entity)
    (blog as any)._status = BlogStatus.DRAFT;

    const updatedBlog = await this._blogRepository.update(blog);
    if (!updatedBlog) {
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to update blog");
    }

    return BlogMapper.toBlogResposeDTO(updatedBlog);
  }
}

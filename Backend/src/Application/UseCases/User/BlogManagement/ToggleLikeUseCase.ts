import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IToggleLikeUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IToggleLikeUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export class ToggleLikeUseCase implements IToggleLikeUseCase {
  constructor(private readonly _blogRepository: IBlogRepository) {}

  async execute(blogId: string, userId: string): Promise<BlogResponseDTO> {
    const blog = await this._blogRepository.findById(blogId);

    if (!blog) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Blog post not found");
    }

    blog.toggleLike(userId);
    const updatedBlog = await this._blogRepository.update(blog);

    if (!updatedBlog) {
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to update blog like status");
    }

    return BlogMapper.toBlogResposeDTO(updatedBlog);
  }
}

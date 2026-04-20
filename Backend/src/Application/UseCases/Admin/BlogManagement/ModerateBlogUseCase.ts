import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import {
  BlogResponseDTO,
  ModerationInputDTO,
} from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { BlogStatus } from "../../../../Domain/Types/Blogtypes";
import { IModerateBlogUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IModerateBlogUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { CustomError } from "../../../../Domain/Entity/CustomError";


export class ModerateBlogUseCase implements IModerateBlogUseCase {
  constructor(private readonly _blogRepository: IBlogRepository) {}

  async execute(input: ModerationInputDTO): Promise<BlogResponseDTO> {
    const blog = await this._blogRepository.findById(input.id);

    if (!blog) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Blog not found");
    }

    // Update status using domain methods
    if (input.status === BlogStatus.PUBLISHED) {
      blog.publish();
    } else if (input.status === BlogStatus.REJECTED) {
      blog.reject(input.rejectionReason);
    }

    const updatedBlog = await this._blogRepository.update(blog!);
    return BlogMapper.toBlogResposeDTO(updatedBlog!);
  }
}

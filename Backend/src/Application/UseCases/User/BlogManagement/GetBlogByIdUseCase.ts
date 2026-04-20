import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IGetBlogByIdUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetBlogByIdUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";

export class GetBlogByIdUseCase implements IGetBlogByIdUseCase {
  constructor(
    private readonly _blogRepository: IBlogRepository,
    private readonly _mediaService: IMediaService,
  ) {}

  async execute(id: string, userId: string): Promise<BlogResponseDTO> {
    const blog = await this._blogRepository.findById(id);

    if (!blog) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Blog post not found");
    }

    // only the author can fetch their own draft
    if (!blog.isOwnedBy(userId)) {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        "You do not have permission to access this blog",
      );
    }

    const blogDTO = BlogMapper.toBlogResposeDTO(blog);

    // Process cover image signed URL
    blogDTO.coverImage = await this._mediaService.resolveSignedUrl(blogDTO.coverImage);

    return blogDTO;
  }
}

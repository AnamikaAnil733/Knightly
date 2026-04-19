import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IAdminGetBlogByIdUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IAdminGetBlogByIdUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";

export class AdminGetBlogByIdUseCase implements IAdminGetBlogByIdUseCase {
  constructor(
    private readonly _blogRepository: IBlogRepository,
    private readonly _mediaService: IMediaService,
  ) {}

  async execute(id: string): Promise<BlogResponseDTO> {
    const blog = await this._blogRepository.findById(id);

    if (!blog) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Blog post not found");
    }

    const blogDTO = BlogMapper.toBlogResposeDTO(blog);
    blogDTO.coverImage = await this._mediaService.resolveSignedUrl(blogDTO.coverImage);

    return blogDTO;
  }
}

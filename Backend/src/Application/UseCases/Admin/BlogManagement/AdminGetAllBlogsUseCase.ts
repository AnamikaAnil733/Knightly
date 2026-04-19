import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogListResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IAdminGetAllBlogsUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IAdminGetAllBlogsUseCase";
import { BlogStatus } from "../../../../Domain/Types/Blogtypes";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";

export class AdminGetAllBlogsUseCase implements IAdminGetAllBlogsUseCase {
  constructor(
    private readonly _blogRepository: IBlogRepository,
    private readonly _mediaService: IMediaService,
  ) {}

  async execute(filters?: {
    status?: BlogStatus;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<BlogListResponseDTO> {
    const { blogs, total } = await this._blogRepository.findAll(filters);

    const blogsWithSignedUrls = await Promise.all(
      blogs.map(async (blog) => {
        const blogDTO = BlogMapper.toBlogResposeDTO(blog);
        blogDTO.coverImage = await this._mediaService.resolveSignedUrl(blogDTO.coverImage);
        return blogDTO;
      }),
    );

    return {
      blogs: blogsWithSignedUrls,
      total,
    };
  }
}

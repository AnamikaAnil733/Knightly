import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogListResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IGetAllBlogsUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetAllBlogsUseCase";
import { BlogStatus, BlogCategory } from "../../../../Domain/Types/Blogtypes";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";

export class GetAllBlogsUseCase implements IGetAllBlogsUseCase {
  constructor(
    private readonly _blogRepository: IBlogRepository,
    private readonly _mediaService: IMediaService,
  ) {}

  async execute(filters?: {
    category?: BlogCategory;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<BlogListResponseDTO> {
    // Strictly filter by PUBLISHED status for public view
    const { blogs, total } = await this._blogRepository.findAll({
      ...filters,
      status: BlogStatus.PUBLISHED,
    });

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

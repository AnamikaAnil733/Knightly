import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogListResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IGetUserBlogsUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetUserBlogsUseCase";
import { BlogStatus, BlogCategory } from "../../../../Domain/Types/Blogtypes";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";

export class GetUserBlogsUseCase implements IGetUserBlogsUseCase {
  constructor(
    private readonly _blogRepository: IBlogRepository,
    private readonly _mediaService: IMediaService,
  ) {}

  async execute(filters: {
    authorId: string;
    category?: BlogCategory;
    status?: BlogStatus;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<BlogListResponseDTO> {
    const { blogs, total } = await this._blogRepository.findAll(filters);
    const stats = await this._blogRepository.getUserStats(filters.authorId);

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
      stats,
    };
  }
}

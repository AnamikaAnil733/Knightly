import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogListResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IAdminGetAllBlogsUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IAdminGetAllBlogsUseCase";
import { BlogStatus } from "../../../../Domain/Types/Blogtypes";
import { IStorageService } from "Domain/Interface/Service/IS3Service";

export class AdminGetAllBlogsUseCase implements IAdminGetAllBlogsUseCase {
  constructor(
    private readonly _blogRepository: IBlogRepository,
    private readonly _storageService: IStorageService,
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
        if (blogDTO.coverImage) {
          let key = blogDTO.coverImage;
          let shouldSign = false;

          if (key.startsWith("http")) {
            if (key.includes("knightly-avatars.s3")) {
              try {
                const urlObj = new URL(key);
                key = urlObj.pathname.startsWith("/")
                  ? urlObj.pathname.substring(1)
                  : urlObj.pathname;
                shouldSign = true;
              } catch (e) {
                console.error("Failed to parse legacy coverImage URL:", key);
              }
            }
          } else {
            shouldSign = true;
          }

          if (shouldSign) {
            blogDTO.coverImage = await this._storageService.generateSignedGetUrl(
              key,
              43200, // 12 hours
            );
          }
        }
        return blogDTO;
      }),
    );

    return {
      blogs: blogsWithSignedUrls,
      total,
    };
  }
}

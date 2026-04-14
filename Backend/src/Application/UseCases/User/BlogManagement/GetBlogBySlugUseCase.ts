import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IGetBlogBySlugUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetBlogBySlugUseCase";
import { BlogStatus } from "../../../../Domain/Types/Blogtypes";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IStorageService } from "Domain/Interface/Service/IS3Service";

export class GetBlogBySlugUseCase implements IGetBlogBySlugUseCase {
  constructor(
    private readonly _blogRepository: IBlogRepository,
    private readonly _storageService: IStorageService,
  ) {}

  async execute(slug: string): Promise<BlogResponseDTO> {
    const blog = await this._blogRepository.findBySlug(slug);

    if (!blog) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Blog post not found");
    }

    // Only allow public viewing of PUBLISHED blogs
    if (blog.status !== BlogStatus.PUBLISHED) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, "This blog post is not yet published");
    }

    // Increment view count asynchronously
    if (blog.id) {
      this._blogRepository.incrementView(blog.id).catch((err) => {
        console.error(`[Error] Failed to increment view count for blog ${blog.id}:`, err);
      });
    }

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
  }
}

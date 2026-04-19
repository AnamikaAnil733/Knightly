import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IGetBlogBySlugUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetBlogBySlugUseCase";
import { BlogStatus } from "../../../../Domain/Types/Blogtypes";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";

export class GetBlogBySlugUseCase implements IGetBlogBySlugUseCase {
  constructor(
    private readonly _blogRepository: IBlogRepository,
    private readonly _mediaService: IMediaService,
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
    // Process cover image signed URL
    blogDTO.coverImage = await this._mediaService.resolveSignedUrl(blogDTO.coverImage);

    return blogDTO;
  }
}

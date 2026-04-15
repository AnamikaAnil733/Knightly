import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IGetBlogByIdUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetBlogByIdUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IStorageService } from "Domain/Interface/Service/IS3Service";

export class GetBlogByIdUseCase implements IGetBlogByIdUseCase {
  constructor(
    private readonly _blogRepository: IBlogRepository,
    private readonly _storageService: IStorageService,
  ) {}

  async execute(id: string, userId: string): Promise<BlogResponseDTO> {
    const blog = await this._blogRepository.findById(id);

    if (!blog) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Blog post not found");
    }

    // Check ownership: only the author can fetch their own draft/rejected blogs by ID
    if (!blog.isOwnedBy(userId)) {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        "You do not have permission to access this blog",
      );
    }

    const blogDTO = BlogMapper.toBlogResposeDTO(blog);

    // Process cover image signed URL
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
            console.error("Failed to parse legacy coverImage URL in getById:", key);
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

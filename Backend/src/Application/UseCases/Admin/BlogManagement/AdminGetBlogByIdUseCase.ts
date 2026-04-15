import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IAdminGetBlogByIdUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IAdminGetBlogByIdUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IStorageService } from "Domain/Interface/Service/IS3Service";

export class AdminGetBlogByIdUseCase implements IAdminGetBlogByIdUseCase {
  constructor(
    private readonly _blogRepository: IBlogRepository,
    private readonly _storageService: IStorageService,
  ) {}

  async execute(id: string): Promise<BlogResponseDTO> {
    const blog = await this._blogRepository.findById(id);

    if (!blog) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Blog post not found");
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
            console.error("Failed to parse legacy coverImage URL in adminGetById:", key);
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

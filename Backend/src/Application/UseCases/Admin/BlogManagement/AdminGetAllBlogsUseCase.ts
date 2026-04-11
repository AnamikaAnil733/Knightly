import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { BlogListResponseDTO } from "../../../../Domain/DTOs/BlogDTOs";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { IAdminGetAllBlogsUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IAdminGetAllBlogsUseCase";
import { BlogStatus } from "../../../../Domain/Types/Blogtypes";

export class AdminGetAllBlogsUseCase implements IAdminGetAllBlogsUseCase {
  constructor(private readonly _blogRepository: IBlogRepository) {}

  async execute(filters?: {
    status?: BlogStatus;
    page?: number;
    limit?: number;
  }): Promise<BlogListResponseDTO> {
    const { blogs, total } = await this._blogRepository.findAll(filters);

    return {
      blogs: blogs.map((blog) => BlogMapper.toBlogResposeDTO(blog)),
      total,
    };
  }
}

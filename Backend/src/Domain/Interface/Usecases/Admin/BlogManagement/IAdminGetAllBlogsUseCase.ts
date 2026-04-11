import { BlogListResponseDTO } from "../../../../DTOs/BlogDTOs";
import { BlogStatus } from "../../../../Types/Blogtypes";

export interface IAdminGetAllBlogsUseCase {
  execute(filters?: {
    status?: BlogStatus;
    page?: number;
    limit?: number;
  }): Promise<BlogListResponseDTO>;
}

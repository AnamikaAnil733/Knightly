import { BlogListResponseDTO } from "../../../../DTOs/BlogDTOs";
import { BlogCategory } from "../../../../Types/Blogtypes";

export interface IGetAllBlogsUseCase {
  execute(filters?: {
    category?: BlogCategory;
    page?: number;
    limit?: number;
  }): Promise<BlogListResponseDTO>;
}

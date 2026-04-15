import { BlogListResponseDTO } from "../../../../DTOs/BlogDTOs";
import { BlogCategory, BlogStatus } from "../../../../Types/Blogtypes";

export interface IGetUserBlogsUseCase {
  execute(filters: {
    authorId: string;
    category?: BlogCategory;
    status?: BlogStatus;
    page?: number;
    limit?: number;
  }): Promise<BlogListResponseDTO>;
}

import { BlogResponseDTO } from "../../../../DTOs/BlogDTOs";

export interface IAdminGetBlogByIdUseCase {
  execute(id: string): Promise<BlogResponseDTO>;
}

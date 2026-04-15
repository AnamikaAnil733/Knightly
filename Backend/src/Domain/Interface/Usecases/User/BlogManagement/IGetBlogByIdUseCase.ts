import { BlogResponseDTO } from "../../../../DTOs/BlogDTOs";

export interface IGetBlogByIdUseCase {
  execute(id: string, userId: string): Promise<BlogResponseDTO>;
}

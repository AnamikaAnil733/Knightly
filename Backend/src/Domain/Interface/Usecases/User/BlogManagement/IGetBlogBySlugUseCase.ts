import { BlogResponseDTO } from "../../../../DTOs/BlogDTOs";

export interface IGetBlogBySlugUseCase {
  execute(slug: string): Promise<BlogResponseDTO>;
}

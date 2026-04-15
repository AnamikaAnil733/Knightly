import { UpdateBlogInputDTO, BlogResponseDTO } from "../../../../DTOs/BlogDTOs";

export interface IUpdateBlogUseCase {
  execute(input: UpdateBlogInputDTO, userId: string): Promise<BlogResponseDTO>;
}

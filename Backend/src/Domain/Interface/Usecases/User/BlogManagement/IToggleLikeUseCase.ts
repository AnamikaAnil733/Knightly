import { BlogResponseDTO } from "../../../../DTOs/BlogDTOs";

export interface IToggleLikeUseCase {
  execute(blogId: string, userId: string): Promise<BlogResponseDTO>;
}

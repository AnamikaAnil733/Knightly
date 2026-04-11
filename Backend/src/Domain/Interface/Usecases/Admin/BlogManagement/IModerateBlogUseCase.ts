import { BlogResponseDTO, ModerationInputDTO } from "../../../../DTOs/BlogDTOs";

export interface IModerateBlogUseCase {
  execute(input: ModerationInputDTO): Promise<BlogResponseDTO>;
}

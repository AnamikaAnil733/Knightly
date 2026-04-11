import {
  BlogResponseDTO,
  CreateBlogInputDTO,
} from "../../../../DTOs/BlogDTOs";


export interface ICreateBlogUseCase{
    execute(input:CreateBlogInputDTO):Promise<BlogResponseDTO>
}

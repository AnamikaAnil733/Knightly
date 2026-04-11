import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import {
  CreateBlogInputDTO,
  BlogResponseDTO,
} from "../../../../Domain/DTOs/BlogDTOs";
import BlogEntity  from "../../../../Domain/Entity/BlogEntity";
import { BlogMapper } from "../../../Mapper/BlogMapper";
import { ICreateBlogUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/ICreateBlogUseCase";
import { BlogStatus } from "../../../../Domain/Types/Blogtypes";


export class CreateBlogUseCase implements ICreateBlogUseCase{
  constructor(
        private readonly _blogReposository:IBlogRepository,
  ){}

  async execute(input: CreateBlogInputDTO): Promise<BlogResponseDTO> {
    const slug = this.generateSlug(input.title);
    let uniqueSlug = slug;
    let count = 1;

    // Ensure slug uniqueness
    while (await this._blogReposository.findBySlug(uniqueSlug)) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const blog = new BlogEntity({
      ...input,
      slug: uniqueSlug,
      status: BlogStatus.DRAFT,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedBlog = await this._blogReposository.create(blog);
    return BlogMapper.toBlogResposeDTO(savedBlog);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word characters
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }
}

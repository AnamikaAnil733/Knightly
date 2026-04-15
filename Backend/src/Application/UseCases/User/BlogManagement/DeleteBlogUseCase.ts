import { IBlogRepository } from "../../../../Domain/Interface/Repositories/IBlogRepository";
import { IDeleteBlogUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IDeleteBlogUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export class DeleteBlogUseCase implements IDeleteBlogUseCase {
  constructor(private readonly _blogRepository: IBlogRepository) {}

  async execute(id: string, userId: string): Promise<boolean> {
    const blog = await this._blogRepository.findById(id);

    if (!blog) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Blog post not found");
    }

    if (!blog.isOwnedBy(userId)) {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        "You do not have permission to delete this blog",
      );
    }

    return await this._blogRepository.delete(id);
  }
}

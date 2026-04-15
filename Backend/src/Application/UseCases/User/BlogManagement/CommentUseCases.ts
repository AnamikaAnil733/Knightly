import { ICommentRepository } from "../../../../Infrastructure/Repository/CommentRepository";
import { CommentDTO, AddCommentInputDTO } from "../../../../Domain/DTOs/CommentDTOs";
import { IAddCommentUseCase, IGetBlogCommentsUseCase, IDeleteCommentUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/ICommentUseCases";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export class AddCommentUseCase implements IAddCommentUseCase {
  constructor(private readonly _commentRepository: ICommentRepository) {}
  async execute(data: AddCommentInputDTO): Promise<CommentDTO> {
    return await this._commentRepository.create(data);
  }
}

export class GetBlogCommentsUseCase implements IGetBlogCommentsUseCase {
  constructor(private readonly _commentRepository: ICommentRepository) {}
  async execute(blogId: string): Promise<CommentDTO[]> {
    return await this._commentRepository.findByBlogId(blogId);
  }
}

export class DeleteCommentUseCase implements IDeleteCommentUseCase {
  constructor(private readonly _commentRepository: ICommentRepository) {}
  async execute(commentId: string, userId: string): Promise<boolean> {
    const comment = await this._commentRepository.findById(commentId);
    if (!comment) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Comment not found");
    }

    if (comment.authorId !== userId) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, "You can only delete your own comments");
    }

    return await this._commentRepository.delete(commentId);
  }
}

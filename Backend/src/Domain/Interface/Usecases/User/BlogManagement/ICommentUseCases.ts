import { CommentDTO, AddCommentInputDTO } from "../../../../DTOs/CommentDTOs";

export interface IAddCommentUseCase {
  execute(data: AddCommentInputDTO): Promise<CommentDTO>;
}

export interface IGetBlogCommentsUseCase {
  execute(blogId: string): Promise<CommentDTO[]>;
}

export interface IDeleteCommentUseCase {
  execute(commentId: string, userId: string): Promise<boolean>;
}

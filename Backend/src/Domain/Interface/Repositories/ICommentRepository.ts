import { CommentEntity } from "../../Entity/CommentEntity";

export interface ICommentRepository {
  create(comment: CommentEntity): Promise<CommentEntity>;
  findByBlogId(blogId: string): Promise<CommentEntity[]>;
  findById(id: string): Promise<CommentEntity | null>;
  delete(id: string): Promise<boolean>;
}

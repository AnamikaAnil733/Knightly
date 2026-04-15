import { CommentDTO, AddCommentInputDTO } from "../../Domain/DTOs/CommentDTOs";
import { CommentModel } from "../Database/Schema/CommentSchema";

export interface ICommentRepository {
  create(data: AddCommentInputDTO): Promise<CommentDTO>;
  findByBlogId(blogId: string): Promise<CommentDTO[]>;
  findById(id: string): Promise<CommentDTO | null>;
  delete(id: string): Promise<boolean>;
}

export class CommentRepository implements ICommentRepository {
  private _mapToDTO(doc: any): CommentDTO {
    return {
      id: doc._id.toString(),
      blogId: doc.blogId.toString(),
      authorId: doc.authorId.toString(),
      authorName: doc.authorName,
      authorAvatar: doc.authorAvatar,
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(data: AddCommentInputDTO): Promise<CommentDTO> {
    const doc = await CommentModel.create(data);
    return this._mapToDTO(doc);
  }

  async findByBlogId(blogId: string): Promise<CommentDTO[]> {
    const docs = await CommentModel.find({ blogId }).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => this._mapToDTO(doc));
  }

  async findById(id: string): Promise<CommentDTO | null> {
    const doc = await CommentModel.findById(id).exec();
    return doc ? this._mapToDTO(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CommentModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}

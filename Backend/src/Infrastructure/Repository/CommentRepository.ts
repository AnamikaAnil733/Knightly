import { CommentModel } from "../Database/Schema/CommentSchema";
import { CommentEntity } from "../../Domain/Entity/CommentEntity";
import { ICommentRepository } from "../../Domain/Interface/Repositories/ICommentRepository";
import { MongoCommentMapper } from "../Mapper/MongoCommentMapper";

export class CommentRepository implements ICommentRepository {
  async create(comment: CommentEntity): Promise<CommentEntity> {
    const data = MongoCommentMapper.toDocumentFromEntity(comment);
    const doc = await CommentModel.create(data);
    return MongoCommentMapper.toEntityFromDocument(doc as any);
  }

  async findByBlogId(blogId: string): Promise<CommentEntity[]> {
    const docs = await CommentModel.find({ blogId }).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => MongoCommentMapper.toEntityFromDocument(doc as any));
  }

  async findById(id: string): Promise<CommentEntity | null> {
    const doc = await CommentModel.findById(id).exec();
    return doc ? MongoCommentMapper.toEntityFromDocument(doc as any) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CommentModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}

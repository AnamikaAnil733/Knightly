import { HydratedDocument, AnyKeys } from "mongoose";
import { CommentEntity } from "../../Domain/Entity/CommentEntity";
import { CommentDocument } from "../Database/Schema/CommentSchema";

export class MongoCommentMapper {
  static toEntityFromDocument(doc: HydratedDocument<CommentDocument>): CommentEntity {
    return new CommentEntity({
      id: doc._id.toString(),
      blogId: doc.blogId.toString(),
      authorId: doc.authorId.toString(),
      authorName: doc.authorName,
      authorAvatar: doc.authorAvatar,
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocumentFromEntity(entity: CommentEntity): AnyKeys<CommentDocument> {
    return {
      blogId: entity.blogId as any,
      authorId: entity.authorId as any,
      authorName: entity.authorName,
      authorAvatar: entity.authorAvatar,
      content: entity.content,
    };
  }
}

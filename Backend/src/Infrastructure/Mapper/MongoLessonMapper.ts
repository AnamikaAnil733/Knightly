import { HydratedDocument, AnyKeys } from "mongoose";
import LessonEntity from "../../Domain/Entity/LessonEntity";
import { LessonDocument } from "../Database/Schema/LessonSchema";

export class MongoLessonMapper {
  static toEntityFromDocument(doc: HydratedDocument<LessonDocument>): LessonEntity {
    return new LessonEntity({
      id: doc._id.toString(),
      title: doc.title,
      category: doc.category,
      difficulty: doc.difficulty,
      content: doc.content,
      order: doc.order,
      isPremium: doc.isPremium,
      fen: doc.fen,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocumentFromEntity(entity: LessonEntity): AnyKeys<LessonDocument> {
    return {
      title: entity.title,
      category: entity.category,
      difficulty: entity.difficulty,
      content: entity.content,
      order: entity.order,
      isPremium: entity.isPremium,
      fen: entity.fen,
    };
  }
}

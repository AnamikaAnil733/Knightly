import { HydratedDocument, AnyKeys } from "mongoose";
import { EUserPuzzleprogress } from "../../Domain/Entity/UserPuzzleProgress";
import { UserPuzzleProgressSchemaType } from "../Database/Schema/UserPuzzzleProgressSchema";

export class MongoUserPuzzleProgressMapper {
  static toEntityFromDocument(doc: HydratedDocument<UserPuzzleProgressSchemaType>): EUserPuzzleprogress {
    return new EUserPuzzleprogress({
      id: doc._id.toString(),
      userId: doc.userId,
      puzzleId: doc.puzzleId,
      solved: doc.solved,
      attempts: doc.attempts,
      solvedAt: doc.solvedAt,
    });
  }

  static toDocumentFromEntity(entity: EUserPuzzleprogress): AnyKeys<UserPuzzleProgressSchemaType> {
    return {
      userId: entity.userId,
      puzzleId: entity.puzzleId,
      solved: entity.solved,
      attempts: entity.attempts,
      solvedAt: entity.solvedAt,
    };
  }
}

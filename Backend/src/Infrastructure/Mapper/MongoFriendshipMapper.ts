import { HydratedDocument, AnyKeys } from "mongoose";
import FriendshipEntity from "../../Domain/Entity/FriendshipEntity";
import { FriendshipDocument } from "../Database/Schema/FriendshipSchema";

export class MongoFriendshipMapper {
  static toEntityFromDocument(doc: HydratedDocument<FriendshipDocument>): FriendshipEntity {
    return new FriendshipEntity({
      requesterId: doc.requesterId.toString(),
      recipientId: doc.recipientId.toString(),
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocumentFromEntity(entity: FriendshipEntity): AnyKeys<FriendshipDocument> {
    return {
      requesterId: entity.requesterId as any,
      recipientId: entity.recipientId as any,
      status: entity.status,
    };
  }
}

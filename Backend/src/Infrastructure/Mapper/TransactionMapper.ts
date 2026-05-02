import { HydratedDocument } from "mongoose";
import ETransaction from "../../Domain/Entity/Transaction";
import { TransactionDocument } from "../Database/Schema/TransactionSchema";

export class TransactionMapper {
  static toEntityFromDocument(doc: HydratedDocument<TransactionDocument>): ETransaction {
    let userDetails: any = doc.userId;

    // Handle populated user data
    if (doc.userId && typeof doc.userId === "object" && "displayname" in (doc.userId as any)) {
      userDetails = {
        _id: (doc.userId as any)._id?.toString() || doc.userId.toString(),
        displayname: (doc.userId as any).displayname || "Unknown User",
        email: (doc.userId as any).email || "N/A",
        avatarUrl: (doc.userId as any).avatarKey || null, 
      };
    } else if (!doc.userId) {
      // Handle orphaned transactions (user deleted)
      userDetails = {
        _id: "deleted",
        displayname: "Deleted User",
        email: "N/A",
      };
    } else {
      // Not populated, just a string ID
      userDetails = doc.userId.toString();
    }

    return new ETransaction({
      id: doc._id.toString(),
      userId: userDetails,
      amount: doc.amount,
      currency: doc.currency,
      status: doc.status,
      stripeSessionId: doc.stripeSessionId,
      stripeSubscriptionId: doc.stripeSubscriptionId,
      type: doc.type,
      createdAt: doc.createdAt,
    });
  }

  static toDocumentFromEntity(entity: ETransaction): any {
    return {
      userId: entity.userId,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      stripeSessionId: entity.stripeSessionId,
      stripeSubscriptionId: entity.stripeSubscriptionId,
      type: entity.type,
    };
  }
}

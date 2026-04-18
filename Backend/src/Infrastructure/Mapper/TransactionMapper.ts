import ETransaction from "../../Domain/Entity/Transaction";
import { TransactionDocument } from "../Database/Schema/TransactionSchema";

export class TransactionMapper {
  static toEntity(doc: TransactionDocument): ETransaction {
    return new ETransaction({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      amount: doc.amount,
      currency: doc.currency,
      status: doc.status,
      stripeSessionId: doc.stripeSessionId,
      stripeSubscriptionId: doc.stripeSubscriptionId,
      type: doc.type,
      createdAt: doc.createdAt,
    });
  }

  static toDatabase(entity: ETransaction): any {
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

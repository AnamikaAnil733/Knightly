import { BaseRepository } from "./BaseRepository";
import { TransactionModel } from "../Database/Model/TransactionModel";
import ETransaction from "../../Domain/Entity/Transaction";
import { TransactionDocument } from "../Database/Schema/TransactionSchema";
import { ITransactionRepository } from "../../Domain/Interface/Repositories/ITransactionRepository";
import { TransactionMapper } from "../Mapper/TransactionMapper";

export class TransactionRepository
  extends BaseRepository<ETransaction, TransactionDocument>
  implements ITransactionRepository
{
  constructor() {
    // We pass a mock mapper to super because BaseRepository expects one,
    // but we'll override methods if needed.
    // Actually, I'll create a proper mapper class if needed or just use static methods.
    super(TransactionModel, TransactionMapper as any);
  }

  async getAll(skip: number, limit: number): Promise<ETransaction[]> {
    const docs = await this.model
      .find()
      .populate("userId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return docs.map((doc) => TransactionMapper.toEntity(doc));
  }

  async count(): Promise<number> {
    return this.model.countDocuments();
  }
}

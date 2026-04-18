import { model } from "mongoose";
import { TransactionSchema, TransactionDocument } from "../Schema/TransactionSchema";

export const TransactionModel = model<TransactionDocument>("Transaction", TransactionSchema);

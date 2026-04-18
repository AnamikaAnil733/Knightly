import { Schema, Document, Types } from "mongoose";

export interface TransactionDocument extends Document {
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  stripeSessionId: string;
  stripeSubscriptionId?: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TransactionSchema = new Schema<TransactionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "usd" },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    stripeSessionId: { type: String, required: true, unique: true },
    stripeSubscriptionId: { type: String },
    type: { type: String, default: "SUBSCRIPTION" },
  },
  { timestamps: true },
);

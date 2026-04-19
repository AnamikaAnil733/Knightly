import { Schema, Document, Types } from "mongoose";
import { ReportReason, ReportStatus } from "../../../Domain/Types/ReportTypes";

export interface ReportDocument extends Document {
  reporterId: Types.ObjectId;
  reportedId: Types.ObjectId;
  reason: ReportReason;
  description: string;
  evidence?: any;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const ReportSchema = new Schema<ReportDocument>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    reportedId: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    reason: {
      type: String,
      enum: Object.values(ReportReason),
      required: true,
    },
    description: { type: String, required: true },
    evidence: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.PENDING,
    },
  },
  { timestamps: true },
);

// Indexes for faster lookups
ReportSchema.index({ reporterId: 1 });
ReportSchema.index({ reportedId: 1 });
ReportSchema.index({ status: 1 });

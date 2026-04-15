import { Schema, model, Document } from "mongoose";

export interface CommentDocument extends Document {
  blogId: any;
  authorId: any;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<CommentDocument>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

// Indexes
CommentSchema.index({ blogId: 1 });
CommentSchema.index({ authorId: 1 });

export const CommentModel = model<CommentDocument>("Comment", CommentSchema);

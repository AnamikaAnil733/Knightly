import { Schema, Document, model } from "mongoose";
import { FriendshipStatus } from "../../../Domain/Types/FriendshipStatus";

export interface FriendshipDocument extends Document {
  requesterId: Schema.Types.ObjectId;
  recipientId: Schema.Types.ObjectId;
  status: FriendshipStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FriendshipSchema = new Schema<FriendshipDocument>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(FriendshipStatus),
      default: FriendshipStatus.PENDING,
    },
  },
  { timestamps: true },
);

// Ensure a unique friendship between two users
FriendshipSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

export const FriendshipModel = model<FriendshipDocument>("Friendship", FriendshipSchema);

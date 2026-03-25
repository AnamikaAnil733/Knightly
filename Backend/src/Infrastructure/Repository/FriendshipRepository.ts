import { FriendshipModel } from "../Database/Schema/FriendshipSchema";
import FriendshipEntity from "../../Domain/Entity/FriendshipEntity";
import { IFriendshipRepository}from "../../Domain/Interface/Repositories/IFriendshipRepository";
import { FriendshipStatus } from "../../Domain/Types/FriendshipStatus";


export  class FriendshipRepository implements IFriendshipRepository {
  async create(friendship: FriendshipEntity): Promise<void> {
    await FriendshipModel.create({
      requesterId: friendship.requesterId,
      recipientId: friendship.recipientId,
      status: friendship.status,
    } as any);
  }

  async update(friendship: FriendshipEntity): Promise<void> {
    const query: any = {
      requesterId: friendship.requesterId,
      recipientId: friendship.recipientId,
    };
    await FriendshipModel.findOneAndUpdate(
      query,
      { status: friendship.status },
      { new: true },
    );
  }

  async findByIds(user1: string, user2: string): Promise<FriendshipEntity | null> {
    const query: any = {
      $or: [
        { requesterId: user1, recipientId: user2 },
        { requesterId: user2, recipientId: user1 },
      ],
    };
    const doc = await FriendshipModel.findOne(query);

    if (!doc) return null;

    return new FriendshipEntity({
      requesterId: doc.requesterId.toString(),
      recipientId: doc.recipientId.toString(),
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findFriendsByUserId(userId: string): Promise<FriendshipEntity[]> {
    const query: any = {
      $or: [{ requesterId: userId }, { recipientId: userId }],
      status: FriendshipStatus.ACCEPTED,
    };
    const docs = await FriendshipModel.find(query);

    return docs.map(
      (doc) =>
        new FriendshipEntity({
          requesterId: doc.requesterId.toString(),
          recipientId: doc.recipientId.toString(),
          status: doc.status,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        }),
    );
  }

  async findPendingRequests(userId: string): Promise<FriendshipEntity[]> {
    const query: any = {
      recipientId: userId,
      status: FriendshipStatus.PENDING,
    };
    const docs = await FriendshipModel.find(query);

    return docs.map(
      (doc) =>
        new FriendshipEntity({
          requesterId: doc.requesterId.toString(),
          recipientId: doc.recipientId.toString(),
          status: doc.status,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        }),
    );
  }

  async delete(user1: string, user2: string): Promise<void> {
    const query: any = {
      $or: [
        { requesterId: user1, recipientId: user2 },
        { requesterId: user2, recipientId: user1 },
      ],
    };
    await FriendshipModel.deleteOne(query);
  }
}

import FriendshipEntity from "../../Entity/FriendshipEntity";

export interface IFriendshipRepository {
  create(friendship: FriendshipEntity): Promise<void>;
  update(friendship: FriendshipEntity): Promise<void>;
  findByIds(user1: string, user2: string): Promise<FriendshipEntity | null>;
  findFriendsByUserId(userId: string): Promise<FriendshipEntity[]>;
  findPendingRequests(userId: string): Promise<FriendshipEntity[]>;
  delete(user1: string, user2: string): Promise<void>;
}

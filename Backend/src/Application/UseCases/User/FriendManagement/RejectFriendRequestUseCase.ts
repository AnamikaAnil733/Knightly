import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import { FriendshipStatus } from "../../../../Domain/Types/FriendshipStatus";
import { IRejectFriendRequestUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IRejectFriendRequestUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export default class RejectFriendRequestUseCase implements IRejectFriendRequestUseCase {
  constructor(private friendshipRepository: IFriendshipRepository) {}

  async execute(requesterId: string, recipientId: string): Promise<void> {
    const friendship = await this.friendshipRepository.findByIds(
      requesterId,
      recipientId,
    );

    if (!friendship) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Friend request not found.");
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, "Friend request is not in pending status.");
    }

    // Ensure the one rejecting is the recipient
    if (friendship.recipientId !== recipientId) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, "Only the recipient can reject a friend request.");
    }

    friendship.reject();
    await this.friendshipRepository.update(friendship);
  }
}

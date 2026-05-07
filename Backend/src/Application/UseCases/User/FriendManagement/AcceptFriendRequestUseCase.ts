import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import { FriendshipStatus } from "../../../../Domain/Types/FriendshipStatus";
import { IAcceptFriendRequestUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IAcceptFriendRequestUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export  class AcceptFriendRequestUseCase implements IAcceptFriendRequestUseCase {
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

    // Ensure the one accepting is the recipient
    if (friendship.recipientId !== recipientId) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, "Only the recipient can accept a friend request.");
    }

    friendship.accept();
    await this.friendshipRepository.update(friendship);
  }
}

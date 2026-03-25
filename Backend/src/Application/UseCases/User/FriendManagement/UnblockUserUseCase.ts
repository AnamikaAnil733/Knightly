import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import { IUnblockUserUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IUnblockUserUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { FriendshipStatus } from "../../../../Domain/Types/FriendshipStatus";

export default class UnblockUserUseCase implements IUnblockUserUseCase {
  constructor(private friendshipRepository: IFriendshipRepository) {}

  async execute(requesterId: string, recipientId: string): Promise<void> {
    const friendship = await this.friendshipRepository.findByIds(requesterId, recipientId);

    if (!friendship || friendship.status !== FriendshipStatus.BLOCKED || friendship.requesterId !== requesterId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, "Invalid unblock request.");
    }

    // Unblocking restores the friendship to ACCEPTED.
    friendship.accept();
    await this.friendshipRepository.update(friendship);
  }
}

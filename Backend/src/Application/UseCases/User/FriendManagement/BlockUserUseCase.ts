import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import FriendshipEntity from "../../../../Domain/Entity/FriendshipEntity";
import { FriendshipStatus } from "../../../../Domain/Types/FriendshipStatus";
import { IBlockUserUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IBlockUserUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export default class BlockUserUseCase implements IBlockUserUseCase {
  constructor(private friendshipRepository: IFriendshipRepository) {}

  async execute(requesterId: string, recipientId: string): Promise<void> {
    if (requesterId === recipientId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, "You cannot block yourself.");
    }

    const existingFriendship = await this.friendshipRepository.findByIds(
      requesterId,
      recipientId,
    );

    if (existingFriendship) {
      if (existingFriendship.status === FriendshipStatus.BLOCKED) {
        throw new CustomError(HttpStatusCodes.CONFLICT, "User is already blocked.");
      }

      // We explicitly log that the blocker (requesterId) is the one initiating the block
      // To ensure correct "requester" is saved upon blocking, we recreate the entity if we are swapping
      // Actually we can simply delete the current orientation, and create a blocked relationship explicitly
      // assigning requesterId = blocker.
      await this.friendshipRepository.delete(requesterId, recipientId);
    }

    const blockedFriendship = new FriendshipEntity({
      requesterId,
      recipientId,
      status: FriendshipStatus.BLOCKED,
    });

    await this.friendshipRepository.create(blockedFriendship);
  }
}

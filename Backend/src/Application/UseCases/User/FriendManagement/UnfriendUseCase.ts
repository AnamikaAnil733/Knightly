import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import { IUnfriendUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IUnfriendUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export default class UnfriendUseCase implements IUnfriendUseCase {
  constructor(private friendshipRepository: IFriendshipRepository) {}

  async execute(userId1: string, userId2: string): Promise<void> {
    const friendship = await this.friendshipRepository.findByIds(
      userId1,
      userId2,
    );

    if (!friendship) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Friendship not found.");
    }

    // Unfriending simply deletes the friendship record.
    await this.friendshipRepository.delete(userId1, userId2);
  }
}

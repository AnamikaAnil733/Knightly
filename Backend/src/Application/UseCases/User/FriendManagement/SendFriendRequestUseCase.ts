import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import FriendshipEntity from "../../../../Domain/Entity/FriendshipEntity";
import { FriendshipStatus } from "../../../../Domain/Types/FriendshipStatus";
import { ISendFriendRequestUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/ISendFriendRequestUseCase";

export default class SendFriendRequestUseCase implements ISendFriendRequestUseCase {
  constructor(
    private friendshipRepository: IFriendshipRepository,
    private userRepository: IUserManagmentRepository,
  ) {}

  async execute(requesterId: string, recipientId: string): Promise<void> {
    if (requesterId === recipientId) {
      throw new Error("You cannot send a friend request to yourself.");
    }

    const recipient = await this.userRepository.findById(recipientId);
    if (!recipient) {
      throw new Error("Recipient user not found.");
    }

    const existingFriendship = await this.friendshipRepository.findByIds(
      requesterId,
      recipientId,
    );

    if (existingFriendship) {
      if (existingFriendship.status === FriendshipStatus.ACCEPTED) {
        throw new Error("You are already friends.");
      }
      if (existingFriendship.status === FriendshipStatus.PENDING) {
        throw new Error("A friend request is already pending.");
      }
      if (existingFriendship.status === FriendshipStatus.BLOCKED) {
        throw new Error("This user has blocked you or you have blocked them.");
      }
    }

    const friendship = new FriendshipEntity({
      requesterId,
      recipientId,
      status: FriendshipStatus.PENDING,
    });

    await this.friendshipRepository.create(friendship);
  }
}

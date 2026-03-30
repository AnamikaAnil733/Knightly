import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import FriendshipEntity from "../../../../Domain/Entity/FriendshipEntity";
import { FriendshipStatus } from "../../../../Domain/Types/FriendshipStatus";
import { ISendFriendRequestUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/ISendFriendRequestUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export default class SendFriendRequestUseCase implements ISendFriendRequestUseCase {
  constructor(
    private friendshipRepository: IFriendshipRepository,
    private userRepository: IUserManagmentRepository,
  ) {}

  async execute(requesterId: string, recipientId: string): Promise<void> {
    if (requesterId === recipientId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, "You cannot send a friend request to yourself.");
    }

    const recipient = await this.userRepository.findById(recipientId);
    if (!recipient) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Recipient user not found.");
    }

    const existingFriendship = await this.friendshipRepository.findByIds(
      requesterId,
      recipientId,
    );


    if (existingFriendship) {
      console.log(existingFriendship.status);
      if (existingFriendship.status === FriendshipStatus.ACCEPTED) {
        throw new CustomError(HttpStatusCodes.CONFLICT, "You are already friends.");
      }
      if (existingFriendship.status === FriendshipStatus.PENDING) {
        throw new CustomError(HttpStatusCodes.CONFLICT, "A friend request is already pending.");
      }
      if (existingFriendship.status === FriendshipStatus.BLOCKED) {
        throw new CustomError(HttpStatusCodes.FORBIDDEN, "This user has blocked you or you have blocked them.");
      }
    }
    if (existingFriendship && existingFriendship.status === FriendshipStatus.REJECTED) {
      await this.friendshipRepository.delete(requesterId, recipientId);
    } else if (existingFriendship) {
      // For any other status or unhandled cases, just return or throw to be safe
      return;
    }
    const friendship = new FriendshipEntity({
      requesterId,
      recipientId,
      status: FriendshipStatus.PENDING,
    });

    await this.friendshipRepository.create(friendship);
  }
}

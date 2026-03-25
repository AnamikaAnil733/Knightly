import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import { IStorageService } from "../../../../Domain/Interface/Service/IS3Service";
import { IGetFriendsListUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IGetFriendsListUseCase";
import { FriendDTO } from "../../../../Domain/DTOs/UserDTOs";

export default class GetFriendsListUseCase implements IGetFriendsListUseCase {
  constructor(
    private friendshipRepository: IFriendshipRepository,
    private userRepository: IUserManagmentRepository,
    private storageService: IStorageService,
  ) {}

  async execute(userId: string): Promise<FriendDTO[]> {
    const friendships = await this.friendshipRepository.findFriendsByUserId(userId);

    const friendIds = friendships.map((f) =>
      f.requesterId === userId ? f.recipientId : f.requesterId,
    );

    const friends = await Promise.all(
      friendIds.map(async (id) => {
        const user = await this.userRepository.findById(id);
        if (!user) return null;
        const avatarUrl = user.avatarKey
          ? await this.storageService.generateSignedGetUrl(user.avatarKey, 43200) // 12 hours
          : null;

        return {
          id: user.id!,
          displayname: user.displayname,
          email: user.email,
          avatarUrl,
        };
      }),
    );

    return friends.filter((f) => f !== null);
  }
}

import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";
import { IGetFriendsListUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IGetFriendsListUseCase";
import { FriendMapper } from "../../../Mapper/FriendMapper";
import { FriendDTO } from "../../../../Domain/DTOs/UserDTOs";

export default class GetFriendsListUseCase implements IGetFriendsListUseCase {
  constructor(
    private friendshipRepository: IFriendshipRepository,
    private userRepository: IUserManagmentRepository,
    private mediaService: IMediaService,
  ) {}

  async execute(userId: string): Promise<FriendDTO[]> {
    const friendships = await this.friendshipRepository.findFriendsByUserId(userId);

    const friendData = friendships.map((f) => ({
      id: f.requesterId === userId ? f.recipientId : f.requesterId,
      status: f.status,
    }));

    const friends = await Promise.all(
      friendData.map(async (data) => {
        const user = await this.userRepository.findById(data.id);
        if (!user) return null;
        const avatarUrl = (await this.mediaService.resolveSignedUrl(user.avatarKey)) ?? null;

        return FriendMapper.toFriendDTO(user, data.status, avatarUrl);
      }),
    );

    return friends.filter((f) => f !== null) as FriendDTO[];
  }
}

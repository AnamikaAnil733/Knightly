import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";
import { IGetPendingRequestsUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IGetPendingRequestsUseCase";
import { FriendMapper } from "../../../Mapper/FriendMapper";
import { PendingRequestDTO } from "../../../../Domain/DTOs/UserDTOs";

export  class GetPendingRequestsUseCase implements IGetPendingRequestsUseCase {
  constructor(
    private friendshipRepository: IFriendshipRepository,
    private userRepository: IUserManagmentRepository,
    private mediaService: IMediaService,
  ) {}

  async execute(userId: string): Promise<PendingRequestDTO[]> {
    const pendingFriendships = await this.friendshipRepository.findPendingRequests(userId);

    const requests = await Promise.all(
      pendingFriendships.map(async (f) => {
        const user = await this.userRepository.findById(f.requesterId);
        if (!user) return null;

        const avatarUrl = (await this.mediaService.resolveSignedUrl(user.avatarKey)) ?? null;

        return FriendMapper.toPendingRequestDTO(user, f.createdAt, avatarUrl);
      }),
    );

    return requests.filter((r) => r !== null) as PendingRequestDTO[];
  }
}

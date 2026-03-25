import { IFriendshipRepository } from "../../../../Domain/Interface/Repositories/IFriendshipRepository";
import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import { IStorageService } from "../../../../Domain/Interface/Service/IS3Service";
import { IGetPendingRequestsUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IGetPendingRequestsUseCase";
import { PendingRequestDTO } from "../../../../Domain/DTOs/UserDTOs";

export default class GetPendingRequestsUseCase implements IGetPendingRequestsUseCase {
  constructor(
    private friendshipRepository: IFriendshipRepository,
    private userRepository: IUserManagmentRepository,
    private storageService: IStorageService,
  ) {}

  async execute(userId: string): Promise<PendingRequestDTO[]> {
    const pendingFriendships = await this.friendshipRepository.findPendingRequests(userId);

    const requests = await Promise.all(
      pendingFriendships.map(async (f) => {
        const user = await this.userRepository.findById(f.requesterId);
        if (!user) return null;

        const avatarUrl = user.avatarKey
          ? await this.storageService.generateSignedGetUrl(user.avatarKey, 43200) // 12 hours
          : null;

        return {
          id: user.id!,
          displayname: user.displayname,
          avatarUrl,
          requestedAt: f.createdAt,
        };
      }),
    );

    return requests.filter((r) => r !== null);
  }
}

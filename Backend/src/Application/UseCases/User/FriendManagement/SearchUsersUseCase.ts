import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";
import { ISearchUsersUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/ISearchUsersUseCase";
import { FriendMapper } from "../../../Mapper/FriendMapper";
import { SearchUserDTO } from "../../../../Domain/DTOs/UserDTOs";

export class SearchUsersUseCase implements ISearchUsersUseCase {
  constructor(
    private userRepository: IUserManagmentRepository,
    private mediaService: IMediaService,
  ) {}

  async execute(searchTerm: string, currentUserId: string): Promise<SearchUserDTO[]> {
    if (!searchTerm.trim()) return [];

    // Use existing getAll from UserManagementRepository
    const users = await this.userRepository.getAll(0, 10, searchTerm, "UNBLOCKED");

    const validUsers = users.filter((user) => user.id !== currentUserId);

    return Promise.all(
      validUsers.map(async (user) => {
        const avatarUrl = (await this.mediaService.resolveSignedUrl(user.avatarKey)) ?? null;

        return FriendMapper.toSearchUserDTO(user, avatarUrl);
      }),
    );
  }
}

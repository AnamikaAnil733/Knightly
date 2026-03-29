import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import { IStorageService } from "../../../../Domain/Interface/Service/IS3Service";
import { ISearchUsersUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/ISearchUsersUseCase";
import { FriendMapper } from "../../../Mapper/FriendMapper";
import { SearchUserDTO } from "../../../../Domain/DTOs/UserDTOs";

export default class SearchUsersUseCase implements ISearchUsersUseCase {
  constructor(
    private userRepository: IUserManagmentRepository,
    private storageService: IStorageService,
  ) {}

  async execute(searchTerm: string, currentUserId: string): Promise<SearchUserDTO[]> {
    if (!searchTerm.trim()) return [];

    // Use existing getAll from UserManagementRepository
    const users = await this.userRepository.getAll(0, 10, searchTerm, "UNBLOCKED");

    const validUsers = users.filter((user) => user.id !== currentUserId);

    return Promise.all(
      validUsers.map(async (user) => {
        const avatarUrl = user.avatarKey
          ? await this.storageService.generateSignedGetUrl(user.avatarKey, 43200) // 12 hours
          : null;

        return FriendMapper.toSearchUserDTO(user, avatarUrl);
      }),
    );
  }
}

import { SearchUserDTO } from "../../../../DTOs/UserDTOs";

export interface ISearchUsersUseCase {
  execute(searchTerm: string, currentUserId: string): Promise<SearchUserDTO[]>;
}

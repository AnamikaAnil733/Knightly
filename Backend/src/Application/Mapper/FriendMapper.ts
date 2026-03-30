import Auth from "../../Domain/Entity/Auth";
import { FriendDTO, SearchUserDTO, PendingRequestDTO } from "../../Domain/DTOs/UserDTOs";
import { FriendshipStatus } from "../../Domain/Types/FriendshipStatus";

export class FriendMapper {
  static toFriendDTO(user: Auth, status: FriendshipStatus, avatarUrl: string | null): FriendDTO {
    return {
      id: user.id!,
      displayname: user.displayname,
      email: user.email,
      avatarUrl,
      status,
    };
  }

  static toSearchUserDTO(user: Auth, avatarUrl: string | null): SearchUserDTO {
    return {
      id: user.id!,
      displayname: user.displayname,
      avatarUrl,
    };
  }

  static toPendingRequestDTO(user: Auth, requestedAt: Date, avatarUrl: string | null): PendingRequestDTO {
    return {
      id: user.id!,
      displayname: user.displayname,
      avatarUrl,
      requestedAt,
    };
  }
}

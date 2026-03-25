import { FriendDTO } from "../../../../DTOs/UserDTOs";

export interface IGetFriendsListUseCase {
  execute(userId: string): Promise<FriendDTO[]>;
}

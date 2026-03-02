import { GetUserProfileOutputDto } from "../../../../DTOs/UserDTOs";

export interface IGetUserProfileUseCase {
  execute(userId: string): Promise<GetUserProfileOutputDto>;
}

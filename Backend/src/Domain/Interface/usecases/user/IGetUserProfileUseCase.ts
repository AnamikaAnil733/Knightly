import { GetUserProfileOutputDto } from "../../../DTOs/userDTOs";

export interface IGetUserProfileUseCase {
  execute(userId: string): Promise<GetUserProfileOutputDto>;
}

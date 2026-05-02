import { UserPuzzleResponseDTO } from "../../../../DTOs/UserDTOs";

export interface IGetDailyPuzzleUseCase {
  execute(userId?: string): Promise<UserPuzzleResponseDTO>;
}

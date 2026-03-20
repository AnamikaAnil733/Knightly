import { LeaderBoardResponse } from "Domain/DTOs/UserDTOs";

export interface IGetLeaderBoardUseCase {
    execute(type: string): Promise<LeaderBoardResponse[]>;
  }
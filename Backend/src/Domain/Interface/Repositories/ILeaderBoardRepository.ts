import { LeaderBoardUserData } from "../../DTOs/UserDTOs";

export interface ILeaderBoardRepository {
    getTopPlayersByType(type: string, limit: number): Promise<LeaderBoardUserData[]>;
  }

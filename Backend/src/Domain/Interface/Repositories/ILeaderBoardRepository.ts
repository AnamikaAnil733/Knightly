export interface ILeaderBoardRepository {
    getTopPlayersByType(type: string, limit: number): Promise<any[]>;
  }
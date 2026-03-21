import { authModel } from "../Database/Model/Authmodel";
import { ILeaderBoardRepository } from "../../Domain/Interface/Repositories/ILeaderBoardRepository";

export class LeaderBoardRepository implements ILeaderBoardRepository {

  async getTopPlayersByType(type: string, limit: number): Promise<any[]> {
    const gameType = type.toUpperCase();
    return authModel.find({
      isBlocked: false,
      gamesPlayed: { $gte: 1 },
    })
      .sort({ [`rating.${gameType}`]: -1 })
      .limit(limit)
      .select("displayname avatarKey rating");
  }
}

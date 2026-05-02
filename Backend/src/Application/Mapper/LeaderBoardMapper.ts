import { LeaderBoardResponse, LeaderBoardUserData } from "../../Domain/DTOs/UserDTOs";

export class LeaderBoardMapper {
  static toLeaderBoardResponse(
    user: LeaderBoardUserData,
    index: number,
    avatarUrl: string,
    gameType: string
  ): LeaderBoardResponse {
    const ratings = user.rating;
    const averageRating = Math.floor(
      (ratings.BULLET +
        ratings.BLITZ +
        ratings.RAPID +
        ratings.CLASSICAL) /
        4
    );

    const type = gameType.toUpperCase() as keyof typeof ratings;

    return {
      rank: index + 1,
      displayname: user.displayname,
      avatarKey: avatarUrl || "",
      rating: ratings[type] || 0,
      averageRating,
      win: user.gamesWin || 0,
      streak: user.currentStreak || 0,
    };
  }
}

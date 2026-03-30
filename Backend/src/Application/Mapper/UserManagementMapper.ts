import Auth from "../../Domain/Entity/Auth";
import { BaseUserResponseDTO } from "../../Domain/DTOs/AdminDTOs";

export class UserMapper{
  static toBaseUserResponseDTO(
    user:Auth,
  ):BaseUserResponseDTO{
    return {
      id: user.id!,
      displayname: user.displayname,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      isNewUser: user.isNewUser,
      createdAt: user.createdAt,
      gamesPlayed: user.gamesPlayed,
      premium: user.premium,
      avatarUrl: user.avatarUrl,
      rating: user.rating.getAll(),
      gamesWin: user.gamesWin,
      longestStreak: user.longestStreak,
      currentStreak: user.currentStreak,
      achievements: user.achievements,
      rewards: user.rewards,
    };
  }
}

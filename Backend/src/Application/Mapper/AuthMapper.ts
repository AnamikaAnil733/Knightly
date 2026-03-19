import Auth from "../../Domain/Entity/Auth";
import { AuthResponseDTO } from "../../Domain/DTOs/AuthDTO";

export class AuthMapper {
  static toAuthResponseDTOfromEntity(
    auth: Auth,
    token: string,
  ): AuthResponseDTO {
    return {
      id: auth.id!,
      displayname: auth.displayname,
      email: auth.email,
      role: auth.role,
      isNewUser: auth.isNewUser,
      accessToken: token,

      rating: auth.rating.getAll(),
      gamesPlayed: auth.gamesPlayed,
      gamesWin: auth.gamesWin,
      longestStreak: auth.longestStreak,
      currentStreak: auth.currentStreak,
      rewards: auth.rewards ?? [],
      achievements: auth.achievements,
      premium: auth.premium ?? false,
      avatarUrl: auth.avatarUrl!,
    };
  }
}

import UserEntity from "../../Domain/Entity/UserEntity";

export class UserMapper {
  static toMongo(user: UserEntity) {
    return {
      displayName: user.displayName,
      email: user.email,
      password: user.password,
      role: user.role,
      isBlocked: user.isBlocked,
      gamesPlayed: user.gamesPlayed,
      gamesWin: user.gamesWin,
      rating: user.rating,
      rewards: user.rewards,
      achievements: user.achievements,
      subscriptionStart: user.subscriptionStart,
    };
  }
}

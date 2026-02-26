import { HydratedDocument } from "mongoose";
import Auth from "../../Domain/Entity/Auth";
import { AuthSchemaType } from "../../Infrastructure/Database/Schema/AuthSchema";
import { AuthResponseDTO } from "../../Domain/DTOs/AuthDTO";

export class AuthMapper {
  // DB → Domain
  static toEntityFromDocument(doc: HydratedDocument<AuthSchemaType>): Auth {
    return new Auth({
      id: doc._id.toString(),
      email: doc.email,
      displayname: doc.displayname,
      passwordHash: doc.passwordHash,
      googleId: doc.googleId,
      role: doc.role,
      createdAt: doc.createdAt,
      isBlocked: doc.isBlocked,
      isNewUser: doc.isNewUser,
      avatarKey: doc.avatarKey ?? null,
    });
  }

  // Domain → DB
  static toDocumentFromEntity(auth: Auth) {
    return {
      displayname: auth.displayname,
      email: auth.email,
      passwordHash: auth.passwordHash,
      googleId: auth.googleId,
      role: auth.role,
      isBlocked: auth.isBlocked,
      isNewUser: auth.isNewUser,
      createdAt: auth.createdAt,
      gamesPlayed: auth.gamesPlayed,
      gamesWin: auth.gamesWin,
      rating: auth.rating.getAll(),
      premium: auth.premium,
      longestStreak: auth.longestStreak,
      currentStreak: auth.currentStreak,
      rewards: auth.rewards,
      achievements: auth.achievements,
      subscriptionStart: auth.subscriptionStart,
      avatarKey: auth.avatarKey ?? null,
    };
  }

  static toAuthResponseDTOfromEntity(
    auth: Auth,
    token: string
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

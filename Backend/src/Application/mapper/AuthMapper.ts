import { HydratedDocument } from "mongoose";
import Auth from "../../Domain/Entity/auth";
import { AuthSchemaType } from "../../Infrastructure/database/Schema/authSchema";
import { AuthResponseDTO } from "../DTOs/authDTO";

export class AuthMapper {
  // DB → Domain
  static toEntityFromDocument(
    doc: HydratedDocument<AuthSchemaType>
  ): Auth {
    return new Auth({
      id: doc._id.toString(),
      email: doc.email,
      displayname: doc.displayname,
      passwordHash: doc.passwordHash,
      googleId: doc.googleId,
      role: doc.role,
      isBlocked: doc.isBlocked,
      isNewUser: doc.isNewUser,
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

      gamesPlayed: auth.gamesPlayed,
      gamesWin: auth.gamesWin,
      rating: auth.rating,
      premium: auth.premium,
      longestStreak: auth.longestStreak,
      currentStreak: auth.currentStreak,
      rewards: auth.rewards,
      achievements: auth.achievements,
      subscriptionStart: auth.subscriptionStart,
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

      rating: auth.rating,
      gamesPlayed: auth.gamesPlayed,
      gamesWin: auth.gamesWin,
      longestStreak: auth.longestStreak,
      currentStreak: auth.currentStreak,
      rewards: auth.rewards ?? [],
      achievements: auth.achievements,
      premium: auth.premium ?? false,
    };
  }
}

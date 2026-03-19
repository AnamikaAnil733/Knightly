import { AuthSchemaType } from "../Database/Schema/AuthSchema";
import { HydratedDocument } from "mongoose";
import Auth from "../../Domain/Entity/Auth";
import { UserRating } from "../../Domain/Entity/RatingEntity";


export class MongoAuthMapper{
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

      // Profile fields
      gamesPlayed: doc.gamesPlayed,
      gamesWin: doc.gamesWin,
      rating: new UserRating(doc.rating),
      premium: doc.premium,
      longestStreak: doc.longestStreak,
      currentStreak: doc.currentStreak,
      rewards: doc.rewards,
      achievements: doc.achievements,
      subscriptionStart: doc.subscriptionStart,
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
}
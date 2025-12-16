import Auth from "../../../Domain/Entity/auth";

export class MongoMapper {
  static toMongo(user: Auth) {
    return {
      displayname:user.displayname,
      email:user.email,
      passwordHash:user.passwordHash,
      googleId:user.googleId,
      role:user.role,
      isBlocked:user.isBlocked,
      isNewUser:user.isNewUser,
    };
  }
}

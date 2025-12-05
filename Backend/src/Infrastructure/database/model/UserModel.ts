import { model } from "mongoose";
import { UserSchema, UserDocument } from "../Schema/UserSchema";

export const UserModel = model<UserDocument>("User", UserSchema);

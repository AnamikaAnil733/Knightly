import { model, HydratedDocument } from "mongoose";
import { authSchema, AuthSchemaType } from "../Schema/AuthSchema";

export type AuthDocument = HydratedDocument<AuthSchemaType>;
export const authModel = model<AuthSchemaType>("Auth", authSchema);

import { model ,HydratedDocument} from "mongoose";
import { authSchema,AuthSchemaType} from "../Schema/authSchema";


export type AuthDocument = HydratedDocument<AuthSchemaType>;
export const authModel = model<AuthSchemaType>("Auth",authSchema)
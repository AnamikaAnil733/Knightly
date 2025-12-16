import { model } from "mongoose";
import { authSchema,IAuthDocument} from "../Schema/authSchema";



export const authModel = model<IAuthDocument>("Auth",authSchema)
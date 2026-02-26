import { model } from "mongoose";
import { adminSchema } from "../Schema/AdminSchema";

export const AdminModel = model("Admin", adminSchema);

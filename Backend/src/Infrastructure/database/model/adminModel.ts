import { model } from "mongoose";
import { adminSchema } from "../Schema/adminSchema";


export const AdminModel = model("Admin",adminSchema);
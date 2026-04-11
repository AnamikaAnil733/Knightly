import { model } from "mongoose";
import { BlogSchema } from "../Schema/BlogSchema";

export const BlogModel = model("Blog", BlogSchema);

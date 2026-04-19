import { model } from "mongoose";
import { ReportDocument, ReportSchema } from "../Schema/ReportSchema";

export const ReportModel = model<ReportDocument>("Report", ReportSchema);

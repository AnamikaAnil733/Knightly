import { model } from "mongoose";
import SystemSettingsSchema, { SystemSettingsDocument } from "../Schema/SystemSettingsSchema";

export const SystemSettingsModel = model<SystemSettingsDocument>("SystemSettings", SystemSettingsSchema);

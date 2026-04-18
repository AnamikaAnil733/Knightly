import { ISystemSettings } from "../../../Infrastructure/Database/Schema/SystemSettingsSchema";

export interface ISystemSettingsRepository {
  getSettings(): Promise<ISystemSettings>;
  updateSettings(settings: Partial<ISystemSettings>): Promise<ISystemSettings>;
}

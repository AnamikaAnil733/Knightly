import { SystemSettingsEntity } from "../../Entity/SystemSettingsEntity";

export interface ISystemSettingsRepository {
  getSettings(): Promise<SystemSettingsEntity>;
  updateSettings(settings: Partial<SystemSettingsEntity>): Promise<SystemSettingsEntity>;
}

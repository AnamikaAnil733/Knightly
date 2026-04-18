import { ISystemSettings } from "../../../../../Infrastructure/Database/Schema/SystemSettingsSchema";

export interface IGetSystemSettingsUseCase {
  execute(): Promise<ISystemSettings>;
}

export interface IUpdateSystemSettingsUseCase {
  execute(settings: Partial<ISystemSettings>): Promise<ISystemSettings>;
}

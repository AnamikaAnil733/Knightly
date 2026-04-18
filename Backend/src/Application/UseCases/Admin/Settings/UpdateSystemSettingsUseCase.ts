import { ISystemSettingsRepository } from "../../../../Domain/Interface/Repositories/ISystemSettingsRepository";
import { IUpdateSystemSettingsUseCase } from "../../../../Domain/Interface/Usecases/Admin/Settings/ISystemSettingsUseCase";
import { ISystemSettings } from "../../../../Infrastructure/Database/Schema/SystemSettingsSchema";

export class UpdateSystemSettingsUseCase implements IUpdateSystemSettingsUseCase {
  constructor(private readonly _repo: ISystemSettingsRepository) {}

  async execute(settings: Partial<ISystemSettings>): Promise<ISystemSettings> {
    return this._repo.updateSettings(settings);
  }
}

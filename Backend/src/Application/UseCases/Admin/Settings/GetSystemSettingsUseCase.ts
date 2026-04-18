import { ISystemSettingsRepository } from "../../../../Domain/Interface/Repositories/ISystemSettingsRepository";
import { IGetSystemSettingsUseCase } from "../../../../Domain/Interface/Usecases/Admin/Settings/ISystemSettingsUseCase";
import { ISystemSettings } from "../../../../Infrastructure/Database/Schema/SystemSettingsSchema";

export class GetSystemSettingsUseCase implements IGetSystemSettingsUseCase {
  constructor(private readonly _repo: ISystemSettingsRepository) {}

  async execute(): Promise<ISystemSettings> {
    return this._repo.getSettings();
  }
}

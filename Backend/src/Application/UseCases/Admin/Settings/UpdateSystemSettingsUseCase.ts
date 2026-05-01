import { ISystemSettingsRepository } from "../../../../Domain/Interface/Repositories/ISystemSettingsRepository";
import { IUpdateSystemSettingsUseCase } from "../../../../Domain/Interface/Usecases/Admin/Settings/ISystemSettingsUseCase";
import { SystemSettingsEntity } from "../../../../Domain/Entity/SystemSettingsEntity";

export class UpdateSystemSettingsUseCase implements IUpdateSystemSettingsUseCase {
  constructor(private readonly _repo: ISystemSettingsRepository) {}

  async execute(settings: Partial<SystemSettingsEntity>): Promise<SystemSettingsEntity> {
    return this._repo.updateSettings(settings);
  }
}

import { ISystemSettingsRepository } from "../../../Domain/Interface/Repositories/ISystemSettingsRepository";
import IGetPublicSettingsUseCase, { IPublicSettings } from "../../../Domain/Interface/Usecases/Settings/IGetPublicSettingsUseCase";

export class GetPublicSettingsUseCase implements IGetPublicSettingsUseCase {
  constructor(private readonly _repo: ISystemSettingsRepository) {}

  async execute(): Promise<IPublicSettings> {
    const settings = await this._repo.getSettings();

    return {
      platformName: settings.general.platformName,
      maintenanceMode: settings.general.maintenanceMode,
      contactEmail: settings.general.contactEmail,
      monthlyPrice: settings.subscription.monthlyPrice,
      annualPrice: settings.subscription.annualPrice,
      currency: settings.subscription.currency,
    };
  }
}

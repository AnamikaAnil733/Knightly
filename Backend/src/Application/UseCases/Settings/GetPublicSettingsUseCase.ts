import { ISystemSettingsRepository } from "../../../Domain/Interface/Repositories/ISystemSettingsRepository";

export interface IPublicSettings {
  platformName: string;
  maintenanceMode: boolean;
  contactEmail: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
}

export class GetPublicSettingsUseCase {
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

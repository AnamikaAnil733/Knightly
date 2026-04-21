export interface IPublicSettings {
  platformName: string;
  maintenanceMode: boolean;
  contactEmail: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
}

export default interface IGetPublicSettingsUseCase {
  execute(): Promise<IPublicSettings>;
}


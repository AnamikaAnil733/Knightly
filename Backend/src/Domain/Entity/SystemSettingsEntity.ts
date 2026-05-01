import { BaseEntity } from "./BaseEntity";

export interface IGeneralSettings {
  maintenanceMode: boolean;
  platformName: string;
  contactEmail: string;
}

export interface ISubscriptionSettings {
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
}

export class SystemSettingsEntity extends BaseEntity {
  private _general: IGeneralSettings;
  private _subscription: ISubscriptionSettings;

  constructor(params: {
    id?: string;
    general: IGeneralSettings;
    subscription: ISubscriptionSettings;
  }) {
    super(params.id);
    this._general = params.general;
    this._subscription = params.subscription;
  }

  get general(): IGeneralSettings { return this._general; }
  get subscription(): ISubscriptionSettings { return this._subscription; }
}

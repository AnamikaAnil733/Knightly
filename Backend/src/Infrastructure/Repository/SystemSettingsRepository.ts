import { Model } from "mongoose";
import { ISystemSettingsRepository } from "../../Domain/Interface/Repositories/ISystemSettingsRepository";
import { SystemSettingsDocument } from "../Database/Schema/SystemSettingsSchema";
import { SystemSettingsEntity } from "../../Domain/Entity/SystemSettingsEntity";
import { MongoSystemSettingsMapper } from "../Mapper/MongoSystemSettingsMapper";

export class SystemSettingsRepository implements ISystemSettingsRepository {
  constructor(private readonly _model: Model<SystemSettingsDocument>) {}

  async getSettings(): Promise<SystemSettingsEntity> {
    let settings = await this._model.findOne();
    if (!settings) {
      settings = await this._model.create({});
    }
    return MongoSystemSettingsMapper.toEntityFromDocument(settings as any);
  }

  async updateSettings(settings: Partial<SystemSettingsEntity>): Promise<SystemSettingsEntity> {
    const updatePayload: any = {};

    if (settings.general) {
      if (settings.general.platformName !== undefined)
        updatePayload["general.platformName"] = settings.general.platformName;
      if (settings.general.maintenanceMode !== undefined)
        updatePayload["general.maintenanceMode"] = settings.general.maintenanceMode;
      if (settings.general.contactEmail !== undefined)
        updatePayload["general.contactEmail"] = settings.general.contactEmail;
    }

    if (settings.subscription) {
      if (settings.subscription.monthlyPrice !== undefined)
        updatePayload["subscription.monthlyPrice"] = settings.subscription.monthlyPrice;
      if (settings.subscription.annualPrice !== undefined)
        updatePayload["subscription.annualPrice"] = settings.subscription.annualPrice;
      if (settings.subscription.currency !== undefined)
        updatePayload["subscription.currency"] = settings.subscription.currency;
    }

    const updated = await this._model.findOneAndUpdate(
      {},
      { $set: updatePayload },
      { new: true, upsert: true },
    );
    return MongoSystemSettingsMapper.toEntityFromDocument(updated as any);
  }
}

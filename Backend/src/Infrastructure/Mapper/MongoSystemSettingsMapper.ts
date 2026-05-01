import { HydratedDocument, AnyKeys } from "mongoose";
import { SystemSettingsEntity } from "../../Domain/Entity/SystemSettingsEntity";
import { SystemSettingsDocument } from "../Database/Schema/SystemSettingsSchema";

export class MongoSystemSettingsMapper {
  static toEntityFromDocument(doc: HydratedDocument<SystemSettingsDocument>): SystemSettingsEntity {
    return new SystemSettingsEntity({
      id: doc._id.toString(),
      general: {
        maintenanceMode: doc.general.maintenanceMode,
        platformName: doc.general.platformName,
        contactEmail: doc.general.contactEmail,
      },
      subscription: {
        monthlyPrice: doc.subscription.monthlyPrice,
        annualPrice: doc.subscription.annualPrice,
        currency: doc.subscription.currency,
      },
    });
  }

  static toDocumentFromEntity(entity: SystemSettingsEntity): AnyKeys<SystemSettingsDocument> {
    return {
      general: {
        maintenanceMode: entity.general.maintenanceMode,
        platformName: entity.general.platformName,
        contactEmail: entity.general.contactEmail,
      },
      subscription: {
        monthlyPrice: entity.subscription.monthlyPrice,
        annualPrice: entity.subscription.annualPrice,
        currency: entity.subscription.currency,
      },
    };
  }
}

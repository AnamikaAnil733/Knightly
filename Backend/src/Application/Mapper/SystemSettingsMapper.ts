import { SystemSettingsEntity } from "../../Domain/Entity/SystemSettingsEntity";
import { ISystemSettings } from "../../Infrastructure/Database/Schema/SystemSettingsSchema";

export class SystemSettingsMapper {
  static toPublicDTO(entity: ISystemSettings) {
    return {
      platformName: entity.general.platformName,
      maintenanceMode: entity.general.maintenanceMode,
    };
  }

  static toAdminDTO(entity: ISystemSettings) {
    return {
      general: entity.general,
      subscription: entity.subscription,
    };
  }
}

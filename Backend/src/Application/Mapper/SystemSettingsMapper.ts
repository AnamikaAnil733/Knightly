import { SystemSettingsEntity } from "../../Domain/Entity/SystemSettingsEntity";

export class SystemSettingsMapper {
  static toPublicDTO(entity: SystemSettingsEntity) {
    return {
      platformName: entity.general.platformName,
      maintenanceMode: entity.general.maintenanceMode,
    };
  }

  static toAdminDTO(entity: SystemSettingsEntity) {
    return {
      general: entity.general,
      subscription: entity.subscription,
    };
  }
}

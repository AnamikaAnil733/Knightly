import UserAchievementEntity from "../../Domain/Entity/UserAchievementEntity";

export class UserAchievementMapper {
  static toDTO(entity: UserAchievementEntity) {
    return {
      id: entity.id,
      userId: entity.userId,
      achievementId: entity.achievementId,
      unlockedAt: entity.unlockedAt,
    };
  }

  static toDTOList(entities: UserAchievementEntity[]) {
    return entities.map((entity) => this.toDTO(entity));
  }
}

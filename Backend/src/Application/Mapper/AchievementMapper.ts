import AchievementEntity from "../../Domain/Entity/AchievementEntity";
import { CreateAchievementDTO ,AchievementResponseDTO,UpdateAchievementDTO} from "../../Domain/DTOs/AchievementsDTO";

export class AchievementMapper {
   public static toEntity(achievement:CreateAchievementDTO):AchievementEntity{
  return new AchievementEntity({
    title:achievement.title,
    description:achievement.description,
    icon:achievement.icon,
    criteriaType:achievement.criteriaType,
    criteriaValue:achievement.criteriaValue
  })
   }

   public static toResponseDTO(achievement:AchievementEntity):AchievementResponseDTO{
    return {
      id:achievement.id!,
      title:achievement.title,
      description:achievement.description,
      icon:achievement.icon,
      criteriaType:achievement.criteriaType,
      criteriaValue:achievement.criteriaValue
    }
   }
}
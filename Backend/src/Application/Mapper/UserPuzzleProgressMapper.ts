import { EUserPuzzleprogress } from "../../Domain/Entity/UserPuzzleProgress";

export class UserPuzzleProgressMapper {
  static toDTO(entity: EUserPuzzleprogress) {
    return {
      id: entity.id,
      userId: entity.userId,
      puzzleId: entity.puzzleId,
      solved: entity.solved,
      attempts: entity.attempts,
      solvedAt: entity.solvedAt,
    };
  }

  static toDTOList(entities: EUserPuzzleprogress[]) {
    return entities.map((entity) => this.toDTO(entity));
  }
}

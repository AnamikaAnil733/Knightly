import { GameHistoryDTO } from "../../../../DTOs/UserDTOs";

export default interface IGetGameHistoryUseCase {
  execute(userId: string): Promise<GameHistoryDTO[]>;
}

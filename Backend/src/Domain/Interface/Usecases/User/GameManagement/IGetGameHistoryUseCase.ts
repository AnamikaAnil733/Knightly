import { GameHistoryDTO } from "../../../../DTOs/UserDTOs";

export default interface IGetGameHistoryUseCase {
  execute(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ history: GameHistoryDTO[]; total: number }>;
}


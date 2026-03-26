import { IPuzzleGeneratorService } from "../../../../Domain/Interface/Service/IPuzzleGeneratorService";
import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { PuzzleResponseDTO } from "../../../../Domain/DTOs/AdminDTOs";
import { PuzzleMapper } from "../../../Mapper/PuzzleMapper";

import { IGeneratePuzzleFromGameUseCase } from "../../../../Domain/Interface/Usecases/Admin/PuzzleManagement/IGeneratePuzzleFromGameUseCase";

export class GeneratePuzzleFromGameUseCase implements IGeneratePuzzleFromGameUseCase {
  constructor(
        private readonly _puzzleGeneratorService: IPuzzleGeneratorService,
        private readonly _puzzleRepository: IPuzzleRepository,
        private readonly _gameRepository: IChessGameRepository,
  ) {}

  async execute(gameId?: string): Promise<PuzzleResponseDTO[]> {
    let games = [];
    if (gameId) {
      const game = await this._gameRepository.findById(gameId);
      if (!game) throw new Error("Game not found");
      games.push(game);
    } else {
      games = await this._gameRepository.findRecent(3);
    }

    const allCreatedPuzzles = [];
    for (const game of games) {
      try {
        const history = game.getGameState().getHistory();
        if (history.length < 10) continue;

        const puzzles = await this._puzzleGeneratorService.generateFromGame(history);

        for (const puzzle of puzzles) {
          const created = await this._puzzleRepository.create(puzzle);
          allCreatedPuzzles.push(PuzzleMapper.toPuzzleResposeDTO(created));
        }
      } catch (err: any) {
        console.error(`AI generation failed for game ${game.id}: ${err.message}`);
        // Continue to next game instead of failing the whole batch
      }
    }

    if (allCreatedPuzzles.length === 0 && games.length > 0) {
      throw new Error("No puzzles could be generated from recent games. Check server logs for details.");
    }

    return allCreatedPuzzles;
  }
}

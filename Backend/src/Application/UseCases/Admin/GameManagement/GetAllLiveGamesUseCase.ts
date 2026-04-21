import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../../Domain/Entity/Auth";
import { IGetAllLiveGamesUseCase, ILiveGameDTO } from "../../../../Domain/Interface/Usecases/Admin/GameManagement/IGetAllLiveGamesUseCase";

export default class GetAllLiveGamesUseCase implements IGetAllLiveGamesUseCase {
  constructor(
    private readonly gameRepository: IChessGameRepository,
    private readonly userRepository: IBaseRepository<EAuth, string>,
  ) {}

  async execute(): Promise<ILiveGameDTO[]> {
    const liveGames = await this.gameRepository.findAllLiveGames();

    // Map games with player details
    const populatedGames = await Promise.all(
      liveGames.map(async (game) => {
        const whitePlayerId = game.getWhitePlayerId();
        const blackPlayerId = game.getBlackPlayerId();

        const [whitePlayer, blackPlayer] = await Promise.all([
          whitePlayerId ? this.userRepository.findById(whitePlayerId) : null,
          blackPlayerId ? this.userRepository.findById(blackPlayerId) : null,
        ]);

        const timeControl = game.getTimeControl();

        return {
          id: game.id!,
          status: game.getStatus(),
          timeControl,
          whitePlayer: whitePlayer ? {
            id: whitePlayer.id!,
            name: whitePlayer.displayname,
            rating: whitePlayer.getRating(this.getRatingType(timeControl)),
            avatar: whitePlayer.avatarUrl || null,
          } : { id: "bot", name: "Stockfish", rating: 0, avatar: "/images/stockfish-avatar.png" },
          blackPlayer: blackPlayer ? {
            id: blackPlayer.id!,
            name: blackPlayer.displayname,
            rating: blackPlayer.getRating(this.getRatingType(timeControl)),
            avatar: blackPlayer.avatarUrl || null,
          } : { id: "bot", name: "Stockfish", rating: 0, avatar: "/images/stockfish-avatar.png" },
          createdAt: game.createdAt,
        };
      }),
    );

    return populatedGames;
  }

  private getRatingType(timeControl: string): "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL" {
    if (timeControl.startsWith("level-")) return "BLITZ"; // Default for bots

    const [base] = timeControl.split("+").map(Number);
    if (base < 3) return "BULLET";
    if (base < 10) return "BLITZ";
    if (base < 30) return "RAPID";
    return "CLASSICAL";
  }
}

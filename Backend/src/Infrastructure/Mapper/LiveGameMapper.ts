import { ChessGame } from "../../Domain/Entity/ChessGame";
import EAuth from "../../Domain/Entity/Auth";
import { ILiveGameDTO } from "../../Domain/Interface/Usecases/Admin/GameManagement/IGetAllLiveGamesUseCase";

export class LiveGameMapper {
  static toDTO(
    game: ChessGame,
    whitePlayer: EAuth | null,
    blackPlayer: EAuth | null
  ): ILiveGameDTO {
    const timeControl = game.getTimeControl();
    const ratingType = this.getRatingType(timeControl);

    return {
      id: game.id!,
      status: game.getStatus(),
      timeControl,
      whitePlayer: whitePlayer ? {
        id: whitePlayer.id!,
        name: whitePlayer.displayname,
        rating: whitePlayer.getRating(ratingType),
        avatar: whitePlayer.avatarUrl || null,
      } : { id: "bot", name: "Stockfish AI", rating: 0, avatar: "/images/stockfish-avatar.png" },
      blackPlayer: blackPlayer ? {
        id: blackPlayer.id!,
        name: blackPlayer.displayname,
        rating: blackPlayer.getRating(ratingType),
        avatar: blackPlayer.avatarUrl || null,
      } : { id: "bot", name: "Stockfish AI", rating: 0, avatar: "/images/stockfish-avatar.png" },
      createdAt: game.createdAt,
    };
  }

  private static getRatingType(timeControl: string): "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL" {
    if (timeControl.startsWith("level-")) return "BLITZ";
    const [base] = timeControl.split("+").map(Number);
    if (base < 3) return "BULLET";
    if (base < 10) return "BLITZ";
    if (base < 30) return "RAPID";
    return "CLASSICAL";
  }
}

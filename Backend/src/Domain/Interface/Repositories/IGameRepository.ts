import { ChessGame } from "../../Entity/ChessGame";

export interface IChessGameRepository {
  create(game: ChessGame): Promise<ChessGame>;
  findById(id: string): Promise<ChessGame | null>;
  update(game: ChessGame): Promise<ChessGame | null>;
  findRecent(limit: number): Promise<ChessGame[]>;
  findByUserId(userId: string): Promise<ChessGame[]>;
  findLivePublicGames(): Promise<ChessGame[]>;
}

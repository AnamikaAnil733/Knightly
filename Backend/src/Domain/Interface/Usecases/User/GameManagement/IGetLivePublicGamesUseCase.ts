import { ChessGame } from "../../../../Entity/ChessGame";

export interface IGetLivePublicGamesUseCase {
  execute(): Promise<ChessGame[]>;
}

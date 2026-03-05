import { ChessGame } from "../../../../Entity/ChessGame";

export interface IMakeMoveUseCase {
  execute(
    gameId: string,
    from: { row: number; col: number },
    to: { row: number; col: number },
    promotionType?: "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT"
  ): Promise<ChessGame>;
}

export interface IGetLegalMovesUseCase {
  execute(
    gameId: string,
    p: { row: number; col: number }
  ): Promise<{ row: number; col: number; type: "NORMAL" | "EN_PASSANT" }[]>;
}

export interface IUpdateRatingUseCase {
  execute(
    whiteId: string,
    blackId: string,
    result: "WHITEWIN" | "BLACKWIN" | "DRAW",
    type: "BULLET" | "RAPID" | "BLITZ" | "CLASSICAL"
  ): Promise<void>;
}

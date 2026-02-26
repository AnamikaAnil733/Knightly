export interface ICreateGameUseCase {
  execute(
    whitePlayerId?: string,
    blackPlayerId?: string
  ): Promise<{
    gameId: string;
  }>;
}

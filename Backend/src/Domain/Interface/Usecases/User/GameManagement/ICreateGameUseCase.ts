export interface ICreateGameUseCase{
    execute(whitePlayerId?: string, blackPlayerId?: string, timeControl?: string, difficulty?: number):Promise<{
        gameId:string;
    }>
}

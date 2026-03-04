export interface ICreateGameUseCase{
    execute(whitePlayerId?: string, blackPlayerId?: string, timeControl?: string):Promise<{
        gameId:string;
    }>
}

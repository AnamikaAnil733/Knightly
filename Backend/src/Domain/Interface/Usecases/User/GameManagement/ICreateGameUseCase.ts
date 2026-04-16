export interface ICreateGameUseCase{
    execute(whitePlayerId?: string, blackPlayerId?: string, timeControl?: string, difficulty?: number, isPublic?: boolean):Promise<{
        gameId:string;
    }>
}

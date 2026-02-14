export interface ICreateGameUseCase{
    execute():Promise<{
        gameId:string;
    }>
}

export interface IMakeMoveUseCase{
    execute(
        gameId:string,
        from:{row:never,col:number},
        to:{row:number,col:number})
        :Promise<void>;
}
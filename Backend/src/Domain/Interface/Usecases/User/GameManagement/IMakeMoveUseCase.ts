export interface IMakeMoveUseCase{
    execute(
        gameId:string,
        from:{row:never,col:number},
        to:{row:number,col:number},
        promotionType?:"QUEEN" | "ROOK" | "BISHOP" | "KNIGHT",
    )
        :Promise<void>;
}

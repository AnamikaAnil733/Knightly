
export interface MoveDTO{
    from:{row:number;col:number};
    to:{row:number;col:number};
    pieceType:string;
    color :"WHITE" | "BLACK";
}

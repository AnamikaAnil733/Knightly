export type MoveType = "NORMAL"|"CAPTURE"|"EN_PASSANT"|"CASTLING"|"PROMOTION";

export interface MoveDTO{
    from:{row:number;col:number};
    to:{row:number;col:number};
    type:MoveType;
    captured?:{row:number;col:number}
}
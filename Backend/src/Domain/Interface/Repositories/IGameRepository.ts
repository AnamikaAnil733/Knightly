import { ChessGame } from "../../Entity/chessGame";

export interface IChessGameRepository{
    create(game:ChessGame):Promise<ChessGame>;
    findById(id:string):Promise<ChessGame|null>;
    update(game:ChessGame):Promise<ChessGame|null>;
}

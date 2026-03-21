import BP from "../../Assets/ChessPieces/Png/B Pawn.png";
import BK from "../../Assets/ChessPieces/Png/Black King.png";
import BQ from "../../Assets/ChessPieces/Png/BLack Queen.png";
import BB from "../../Assets/ChessPieces/Png/B Bishop.png";
import BR from "../../Assets/ChessPieces/Png/Black Rook.png";
import BN from "../../Assets/ChessPieces/Png/B Knight.png";
import WK from "../../Assets/ChessPieces/Png/King W.png";
import WQ from "../../Assets/ChessPieces/Png/Queen W.png";
import WR from "../../Assets/ChessPieces/Png/Rook White.png";
import WB from "../../Assets/ChessPieces/Png/W Bishop.png";
import WN from "../../Assets/ChessPieces/Png/W Knight.png";
import WP from "../../Assets/ChessPieces/Png/w Pawn.png";

export const Piece_Images = {
  WHITE: {
    PAWN: WP,
    ROOK: WR,
    KING: WK,
    QUEEN: WQ,
    BISHOP: WB,
    KNIGHT: WN,
  },
  BLACK: {
    PAWN: BP,
    ROOK: BR,
    KING: BK,
    QUEEN: BQ,
    BISHOP: BB,
    KNIGHT: BN,
  },
} as const;

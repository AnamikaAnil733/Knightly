import BP from "../../assets/chessPieces/png/B Pawn.png";
import BK from "../../assets/chessPieces/png/Black King.png";
import BQ from "../../assets/chessPieces/png/BLack Queen.png";
import BB from "../../assets/chessPieces/png/B Bishop.png";
import BR from "../../assets/chessPieces/png/Black Rook.png";
import BN from "../../assets/chessPieces/png/B Knight.png";
import WK from "../../assets/chessPieces/png/King W.png";
import WQ from "../../assets/chessPieces/png/Queen W.png";
import WR from "../../assets/chessPieces/png/Rook White.png";
import WB from "../../assets/chessPieces/png/W Bishop.png";
import WN from "../../assets/chessPieces/png/W Knight.png";
import WP from "../../assets/chessPieces/png/w Pawn.png";

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

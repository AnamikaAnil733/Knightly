import { Position } from "../Position";
import { PromotionType } from "./PromotionType";

export class Move {
  constructor(
    public readonly from: Position,
    public readonly to: Position,
    public readonly pieceType: string,
    public readonly color: "WHITE" | "BLACK",
    public readonly promotionType?: PromotionType,
  ) {}
}

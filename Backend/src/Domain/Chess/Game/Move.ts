import { Position } from "../Position";

export class Move {
  constructor(
    public readonly from: Position,
    public readonly to: Position,
    public readonly pieceType: string,
    public readonly color: "WHITE" | "BLACK",
  ) {}
}

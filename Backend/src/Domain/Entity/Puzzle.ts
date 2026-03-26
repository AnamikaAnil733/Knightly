import { BaseEntity } from "./BaseEntity";
import { PuzzleType } from "../Types/PuzzleTypes";

export class EPuzzle extends BaseEntity {
  fen: string;
  difficulty: PuzzleType;
  moves: string[];
  solutionLength: number;
  description?: string;
  isActive: boolean;
  createdAt?: Date;

  constructor(props: {
    id?: string;
    fen: string;
    difficulty: PuzzleType;
    moves: string[];
    solutionLength?: number;
    description?: string;
    isActive?: boolean;
    createdAt?: Date;
  }) {
    super(props.id);
    if (!props.fen || props.fen.trim() === "") {
      throw new Error("FEN cannot be empty");
    }
    if (!props.moves || props.moves.length === 0) {
      throw new Error("Puzzle must contain at least one move");
    }

    this.fen = props.fen;
    this.difficulty = props.difficulty;
    this.moves = props.moves;
    this.description = props.description;
    this.solutionLength = props.solutionLength ?? props.moves.length;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
  }

  deactivate() {
    this.isActive = false;
  }

  updateMoves(moves: string[]) {
    if (!moves || moves.length === 0) {
      throw new Error("Moves cannot be empty");
    }
    this.moves = [...moves];
    this.solutionLength = moves.length;
  }
}

import { BaseEntity } from "./BaseEntity";
import { PuzzleType } from "../Types/PuzzleTypes";

export class Puzzle extends BaseEntity{
  fen: string;
  difficulty: PuzzleType;
  moves: string[];
  solutionLength: number;
  isActive: boolean;

  constructor(props: {
    id?: string;
    fen: string;
    difficulty: PuzzleType;
    moves: string[];
    solutionLength?: number;
    isActive?: boolean;
  }) {
    super(props.id);

    this.fen = props.fen;
    this.difficulty = props.difficulty;
    this.moves = props.moves;
    this.solutionLength = props.solutionLength ?? props.moves.length;
    this.isActive = props.isActive ?? true;
  }

  /** Domain behavior */
  deactivate() {
    this.isActive = false;
  }

  updateMoves(moves: string[]) {
    this.moves = moves;
    this.solutionLength = moves.length;
  }
}

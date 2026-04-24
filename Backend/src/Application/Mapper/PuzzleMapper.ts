import { EPuzzle } from "../../Domain/Entity/Puzzle";
import { PuzzleResponseDTO } from "../../Domain/DTOs/AdminDTOs";
import { UserPuzzleResponseDTO } from "../../Domain/DTOs/UserDTOs";

export class PuzzleMapper{
  static toPuzzleResposeDTO(puzzle:EPuzzle):PuzzleResponseDTO{
    return{
      id: puzzle.id!,
      fen: puzzle.fen,
      difficulty: puzzle.difficulty,
      moves: puzzle.moves,
      solutionLength: puzzle.solutionLength,
      description: puzzle.description,
      isActive: puzzle.isActive,
      createdAt: puzzle.createdAt
        ? puzzle.createdAt.toISOString()
        : "",
    };
  }

  static toUserPuzzleResponseDTO(puzzle: EPuzzle): UserPuzzleResponseDTO {
    return {
      id: puzzle.id!,
      fen: puzzle.fen,
      difficulty: puzzle.difficulty,
      description: puzzle.description,
      solution: puzzle.moves,
    };
  }
}

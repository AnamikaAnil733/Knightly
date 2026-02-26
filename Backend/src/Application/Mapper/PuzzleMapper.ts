import { HydratedDocument } from "mongoose";
import { EPuzzle } from "../../Domain/Entity/Puzzle";
import { PuzzleSchemaType } from "../../Infrastructure/Database/Schema/PuzzleSchema";
import { PuzzleResponseDTO } from "../../Domain/DTOs/AdminDTOs";

export class PuzzleMapper {
  static toEntityFromDocument(
    doc: HydratedDocument<PuzzleSchemaType>
  ): EPuzzle {
    return new EPuzzle({
      id: doc._id.toString(),
      fen: doc.fen,
      difficulty: doc.difficulty,
      moves: doc.moves,
      solutionLength: doc.solutionLength,
      isActive: doc.isActive,
    });
  }

  static toDocumentFromEntity(puzzle: EPuzzle) {
    return {
      fen: puzzle.fen,
      difficulty: puzzle.difficulty,
      moves: puzzle.moves,
      solutionLength: puzzle.solutionLength,
      isActive: puzzle.isActive,
    };
  }

  static toPuzzleResposeDTO(puzzle: EPuzzle): PuzzleResponseDTO {
    return {
      id: puzzle.id!,
      fen: puzzle.fen,
      difficulty: puzzle.difficulty,
      moves: puzzle.moves,
      solutionLength: puzzle.solutionLength,
      isActive: puzzle.isActive,
      createdAt: puzzle.createdAt ? puzzle.createdAt.toISOString() : "",
    };
  }
}

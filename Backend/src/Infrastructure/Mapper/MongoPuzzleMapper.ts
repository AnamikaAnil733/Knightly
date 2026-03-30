import { HydratedDocument } from "mongoose";
import { EPuzzle } from "../../Domain/Entity/Puzzle";
import { PuzzleSchemaType } from "../Database/Schema/PuzzleSchema";

export class MongoPuzzleMapper {
  static toEntityFromDocument(doc: HydratedDocument<PuzzleSchemaType>): EPuzzle {
    return new EPuzzle({
      id: doc._id.toString(),
      fen: doc.fen,
      difficulty: doc.difficulty,
      moves: doc.moves,
      solutionLength: doc.solutionLength,
      description: doc.description,
      isActive: doc.isActive,
    });
  }

  static toDocumentFromEntity(puzzle: EPuzzle) {
    return {
      fen: puzzle.fen,
      difficulty: puzzle.difficulty,
      moves: puzzle.moves,
      solutionLength: puzzle.solutionLength,
      description: puzzle.description,
      isActive: puzzle.isActive,
    };
  }
}

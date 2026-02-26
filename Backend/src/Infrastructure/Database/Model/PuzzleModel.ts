import { model } from "mongoose";
import { PuzzleSchemaType, PuzzleSchema } from "../Schema/PuzzleSchema";
import {
  UserPuzzleProgressSchema,
  UserPuzzleProgressSchemaType,
} from "../Schema/UserPuzzzleProgressSchema";

export const PuzzleModel = model<PuzzleSchemaType>("Puzzle", PuzzleSchema);
export const ProgressPuzzleModel = model<UserPuzzleProgressSchemaType>(
  "PuzzleProgess",
  UserPuzzleProgressSchema
);

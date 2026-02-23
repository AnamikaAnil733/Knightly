import { model } from "mongoose";
import {PuzzleSchemaType, PuzzleSchema} from "../Schema/puzzleSchema";
import { UserPuzzleProgressSchema,UserPuzzleProgressSchemaType } from "../Schema/userPuzzzleProgressSchema";


export const PuzzleModel = model<PuzzleSchemaType>("Puzzle",PuzzleSchema);
export const ProgressPuzzleModel = model<UserPuzzleProgressSchemaType>("PuzzleProgess",UserPuzzleProgressSchema);

import { model } from "mongoose";
import {PuzzleSchemaType, PuzzleSchema} from "../Schema/puzzleSchema";


export const PuzzleModel = model<PuzzleSchemaType>("Puzzle",PuzzleSchema);

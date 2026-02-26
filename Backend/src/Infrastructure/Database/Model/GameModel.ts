import { model } from "mongoose";
import { ChessGameSchema } from "../Schema/ChessGameSchema";

export const GameModel = model("Games", ChessGameSchema);

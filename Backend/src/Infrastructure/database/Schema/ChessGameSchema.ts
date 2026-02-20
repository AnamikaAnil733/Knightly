import { Schema } from "mongoose";
import { SerializedBoardGrid } from "../../../Domain/Chess/Types/SerializedBoard";



export interface ChessGameSchemaType {
  _id?: string;
  turn: "WHITE" | "BLACK";
  board: SerializedBoardGrid;
  history: any[];
  status: "ACTIVE" | "CHECKMATE" | "STALEMATE"|"CHECK"|"WHITE_TIMEOUT"|"BLACK_TIMEOUT";
  createdAt: Date;
  updatedAt: Date;
  clock: {
    whiteTime: number;
    blackTime: number;
    increment: number;
    turn: "WHITE" | "BLACK";
    lastMoveTimestamp: number;
  },
  whitePlayerId?: string;
  blackPlayerId?: string;
}

export const ChessGameSchema = new Schema<ChessGameSchemaType>(
  {
    whitePlayerId: { type: String },
    blackPlayerId: { type: String },
    turn:{
      type:String,
      enum:["WHITE","BLACK"],
      required:true,
    },
    board:{
      type:Schema.Types.Mixed,
      required:true,
    },
    history:{
      type:Schema.Types.Mixed,
      required:true,
      default:[],
    },
    status:{
      type:String,
      enum:["ACTIVE",
        "CHECKMATE",
        "STALEMATE",
        "CHECK",
        "WHITE_TIMEOUT",
        "BLACK_TIMEOUT"],
      required:true,
      default:"ACTIVE",
    },
    clock: {
      whiteTime: { type: Number, required: true },
      blackTime: { type: Number, required: true },
      increment: { type: Number, required: true },
      turn: {
        type: String,
        enum: ["WHITE", "BLACK"],
        required: true, 
      },
      lastMoveTimestamp: { type: Number, required: true },
    },
  },
  {
    timestamps:true,
  },
);

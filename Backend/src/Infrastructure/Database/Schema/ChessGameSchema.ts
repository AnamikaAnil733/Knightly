import { Schema } from "mongoose";
import { SerializedBoardGrid } from "../../../Domain/Chess/Types/SerializedBoard";
import { GameStatus } from "../../../Domain/Chess/Game/GameStatus";

export interface ChessGameSchemaType {
  _id?: string;
  turn: "WHITE" | "BLACK";
  board: SerializedBoardGrid;
  history: any[];
  status: GameStatus;
  createdAt: Date;
  updatedAt: Date;
  clock: {
    whiteTime: number;
    blackTime: number;
    increment: number;
    turn: "WHITE" | "BLACK";
    lastMoveTimestamp: number;
  };
  whitePlayerId?: string;
  blackPlayerId?: string;
  positionHistory: string[];
  halfMoveClock: number;
  timeControl: string;
  isRatingUpdated: boolean;
  whiteRatingChange?: number;
  blackRatingChange?: number;
  difficulty?: number; // Bot level 1-6
}

export const ChessGameSchema = new Schema<ChessGameSchemaType>(
  {
    whitePlayerId: { type: String },
    blackPlayerId: { type: String },
    timeControl: { type: String, default: "5+0" },
    turn: {
      type: String,
      enum: ["WHITE", "BLACK"],
      required: true,
    },
    board: {
      type: Schema.Types.Mixed,
      required: true,
    },
    history: {
      type: Schema.Types.Mixed,
      required: true,
      default: [],
    },
    status: {
      type: String,
      enum: [
        "ACTIVE",
        "CHECKMATE",
        "STALEMATE",
        "CHECK",
        "WHITE_TIMEOUT",
        "BLACK_TIMEOUT",
        "WHITE_RESIGNED",
        "BLACK_RESIGNED",
        "DRAW_BY_REPETITION",
        "DRAW_BY_FIFTY_MOVES",
        "DRAW_BY_INSUFFICIENT_MATERIAL",
        "DRAW_BY_AGREEMENT",
      ],
      required: true,
      default: "ACTIVE",
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
    positionHistory: {
      type: [String],
      required: true,
      default: [],
    },
    halfMoveClock: {
      type: Number,
      required: true,
      default: 0,
    },
    isRatingUpdated: {
      type: Boolean,
      default: false,
    },
    whiteRatingChange: { type: Number },
    blackRatingChange: { type: Number },
    difficulty: {
      type: Number,
      min: 1,
      max: 6,
    },
  },
  {
    timestamps: true,
  },
);

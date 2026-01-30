import { Schema } from "mongoose";
import { SerializedBoardGrid } from "../../../Domain/Chess/Types/SerializedBoard";



export interface ChessGameSchemaType {
  _id: string;
  turn: "WHITE" | "BLACK";
  board: SerializedBoardGrid;
  history: any[];         
  status: "ACTIVE" | "CHECKMATE" | "STALEMATE";
  createdAt: Date;
  updatedAt: Date;
}

export const ChessGameSchema = new Schema<ChessGameSchemaType>(
   {
      _id:{
         type:String,
         required:true,
      },
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
         default:[]
      },
      status:{
         type:String,
         enum:["ACTIVE","CHECKMATE","STALEMATE"],
         required:true,
         default:"ACTIVE"
      },
   },
   {
      timestamps:true
   }
)

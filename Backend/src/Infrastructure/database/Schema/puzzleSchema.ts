import { Schema } from "mongoose";
import { PuzzleType } from "../../../Domain/Types/PuzzleTypes";

export interface PuzzleSchemaType{
    fen:string;
    difficulty:PuzzleType;
    moves:string[];
    solutionLength:number;
    isActive:boolean;
}

export const PuzzleSchema = new Schema<PuzzleSchemaType>(
    {
        fen:{
            type:String,
            required:true,
        },
        difficulty:{
            type:String,
            enum:Object.values(PuzzleType),
            required:true,
        },
        moves:{
            type:[String],
            required:true,
        },
        solutionLength:{
            type:Number,
            required:true,
        },
        isActive:{
            type:Boolean,
            default:true,
        }
    },
    {timestamps:true}
);


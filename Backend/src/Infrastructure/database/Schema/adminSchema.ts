import { Schema } from "mongoose";

 export const adminSchema = new Schema(
    {
        name:{
            type:String,
        },
        email:{
            type:String,
            required:true,
        },
        passwordHash:{
            type:String,
            required:true,
        },
    },
    {timestamps:true}
)
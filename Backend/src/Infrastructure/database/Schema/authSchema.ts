import { Document,Schema } from "mongoose";
import { UserRole } from "../../../Domain/Types/UserRole";


export interface IAuthDocument extends Document{
    displayname:string;
    email:string;
    passwordHash:string;
    googleId:string,
    role:UserRole;
    isBlocked:boolean;
    isNewUser:boolean;
    createdAt:Date;
    updatedAt:Date;
}

 export const authSchema = new Schema<IAuthDocument>(
{
    displayname:{
        type:Schema.Types.String,
        required:true,
    },
    email:{
        type:Schema.Types.String,
        required:true,
    },
    passwordHash:{
        type:Schema.Types.String
    },
    googleId:{
        type:Schema.Types.String,
    },
    role:{
        type:Schema.Types.String,
        enum:Object.values(UserRole),
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false,
    },
    isNewUser:{
        type:Boolean,
        required:true,
        default:true,
    }
},
{timestamps:true}
)
import { UserRole } from "../../Domain/Types/UserRole";

export interface AuthRequestDTO{
    displayname:string;
    email:string;
    role:UserRole;
    password?:string;
}

export interface AuthResponseDTO{
    id:string;
    displayname:string;
    email:string;
    role:UserRole;
    isNewUser:boolean;
}
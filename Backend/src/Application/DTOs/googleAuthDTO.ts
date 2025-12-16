import { UserRole } from "../../Domain/Types/UserRole";

export interface GoogleAuthRequestDTO{
    token:string;
    role:UserRole;
}
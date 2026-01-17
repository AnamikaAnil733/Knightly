import { AvatarURLtypes } from "../../Types/avatarURLtypes"

export interface IStorageService{
    generateAvatarUploadUrl(key:string,contentType:string):Promise<AvatarURLtypes>
}
import Auth from "../../Domain/Entity/auth";
import { IAuthDocument } from "../../Infrastructure/database/Schema/authSchema";
import { AuthResponseDTO } from "../DTOs/authDTO"


export class AuthMapper{
    static toEntityFromDocument(docu:IAuthDocument):Auth{
        return new Auth({
            id :docu._id ? docu._id.toString().replace(/"/g, "") : undefined,
            email:docu.email,
            displayname:docu.displayname,
            passwordHash:docu.passwordHash,
            googleId:docu.googleId,
            role:docu.role,
            isBlocked:docu.isBlocked,
            isNewUser:docu.isNewUser,
            createdAt:docu.createdAt,
            updatedAt:docu.updatedAt
        })
    }

    static toAuthResponseDTOfromEntity(auth:Auth,token:string):AuthResponseDTO{
            return {
                id:auth.id!,
                displayname:auth.displayname,
                email:auth.email,
                role:auth.role,
                isNewUser:auth.isNewUser,
                accessToken: token, 
                rating: auth.rating,
                gamesPlayed: auth.gamesPlayed,
                gamesWin: auth.gamesWin,
                longestStreak: auth.longestStreak,
                currentStreak: auth.currentStreak,
                rewards: auth.rewards ?? [],        
                achievements: auth.achievements,
                premium: auth.premium ?? false   
            }
            
    }
}
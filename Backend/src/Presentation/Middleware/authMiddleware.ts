import { NextFunction,Request,Response } from "express";
import { UserRole } from "../../Domain/Types/UserRole";
import { ITokenService } from "../../Domain/Interface/service/ITokenService";
import { logger } from "../../Infrastructure/logger/logger";
import { HttpStatusCodes } from "../../Domain/Types/statusCode";
import { MESSAGES } from "../../Domain/Constants/Messages/Messages";


export function authMiddleware(
    allowedRoles:UserRole[],
    tokenService :ITokenService
){
    return function (req:Request,res:Response,next:NextFunction){
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith("Bearer ")){
            const token = authHeader.split(" ")[1];
            try{
                const data = tokenService.verifyAccessToken(token);
                (req as any).user = data
                const role = data.role
                if(!allowedRoles.includes(role)){
             return res
              .status(403)
              .json({success:false,message:MESSAGES.UNAUTHORIZED})
                }else{
                    next()
                }
            }catch(error){
                logger.error("ERROR: Auth Middleware")
                logger.error(error)
                res.status(HttpStatusCodes.UNAUTHORIZED)
                .json({success:false,message:MESSAGES.UNAUTHORIZED})

            }
        }else{
            return res
            .status(HttpStatusCodes.UNAUTHORIZED)
            .json({success:false,message:MESSAGES.UNAUTHORIZED})
        }
    }
}
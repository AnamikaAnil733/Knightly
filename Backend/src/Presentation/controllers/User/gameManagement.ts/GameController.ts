import { Request,Response,NextFunction } from "express";
import { ICreateGameUseCase } from "../../../../Domain/Interface/usecases/user/gameManagement/ICreateGameUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";


export class GameController{
    constructor(
        private readonly _createGameUseCase : ICreateGameUseCase
    ){}

    createGame = async(req:Request,res:Response):Promise<Response>=>{
        try{
            const GameResponse = await this._createGameUseCase.execute()
            console.log(GameResponse)
            return res.status(HttpStatusCodes.CREATED)
            .json({
                success:true,
                data:GameResponse
            })

        }catch(error:any){
            console.error("CreateGame error:", error); 
           return res.status(HttpStatusCodes.BAD_REQUEST)
           .json({
            success:false,
            message:"failed to create Game"
        })
        }
    }

}
import { Request,Response,NextFunction } from "express";
import { ICreateGameUseCase } from "../../../../Domain/Interface/usecases/user/gameManagement/ICreateGameUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { IGetGameUseCase } from "../../../../Domain/Interface/usecases/user/gameManagement/IGetGameUseCase";


export class GameController{
    constructor(
        private readonly _createGameUseCase : ICreateGameUseCase,
        private readonly _getGameUseCase: IGetGameUseCase,
    ){}

    createGame = async(req:Request,res:Response):Promise<Response>=>{
        try{
            const GameResponse = await this._createGameUseCase.execute()
            return res.status(HttpStatusCodes.CREATED)
            .json({
                success:true,
                data:GameResponse
            })

        }catch(error:any){
           return res.status(HttpStatusCodes.BAD_REQUEST)
           .json({
            success:false,
            message:"failed to create Game"
        })
        }
    }

    getGame = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {gameId} = req.params
     
        if(!gameId){
            res.status(HttpStatusCodes.BAD_REQUEST).json({message:"GameId is required"})
            return
        }
        const response = await this._getGameUseCase.execute(gameId)
        res.status(HttpStatusCodes.OK).json(response)

    }catch(error){
        next(error)
    }
    }

}
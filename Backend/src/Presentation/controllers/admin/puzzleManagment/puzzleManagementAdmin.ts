import { Request,Response } from "express";
import { ICreatePuzzleUseCase } from "../../../../Domain/Interface/usecases/admin/PuzzleManagement/ICreatePuzzle";
import  { HttpStatusCodes} from  "../../../../Domain/Types/statusCode"

export class AdminPuzzleController{
    constructor(private readonly _createPuzzleUseCase :ICreatePuzzleUseCase){}

    async createPuzzle(req:Request,res:Response):Promise<Response>{
        try{
            const puzzleResponse = await this._createPuzzleUseCase.execute(req.body)
            return res.status(HttpStatusCodes.CREATED).json({
                success: true,
                data: puzzleResponse,
              });
        }catch(error:any){
           return res.status(HttpStatusCodes.BAD_REQUEST).json({
            success:false,
            message:error.message || "failed to create puzzle"
           })
        }
    }

    
}
import { Request,Response,NextFunction} from "express";
import { ICreatePuzzleUseCase } from "../../../../Domain/Interface/usecases/admin/PuzzleManagement/ICreatePuzzle";
import  { HttpStatusCodes} from  "../../../../Domain/Types/statusCode";
import { IGetAllPuzzleUseCase } from "../../../../Domain/Interface/usecases/admin/PuzzleManagement/IGetAllPuzzlesUseCase";
import { PuzzleType } from "../../../../Domain/Types/PuzzleTypes";

export class AdminPuzzleController{
    constructor(private readonly _createPuzzleUseCase :ICreatePuzzleUseCase,
                private readonly _getAllPuzzleUseCase :IGetAllPuzzleUseCase,
    ){}

 createPuzzle = async(req:Request,res:Response):Promise<Response> =>{
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

    getAllPuzzles = async(req:Request,res:Response,next:NextFunction):Promise<Response|void>=>{
        try{
            const page = Number(req.query.page)||1;
            const limit = Number(req.query.limit)||10;
            const difficulty = req.query.difficulty
            ? (req.query.difficulty as PuzzleType)
            : undefined;

            const result = await this._getAllPuzzleUseCase.execute(
                {page:page,
                limit:limit,
                difficulty:difficulty
                }
            )
            return res.status(HttpStatusCodes.OK).json(result)

        }catch(error){
            next(error)

        }
    }

    
}
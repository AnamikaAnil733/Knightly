import { Request,Response,NextFunction} from "express";
import { ICreatePuzzleUseCase } from "../../../../Domain/Interface/usecases/Admin/PuzzleManagement/ICreatePuzzle";
import { HttpStatusCodes} from  "../../../../Domain/Types/StatusCode";
import { IGetAllPuzzleUseCase } from "../../../../Domain/Interface/usecases/Admin/PuzzleManagement/IGetAllPuzzlesUseCase";
import { PuzzleType } from "../../../../Domain/Types/PuzzleTypes";
import { IEditPuzzleUsecase } from "../../../../Domain/Interface/usecases/Admin/PuzzleManagement/IEditPuzzleUseCase";
import { ISoftDeleteUseCase } from "../../../../Domain/Interface/usecases/Admin/PuzzleManagement/IDeletePuzzleUseCase";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";


export class AdminPuzzleController{
  constructor(
                private readonly _createPuzzleUseCase :ICreatePuzzleUseCase,
                private readonly _getAllPuzzleUseCase :IGetAllPuzzleUseCase,
                private readonly _editPuzzleUseCase   :IEditPuzzleUsecase,
                private readonly _softDeletePuzzleUseCase:ISoftDeleteUseCase,
  ){}

  createPuzzle = async(req:Request,res:Response):Promise<Response> =>{
    try{
      const puzzleResponse = await this._createPuzzleUseCase.execute(req.body);
      return res.status(HttpStatusCodes.CREATED).json({
        success: true,
        data: puzzleResponse,
      });
    }catch(error:any){
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success:false,
        message:error.message || MESSAGES.FAILD_CREATE_PUZZLE,
      });
    }
  };

  getAllPuzzles = async(req:Request,res:Response,next:NextFunction):Promise<Response|void>=>{
    try{
      const page = Number(req.query.page)||1;
      const limit = Number(req.query.limit)||10;
      const difficulty = req.query.difficulty
        ? (req.query.difficulty as PuzzleType)
        : undefined;

      const result = await this._getAllPuzzleUseCase.execute(
        {
          page,
          limit,
          difficulty,
        },
      );
      return res.status(HttpStatusCodes.OK).json(result);

    }catch(error){

      next(error);

    }
  };

  editPuzzles = async(req:Request,res:Response,next:NextFunction):Promise<Response|void>=>{
    try{
      const puzzleId = req.params.id;
      const result = await this._editPuzzleUseCase.execute({
        id:puzzleId,
        ...req.body,
      });

      return res.status(HttpStatusCodes.OK).json(result);


    }catch(error){
      next(error);
    }
  };

  softDeletePuzzle = async (req:Request,res:Response,next:NextFunction):Promise<Response|void>=>{
    try{
      const {id} = req.params;
      await this._softDeletePuzzleUseCase.execute(id);

      return res.status(HttpStatusCodes.OK).json({
        success:true,
        message:MESSAGES.PUZZLE_DELETE_SUCCESS,
      });

    }catch(error){
      next(error);
    }
  };


}

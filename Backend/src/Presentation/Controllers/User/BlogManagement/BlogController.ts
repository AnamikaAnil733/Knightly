import { Request,Response,NextFunction } from "express";
import { ICreateBlogUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/ICreateBlogUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { CreateBlogSchema } from "../../../Validators/BlogValidator";
import { logger } from "../../../../Infrastructure/Logger/Logger";


export class BlogController{
  constructor(
        private readonly _createBlogUseCase:ICreateBlogUseCase,
  ){}

  createBlog = async(req:Request,res:Response,next:NextFunction)=>{
    try{
      const result = CreateBlogSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          result.error.issues[0].message,
        );
      }

      const blog = await this._createBlogUseCase.execute(result.data);
      return res.status(HttpStatusCodes.OK).json({ success: true, blog });

    }catch(error){
      logger.error({ error }, "ERROR: BlogController - createBlog");
      next(error);
    }
  };
}


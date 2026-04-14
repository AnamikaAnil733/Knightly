import { Request,Response,NextFunction } from "express";
import { ICreateBlogUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/ICreateBlogUseCase";
import { IModerateBlogUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IModerateBlogUseCase";
import { IAdminGetAllBlogsUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IAdminGetAllBlogsUseCase";
import { IGetAllBlogsUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetAllBlogsUseCase";
import { IGetBlogBySlugUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetBlogBySlugUseCase";
import { IGetCoverUploadUrlUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetCoverUploadUrlUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { BlogStatus } from "../../../../Domain/Types/Blogtypes";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { CreateBlogSchema, BlogModerationSchema } from "../../../Validators/BlogValidator";
import { logger } from "../../../../Infrastructure/Logger/Logger";


export class BlogController{
  constructor(
    private readonly _createBlogUseCase: ICreateBlogUseCase,
    private readonly _moderateBlogUseCase: IModerateBlogUseCase,
    private readonly _adminGetAllBlogsUseCase: IAdminGetAllBlogsUseCase,
    private readonly _getAllBlogsUseCase: IGetAllBlogsUseCase,
    private readonly _getBlogBySlugUseCase: IGetBlogBySlugUseCase,
    private readonly _getCoverUploadUrlUseCase: IGetCoverUploadUrlUseCase,
  ) {}

  getCoverUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { contentType } = req.body;

      if (!contentType) {
        throw new CustomError(HttpStatusCodes.BAD_REQUEST, "Content-Type is required");
      }

      const result = await this._getCoverUploadUrlUseCase.execute({
        userId,
        contentType,
      });

      return res.status(HttpStatusCodes.OK).json({ success: true, ...result });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - getCoverUploadUrl");
      next(error);
    }
  };

  createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = CreateBlogSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          result.error.issues[0].message,
        );
      }

      const blog = await this._createBlogUseCase.execute(result.data);
      return res.status(HttpStatusCodes.OK).json({ success: true, blog });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - createBlog");
      next(error);
    }
  };

  /** Admin moderate blog (Approve/Reject) */
  moderateBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = BlogModerationSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          result.error.issues[0].message,
        );
      }

      const blog = await this._moderateBlogUseCase.execute(result.data as any);
      return res.status(HttpStatusCodes.OK).json({ success: true, blog });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - moderateBlog");
      next(error);
    }
  };

  /** Admin fetch all blogs with status filter */
  adminGetAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, page, limit } = req.query;

      const filters = {
        status: status as BlogStatus,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const result = await this._adminGetAllBlogsUseCase.execute(filters);
      return res.status(HttpStatusCodes.OK).json({
        success: true,
        blogs: result.blogs,
        total: result.total,
      });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - adminGetAllBlogs");
      next(error);
    }
  };

  /** Increment view count */
  incrementView = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      return res.status(HttpStatusCodes.OK).json({ success: true });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - incrementView");
      next(error);
    }
  };

  /** User fetch all published blogs */
  getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, page, limit } = req.query;

      const filters = {
        category: category as any,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const result = await this._getAllBlogsUseCase.execute(filters);
      return res.status(HttpStatusCodes.OK).json({
        success: true,
        blogs: result.blogs,
        total: result.total,
      });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - getAllBlogs");
      next(error);
    }
  };

  /** User fetch single blog by slug */
  getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const blog = await this._getBlogBySlugUseCase.execute(slug);
      return res.status(HttpStatusCodes.OK).json({ success: true, blog });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - getBlogBySlug");
      next(error);
    }
  };
}


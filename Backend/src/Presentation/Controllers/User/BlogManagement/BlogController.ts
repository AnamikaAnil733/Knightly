import { Request,Response,NextFunction } from "express";
import { ICreateBlogUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/ICreateBlogUseCase";
import { IModerateBlogUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IModerateBlogUseCase";
import { IAdminGetAllBlogsUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IAdminGetAllBlogsUseCase";
import { IGetAllBlogsUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetAllBlogsUseCase";
import { IGetBlogBySlugUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetBlogBySlugUseCase";
import { IGetCoverUploadUrlUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetCoverUploadUrlUseCase";
import { IGetUserBlogsUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetUserBlogsUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { BlogStatus, BlogAuthorRole } from "../../../../Domain/Types/Blogtypes";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { CreateBlogSchema, UpdateBlogSchema, BlogModerationSchema } from "../../../Validators/BlogValidator";
import { IUpdateBlogUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IUpdateBlogUseCase";
import { IDeleteBlogUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IDeleteBlogUseCase";
import { IGetBlogByIdUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetBlogByIdUseCase";
import { IAdminGetBlogByIdUseCase } from "../../../../Domain/Interface/Usecases/Admin/BlogManagement/IAdminGetBlogByIdUseCase";
import { IToggleLikeUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IToggleLikeUseCase";
import { IAddCommentUseCase, IGetBlogCommentsUseCase, IDeleteCommentUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/ICommentUseCases";
import { IUserRepository } from "../../../../Domain/Interface/Repositories/IUserRepository";
import { logger } from "../../../../Infrastructure/Logger/Logger";


export class BlogController{
  constructor(
    private readonly _createBlogUseCase: ICreateBlogUseCase,
    private readonly _moderateBlogUseCase: IModerateBlogUseCase,
    private readonly _adminGetAllBlogsUseCase: IAdminGetAllBlogsUseCase,
    private readonly _getAllBlogsUseCase: IGetAllBlogsUseCase,
    private readonly _getBlogBySlugUseCase: IGetBlogBySlugUseCase,
    private readonly _getCoverUploadUrlUseCase: IGetCoverUploadUrlUseCase,
    private readonly _getUserBlogsUseCase: IGetUserBlogsUseCase,
    private readonly _updateBlogUseCase: IUpdateBlogUseCase,
    private readonly _deleteBlogUseCase: IDeleteBlogUseCase,
    private readonly _getBlogByIdUseCase: IGetBlogByIdUseCase,
    private readonly _adminGetBlogByIdUseCase: IAdminGetBlogByIdUseCase,
    private readonly _toggleLikeUseCase: IToggleLikeUseCase,
    private readonly _addCommentUseCase: IAddCommentUseCase,
    private readonly _getBlogCommentsUseCase: IGetBlogCommentsUseCase,
    private readonly _deleteCommentUseCase: IDeleteCommentUseCase,
    private readonly _userRepository: IUserRepository,
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
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      console.log(userRole,userId);

      const user = await this._userRepository.findById(userId);
      if (!user) {
        throw new CustomError(HttpStatusCodes.NOT_FOUND, "User not found");
      }

      const inputData = {
        ...req.body,
        authorId: userId,
        authorRole: userRole === "admin" ? BlogAuthorRole.ADMIN : BlogAuthorRole.USER,
        authorName: user.displayname,
      };

      const result = CreateBlogSchema.safeParse(inputData);
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
      const { status, page, limit, search } = req.query;

      const filters = {
        status: status as BlogStatus,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
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
      const { category, page, limit, search } = req.query;

      const filters = {
        category: category as any,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
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

  /** User fetch their own blogs */
  getUserBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = (req as any).user.id;
      const { category, status, page, limit, search } = req.query;

      const filters = {
        authorId,
        category: category as any,
        status: status as any,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
      };

      const result = await this._getUserBlogsUseCase.execute(filters);
      return res.status(HttpStatusCodes.OK).json({
        success: true,
        blogs: result.blogs,
        total: result.total,
        stats: result.stats,
      });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - getUserBlogs");
      next(error);
    }
  };

  updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const result = UpdateBlogSchema.safeParse({ ...req.body, id });

      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          result.error.issues[0].message,
        );
      }

      const blog = await this._updateBlogUseCase.execute(result.data, userId);
      return res.status(HttpStatusCodes.OK).json({ success: true, blog });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - updateBlog");
      next(error);
    }
  };

  deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const success = await this._deleteBlogUseCase.execute(id, userId);
      return res.status(HttpStatusCodes.OK).json({ success });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - deleteBlog");
      next(error);
    }
  };

  getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const blog = await this._getBlogByIdUseCase.execute(id, userId);
      return res.status(HttpStatusCodes.OK).json({ success: true, blog });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - getBlogById");
      next(error);
    }
  };

  adminGetBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const blog = await this._adminGetBlogByIdUseCase.execute(id);
      return res.status(HttpStatusCodes.OK).json({ success: true, blog });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - adminGetBlogById");
      next(error);
    }
  };

  toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const blog = await this._toggleLikeUseCase.execute(id, userId);
      return res.status(HttpStatusCodes.OK).json({ success: true, blog });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - toggleLike");
      next(error);
    }
  };

  addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { blogId, content, authorName, authorAvatar } = req.body;
      const comment = await this._addCommentUseCase.execute({
        blogId,
        content,
        authorId: userId,
        authorName,
        authorAvatar,
      });
      return res.status(HttpStatusCodes.OK).json({ success: true, comment });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - addComment");
      next(error);
    }
  };

  getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const comments = await this._getBlogCommentsUseCase.execute(blogId);
      return res.status(HttpStatusCodes.OK).json({ success: true, comments });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - getComments");
      next(error);
    }
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { commentId } = req.params;
      const success = await this._deleteCommentUseCase.execute(commentId, userId);
      return res.status(HttpStatusCodes.OK).json({ success });
    } catch (error) {
      logger.error({ error }, "ERROR: BlogController - deleteComment");
      next(error);
    }
  };
}


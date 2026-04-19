import { BlogRepository } from "../Repository/BlogRepository";
import { CreateBlogUseCase } from "../../Application/UseCases/User/BlogManagement/CreateBlogUseCase";
import { BlogController } from "../../Presentation/Controllers/User/BlogManagement/BlogController";
import { ModerateBlogUseCase } from "../../Application/UseCases/Admin/BlogManagement/ModerateBlogUseCase";
import { AdminGetAllBlogsUseCase } from "../../Application/UseCases/Admin/BlogManagement/AdminGetAllBlogsUseCase";
import { AdminGetBlogByIdUseCase } from "../../Application/UseCases/Admin/BlogManagement/AdminGetBlogByIdUseCase";
import { GetAllBlogsUseCase } from "../../Application/UseCases/User/BlogManagement/GetAllBlogsUseCase";
import { GetBlogBySlugUseCase } from "../../Application/UseCases/User/BlogManagement/GetBlogBySlugUseCase";
import { GetCoverUploadUrlUseCase } from "../../Application/UseCases/User/BlogManagement/GetCoverUploadUrlUseCase";
import { GetUserBlogsUseCase } from "../../Application/UseCases/User/BlogManagement/GetUserBlogsUseCase";
import { UpdateBlogUseCase } from "../../Application/UseCases/User/BlogManagement/UpdateBlogUseCase";
import { DeleteBlogUseCase } from "../../Application/UseCases/User/BlogManagement/DeleteBlogUseCase";
import { GetBlogByIdUseCase } from "../../Application/UseCases/User/BlogManagement/GetBlogByIdUseCase";
import { ToggleLikeUseCase } from "../../Application/UseCases/User/BlogManagement/ToggleLikeUseCase";
import { AddCommentUseCase, GetBlogCommentsUseCase, DeleteCommentUseCase } from "../../Application/UseCases/User/BlogManagement/CommentUseCases";
import { CommentRepository } from "../Repository/CommentRepository";
import { AuthRepository } from "../Repository/AuthRepository";
import { S3StorageService } from "../Services/S3Service";
import { MediaService } from "../Services/MediaService";

const blogRepository = new BlogRepository();
const commentRepository = new CommentRepository();
const userRepository = new AuthRepository();
const s3Service = new S3StorageService();
const mediaService = new MediaService(s3Service);

const createBlogUseCase = new CreateBlogUseCase(blogRepository);
const moderateBlogUseCase = new ModerateBlogUseCase(blogRepository);
const adminGetAllBlogsUseCase = new AdminGetAllBlogsUseCase(blogRepository, mediaService);
const adminGetBlogByIdUseCase = new AdminGetBlogByIdUseCase(blogRepository, mediaService);
const getAllBlogsUseCase = new GetAllBlogsUseCase(blogRepository, mediaService);
const getBlogBySlugUseCase = new GetBlogBySlugUseCase(blogRepository, mediaService);
const getCoverUploadUrlUseCase = new GetCoverUploadUrlUseCase(s3Service);
const getUserBlogsUseCase = new GetUserBlogsUseCase(blogRepository, mediaService);
const updateBlogUseCase = new UpdateBlogUseCase(blogRepository);
const deleteBlogUseCase = new DeleteBlogUseCase(blogRepository);
const getBlogByIdUseCase = new GetBlogByIdUseCase(blogRepository, mediaService);
const toggleLikeUseCase = new ToggleLikeUseCase(blogRepository);
const addCommentUseCase = new AddCommentUseCase(commentRepository);
const getBlogCommentsUseCase = new GetBlogCommentsUseCase(commentRepository);
const deleteCommentUseCase = new DeleteCommentUseCase(commentRepository);

export const blogController = new BlogController(
  createBlogUseCase,
  moderateBlogUseCase,
  adminGetAllBlogsUseCase,
  getAllBlogsUseCase,
  getBlogBySlugUseCase,
  getCoverUploadUrlUseCase,
  getUserBlogsUseCase,
  updateBlogUseCase,
  deleteBlogUseCase,
  getBlogByIdUseCase,
  adminGetBlogByIdUseCase,
  toggleLikeUseCase,
  addCommentUseCase,
  getBlogCommentsUseCase,
  deleteCommentUseCase,
  userRepository,
);

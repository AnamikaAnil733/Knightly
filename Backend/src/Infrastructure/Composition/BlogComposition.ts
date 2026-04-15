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
import { S3StorageService } from "../Services/S3Service";

const blogRepository = new BlogRepository();
const s3Service = new S3StorageService();

const createBlogUseCase = new CreateBlogUseCase(blogRepository);
const moderateBlogUseCase = new ModerateBlogUseCase(blogRepository);
const adminGetAllBlogsUseCase = new AdminGetAllBlogsUseCase(blogRepository, s3Service);
const adminGetBlogByIdUseCase = new AdminGetBlogByIdUseCase(blogRepository, s3Service);
const getAllBlogsUseCase = new GetAllBlogsUseCase(blogRepository, s3Service);
const getBlogBySlugUseCase = new GetBlogBySlugUseCase(blogRepository, s3Service);
const getCoverUploadUrlUseCase = new GetCoverUploadUrlUseCase(s3Service);
const getUserBlogsUseCase = new GetUserBlogsUseCase(blogRepository, s3Service);
const updateBlogUseCase = new UpdateBlogUseCase(blogRepository);
const deleteBlogUseCase = new DeleteBlogUseCase(blogRepository);
const getBlogByIdUseCase = new GetBlogByIdUseCase(blogRepository, s3Service);

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
);

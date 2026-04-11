import { BlogRepository } from "../Repository/BlogRepository";
import { CreateBlogUseCase } from "../../Application/UseCases/User/BlogManagement/CreateBlogUseCase";
import { BlogController } from "../../Presentation/Controllers/User/BlogManagement/BlogController";
import { ModerateBlogUseCase } from "../../Application/UseCases/Admin/BlogManagement/ModerateBlogUseCase";
import { AdminGetAllBlogsUseCase } from "../../Application/UseCases/Admin/BlogManagement/AdminGetAllBlogsUseCase";

const blogRepository = new BlogRepository();

const createBlogUseCase = new CreateBlogUseCase(blogRepository);
const moderateBlogUseCase = new ModerateBlogUseCase(blogRepository);
const adminGetAllBlogsUseCase = new AdminGetAllBlogsUseCase(blogRepository);

export const blogController = new BlogController(
  createBlogUseCase,
  moderateBlogUseCase,
  adminGetAllBlogsUseCase,
);

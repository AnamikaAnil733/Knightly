import { BlogRepository } from "../Repository/BlogRepository";
import { CreateBlogUseCase } from "../../Application/UseCases/User/BlogManagement/CreateBlogUseCase";
import { BlogController } from "../../Presentation/Controllers/User/BlogManagement/BlogController";



const blogRepository = new BlogRepository();

const createBlogUseCase = new CreateBlogUseCase(blogRepository);

export const blogController = new BlogController(
  createBlogUseCase,
);

import { AxiosError } from "axios";
import userApi from "./Axios/Useraxios";
import adminApi from "./Axios/Adminaxios";
import {
  BlogResponseDTO,
  CreateBlogInputDTO,
  UpdateBlogInputDTO,
  ModerationInputDTO,
  BlogListResponseDTO,
  BlogCategory,
  BlogStatus,
} from "../../Types/BlogTypes";

/** Fetch all published blogs with optional filters and pagination. */
export const getAllBlogs = async (filters?: {
  category?: BlogCategory;
  status?: BlogStatus;
  authorId?: string;
  page?: number;
  limit?: number;
}): Promise<BlogListResponseDTO> => {
  try {
    const response = await userApi.get<BlogListResponseDTO>("/blogs", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Failed to fetch blogs");
    }
    throw error;
  }
};

/** Fetch a single blog by its slug. */
export const getBlogBySlug = async (slug: string): Promise<BlogResponseDTO> => {
  try {
    const response = await userApi.get<BlogResponseDTO>(`/blog/${slug}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Failed to fetch blog post");
    }
    throw error;
  }
};

/** Create a new blog post. */
export const createBlog = async (
  data: CreateBlogInputDTO,
): Promise<BlogResponseDTO> => {
  try {
    const response = await userApi.post<BlogResponseDTO>("/user/blog", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Failed to create blog");
    }
    throw error;
  }
};

/** Update an existing blog. */
export const updateBlog = async (
  data: UpdateBlogInputDTO,
): Promise<BlogResponseDTO> => {
  try {
    const response = await userApi.patch<BlogResponseDTO>(
      `/blog/${data.id}`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Failed to update blog");
    }
    throw error;
  }
};

/** Increment view count for a blog. */
export const incrementView = async (id: string): Promise<void> => {
  try {
    await userApi.post(`/blog/${id}/view`);
  } catch (error) {
    // Silently fail for view increment as it's not critical
    console.error("Failed to increment view count", error);
  }
};

/** Moderate a blog (Approve/Reject). */
export const moderateBlog = async (
  data: ModerationInputDTO,
): Promise<BlogResponseDTO> => {
  try {
    const response = await adminApi.patch<BlogResponseDTO>(
      `/admin/blogs/moderate`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Moderation failed");
    }
    throw error;
  }
};

/** Admin fetch for all blogs (including drafts and rejected). */
export const adminGetAllBlogs = async (filters?: {
  status?: BlogStatus;
  page?: number;
  limit?: number;
}): Promise<BlogListResponseDTO> => {
  try {
    const response = await adminApi.get<BlogListResponseDTO>("/admin/blogs", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Failed to fetch blogs for admin");
    }
    throw error;
  }
};

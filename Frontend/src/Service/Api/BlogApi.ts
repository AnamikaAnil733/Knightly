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

/** Fetch signed S3 URL for blog cover upload. */
export const getBlogCoverUploadUrl = async (
  contentType: string,
): Promise<{ uploadUrl: string; key: string }> => {
  try {
    const response = await userApi.post<{
      success: boolean;
      uploadUrl: string;
      key: string;
    }>("/user/blog/upload-url", { contentType });
    return { uploadUrl: response.data.uploadUrl, key: response.data.key };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message || "Failed to get upload URL",
      );
    }
    throw error;
  }
};

/** Fetch all published blogs with optional filters and pagination. */
export const getAllBlogs = async (filters?: {
  category?: BlogCategory;
  status?: BlogStatus;
  authorId?: string;
  page?: number;
  limit?: number;
}): Promise<BlogListResponseDTO> => {
  try {
    const response = await userApi.get<BlogListResponseDTO>("/user/blogs", {
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
    const response = await userApi.get<{ blog: BlogResponseDTO }>(
      `/user/blog/${slug}`,
    );
    return response.data.blog;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message || "Failed to fetch blog post",
      );
    }
    throw error;
  }
};

/** Create a new blog post. */
export const createBlog = async (
  data: CreateBlogInputDTO,
): Promise<BlogResponseDTO> => {
  try {
    const response = await userApi.post<{ blog: BlogResponseDTO }>(
      "/user/blog",
      data,
    );
    return response.data.blog;
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
    const response = await userApi.patch<{ blog: BlogResponseDTO }>(
      `/user/blog/${data.id}`,
      data,
    );
    return response.data.blog;
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
    await userApi.post(`/user/blog/${id}/view`);
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
    const response = await adminApi.patch<{ blog: BlogResponseDTO }>(
      `/admin/blogs/moderate`,
      data,
    );
    return response.data.blog;
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
      throw new Error(
        error.response?.data.message || "Failed to fetch blogs for admin",
      );
    }
    throw error;
  }
};

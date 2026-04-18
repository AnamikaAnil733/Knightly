import { z } from "zod";

export const BlockUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const GetAllUsersSchema = z.object({
  page: z.preprocess((val) => Number(val) || 1, z.number().min(1)),
  limit: z.preprocess((val) => Number(val) || 10, z.number().min(1)),
  search: z.string().optional().default(""),
  filter: z.enum(["ALL", "BLOCKED", "UNBLOCKED", "PREMIUM"]).optional().default("ALL"),
});

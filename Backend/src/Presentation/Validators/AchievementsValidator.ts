import { z } from "zod";

export const CreateAchievementSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(50),
    description: z.string().min(10, "Description must be at least 10 characters").max(200),
    icon: z.string().optional().default("Trophy"),
    criteriaType: z.enum(['GAMES_WON', 'GAMES_PLAYED', 'PUZZLES_SOLVED', 'STREAK_DAYS']),
    criteriaValue: z.number().int().positive("Criteria value must be a positive number"),
});

import { z } from "zod";

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      "New password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character",
    ),
});

export const UpdateProfileSchema = z.object({
  displayname: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters"),
});

export const CreateGameSchema = z.object({
  timeControl: z.string().min(1, "Time control is required"),
});

export const GetGameSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
});

export const LegalMoveSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
  row: z.preprocess((val) => Number(val), z.number().min(0).max(7)),
  col: z.preprocess((val) => Number(val), z.number().min(0).max(7)),
});

export const MakeMoveSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
  from: z.object({
    row: z.number().min(0).max(7),
    col: z.number().min(0).max(7),
  }),
  to: z.object({
    row: z.number().min(0).max(7),
    col: z.number().min(0).max(7),
  }),
  promotionType: z.enum(["QUEEN", "ROOK", "BISHOP", "KNIGHT"]).optional(),
});

export const ReviewGameSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
});

export const AvatarQuerySchema = z.object({
  contentType: z.string().min(1, "Content type is required"),
});

export const DiceBearAvatarSchema = z.object({
  diceBearUrl: z.string().url("Invalid DiceBear URL"),
});

export const GetPuzzleSchema = z.object({
  difficulty: z.string().min(1, "Difficulty is required"),
});

export const ValidatePuzzleMoveSchema = z.object({
  puzzleId: z.string().min(1, "Puzzle ID is required"),
  move: z.string().min(1, "Move is required"),
  moveIndex: z.number().min(0, "Move index must be non-negative"),
});

export const USER_ROUTES = {
  EDIT_PROFILE: "/edit-profile",
  CHANGE_PASSWORD: "/change-password",

  AVATAR: {
    UPLOAD: "/avatar/upload-avatar",
    DICEBEAR: "/avatar/dicebear",
  },

  PROFILE: "/profile",

  CREATE_GAME: "/create-game",
  GET_GAME: "/games/:gameId",
  LEGAL_MOVES: "/games/:gameId/legal-moves",
  MAKE_MOVE: "/games/:gameId/move",

  GET_PUZZLE_BY_DIFFICULTY: "/puzzles/difficulty/:difficulty",
  VALIDATE_PUZZLE_MOVE: "/puzzles/:puzzleId/validate",
} as const;

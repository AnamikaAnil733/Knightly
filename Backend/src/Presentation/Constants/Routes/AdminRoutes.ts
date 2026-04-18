export const ADMIN_ROUTES = {
  USERS: "/users",

  BAN_USER: "/users/ban/:userId",
  UNBAN_USER: "/users/unban/:userId",

  CREATEPUZZLES: "/create-puzzles",
  PUZZLES:"/puzzles",
  EDITPUZZLE:"/edit-puzzle/:id",
  DELETEPUZZLE:"/delete-puzzle/:id",
  SYNC_LICHESS_PUZZLE: "/sync-lichess-puzzle",
  GENERATE_AI_PUZZLES: "/generate-ai-puzzles",
  GENERATE_PUZZLE_FROM_GAME: "/generate-puzzle-from-game/:gameId",

  BLOGS: "/blogs",
  GET_BLOG_BY_ID: "/blogs/:id",
  MODERATE_BLOG: "/blogs/moderate",
  SUBSCRIPTION_STATS: "/subscriptions/stats",
  TRANSACTIONS: "/transactions",
  LIVE_GAMES: "/live-games",
  GET_ANALYTICS: "/analytics",
  SYSTEM_SETTINGS: "/settings",
} as const;

export const ADMIN_ROUTES = {
  USERS: "/users",

  BAN_USER: "/users/ban/:userId",
  UNBAN_USER: "/users/unban/:userId",

  CREATEPUZZLES: "/create-puzzles",
  PUZZLES:"/puzzles",
  EDITPUZZLE:"/edit-puzzle/:id",
  DELETEPUZZLE:"/delete-puzzle/:id",
} as const;

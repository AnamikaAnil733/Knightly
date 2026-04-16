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
  LEGAL_MOVES:"/games/:gameId/legal-moves",
  MAKE_MOVE:"/games/:gameId/move",
  REVIEW_GAME: "/games/:gameId/review",
  GET_GAME_HISTORY: "/games/history",
  GET_LIVE_GAMES: "/games/live",

  GET_PUZZLE_BY_DIFFICULTY: "/puzzles/difficulty/:difficulty",
  VALIDATE_PUZZLE_MOVE: "/puzzles/:puzzleId/validate",

  LEADERBOARD: "/leaderboard/:type",

  FRIENDS: {
    SEND_REQUEST: "/friends/request",
    ACCEPT_REQUEST: "/friends/accept",
    REJECT_REQUEST: "/friends/reject",
    UNFRIEND: "/friends/unfriend",
    BLOCK: "/friends/block",
    UNBLOCK: "/friends/unblock",
    LIST: "/friends",
    SEARCH: "/friends/search",
    PENDING_REQUESTS: "/friends/pending",
  },

  BLOGS: "/blogs",
  BLOG_DETAIL: "/blog/:slug",
  BLOG:"/blog",
  BLOG_UPLOADURL:"/blog/upload-url",
  BLOG_VIEW:"/blog/:id/view",
  MY_BLOGS:"/my-blogs",
  UPDATE_BLOG:"/blog/:id",
  DELETE_BLOG:"/blog/:id",
  BLOG_BY_ID: "/blog/id/:id",
  BLOG_TOGGLE_LIKE: "/blog/:id/like",
  BLOG_COMMENTS: "/blog/:blogId/comments",
  BLOG_DELETE_COMMENT: "/blog/comment/:commentId",

  LEARN:"/learn",
  LEARN_ID:"/learn/:id",
} as const;

export interface CommentDTO {
  id: string;
  blogId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddCommentInputDTO {
  blogId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
}

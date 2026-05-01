import { BaseEntity } from "./BaseEntity";

export class CommentEntity extends BaseEntity {
  private _blogId: string;
  private _authorId: string;
  private _authorName: string;
  private _authorAvatar?: string;
  private _content: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id?: string;
    blogId: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(params.id);
    this._blogId = params.blogId;
    this._authorId = params.authorId;
    this._authorName = params.authorName;
    this._authorAvatar = params.authorAvatar;
    this._content = params.content;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }

  get blogId(): string { return this._blogId; }
  get authorId(): string { return this._authorId; }
  get authorName(): string { return this._authorName; }
  get authorAvatar(): string | undefined { return this._authorAvatar; }
  get content(): string { return this._content; }
}

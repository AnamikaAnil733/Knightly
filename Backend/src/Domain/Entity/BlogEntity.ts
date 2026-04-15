import { BlogCategory, BlogStatus, BlogAuthorRole } from "../Types/Blogtypes";

export default class BlogEntity {
  private _id?: string;
  private _title: string;
  private _slug: string;
  private _coverImage?: string;
  private _excerpt: string;
  private _content: string;
  private _tags: string[];
  private _category: BlogCategory;
  private _status: BlogStatus;
  private _authorId: string;
  private _authorRole: BlogAuthorRole;
  private _viewCount: number;
  private _likes: string[];
  private _rejectionReason?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: {
    id?: string;
    title: string;
    slug: string;
    coverImage?: string;
    excerpt: string;
    content: string;
    tags?: string[];
    category: BlogCategory;
    status?: BlogStatus;
    authorId: string;
    authorRole: BlogAuthorRole;
    viewCount?: number;
    likes?: string[];
    rejectionReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = params.id;
    this._title = params.title;
    this._slug = params.slug;
    this._coverImage = params.coverImage;
    this._excerpt = params.excerpt;
    this._content = params.content;
    this._tags = params.tags ?? [];
    this._category = params.category;
    this._status = params.status ?? BlogStatus.DRAFT;
    this._authorId = params.authorId;
    this._authorRole = params.authorRole;
    this._viewCount = params.viewCount ?? 0;
    this._likes = params.likes ?? [];
    this._rejectionReason = params.rejectionReason;
    this._createdAt = params.createdAt ?? new Date();
    this._updatedAt = params.updatedAt ?? new Date();
  }

  // ── Getters ──
  get id()               { return this._id; }
  get title()            { return this._title; }
  get slug()             { return this._slug; }
  get coverImage()       { return this._coverImage; }
  get excerpt()          { return this._excerpt; }
  get content()          { return this._content; }
  get tags()             { return this._tags; }
  get category()         { return this._category; }
  get status()           { return this._status; }
  get authorId()         { return this._authorId; }
  get authorRole()       { return this._authorRole; }
  get viewCount()        { return this._viewCount; }
  get likes()            { return this._likes; }
  get rejectionReason()  { return this._rejectionReason; }
  get createdAt()        { return this._createdAt; }
  get updatedAt()        { return this._updatedAt; }



  /** Update editable fields (only while DRAFT). */
  update(params: {
    title?: string;
    slug?: string;
    coverImage?: string;
    excerpt?: string;
    content?: string;
    tags?: string[];
    category?: BlogCategory;
  }) {
    if (params.title       !== undefined) this._title       = params.title;
    if (params.slug        !== undefined) this._slug        = params.slug;
    if (params.coverImage  !== undefined) this._coverImage  = params.coverImage;
    if (params.excerpt     !== undefined) this._excerpt     = params.excerpt;
    if (params.content     !== undefined) this._content     = params.content;
    if (params.tags        !== undefined) this._tags        = params.tags;
    if (params.category    !== undefined) this._category    = params.category;
    this._updatedAt = new Date();
  }

  /** Admin approves the post → PUBLISHED. */
  publish() {
    this._status          = BlogStatus.PUBLISHED;
    this._rejectionReason = undefined;
    this._updatedAt       = new Date();
  }

  /** Admin rejects the post → REJECTED with optional reason. */
  reject(reason?: string) {
    this._status          = BlogStatus.REJECTED;
    this._rejectionReason = reason;
    this._updatedAt       = new Date();
  }

  /** Increment view counter (called on every public read). */
  incrementView() {
    this._viewCount++;
  }

  /** Toggles a user ID in the likes array. */
  toggleLike(userId: string) {
    const index = this._likes.indexOf(userId);
    if (index === -1) {
      this._likes.push(userId);
    } else {
      this._likes.splice(index, 1);
    }
    this._updatedAt = new Date();
  }

  /** Returns true when the post is still editable by its author. */
  isEditable(): boolean {
    return this._status === BlogStatus.DRAFT;
  }

  /** Returns true when the post belongs to the given userId. */
  isOwnedBy(userId: string): boolean {
    return this._authorId === userId;
  }
}

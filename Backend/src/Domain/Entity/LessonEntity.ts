import { LessonCategory, LessonDifficulty } from "../Types/LessonTypes";

export default class LessonEntity {
  private _id?: string;
  private _title: string;
  private _category: LessonCategory;
  private _difficulty: LessonDifficulty;
  private _content: string;
  private _order: number;
  private _isPremium: boolean;
  private _fen?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: {
    id?: string;
    title: string;
    category: LessonCategory;
    difficulty: LessonDifficulty;
    content: string;
    order: number;
    isPremium?: boolean;
    fen?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = params.id;
    this._title = params.title;
    this._category = params.category;
    this._difficulty = params.difficulty;
    this._content = params.content;
    this._order = params.order;
    this._isPremium = params.isPremium ?? false;
    this._fen = params.fen;
    this._createdAt = params.createdAt ?? new Date();
    this._updatedAt = params.updatedAt ?? new Date();
  }

  get id() { return this._id; }
  get title() { return this._title; }
  get category() { return this._category; }
  get difficulty() { return this._difficulty; }
  get content() { return this._content; }
  get order() { return this._order; }
  get isPremium() { return this._isPremium; }
  get fen() { return this._fen; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }

  update(params: {
    title?: string;
    category?: LessonCategory;
    difficulty?: LessonDifficulty;
    content?: string;
    order?: number;
    isPremium?: boolean;
    fen?: string;
  }) {
    if (params.title !== undefined) this._title = params.title;
    if (params.category !== undefined) this._category = params.category;
    if (params.difficulty !== undefined) this._difficulty = params.difficulty;
    if (params.content !== undefined) this._content = params.content;
    if (params.order !== undefined) this._order = params.order;
    if (params.isPremium !== undefined) this._isPremium = params.isPremium;
    if (params.fen !== undefined) this._fen = params.fen;
    this._updatedAt = new Date();
  }
}

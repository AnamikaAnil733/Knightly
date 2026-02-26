import { UserRole } from "../Types/UserRole";
import { UserRating } from "./RatingEntity";

export default class EAuth {
  private _id?: string;
  private _displayname: string;
  private _email: string;
  private _passwordHash?: string;
  private _googleId?: string;
  private _role: UserRole;
  private _isNewUser: boolean;
  private _isBlocked: boolean;

  // Additional player profile fields
  private _gamesPlayed: number;
  private _gamesWin: number;
  private _rating: UserRating;
  private _premium: boolean;
  private _longestStreak: number;
  private _currentStreak: number;
  private _rewards: string[];
  private _achievements: string[];
  private _subscriptionStart?: Date;

  private _createdAt: Date;
  private _updatedAt: Date;

  //Avatar
  private _avatarUrl: string | null;
  private _avatarSeed!: string;
  private _avatarStyle!: string;
  private _avatarKey?: string;

  constructor(params: {
    id?: string;
    displayname: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
    role: UserRole;
    isBlocked?: boolean;
    isNewUser?: boolean;

    gamesPlayed?: number;
    gamesWin?: number;
    rating?: UserRating;
    premium?: boolean;
    longestStreak?: number;
    currentStreak?: number;
    rewards?: string[];
    achievements?: string[];
    subscriptionStart?: Date;

    avatarUrl?: string | null;
    avatarSeed?: string;
    avatarStyle?: string;
    avatarKey?: string;

    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = params.id;
    this._displayname = params.displayname;
    this._email = params.email;

    if (params.passwordHash) this._passwordHash = params.passwordHash;
    if (params.googleId) this._googleId = params.googleId;

    this._role = params.role;
    this._isBlocked = params.isBlocked ?? false;
    this._isNewUser = params.isNewUser ?? true;

    // default profile values
    this._gamesPlayed = params.gamesPlayed ?? 0;
    this._gamesWin = params.gamesWin ?? 0;
    this._rating = params.rating ?? new UserRating();
    this._premium = params.premium ?? false;
    this._longestStreak = params.longestStreak ?? 0;
    this._currentStreak = params.currentStreak ?? 0;
    this._rewards = params.rewards ?? [];
    this._achievements = params.achievements ?? [];
    this._subscriptionStart = params.subscriptionStart;

    this._avatarUrl = params.avatarUrl ?? null;
    this._avatarSeed = params.avatarSeed ?? params.id ?? params.email;
    this._avatarStyle = params.avatarStyle ?? "bottts";
    this._avatarKey = params.avatarKey;

    this._createdAt = params.createdAt ?? new Date();
    this._updatedAt = params.updatedAt ?? new Date();
  }

  // GETTERS
  get id(): string | undefined {
    return this._id;
  }
  get displayname(): string {
    return this._displayname;
  }
  get email(): string {
    return this._email;
  }
  get passwordHash(): string | undefined {
    return this._passwordHash;
  }
  get googleId(): string | undefined {
    return this._googleId;
  }
  get role(): UserRole {
    return this._role;
  }
  get isBlocked(): boolean {
    return this._isBlocked;
  }
  get isNewUser(): boolean {
    return this._isNewUser;
  }

  get gamesPlayed(): number {
    return this._gamesPlayed;
  }
  get gamesWin(): number {
    return this._gamesWin;
  }
  get rating(): UserRating {
    return this._rating;
  }
  get premium(): boolean {
    return this._premium;
  }
  get longestStreak(): number {
    return this._longestStreak;
  }
  get currentStreak(): number {
    return this._currentStreak;
  }
  get rewards(): string[] {
    return this._rewards;
  }
  get achievements(): string[] {
    return this._achievements;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  get subscriptionStart(): Date | undefined {
    return this._subscriptionStart;
  }

  get avatarUrl(): string | null {
    return this._avatarUrl;
  }
  get avatarSeed(): string {
    return this._avatarSeed;
  }
  get avatarStyle(): string {
    return this._avatarStyle;
  }
  get avatarKey(): string | undefined {
    return this._avatarKey;
  }

  // SETTERS
  set passwordHash(passwordHash: string) {
    this._passwordHash = passwordHash;
  }
  set isNewUser(isNewUser: boolean) {
    this._isNewUser = isNewUser;
  }
  set displayname(displayname: string) {
    this._displayname = displayname;
  }

  set avatarUrl(value: string | null) {
    this._avatarUrl = value;
  }

  set avatarKey(value: string) {
    this._avatarKey = value;
  }

  getRating(type: "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL"): number {
    return this._rating.get(type);
  }

  updateRating(
    type: "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL",
    newRating: number
  ): void {
    this._rating.set(type, newRating);
  }
}

import { UserRole } from "../Types/UserRole";

export default class UserEntity {
  private _displayName: string;
  private _email: string;
  private _password?: string;
  private _googleId?: string;
  private _isBlocked: boolean;
  private _gamesPlayed: number;
  private _gamesWin: number;
  private _rating: number;
  private _premium: boolean;
  private _longestStreak: number;
  private _currentStreak: number;
  private _rewards: string[];
  private _achievements?: string[];
  private _subscriptionStart?: Date;
  private _createdAt: Date;
  private _role: UserRole;

  constructor(params: {
    displayName: string;
    email: string;
    password?: string;
    googleId?: string;
    isBlocked?: boolean;
    gamesPlayed?: number;
    gamesWin?: number;
    rating?: number;
    premium?: boolean;
    longestStreak?: number;
    currentStreak?: number;
    rewards?: string[];
    achievements?: string[];
    subscriptionStart?: Date;
    createdAt?: Date;
    role: UserRole;
  }) {
    this._displayName = params.displayName;
    this._email = params.email;
    this._password = params.password;
    this._googleId = params.googleId;
    this._isBlocked = params.isBlocked ?? false;
    this._gamesPlayed = params.gamesPlayed ?? 0;
    this._gamesWin = params.gamesWin ?? 0;
    this._rating = params.rating ?? 0;
    this._premium = params.premium ?? false;
    this._longestStreak = params.longestStreak ?? 0;
    this._currentStreak = params.currentStreak ?? 0;
    this._rewards = params.rewards ?? [];
    this._achievements = params.achievements ?? [];
    this._subscriptionStart = params.subscriptionStart;
    this._createdAt = params.createdAt ?? new Date();
    this._role = params.role;
  }

  get displayName() {
    return this._displayName;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password
  }
  get rating() {
    return this._rating;
  }
  get gamesPlayed() {
    return this._gamesPlayed;
  }
  get gamesWin() {
    return this._gamesWin;
  }
  get isBlocked() {
    return this._isBlocked;
  }
  get currentStreak() {
    return this._currentStreak;
  }
  get longestStreak() {
    return this._longestStreak;
  }
  get premium() {
    return this._premium;
  }
  get role() {
    return this._role;
  }
  get rewards() {
    return this._rewards;
  }
  get achievements() {
    return this._achievements;
  }
  get subscriptionStart() {
    return this._subscriptionStart;
  }

  set password(newPassword: string | undefined) {
    this._password = newPassword;
  }

  public addWin() {
    this._gamesWin++;
    this._gamesPlayed++;
  }

  public increaseStreak() {
    this._currentStreak++;
    if (this._currentStreak > this._longestStreak) {
      this._longestStreak = this._currentStreak;
    }
  }

  public resetStreak() {
    this._currentStreak = 0;
  }

  public addAchievement(achievement: string) {
    if (!this._achievements) this._achievements = [];
    this._achievements.push(achievement);
  }

  public updateRating(newRating: number) {
    this._rating = newRating;
  }

  public block() {
    this._isBlocked = true;
  }

  public unblock() {
    this._isBlocked = false;
  }
}

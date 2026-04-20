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
  private _stripeCustomerId?: string;
  private _stripeSubscriptionId?: string;
  private _ratingHistory: { rating: number; date: Date; type: string }[];


  private _createdAt: Date;
  private _updatedAt: Date;

  //Avatar
  private _avatarUrl:string|null;
  private _avatarSeed!:string;
  private _avatarStyle!:string;
  private _avatarKey?:string;

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
        stripeCustomerId?: string;
        stripeSubscriptionId?: string;

        avatarUrl?: string | null;
        avatarSeed?: string;
        avatarStyle?: string;
        avatarKey?:string

        createdAt?: Date;
        updatedAt?: Date;
        ratingHistory?: { rating: number; date: Date; type: string }[];
    }) {
    this._id = params.id ;
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
    this._stripeCustomerId = params.stripeCustomerId;
    this._stripeSubscriptionId = params.stripeSubscriptionId;
    this._ratingHistory = params.ratingHistory ?? [];

    this._avatarUrl = params.avatarUrl ?? null;
    this._avatarSeed = params.avatarSeed ?? (params.id ?? params.email);
    this._avatarStyle = params.avatarStyle ?? "bottts";
    this._avatarKey = params.avatarKey;

    this._createdAt = params.createdAt ?? new Date();
    this._updatedAt = params.updatedAt ?? new Date();
  }

  // GETTERS
  get id(): string | undefined { return this._id; }
  get displayname(): string { return this._displayname; }
  get email(): string { return this._email; }
  get passwordHash(): string | undefined { return this._passwordHash; }
  get googleId(): string | undefined { return this._googleId; }
  get role(): UserRole { return this._role; }
  get isBlocked(): boolean { return this._isBlocked; }
  get isNewUser(): boolean { return this._isNewUser; }

  get gamesPlayed(): number { return this._gamesPlayed; }
  get gamesWin(): number { return this._gamesWin; }
  get rating(): UserRating { return this._rating; }
  get premium(): boolean { return this._premium; }
  get longestStreak(): number { return this._longestStreak; }
  get currentStreak(): number { return this._currentStreak; }
  get rewards(): string[] { return this._rewards; }
  get achievements(): string[] { return this._achievements; }

  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get ratingHistory(): { rating: number; date: Date; type: string }[] { return this._ratingHistory; }
  get subscriptionStart():Date|undefined{ return this._subscriptionStart;}
  get stripeCustomerId(): string | undefined { return this._stripeCustomerId; }
  get stripeSubscriptionId(): string | undefined { return this._stripeSubscriptionId; }

  get avatarUrl(): string | null { return this._avatarUrl; }
  get avatarSeed(): string { return this._avatarSeed; }
  get avatarStyle(): string { return this._avatarStyle; }
  get avatarKey(): string | undefined {return this._avatarKey;}

  // SETTERS
  set passwordHash(passwordHash: string) { this._passwordHash = passwordHash; }
  set isNewUser(isNewUser: boolean) { this._isNewUser = isNewUser; }
  set displayname(displayname:string) { this._displayname = displayname; }

  set avatarUrl(value: string | null) { this._avatarUrl = value; }

  set avatarKey(value: string) {
    this._avatarKey = value;
  }



  getRating(type: "BULLET" | "BLITZ" | "RAPID"|"CLASSICAL"): number {
    return this._rating.get(type);
  }

  updateRating(type: "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL", newRating: number): void {
    this._rating.set(type, newRating);
    this._ratingHistory.push({
      rating: newRating,
      date: new Date(),
      type,
    });
  }

  public addWin(): void {
    this._gamesWin++;
    this._gamesPlayed++;
    this._currentStreak++;
    if (this._currentStreak > this._longestStreak) {
      this._longestStreak = this._currentStreak;
    }
  }

  public addLoss(): void {
    this._gamesPlayed++;
    this._currentStreak = 0;
  }

  public addDraw(): void {
    this._gamesPlayed++;
    this._currentStreak = 0;
  }

  public updatePremiumStatus(isPremium: boolean, subscriptionId?: string, customerId?: string) {
    this._premium = isPremium;
    if (subscriptionId) this._stripeSubscriptionId = subscriptionId;
    if (customerId) this._stripeCustomerId = customerId;

    if (isPremium) {
      this._subscriptionStart = new Date();
    } else {
      this._subscriptionStart = undefined;
      this._stripeSubscriptionId = undefined;
    }
  }



}

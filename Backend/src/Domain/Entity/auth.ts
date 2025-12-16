import { UserRole } from "../Types/UserRole";

export default class EAuth {
    private _id: string | null;
    private _displayname: string;
    private _email: string;
    private _passwordHash?: string;     // optional, no null
    private _googleId?: string;         // optional, no null
    private _role: UserRole;
    private _isNewUser: boolean;
    private _isBlocked: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(params: {
        id?: string;
        displayname: string;
        email: string;
        passwordHash?: string;   // make optional to support Google login
        googleId?: string;
        role: UserRole;
        isBlocked: boolean;
        isNewUser: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this._id = params.id ?? null;
        this._displayname = params.displayname;
        this._email = params.email;

        // password is optional (Google login compatibility)
        if (params.passwordHash) {
            this._passwordHash = params.passwordHash;
        }

        // googleId is optional
        if (params.googleId) {
            this._googleId = params.googleId;
        }

        this._role = params.role;
        this._isBlocked = params.isBlocked ?? false;
        this._isNewUser = params.isNewUser ?? true;
        this._createdAt = params.createdAt ?? new Date();
        this._updatedAt = params.updatedAt ?? new Date();
    }

    // GETTERS
    public get id(): string | null {
        return this._id;
    }

    public get displayname(): string {
        return this._displayname;
    }

    public get email(): string {
        return this._email;
    }

    public get passwordHash(): string | undefined {
        return this._passwordHash;
    }

    public get googleId(): string | undefined {
        return this._googleId;
    }

    public get role(): UserRole {
        return this._role;
    }

    public get isBlocked(): boolean {
        return this._isBlocked;
    }

    public get isNewUser(): boolean {
        return this._isNewUser;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }

    // SETTERS
    public set passwordHash(passwordHash: string) {
        this._passwordHash = passwordHash;
    }

    public set isNewUser(isNewUser: boolean) {
        this._isNewUser = isNewUser;
    }
}

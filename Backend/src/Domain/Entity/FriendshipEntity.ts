import { FriendshipStatus } from "../Types/FriendshipStatus";

export default class FriendshipEntity {
  private _requesterId: string;
  private _recipientId: string;
  private _status: FriendshipStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: {
    requesterId: string;
    recipientId: string;
    status: FriendshipStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._requesterId = params.requesterId;
    this._recipientId = params.recipientId;
    this._status = params.status;
    this._createdAt = params.createdAt ?? new Date();
    this._updatedAt = params.updatedAt ?? new Date();
  }

  get requesterId() {
    return this._requesterId;
  }
  get recipientId() {
    return this._recipientId;
  }
  get status() {
    return this._status;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  public accept() {
    this._status = FriendshipStatus.ACCEPTED;
    this._updatedAt = new Date();
  }

  public reject() {
    this._status = FriendshipStatus.REJECTED;
    this._updatedAt = new Date();
  }

  public block() {
    this._status = FriendshipStatus.BLOCKED;
    this._updatedAt = new Date();
  }
}

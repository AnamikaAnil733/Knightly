export default class ETransaction {
  private _id?: string;
  private _userId: string;
  private _amount: number;
  private _currency: string;
  private _status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  private _stripeSessionId: string;
  private _stripeSubscriptionId?: string;
  private _type: string;
  private _createdAt?: Date;

  constructor(params: {
    id?: string;
    userId: string;
    amount: number;
    currency: string;
    status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
    stripeSessionId: string;
    stripeSubscriptionId?: string;
    type?: string;
    createdAt?: Date;
  }) {
    this._id = params.id;
    this._userId = params.userId;
    this._amount = params.amount;
    this._currency = params.currency;
    this._status = params.status;
    this._stripeSessionId = params.stripeSessionId;
    this._stripeSubscriptionId = params.stripeSubscriptionId;
    this._type = params.type ?? "SUBSCRIPTION";
    this._createdAt = params.createdAt;
  }

  get id() { return this._id; }
  get userId() { return this._userId; }
  get amount() { return this._amount; }
  get currency() { return this._currency; }
  get status() { return this._status; }
  get stripeSessionId() { return this._stripeSessionId; }
  get stripeSubscriptionId() { return this._stripeSubscriptionId; }
  get type() { return this._type; }
  get createdAt() { return this._createdAt; }

  public complete() {
    this._status = "COMPLETED";
  }

  public fail() {
    this._status = "FAILED";
  }
}

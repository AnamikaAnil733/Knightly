import { ReportReason, ReportStatus } from "../Types/ReportTypes";

export default class ReportEntity {
  private _id?: string;
  private _reporterId: string;
  private _reportedId: string;
  private _reason: ReportReason;
  private _description: string;
  private _evidence?: any;
  private _status: ReportStatus;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _reporterName?: string;
  private _reportedName?: string;

  constructor(params: {
    id?: string;
    reporterId: string;
    reportedId: string;
    reason: ReportReason;
    description: string;
    evidence?: any;
    status?: ReportStatus;
    createdAt?: Date;
    updatedAt?: Date;
    reporterName?: string;
    reportedName?: string;
  }) {
    this._id = params.id;
    this._reporterId = params.reporterId;
    this._reportedId = params.reportedId;
    this._reason = params.reason;
    this._description = params.description;
    this._evidence = params.evidence;
    this._status = params.status ?? ReportStatus.PENDING;
    this._createdAt = params.createdAt ?? new Date();
    this._updatedAt = params.updatedAt ?? new Date();
    this._reporterName = params.reporterName;
    this._reportedName = params.reportedName;
  }

  get id(): string | undefined { return this._id; }
  get reporterId(): string { return this._reporterId; }
  get reportedId(): string { return this._reportedId; }
  get reason(): ReportReason { return this._reason; }
  get description(): string { return this._description; }
  get evidence(): any { return this._evidence; }
  get status(): ReportStatus { return this._status; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get reporterName(): string | undefined { return this._reporterName; }
  get reportedName(): string | undefined { return this._reportedName; }

  set status(status: ReportStatus) {
    this._status = status;
    this._updatedAt = new Date();
  }
}

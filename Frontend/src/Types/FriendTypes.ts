export interface IFriend {
  id: string;
  displayname: string;
  avatarUrl?: string | null;
  status?: "PENDING" | "ACCEPTED" | "BLOCKED" | string;
}

export interface IPendingRequest {
  id: string;
  displayname: string;
  avatarUrl?: string | null;
}

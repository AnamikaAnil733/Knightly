import { ChatMessage } from "./ChatTypes";

export type { ChatMessage }; // Re-export ChatMessage

export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

export interface ReportEvidence {
  gameId?: string;
  chatSnapshot?: ChatMessage[];
}

export interface IReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  reportedId: string;
  reportedName?: string;
  reporterEmail?: string;
  reportedEmail?: string;
  reason: string;
  description: string;
  evidence?: ReportEvidence;
  status: ReportStatus;
  createdAt: string;
}

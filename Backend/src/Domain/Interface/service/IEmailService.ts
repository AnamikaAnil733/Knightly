export interface EmailPayload {
  to: string;
  displayname: string;
  otp: string;
  subject: string;
  content: string;
}

export interface IEmailService {
  sendMail(payload: EmailPayload): Promise<void>;
}

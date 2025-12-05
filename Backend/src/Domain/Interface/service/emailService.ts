export interface EmailPayload {
  to: string;
  name: string;
  otp: string;
  subject: string;
  content: string;
}

export interface IEmailService {
  sendMail(payload: EmailPayload): Promise<void>;
}

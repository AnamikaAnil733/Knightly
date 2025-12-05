import nodemailer from "nodemailer";
import { EmailPayload, IEmailService } from "../../Domain/Interface/service/emailService";
import { otpMailHtml } from "../../Domain/Constants/emailHtml/otpmailHTML";

export class EmailService implements IEmailService {
  private _transporter: nodemailer.Transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }

  async sendMail(payload: EmailPayload): Promise<void> {
    const html = otpMailHtml(payload.name, payload.otp, payload.content);

    // Verify transporter
    const isVerified = await this._transporter.verify();
    if (!isVerified) {
      throw new Error("Nodemailer transporter verification failed!");
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.NODEMAILER_USER,
      to: payload.to,
      subject: payload.subject,
      html,
    };

    await this._transporter.sendMail(mailOptions);
  }
}

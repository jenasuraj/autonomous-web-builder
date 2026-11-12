import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter?: Transporter;
  private readonly from: string;
  private readonly isProduction: boolean;

  constructor(config: ConfigService) {
    const user = config.get<string>('GMAIL_USER');
    const pass = config.get<string>('GMAIL_APP_PASSWORD');
    this.from = `"Web Builder" <${user}>`;
    this.isProduction = config.get('NODE_ENV') === 'production';
    if (user && pass)
      this.transporter = createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
  }

  async sendOtp(email: string, code: string) {
    if (!this.transporter) {
      if (this.isProduction)
        throw new Error(
          'GMAIL_USER and GMAIL_APP_PASSWORD must be set in production',
        );
      this.logger.warn(
        `Gmail is not configured, so the email was not sent. OTP for ${email}: ${code}`,
      );
      return;
    }
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: `${code} is your Web Builder verification code`,
      text: `Your verification code is ${code}. It expires in 10 minutes. If you didn't sign up for Web Builder, you can ignore this email.`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:420px;margin:auto;padding:24px">
  <h2 style="margin:0 0 8px">Verify your email</h2>
  <p style="color:#555">Enter this code to finish setting up your Web Builder account:</p>
  <p style="font-size:32px;font-weight:700;letter-spacing:8px;margin:24px 0">${code}</p>
  <p style="color:#888;font-size:13px">It expires in 10 minutes. If you didn't sign up, you can ignore this email.</p>
</div>`,
    });
  }
}

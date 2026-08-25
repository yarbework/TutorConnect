import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    // Note: This URL should point to your Next.js FRONTEND, not the backend API
    const frontendVerifyUrl = `https://tutorconnect.com/verify-email?token=${token}`;
    
    try {
      await this.mailerService.sendMail({
        to: email,
        from: '"TutorConnect" <noreply@tutorconnect.com>',
        subject: 'Welcome to TutorConnect - Verify Your Email',
        html: `
          <h1>Welcome!</h1>
          <p>Please click the link below to verify your account:</p>
          <a href="${frontendVerifyUrl}">Verify My Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
      this.logger.log(`Real email dispatched to: ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error);
      throw new InternalServerErrorException('Email delivery failed');
    }
  }
}
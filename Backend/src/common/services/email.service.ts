import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  /**
   * Dispatches the email verification link to the user.
   * In a production environment, this integrates with AWS SES or SendGrid.
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `https://api.tutorconnect.com/v1/auth/verify-email?token=${token}`;
    
    // Simulating network delay and logging the output for the console
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.logger.log(`[EMAIL DISPATCHED] To: ${email} | Link: ${verificationLink}`);
  }
}
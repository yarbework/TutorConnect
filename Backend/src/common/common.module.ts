import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST') || 'smtp.ethereal.email',
          port: configService.get<number>('SMTP_PORT') || 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: configService.get<string>('SMTP_USER') || 'test_user',
            pass: configService.get<string>('SMTP_PASS') || 'test_pass',
          },
        },
        defaults: {
          from: '"TutorConnect" <noreply@tutorconnect.com>',
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class CommonModule {}
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { environmentValidationSchema } from './config/env.validation';
import { databaseConfig } from './config/database.config';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { TutorModule } from './tutor/tutor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: environmentValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        ...configService.get<TypeOrmModuleOptions>('database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CommonModule,
    AuthModule,
    JobsModule,
    TutorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
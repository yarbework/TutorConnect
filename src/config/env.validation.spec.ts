import { environmentValidationSchema } from './env.validation';

describe('Environment Validation Schema', () => {
  it('should fail validation when critical database parameters are missing', () => {
    const invalidConfig = {
      NODE_ENV: 'development',
      PORT: 5000,
      // DATABASE_HOST is missing
      DATABASE_PORT: 5432,
      DATABASE_USER: 'tutor_admin',
      DATABASE_PASSWORD: 'password',
      DATABASE_NAME: 'tutorconnect_db',
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      REDIS_PASSWORD: 'redis',
      JWT_ACCESS_SECRET: 'supersecretstringthatisatleast32characterslong',
      JWT_ACCESS_EXPIRATION: '15m',
      JWT_REFRESH_SECRET: 'supersecretrefreshstringthatisatleast32characterslong',
      JWT_REFRESH_EXPIRATION: '7d',
    };

    const { error } = environmentValidationSchema.validate(invalidConfig);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"DATABASE_HOST" is required');
  });

  it('should successfully validate complete configuration parameters', () => {
    const validConfig = {
      NODE_ENV: 'development',
      PORT: 5000,
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: 5432,
      DATABASE_USER: 'tutor_admin',
      DATABASE_PASSWORD: 'EnterpriseSecurePass2026!',
      DATABASE_NAME: 'tutorconnect_db',
      DATABASE_SYNCHRONIZE: true,
      DATABASE_LOGGING: false,
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      REDIS_PASSWORD: 'RedisSecurePass2026!',
      JWT_ACCESS_SECRET: 'supersecretstringthatisatleast32characterslong',
      JWT_ACCESS_EXPIRATION: '15m',
      JWT_REFRESH_SECRET: 'supersecretrefreshstringthatisatleast32characterslong',
      JWT_REFRESH_EXPIRATION: '7d',
    };

    const { error, value } = environmentValidationSchema.validate(validConfig);
    expect(error).toBeUndefined();
    expect(value.PORT).toEqual(5000);
  });
});
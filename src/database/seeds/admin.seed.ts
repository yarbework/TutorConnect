import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User, UserRole } from '../../auth/entities/user.entity';
import { HashingService } from '../../common/services/hashing.service';

dotenv.config();

export async function seedInitialAdmin() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User],
    synchronize: false,
  });

  await dataSource.initialize();
  const userRepository = dataSource.getRepository(User);
  const hashingService = new HashingService();

  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@tutorconnect.internal';
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'SuperAdminSecure2026!';

  try {
    const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const password_hash = await hashingService.hash(adminPassword);
      const admin = userRepository.create({
        email: adminEmail,
        password_hash,
        role: UserRole.ADMIN,
        is_email_verified: true, // Super admin is auto-verified
      });

      await userRepository.save(admin);
      console.log(`[SEED SUCCESS] Initial administrator (${adminEmail}) seeded successfully.`);
    } else {
      console.log('[SEED INFO] Admin user already exists, skipping seed.');
    }
  } catch (error) {
    console.error('[SEED ERROR] Failed to seed admin user:', error);
  } finally {
    await dataSource.destroy();
  }
}

// Execute if run directly
if (require.main === module) {
  seedInitialAdmin();
}
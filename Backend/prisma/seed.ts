import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database and setting up fresh demo accounts...');

  // Reset database tables
  await prisma.tutorProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Admin Account
  await prisma.user.create({
    data: {
      email: 'admin@tutorconnect.com',
      passwordHash,
      fullName: 'System Administrator',
      role: 'ADMIN',
    },
  });

  // 2. Create Tutor Account (Mr. Yarbe Mohaz) - Clean State without PDF
  const yarbeUser = await prisma.user.create({
    data: {
      email: 'tutor.david@tutorconnect.com',
      passwordHash,
      fullName: 'Mr. Yarbe Mohaz',
      role: 'TUTOR',
    },
  });

  await prisma.tutorProfile.create({
    data: {
      userId: yarbeUser.id,
      bio: 'Ph.D. in Applied Physics with 10+ years of university teaching experience.',
      hourlyRate: 50.0,
      teachingModes: JSON.stringify(['ONLINE', 'IN_PERSON_STUDENT_HOME']),
      geographicRadiusKm: 20.0,
      availabilityCalendar: JSON.stringify({
        monday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
        tuesday: [{ start: '10:00', end: '16:00' }],
        wednesday: [{ start: '09:00', end: '12:00' }],
        thursday: [{ start: '14:00', end: '19:00' }],
        friday: [{ start: '09:00', end: '15:00' }],
        saturday: [{ start: '10:00', end: '14:00' }],
        sunday: [],
      }),
      credentialPdfUrl: null,
      credentialFilename: null,
      uploadedAt: null,
      verificationStatus: 'PENDING_AUDIT',
      adminReviewNote: null,
    },
  });

  console.log('✅ Clean setup completed! Ready for fresh PDF uploads and audit testing.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

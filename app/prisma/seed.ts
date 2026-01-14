import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'realworld@me' },
    update: {},
    create: {
      email: 'realworld@me',
      username: 'RealWorld',
      password: hashedPassword,
      bio: null,
      image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    },
  });

  console.log('Seed finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

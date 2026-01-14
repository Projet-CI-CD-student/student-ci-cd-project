import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('testpassword', 10);

  await prisma.user.create({
    data: {
      username: 'RealWorld',
      email: 'realworld@me',
      password: passwordHash,
      bio: null,
      image: 'https://api.realworld.io/images/smiley-cyrus.jpeg'
    },
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

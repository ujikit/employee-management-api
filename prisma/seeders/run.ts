import { PrismaClient } from '@prisma/client';
import { seedAllTables } from './seedAllTables';

const prisma = new PrismaClient();

async function main() {
  await seedAllTables(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
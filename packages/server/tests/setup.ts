import { PrismaClient } from "@prisma/client";

// Set test database URL for all tests
process.env.DATABASE_URL = "file:./test.db";

const prisma = new PrismaClient();

// Disconnect after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

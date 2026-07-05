import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn', 'info']
      : ['error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('DB Connect vie Prisma');
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('DB Disconnect vie Prisma');
  } catch (error) {
    console.error(`DB Disconnection Error: ${error.message}`);
    process.exit(1);
  }
};
export default { prisma, connectDB, disconnectDB };

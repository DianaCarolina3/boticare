import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDatabase = async () => {
   try {
      await prisma.$connect();
      console.log('✅ MySQL Database connected');
   } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
   }
};

export const disconnectDatabase = async () => {
   await prisma.$disconnect();
};

export { prisma };

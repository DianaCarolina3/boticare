import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
   return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
   });
};

// previene múltiples inicializaciones
declare global {
   var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
   globalThis.prismaGlobal = prisma;
}

export const connectDatabase = async () => {
   try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('[DB Ready] Successfully connected to MySQL');
   } catch (error) {
      console.error('[Error DB Connection]: ', error);
      process.exit(1);
   }
};

export const disconnectDatabase = async () => {
   await prisma.$disconnect();
   console.log('[DB Disconnected] MySQL connection closed');
};

process.on('SIGINT', async () => {
   await disconnectDatabase();
   process.exit(0);
});

process.on('SIGTERM', async () => {
   await disconnectDatabase();
   process.exit(0);
});

export { prisma };

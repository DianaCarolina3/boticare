import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

import { config } from './config.js';

const adapter = new PrismaMariaDb({
   host: config.mysql.host as string,
   port: Number(config.mysql.port),
   user: config.mysql.user as string,
   password: config.mysql.password as string,
   database: config.mysql.name as string,
   connectionLimit: 5,
   connectTimeout: 10000,
});

const prismaClientSingleton = () => {
   return new PrismaClient({
      adapter,
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
      await prisma.$connect();
      console.log('[DB Connected] Successfully connected to MySQL');
   } catch (error) {
      console.error('[Error DB Connection]:', error);
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

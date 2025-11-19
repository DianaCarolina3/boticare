import dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config({
   path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

export const config = {
   api: {
      port: process.env.API_PORT,
      host: process.env.API_HOST,
   },
   postgresql: {
      user: process.env.DB_POSTGRESQL_USER,
      password: process.env.DB_POSTGRESQL_PASSWORD,
      host: process.env.DB_POSTGRESQL_HOST,
      port: process.env.DB_POSTGRESQL_PORT,
      database: process.env.DB_POSTGRESQL_DATABASE,
   },
};

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
   mysql: {
      url: process.env.DATABASE_URL,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      name: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
   },
};

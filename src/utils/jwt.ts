import jwt from 'jsonwebtoken';
import { config } from '../core/config/config.js';
import { Errors } from './errors.js';

// Genera JWT firmado
export const signToken = (sub: string, role: string) => {
   return jwt.sign(
      {
         role: role,
      },
      config.jwt.secret as string,
      {
         algorithm: 'HS256',
         expiresIn: '1h',
         subject: sub,
      },
   );
};

// Verifica que el JWT sea válido
export const verifyToken = (token: string) => {
   try {
      return jwt.verify(token, config.jwt.secret as string);
   } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
         throw new Errors('Token Expired', 498);
      } else {
         throw new Errors('Invalid Token', 498);
      }
   }
};

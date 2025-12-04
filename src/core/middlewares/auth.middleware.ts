import type { Request, Response, NextFunction } from 'express';
import { Errors } from '../../utils/errors.js';
import { verifyToken } from '../../utils/jwt.js';
import { BaseRepository } from '../../shared/repositories/BaseRepository.js';
import { prisma } from '../config/database.js';

interface JwtPayload {
   sub: string; // id del usuario
   role: 'ADMIN' | 'USER';
   iat?: number;
   exp?: number;
}

const userRepository = new BaseRepository(prisma, prisma.user);

export const authenticateJWT = async (_req: Request, _res: Response, next: NextFunction) => {
   try {
      const authHeader = _req.headers.authorization;
      if (!authHeader) throw new Errors('No token', 401);
      if (!authHeader.startsWith('Bearer ')) throw new Errors('Invalid token format', 401);

      const token = authHeader.replace('Bearer ', '');
      // Verificar el token
      const payload = verifyToken(token) as JwtPayload;
      // Verificar si el usuario existe
      const user = await userRepository.findById(payload.sub);
      if (user === false) throw new Errors('User does not exist or was deleted', 401);

      _req.user = { userId: payload.sub, role: payload.role };
      return next();
   } catch (err) {
      return next(err);
   }
};

// Verificar roles
export const authorizeRoles = (...roles: ('ADMIN' | 'USER')[]) => {
   return (_req: Request, _res: Response, next: NextFunction) => {
      if (!_req.user) return next(new Errors('Not authenticated', 401));
      // si el role del usuario no es el mismo asignado a la ruta entonces error
      if (!roles.includes(_req.user.role))
         return next(new Errors('Forbidden: role not allowed', 403));
      // de lo contrario continuamos
      return next();
   };
};

// Dar acceso solo a lo que es propietario
export const verifyOwnership = (_req: Request, ownerId: string) => {
   if (!_req.user) throw new Errors('Not authenticated', 401);
   if (_req.user.userId !== ownerId && _req.user.role !== 'ADMIN')
      throw new Errors('Forbidden: not owner', 403);
};

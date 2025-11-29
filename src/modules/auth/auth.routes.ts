import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { validate } from '../../core/middlewares/validation.middleware.js';
import { authLoginSchema } from './auth.schema.js';

export const createAuthRouter = () => {
   const router = Router();

   const authRepository = new AuthRepository();
   const authService = new AuthService(authRepository);
   const authController = new AuthController(authService);

   router.post('/login', validate(authLoginSchema, 'body'), authController.login);

   return router;
};

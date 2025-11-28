import { Router } from 'express';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { UserRepository } from './user.repository.js';
import { validate, validateOpcional } from '../../core/middlewares/validation.middleware.js';
import {
   idSchema,
   nameAndLastnameSchema,
   userCreateSchema,
   userUpdateSchema,
} from './user.schema.js';
import { AuthService } from '../auth/auth.service.js';
import { AuthRepository } from '../auth/auth.repository.js';

export const createUserRouter = () => {
   const router = Router();

   // Dependencias de Auth
   const authRepository = new AuthRepository();
   const authService = new AuthService(authRepository);

   // Dependencias de User
   const userRepository = new UserRepository();
   const userService = new UserService(userRepository, authService);
   const userController = new UserController(userService);

   router.get(
      '/',
      validateOpcional(nameAndLastnameSchema, 'query'),
      userController.getAllOrByNameAndLastname,
   );
   router.get('/:id', validate(idSchema, 'params'), userController.getById);
   router.post('/register', validate(userCreateSchema, 'body'), userController.postNewUser);
   router.patch(
      '/:id',
      validate(idSchema, 'params'),
      validate(userUpdateSchema, 'body'),
      userController.patchUser,
   );
   router.delete('/:id', validate(idSchema, 'params'), userController.deleteUser);

   return router;
};

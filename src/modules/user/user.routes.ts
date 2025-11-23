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

export const createUserRouter: () => Router = (): Router => {
   const router = Router();

   const userRepository = new UserRepository();
   const userService = new UserService(userRepository);
   const userController = new UserController(userService);

   router.get(
      '/',
      validateOpcional(nameAndLastnameSchema, 'query'),
      userController.getAllOrByNameAndLastname,
   );
   router.get('/:id', validate(idSchema, 'params'), userController.getById);
   router.post('/', validate(userCreateSchema, 'body'), userController.postNewUser);
   router.patch(
      '/:id',
      validate(idSchema, 'params'),
      validate(userUpdateSchema, 'body'),
      userController.patchUser,
   );
   router.delete('/:id', validate(idSchema, 'params'), userController.deleteUser);

   return router;
};

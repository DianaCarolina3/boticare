import { Router } from 'express';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { UserRepository } from './user.repository.js';

export const createUserRouter: () => Router = (): Router => {
   const router = Router();

   const userRepository = new UserRepository();
   const userService = new UserService(userRepository);
   const userController = new UserController(userService);

   router.get('/', userController.getAllOrByNameAndLastname);
   router.get('/:id', userController.getById);
   router.post('/', userController.postNewUser);
   router.patch('/:id', userController.patchUser);
   router.delete('/:id', userController.deleteUser);

   return router;
};

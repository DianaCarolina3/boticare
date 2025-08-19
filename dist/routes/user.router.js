import { Router } from "express";
import { UserController } from '../modules/user/user.controller.js';
export const createUserRouter = () => {
    const router = Router();
    router.get('/', UserController.getAllOrByNameAndLastname);
    router.get('/:id', UserController.getById);
    router.post('/', UserController.postUser);
    return router;
};
//# sourceMappingURL=user.router.js.map
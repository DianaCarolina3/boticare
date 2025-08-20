import { Router } from "express"
import { UserController } from './user.controller.js'


export const createUserRouter: () => Router = (): Router => {
    const router = Router()

    router.get('/', UserController.getAllOrByNameAndLastname)
    router.get('/:id', UserController.getById)
    router.post('/', UserController.postNewUser)
    router.patch('/:id', UserController.patchUser)
    router.delete('/:id', UserController.deleteUser)

    return router
}
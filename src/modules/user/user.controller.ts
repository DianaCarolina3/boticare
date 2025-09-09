//Maneja las rutas y peticiones/respuestas HTTP	-> Service
import type { Request, Response} from 'express'
import * as z from 'zod'
import { UserService } from './user.service.js'
import {
    IdSchema,
    NameAndLastnameSchema,
    UserSchemaToCreate,
    UserSchemaToUpdate,
    type UserType,
    type UserTypeOptionalWithoutId,
    type UserTypeWithoutId
} from './user.schema.js'
import { handleError } from "../../utils/errors.js";

export class UserController {

    static getAllOrByNameAndLastname = async (
        //params url, res body, req body, req query
        _req: Request<{}, {}, {}, {name?: string, lastname?: string}>,
        res: Response<UserType[] | {error: string | undefined}>) => {
        try {
            // Get all
            if (!_req.query.name && !_req.query.lastname) {
                const users: UserType[] = await  UserService.getAllUsers()
                return res.status(200).json(users)
            }

            // Validar name y lastname
            const nameAndLastnameValidation = NameAndLastnameSchema.safeParse(_req.query)
            if (!nameAndLastnameValidation.success) {
                const errorMessage = z.treeifyError(nameAndLastnameValidation.error)
                return res.status(422).json({ error: errorMessage.errors[0] })
            }

            // Get a filter query for name or/and lastname
            const { name, lastname } = nameAndLastnameValidation.data
            const users: UserType[] = await UserService.getByNameAndLastname(name, lastname)

            return res.status(200).json(users)
        } catch (err) {
            const error = handleError(err)
            if (error.code === 500) {
                console.log(error)
                return res.status(error.code).json({ error: error.message })
            }
            return res.status(error.code).json({ error: error.message})
        }
    }

    static getById = async (
        _req: Request<{id: UserType['id']}>,
        res: Response<UserType[] | boolean | {error: string | undefined}>) => {
        try {
            const { id } =  _req.params

            const idValidation = IdSchema.safeParse(id)
            if (!idValidation.success) {
                const errorMessage = z.treeifyError(idValidation.error)
                return res.status(422).json({ error: errorMessage.errors[0] })
            }

            const user: UserType[] | boolean = await UserService.getByIdUser(idValidation.data)

            return res.status(200).json(user)
        } catch (err) {
            const error = handleError(err)
            if (error.code === 500) {
                console.log(error)
                return res.status(error.code).json({ error: error.message })
            }
            return res.status(error.code).json({ error: error.message})
        }
    }

    static postNewUser = async (
        _req: Request<{}, {}, UserTypeWithoutId>,
        res: Response<{message: string, id: string} | {error: string | Record<string, string[]>}>) => {
        try {
            // validar body
            const bodyValidation = UserSchemaToCreate.safeParse(_req.body)
            if (!bodyValidation.success) {
                // 422 request funciona, pero la sintaxis del recurso no es correcta
                const errorMessage = z.flattenError(bodyValidation.error)
                return res.status(422).json({ error: errorMessage.fieldErrors })
            }

            const newUser: UserType = await UserService.postNewUser(bodyValidation.data)

            return res.status(200).json({
                message: 'User created successfully',
                id: newUser.id
            })

        } catch (err) {
            const error = handleError(err)
            if (error.code === 500) {
                console.log(error)
                return res.status(error.code).json({ error: error.message })
            }
            return res.status(error.code).json({ error: error.message })
        }
    }

    static patchUser = async (_req: Request<{id: UserType['id']}, {}, UserTypeOptionalWithoutId>,
                     res: Response<UserTypeOptionalWithoutId[] | {error: string | Record<string, string[]> | undefined}>) => {
        // Record<K, T> objeto clave, valor
        try {
            const { id } = _req.params

            // validar id
            const idValidation = IdSchema.safeParse(id)
            if (!idValidation.success) {
                const errorMessage = z.treeifyError(idValidation.error)
                return res.status(422).json({ error: errorMessage.errors[0] })
            }

            // validar body
            const bodyValidation = UserSchemaToUpdate.safeParse(_req.body)
            if (!bodyValidation.success) {
                const errorMessage = z.flattenError(bodyValidation.error)
                return res.status(422).json({ error: errorMessage.fieldErrors })
            }

            const updatedUser: UserTypeOptionalWithoutId[] = await UserService.patchUser(idValidation.data, bodyValidation.data)

            return  res.status(200).json(updatedUser)

        } catch (err) {
            const error = handleError(err)
            if (error.code === 500) {
                console.log(error)
                return res.status(error.code).json({ error: error.message })
            }
            return res.status(error.code).json({ error: error.message })
        }
    }

    static deleteUser = (_req: Request<{id: UserType['id']}>, res: Response<string | {error: string | undefined}>)=> {
        try {
            const { id } = _req.params

            const idValidation = IdSchema.safeParse(id)
            if(!idValidation.success) {
                const errorMessage = z.treeifyError(idValidation.error)
                return res.status(422).json({ error: errorMessage.errors[0] })
            }

            const userDeleted = UserService.deleteUser(idValidation.data)

            return res.status(200).json(userDeleted)
        } catch (err) {
            const error = handleError(err)
            if (error.code === 500) {
                console.log(error)
                return res.status(error.code).json({ error: error.message })
            }
            return res.status(error.code).json({ error: error.message })
        }
    }

}

// Implementa la lógica de negocio -> Service
import { UserRepository } from './user.repository.ts'
import { AuthService } from "../auth/auth.service.ts";
import type {UserType, UserTypeOptionalWithoutId, UserTypeWithoutId} from "./user.schema.ts";
import { hashPassword } from "../../utils/hash.ts";
import { Errors } from '../../utils/errors.ts'

export class UserService {

    static async getAllUsers(): Promise<UserType[]> {
        return  await UserRepository.find()
    }

    static async getByNameAndLastname(name?: UserType['name'], lastname?: UserType['lastname']): Promise<UserType[]> {
         const users: UserType[] = await UserRepository.findNameAndLastname(name, lastname)

            if (!users || users.length === 0) {
                throw new Errors('Users not found', 404)
            }

            return users
    }

    static async getByIdUser(id: UserType['id']): Promise<UserType[] | boolean> {
        const user = await UserRepository.findId(id)

        if (user === false) {
            throw new Errors('User not found', 404)
        }

        return user
    }

    static async postNewUser(body: UserTypeWithoutId): Promise<UserType> {
        // Hasear contrasena
        let hashedPassword= await hashPassword(body.password)
        // quitar espacios en cel
        let celWithoutSpaces = body.cel.split(" ").join("")

        // evitar email duplicado en db
        const emailExists = await UserRepository.findEmail(body.email)
        if (emailExists) {
            throw new Errors('Email exists or is in use', 409)
        }

        body.cel = celWithoutSpaces
        body.password = hashedPassword

        let data = {
            id: crypto.randomUUID(),
            ...body,
        }

        const user =  await UserRepository.createNewUser(data)
        await AuthService.createAuthUser(user, data.password)

        return user
    }

    static async patchUser(id: UserType['id'], body: UserTypeOptionalWithoutId): Promise<UserType[]> {
        // buscar id para saber si existe y poder actualizarlo
        const user = await UserRepository.findId(id)
        if (user === false) {
            throw new Errors('User not found', 404)
        }

        // si encuentra el id hasear contrasena
        let hashedPassword
        if (body.password) {
            hashedPassword = await hashPassword(body.password)
            body.password = hashedPassword
        }
        // si vienen el cel quitar espacios
        let celWithoutSpaces
        if (body.cel) {
            celWithoutSpaces = body.cel.split(" ").join("")
            body.cel = celWithoutSpaces
        }
        // verificar si email existe
        const emailExists = await UserRepository.findEmail(body.email)
        if (emailExists) {
            throw new Errors('Email exists or is in use', 409)
        }

        // actualizar password en auth
        await AuthService.updateAuthUser(id, body)

        return await UserRepository.updateUser(id, body)
    }

    static async deleteUser(id: UserType['id']): Promise<string> {
        const user = UserRepository.findId(id)

        if (!user) {
            throw new Errors('User not found', 404)
        }

        await AuthService.deleteAuthUser(id)

        return UserRepository.deleteUser(id)
    }

}
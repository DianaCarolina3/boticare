// Implementa la lógica de negocio -> Model
import { UserRepository } from './user.repository.js'
import type {UserType, UserTypeOptionalWithoutId, UserTypeWithoutId} from "./user.schema.js";
import { hashPassword } from "../../utils/hash.js";

export class UserService {

    static async getAllUsers(): Promise<UserType[]> {
        return  await UserRepository.find()
    }

    static async getByNameAndLastname(name?: UserType['name'], lastname?: UserType['lastname']): Promise<UserType[]> {
         const users: UserType[] = await UserRepository.findNameAndLastname(name, lastname)

            if (!users || users.length === 0) {
                throw new Error('Users not found')
            }

            return users
    }

    static async getByIdUser(id: UserType['id']): Promise<UserType[] | boolean> {
        const user = await UserRepository.findId(id)

        if (user === false) {
            throw new Error('User not found')
        }

        return user
    }

    static async postNewUser(body: UserTypeWithoutId): Promise<UserType> {
        // Hasear contrasena
        let hashedPassword= await hashPassword(body.password)
        // quitar espacios en cel
        let celWithoutSpaces = body.cel.replaceAll(" ", "")

        // evitar email duplicado en db
        const emailExists = await UserRepository.findEmail(body.email)
        if (emailExists) {
            throw new Error('Email exists or is in use')
        }

        body.cel = celWithoutSpaces
        body.password = hashedPassword

        return await UserRepository.createNewUser(body)
    }

    static async patchUser(id: UserType['id'], body: UserTypeOptionalWithoutId): Promise<UserType[]> {
        // buscar id para saber si existe y poder actualizarlo
        const user = await UserRepository.findId(id)
        if (user === false) {
            throw new Error('User not found')
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
            celWithoutSpaces = body.cel.replaceAll(" ", "")
            body.cel = celWithoutSpaces
        }
        // verificar si email existe
        const emailExists = await UserRepository.findEmail(body.email)
        if (emailExists) {
            throw new Error('Email exists or is in use')
        }

        return await UserRepository.updateUser(id, body)
    }

    static deleteUser(id: UserType['id']): string {
        const user = UserRepository.findId(id)

        if (!user) {
            throw new Error('User not found')
        }

        return UserRepository.deleteUser(id)
    }

}
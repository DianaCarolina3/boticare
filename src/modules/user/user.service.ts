// Implementa la lógica de negocio -> Model
import { UserModel } from './user.model.js'
import type {UserType, UserTypeOptionalWithoutId, UserTypeWithoutId} from "./user.schema.js";
import users from '../../test/user.json' with { type: 'json' }
import {hashPassword} from "../../utils/hash.js";

export class UserService {

    static getAllUsers(): UserType[] {
        return  UserModel.find()
    }

    static getByIdUser(id: UserType['id']): UserType | undefined {
        const user = UserModel.findId(id)

        if (!user) {
            throw new Error('User not found')
        }

        return user
    }

    static getByNameAndLastname(name?: UserType['name'], lastname?: UserType['lastname']): UserType[] {
         const users: UserType[] = UserModel.findNameAndLastname(name, lastname)

            if (!users || users.length === 0) {
                throw new Error('Users not found')
            }

            return users
    }

    static async postNewUser(body: UserTypeWithoutId): Promise<UserType> {
        // Hasear contrasena
        let hashedPassword= await hashPassword(body.password)
        // quitar espacios en cel
        let celWithoutSpaces = body.cel.replaceAll(" ", "")

        // evitar email duplicado en db
        const emailExists = UserModel.findEmail(body.email)
        if (emailExists) {
            throw new Error('Email existed')
        }

        body.cel = celWithoutSpaces
        body.password = hashedPassword

        return UserModel.createNewUser(body)
    }

    static async patchUser(id: UserType['id'], body: UserTypeOptionalWithoutId): Promise<UserType> {
        const indexUser = users.findIndex(item => item.id === id)

        if (indexUser === -1) {
            throw new Error('User not found')
        }

        // si encuentra el id hasear contrasena
        let hashedPassword
        if (body.password) {
            hashedPassword = await hashPassword(body.password)
            body.password = hashedPassword
        }
        // si vienen el cel
        let celWithoutSpaces
        if (body.cel) {
            celWithoutSpaces = body.cel.replaceAll(" ", "")
            body.cel = celWithoutSpaces
        }

        // ignorar por ahora hasta db
        return UserModel.updateUser(indexUser, body)
    }

    static deleteUser(id: UserType['id']): string {
        const user = UserModel.findId(id)

        if (!user) {
            throw new Error('User not found')
        }

        return UserModel.deleteUser(id)
    }

}
// Implementa la lógica de negocio -> Model
import { UserModel } from './user.model.js'
import type {UserType, UserTypeOptionalWithoutId, UserTypeWithoutId} from "./user.schema.js";
import users from '../../test/user.json' with { type: 'json' }

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

    static postNewUser(body: UserTypeWithoutId): UserType {
        // evitar email duplicado en db
        const emailExists = UserModel.findEmail(body.email)
        if (emailExists) {
            throw new Error('Email existed')
        }

        return UserModel.createNewUser(body)
    }

    static patchUser(id: UserType['id'], body: UserTypeOptionalWithoutId): UserType {
        const indexUser = users.findIndex(item => item.id === id)

        if (indexUser === -1) {
            throw new Error('User not found')
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
import { AuthRepository } from './auth.repository.js'
import type {UserType, UserTypeOptionalWithoutId} from "../user/user.schema.js";

export class AuthService {
    static async createAuthUser (data: UserType, password: string): Promise<void> {
        let id =  crypto.randomUUID()

        if (!data.id && password) {
            throw new Error('Id and password is required')
        }

        await AuthRepository.createAuthUser(id, data.id, password)
    }

    static async deleteAuthUser (idUser: UserType['id']): Promise<void> {
        await AuthRepository.deleteAuthUser(idUser)
    }

    static async updateAuthUser (idUser: UserType['id'], body: UserTypeOptionalWithoutId): Promise<void> {
        if (idUser && body.password) {
            await AuthRepository.updateAuthUser(idUser, body.password)
        }
    }
}
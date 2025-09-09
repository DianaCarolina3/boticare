import { AuthRepository } from './auth.repository.js'
import type {UserType} from "../user/user.schema.js";

export class AuthService {
    static async createAuthUser (data: UserType, password: string): Promise<void> {
        let id =  crypto.randomUUID()

        if (!data.id && password) {
            throw new Error('Id and password is required')
        }

        await AuthRepository.createAuthUser(id, data.id, password)
    }
}
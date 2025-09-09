import pool from '../../database/connection.js'
import type {UserType} from "../user/user.schema.js";

export class AuthRepository {
    static async createAuthUser(id: string, idUser: UserType['id'], password: UserType['password']) {
        const query = `INSERT INTO auth(id, user_id, password) 
                        VALUES ($1, $2, $3)`
        const values = [id, idUser, password]

        await pool.query(query, values)
    }
}
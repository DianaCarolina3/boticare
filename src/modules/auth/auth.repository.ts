import pool from '../../database/connection.js'
import type {UserType} from "../user/user.schema.js";
import {Errors} from "../../utils/errors.js";

export class AuthRepository {
    static async createAuthUser(id: string, idUser: UserType['id'], password: UserType['password']) {
        const query = `INSERT INTO auth(id, user_id, password) 
                        VALUES ($1, $2, $3)`
        const values = [id, idUser, password]

        await pool.query(query, values)
    }

    static async deleteAuthUser(idUser: UserType['id']) {
        const query = `DELETE FROM auth WHERE user_id=$1`
        const values = [idUser]

        const { rowCount } = await pool.query(query, values)
        if (rowCount != 1) {
            throw new Errors('Error deleting user', 500)
        }
    }
}
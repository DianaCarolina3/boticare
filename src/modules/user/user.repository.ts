//Define y accede a los datos (BD) -> DB
import users from '../../test/user.json' with { type: 'json' }
import pool from '../../database/connection.js'

import {UserSchema,
    type UserType,
    type UserTypeOptionalWithoutId} from "./user.schema.js";

// por archivo json validamos datos (en local)
// con db lista debe enviarse a la db y solo se valida en el controller el post y put
const userValidatedIntern: UserType[] = users.map(user => UserSchema.parse(user))

export class UserRepository {

    static async find(): Promise<UserType[]> {
        const query = `SELECT id, name, lastname, email, cel, photo FROM users`
        const { rows } = await pool.query(query)
        return rows
    }

    static async findNameAndLastname(name?: string, lastname?: string): Promise<UserType[]> {
        if (name && lastname) {
            const query = `SELECT id, name, lastname, email, cel, photo FROM users
                                WHERE LOWER(name) = $1 AND LOWER(lastname) = $2`
            const values = [name.toLowerCase(), lastname.toLowerCase()]

            const { rows } = await pool.query(query, values)
            return rows
        }

        if (name) {
            const query = `SELECT id, name, lastname, email, cel, photo FROM users
                                WHERE LOWER(name) = $1`
            const values = [name.toLowerCase()]

            const { rows } = await pool.query(query, values)
            return rows
        }

        if (lastname) {
            const query = `SELECT id, name, lastname, email, cel, photo FROM users
                                WHERE LOWER(lastname) = $1`
            const values = [lastname.toLowerCase()]

            const { rows } = await pool.query(query, values)
            return rows
        }

        return await UserRepository.find()

    }

    static async findId(id: UserType['id']): Promise<UserType[] | boolean> {
        const query = `SELECT id, name, lastname, email, cel, photo FROM users
                            WHERE id = $1`
        const values = [id]

        const { rows } = await pool.query(query, values)

        if (rows.length === 0) {
            return false
        }

        return rows
    }

    static async findEmail(email: string | undefined): Promise<boolean | void> {
        const query = `SELECT id FROM users WHERE email = $1`
        const values = [email]

        const { rows } = await pool.query(query, values)
        if (rows.length === 0) {
            return false
        }
        if (rows[0].id) {
            return true
        }

    }

    static async createNewUser(body: UserType): Promise<UserType> {
        const query = `INSERT INTO users(id, name, lastname, email, cel, photo) 
                            VALUES($1, $2, $3, $4, $5, $6) 
                            RETURNING *`
        const values = [
            body.id,
            body.name,
            body.lastname,
            body.email,
            body.cel,
            body.photo
        ]

        const { rows } = await pool.query(query, values)
        return rows[0]
    }

    static async updateUser(id: UserType['id'], body: UserTypeOptionalWithoutId): Promise<UserType[]> {
        const query = `UPDATE users SET name = $1,
                                        lastname = $2, 
                                        password = $3, 
                                        email = $4, 
                                        cel = $5, 
                                        photo = $6
                                    WHERE id = $7 
                                    RETURNING name, lastname, email, cel, photo`
        const values = [
            body.name,
            body.lastname,
            body.password,
            body.email,
            body.cel,
            body.photo,
            id
        ]

        const { rows } = await pool.query(query, values)
        return rows
    }

    static deleteUser(id: UserType['id']): string {
        const indexUser = userValidatedIntern.findIndex(user => user.id === id)

        userValidatedIntern.splice(indexUser, 1)
        return 'User deleted'
    }
}
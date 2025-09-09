//Define y accede a los datos (BD) -> DB
import pool from '../../database/connection.js'

import {
    type UserType,
    type UserTypeOptionalWithoutId} from "./user.schema.js";
import {Errors} from "../../utils/errors.js";

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
        // coalesce: toma el primer valor no nulo, si es nulo, conversa el actual
        const query = `UPDATE users SET 
                                        name = COALESCE($1, name),
                                        lastname = COALESCE($2, lastname),
                                        email = COALESCE($3, name),
                                        cel = COALESCE($4, cel),
                                        photo = COALESCE($5, photo)
                                    WHERE id = $6 
                                    RETURNING name, lastname, email, cel, photo`
        const values = [
            body.name ?? null,
            body.lastname ?? null,
            body.email ?? null,
            body.cel ?? null,
            body.photo ?? null,
            id
        ]

        const { rows } = await pool.query(query, values)
        return rows
    }

    static async deleteUser(id: UserType['id']): Promise<string> {
        const query = `DELETE FROM users WHERE id=$1`
        const values = [id]

        const { rowCount } = await pool.query(query, values)
        if (rowCount !== 1) {
            throw new Errors('Error deleting user', 500)
        }

        return `User ${id} deleted`
    }
}
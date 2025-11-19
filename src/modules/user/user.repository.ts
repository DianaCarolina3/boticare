//Define y accede a los datos (BD) -> DB
import pool from '../../database/connection.js';

import type { UserDto, UserUpdateDto } from './user.schema.js';
import { Errors } from '../../utils/errors.js';

export class UserRepository {
   async find(): Promise<UserDto[]> {
      const query = `SELECT id, name, lastname, email, cel, photo FROM users`;
      const { rows } = await pool.query(query);
      return rows;
   }

   async findNameAndLastname(name?: string, lastname?: string): Promise<UserDto[]> {
      if (name && lastname) {
         const query = `SELECT id, name, lastname, email, cel, photo FROM users
                                WHERE LOWER(name) = $1 AND LOWER(lastname) = $2`;
         const values = [name.toLowerCase(), lastname.toLowerCase()];

         const { rows } = await pool.query(query, values);
         return rows;
      }

      if (name) {
         const query = `SELECT id, name, lastname, email, cel, photo FROM users
                                WHERE LOWER(name) = $1`;
         const values = [name.toLowerCase()];

         const { rows } = await pool.query(query, values);
         return rows;
      }

      if (lastname) {
         const query = `SELECT id, name, lastname, email, cel, photo FROM users
                                WHERE LOWER(lastname) = $1`;
         const values = [lastname.toLowerCase()];

         const { rows } = await pool.query(query, values);
         return rows;
      }

      return await UserRepository.find();
   }

   async findId(id: UserDto['id']): Promise<UserDto[] | boolean> {
      const query = `SELECT id, name, lastname, email, cel, photo FROM users
                            WHERE id = $1`;
      const values = [id];

      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
         return false;
      }

      return rows;
   }

   async findEmail(email: string | undefined): Promise<boolean | void> {
      const query = `SELECT id FROM users WHERE email = $1`;
      const values = [email];

      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
         return false;
      }
      if (rows[0].id) {
         return true;
      }
   }

   async createNewUser(body: UserDto): Promise<UserDto> {
      const query = `INSERT INTO users(id, name, lastname, email, cel, photo) 
                            VALUES($1, $2, $3, $4, $5, $6) 
                            RETURNING *`;
      const values = [body.id, body.name, body.lastname, body.email, body.cel, body.photo];

      const { rows } = await pool.query(query, values);
      return rows[0];
   }

   async updateUser(id: UserDto['id'], body: UserUpdateDto): Promise<UserDto[]> {
      // coalesce: toma el primer valor no nulo, si es nulo, conversa el actual
      const query = `UPDATE users SET 
                                        name = COALESCE($1, name),
                                        lastname = COALESCE($2, lastname),
                                        email = COALESCE($3, name),
                                        cel = COALESCE($4, cel),
                                        photo = COALESCE($5, photo)
                                    WHERE id = $6 
                                    RETURNING name, lastname, email, cel, photo`;
      const values = [
         body.name ?? null,
         body.lastname ?? null,
         body.email ?? null,
         body.cel ?? null,
         body.photo ?? null,
         id,
      ];

      const { rows } = await pool.query(query, values);
      return rows;
   }

   async deleteUser(id: UserDto['id']): Promise<string> {
      const query = `DELETE FROM users WHERE id=$1`;
      const values = [id];

      const { rowCount } = await pool.query(query, values);
      if (rowCount !== 1) {
         throw new Errors('Error deleting user', 500);
      }

      return `User ${id} deleted`;
   }
}

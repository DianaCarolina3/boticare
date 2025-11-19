import pool from '../../database/connection.js';
import type { UserDto } from '../user/user.schema.js';
import { Errors } from '../../utils/errors.js';

export class AuthRepository {
   static async createAuthUser(id: string, idUser: UserDto['id'], password: UserDto['password']) {
      const query = `INSERT INTO auth(id, user_id, password) 
                        VALUES ($1, $2, $3)`;
      const values = [id, idUser, password];

      await pool.query(query, values);
   }

   static async deleteAuthUser(idUser: UserDto['id']) {
      const query = `DELETE FROM auth WHERE user_id=$1`;
      const values = [idUser];

      const { rowCount } = await pool.query(query, values);
      if (rowCount != 1) {
         throw new Errors('Error deleting user', 500);
      }
   }

   static async updateAuthUser(idUser: UserDto['id'], password: UserDto['password']) {
      const query = `UPDATE auth SET password=$1 WHERE user_id=$2`;
      const values = [password, idUser];

      const { rowCount } = await pool.query(query, values);
      if (rowCount != 1) {
         throw new Errors('Error updating user', 500);
      }
   }
}
